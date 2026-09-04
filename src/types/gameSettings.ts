export interface GameSettings {
  effectVolume: number;
  musicVolume: number;
  shakesTheScreen: boolean;
  entersFullScreen: boolean;
}

export type SettingName = keyof GameSettings;
