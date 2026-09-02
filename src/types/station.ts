export type StationKind = "emberFont" | "soulBrazier" | "forgeHearth" | "alchemyVat";

export type StationReward =
  | "restoresHealth"
  | "restoresStamina"
  | "sharpensWeapon"
  | "raisesMaximumHealth";

export interface StationAppearance {
  sheetName: string;
  sheetPath: string;
  frameWidth: number;
  frameHeight: number;
  frameCount: number;
  framesPerSecond: number;
}

export interface StationDefinition {
  kind: StationKind;
  label: string;
  appearances: StationAppearance[];
  reward: StationReward;
  rewardAmount: number;
  reachPixels: number;
}

export interface PlacedStation {
  definition: StationDefinition;
  appearance: StationAppearance;
  horizontalPosition: number;
  verticalPosition: number;
  hasBeenUsed: boolean;
}

export type StationSheets = Record<string, HTMLImageElement>;
