export type StationKind = "emberFont" | "soulBrazier" | "forgeHearth" | "alchemyVat";

export type StationReward =
  | "restoresHealth"
  | "restoresStamina"
  | "sharpensWeapon"
  | "raisesMaximumHealth";

export interface StationDefinition {
  kind: StationKind;
  label: string;
  sheetPath: string;
  frameSize: number;
  frameCount: number;
  framesPerSecond: number;
  reward: StationReward;
  rewardAmount: number;
  reachPixels: number;
}

export interface PlacedStation {
  definition: StationDefinition;
  horizontalPosition: number;
  verticalPosition: number;
  hasBeenUsed: boolean;
}

export type StationSheets = Record<StationKind, HTMLImageElement | null>;
