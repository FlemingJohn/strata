import type { MusicEngine, MusicShape, MusicTrack, MusicVoice, TrackName } from "../types/music";
import { findGameSettings, watchGameSettings } from "../game/keepGameSettings";
import {
  MUSIC_FADE_SECONDS,
  MUSIC_TRACKS,
  PULSE_FILTER_FREQUENCY,
  SCHEDULER_INTERVAL_MILLISECONDS,
  SCHEDULE_AHEAD_SECONDS,
  STEPS_PER_BAR
} from "../constants/musicSettings";
import { findAudioContext } from "./findAudioContext";
import { findMidiNumberForDegree, findNoteFrequency } from "./findNoteFrequency";

function createNoiseBuffer(audioContext: AudioContext, seconds: number): AudioBuffer {
  const sampleCount = Math.max(1, Math.floor(audioContext.sampleRate * seconds));
  const buffer = audioContext.createBuffer(1, sampleCount, audioContext.sampleRate);
  const samples = buffer.getChannelData(0);

  for (let index = 0; index < sampleCount; index++) {
    samples[index] = Math.random() * 2 - 1;
  }

  return buffer;
}

export function createMusicEngine(): MusicEngine {
  let musicGain: GainNode | null = null;
  let currentTrack: MusicTrack | null = null;
  let currentShape: MusicShape | null = null;
  let nextStepIndex = 0;
  let nextStepTime = 0;
  let schedulerHandle = 0;
  let isMuted = false;

  function ensureMusicGain(): GainNode | null {
    const context = findAudioContext();

    if (!context) {
      return null;
    }

    if (!musicGain) {
      musicGain = context.createGain();
      musicGain.gain.value = 0;
      musicGain.connect(context.destination);
    }

    return musicGain;
  }

  function findRootMidiNumber(): number {
    if (currentShape) {
      return currentShape.rootMidiNumber;
    }

    return currentTrack ? currentTrack.rootMidiNumber : 45;
  }

  function findScaleSemitones(): number[] {
    if (currentShape) {
      return currentShape.scaleSemitones;
    }

    return currentTrack ? currentTrack.scaleSemitones : [0, 2, 3, 5, 7, 8, 10];
  }

  function findSecondsPerStep(): number {
    if (!currentTrack) {
      return 0.15;
    }

    const beatsPerMinute = currentShape
      ? currentShape.beatsPerMinute
      : currentTrack.beatsPerMinute;

    return 60 / beatsPerMinute / currentTrack.stepsPerBeat;
  }

  function scheduleVoiceNote(
    context: AudioContext,
    destination: GainNode,
    voice: MusicVoice,
    degree: number,
    startTime: number
  ): void {
    const envelope = context.createGain();
    envelope.gain.setValueAtTime(0.0001, startTime);
    envelope.gain.exponentialRampToValueAtTime(voice.peakGain, startTime + 0.012);
    envelope.gain.exponentialRampToValueAtTime(0.0001, startTime + voice.noteSeconds);
    envelope.connect(destination);

    if (voice.usesNoise) {
      const noise = context.createBufferSource();
      noise.buffer = createNoiseBuffer(context, voice.noteSeconds);

      const filter = context.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.setValueAtTime(PULSE_FILTER_FREQUENCY, startTime);

      noise.connect(filter);
      filter.connect(envelope);
      noise.start(startTime);
      noise.stop(startTime + voice.noteSeconds);
      return;
    }

    const midiNumber = findMidiNumberForDegree(
      findRootMidiNumber(),
      findScaleSemitones(),
      degree,
      voice.octaveOffset
    );

    const oscillator = context.createOscillator();
    oscillator.type = voice.waveform;
    oscillator.frequency.setValueAtTime(findNoteFrequency(midiNumber), startTime);
    oscillator.connect(envelope);
    oscillator.start(startTime);
    oscillator.stop(startTime + voice.noteSeconds);
  }

  function scheduleStep(context: AudioContext, destination: GainNode, startTime: number): void {
    if (!currentTrack) {
      return;
    }

    for (const voice of currentTrack.voices) {
      const degree = voice.degreePattern[nextStepIndex % voice.degreePattern.length];

      if (degree < 0) {
        continue;
      }

      scheduleVoiceNote(context, destination, voice, degree, startTime);
    }
  }

  function runScheduler(): void {
    const context = findAudioContext();
    const destination = ensureMusicGain();

    if (!context || !destination || !currentTrack) {
      return;
    }

    if (context.state !== "running") {
      nextStepTime = context.currentTime;
      return;
    }

    while (nextStepTime < context.currentTime + SCHEDULE_AHEAD_SECONDS) {
      scheduleStep(context, destination, Math.max(nextStepTime, context.currentTime));
      nextStepTime += findSecondsPerStep();
      nextStepIndex = (nextStepIndex + 1) % STEPS_PER_BAR;
    }
  }

  function chosenLevel(): number {
    return isMuted || !currentTrack ? 0 : findGameSettings().musicVolume;
  }

  function fadeTo(level: number): void {
    const context = findAudioContext();
    const destination = ensureMusicGain();

    if (!context || !destination) {
      return;
    }

    destination.gain.setTargetAtTime(level, context.currentTime, MUSIC_FADE_SECONDS / 3);
  }

  watchGameSettings(function followTheVolumeSetting() {
    fadeTo(chosenLevel());
  });

  return {
    playTrack(trackName: TrackName, shape: MusicShape | null): void {
      const context = findAudioContext();

      if (!context || !ensureMusicGain()) {
        return;
      }

      const requestedTrack = MUSIC_TRACKS[trackName];
      const isAlreadyPlaying =
        currentTrack === requestedTrack &&
        currentShape === shape &&
        schedulerHandle !== 0;

      if (isAlreadyPlaying) {
        return;
      }

      currentTrack = requestedTrack;
      currentShape = shape;
      nextStepIndex = 0;
      nextStepTime = context.currentTime + 0.06;

      if (schedulerHandle === 0) {
        schedulerHandle = window.setInterval(runScheduler, SCHEDULER_INTERVAL_MILLISECONDS);
      }

      fadeTo(chosenLevel());
    },

    stopTrack(): void {
      fadeTo(0);
      window.clearInterval(schedulerHandle);
      schedulerHandle = 0;
      currentTrack = null;
      currentShape = null;
    },

    setMuted(nextIsMuted: boolean): void {
      isMuted = nextIsMuted;
      fadeTo(chosenLevel());
    }
  };
}
