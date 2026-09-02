import type { SoundName, SoundRecipe } from "../types/sound";

export const EFFECT_VOLUME = 0.22;
export const MUTE_STORAGE_KEY = "strataMuted";
export const MUTE_KEY = "m";

export const SOUND_RECIPES: Record<SoundName, SoundRecipe> = {
  swing: {
    waveform: "sawtooth",
    startFrequency: 900,
    endFrequency: 240,
    seconds: 0.11,
    peakGain: 0.35,
    usesNoise: true
  },
  hitConnects: {
    waveform: "square",
    startFrequency: 420,
    endFrequency: 90,
    seconds: 0.13,
    peakGain: 0.9,
    usesNoise: false
  },
  enemyDies: {
    waveform: "square",
    startFrequency: 260,
    endFrequency: 45,
    seconds: 0.34,
    peakGain: 0.8,
    usesNoise: false
  },
  playerHurt: {
    waveform: "sawtooth",
    startFrequency: 180,
    endFrequency: 60,
    seconds: 0.26,
    peakGain: 0.85,
    usesNoise: false
  },
  roll: {
    waveform: "sine",
    startFrequency: 320,
    endFrequency: 620,
    seconds: 0.16,
    peakGain: 0.3,
    usesNoise: true
  },
  doorOpens: {
    waveform: "triangle",
    startFrequency: 140,
    endFrequency: 320,
    seconds: 0.3,
    peakGain: 0.4,
    usesNoise: false
  },
  roomCleared: {
    waveform: "triangle",
    startFrequency: 440,
    endFrequency: 880,
    seconds: 0.42,
    peakGain: 0.45,
    usesNoise: false
  },
  relicFound: {
    waveform: "triangle",
    startFrequency: 660,
    endFrequency: 1320,
    seconds: 0.5,
    peakGain: 0.4,
    usesNoise: false
  },
  menuMove: {
    waveform: "square",
    startFrequency: 620,
    endFrequency: 620,
    seconds: 0.05,
    peakGain: 0.18,
    usesNoise: false
  },
  menuChoose: {
    waveform: "square",
    startFrequency: 520,
    endFrequency: 1040,
    seconds: 0.14,
    peakGain: 0.28,
    usesNoise: false
  }
};
