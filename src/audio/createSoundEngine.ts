import type { SoundEngine, SoundName } from "../types/sound";
import {
  EFFECT_VOLUME,
  MUTE_STORAGE_KEY,
  SOUND_RECIPES
} from "../constants/soundSettings";
import { findAudioContext, resumeAudioContext } from "./findAudioContext";

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
  let effectGain: GainNode | null = null;
  let isMuted = readStoredMuteChoice();

  function ensureEffectGain(): GainNode | null {
    const context = findAudioContext();

    if (!context) {
      return null;
    }

    if (!effectGain) {
      effectGain = context.createGain();
      effectGain.gain.value = isMuted ? 0 : EFFECT_VOLUME;
      effectGain.connect(context.destination);
    }

    return effectGain;
  }

  function playTone(recipe: (typeof SOUND_RECIPES)[SoundName]): void {
    const context = findAudioContext();
    const destination = ensureEffectGain();

    if (!context || !destination) {
      return;
    }

    const startTime = context.currentTime;
    const envelope = context.createGain();
    envelope.gain.setValueAtTime(recipe.peakGain, startTime);
    envelope.gain.exponentialRampToValueAtTime(0.0001, startTime + recipe.seconds);
    envelope.connect(destination);

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

  return {
    play(soundName: SoundName): void {
      if (isMuted) {
        return;
      }

      playTone(SOUND_RECIPES[soundName]);
    },

    toggleMute(): boolean {
      isMuted = !isMuted;
      storeMuteChoice(isMuted);

      const context = findAudioContext();
      const destination = ensureEffectGain();

      if (context && destination) {
        destination.gain.setTargetAtTime(isMuted ? 0 : EFFECT_VOLUME, context.currentTime, 0.02);
      }

      return isMuted;
    },

    isMuted(): boolean {
      return isMuted;
    },

    resumeAfterUserAction(): void {
      ensureEffectGain();
      resumeAudioContext();
    }
  };
}
