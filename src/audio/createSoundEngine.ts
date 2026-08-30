import type { SoundEngine, SoundName } from "../types/sound";
import {
  DRONE_BASE_FREQUENCIES,
  DRONE_VOLUME,
  EFFECT_VOLUME,
  MUTE_STORAGE_KEY,
  SOUND_RECIPES
} from "../constants/soundSettings";

function readStoredMuteChoice(): boolean {
  try {
    return window.localStorage.getItem(MUTE_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function storeMuteChoice(isMuted: boolean): void {
  try {
    window.localStorage.setItem(MUTE_STORAGE_KEY, String(isMuted));
  } catch {
    return;
  }
}

function createNoiseBuffer(audioContext: AudioContext, seconds: number): AudioBuffer {
  const sampleCount = Math.floor(audioContext.sampleRate * seconds);
  const buffer = audioContext.createBuffer(1, sampleCount, audioContext.sampleRate);
  const samples = buffer.getChannelData(0);

  for (let index = 0; index < sampleCount; index++) {
    samples[index] = Math.random() * 2 - 1;
  }

  return buffer;
}

export function createSoundEngine(): SoundEngine {
  let audioContext: AudioContext | null = null;
  let effectGain: GainNode | null = null;
  let droneGain: GainNode | null = null;
  let droneOscillators: OscillatorNode[] = [];
  let isMuted = readStoredMuteChoice();

  function ensureContext(): AudioContext | null {
    if (audioContext) {
      return audioContext;
    }

    const AudioContextConstructor =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextConstructor) {
      return null;
    }

    audioContext = new AudioContextConstructor();

    effectGain = audioContext.createGain();
    effectGain.gain.value = isMuted ? 0 : EFFECT_VOLUME;
    effectGain.connect(audioContext.destination);

    droneGain = audioContext.createGain();
    droneGain.gain.value = 0;
    droneGain.connect(audioContext.destination);

    return audioContext;
  }

  function playTone(recipe: (typeof SOUND_RECIPES)[SoundName]): void {
    const context = ensureContext();

    if (!context || !effectGain) {
      return;
    }

    const startTime = context.currentTime;
    const envelope = context.createGain();
    envelope.gain.setValueAtTime(recipe.peakGain, startTime);
    envelope.gain.exponentialRampToValueAtTime(0.0001, startTime + recipe.seconds);
    envelope.connect(effectGain);

    if (recipe.usesNoise) {
      const noise = context.createBufferSource();
      noise.buffer = createNoiseBuffer(context, recipe.seconds);

      const filter = context.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(recipe.startFrequency, startTime);
      filter.frequency.exponentialRampToValueAtTime(
        Math.max(60, recipe.endFrequency),
        startTime + recipe.seconds
      );

      noise.connect(filter);
      filter.connect(envelope);
      noise.start(startTime);
      noise.stop(startTime + recipe.seconds);
      return;
    }

    const oscillator = context.createOscillator();
    oscillator.type = recipe.waveform;
    oscillator.frequency.setValueAtTime(recipe.startFrequency, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      Math.max(30, recipe.endFrequency),
      startTime + recipe.seconds
    );

    oscillator.connect(envelope);
    oscillator.start(startTime);
    oscillator.stop(startTime + recipe.seconds);
  }

  function applyMuteToNodes(): void {
    if (effectGain && audioContext) {
      effectGain.gain.setTargetAtTime(isMuted ? 0 : EFFECT_VOLUME, audioContext.currentTime, 0.02);
    }

    if (droneGain && audioContext) {
      const target = isMuted || droneOscillators.length === 0 ? 0 : DRONE_VOLUME;
      droneGain.gain.setTargetAtTime(target, audioContext.currentTime, 0.6);
    }
  }

  return {
    play(soundName: SoundName): void {
      if (isMuted) {
        return;
      }

      playTone(SOUND_RECIPES[soundName]);
    },

    startDrone(): void {
      const context = ensureContext();

      if (!context || !droneGain || droneOscillators.length > 0) {
        return;
      }

      droneOscillators = DRONE_BASE_FREQUENCIES.map((frequency, index) => {
        const oscillator = context.createOscillator();
        oscillator.type = index === 0 ? "sine" : "triangle";
        oscillator.frequency.value = frequency;

        const drift = context.createOscillator();
        drift.frequency.value = 0.05 + index * 0.03;

        const driftAmount = context.createGain();
        driftAmount.gain.value = 1.5 + index;

        drift.connect(driftAmount);
        driftAmount.connect(oscillator.frequency);
        drift.start();

        oscillator.connect(droneGain);
        oscillator.start();
        return oscillator;
      });

      applyMuteToNodes();
    },

    stopDrone(): void {
      for (const oscillator of droneOscillators) {
        oscillator.stop();
      }

      droneOscillators = [];

      if (droneGain && audioContext) {
        droneGain.gain.setTargetAtTime(0, audioContext.currentTime, 0.2);
      }
    },

    toggleMute(): boolean {
      isMuted = !isMuted;
      storeMuteChoice(isMuted);
      applyMuteToNodes();
      return isMuted;
    },

    isMuted(): boolean {
      return isMuted;
    },

    resumeAfterUserAction(): void {
      const context = ensureContext();

      if (context && context.state === "suspended") {
        void context.resume();
      }
    }
  };
}
