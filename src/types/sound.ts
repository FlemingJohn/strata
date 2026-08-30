export type SoundName =
  | "swing"
  | "hitConnects"
  | "enemyDies"
  | "playerHurt"
  | "roll"
  | "doorOpens"
  | "roomCleared"
  | "relicFound"
  | "menuMove"
  | "menuChoose";

export interface SoundRecipe {
  waveform: OscillatorType;
  startFrequency: number;
  endFrequency: number;
  seconds: number;
  peakGain: number;
  usesNoise: boolean;
}

export interface SoundEngine {
  play: (soundName: SoundName) => void;
  startDrone: () => void;
  stopDrone: () => void;
  toggleMute: () => boolean;
  isMuted: () => boolean;
  resumeAfterUserAction: () => void;
}
