import type { SpriteSheet } from "./spriteSheet";

export type SurvivorName = "peasant" | "innkeeper" | "cellarhand";

export interface SurvivorSpriteSet {
  standing: SpriteSheet;
  walking: SpriteSheet;
}

export type SurvivorSpriteLibrary = Record<SurvivorName, SurvivorSpriteSet>;

export interface Survivor {
  name: SurvivorName;
  horizontalPosition: number;
  verticalPosition: number;
  homeHorizontal: number;
  homeVertical: number;
  wanderHorizontal: number;
  wanderVertical: number;
  secondsUntilWanderChanges: number;
  isFacingLeft: boolean;
  isWalking: boolean;
  rumour: string;
  hasSpoken: boolean;
}
