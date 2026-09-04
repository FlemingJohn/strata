import type { GameSettings } from "../types/gameSettings";

export const SETTINGS_STORAGE_KEY = "strataSettings";

export const DEFAULT_SETTINGS: GameSettings = {
  effectVolume: 0.22,
  musicVolume: 0.11,
  shakesTheScreen: true,
  entersFullScreen: true
};

export const LOUDEST_VOLUME = 0.4;
export const VOLUME_STEPS = 5;
