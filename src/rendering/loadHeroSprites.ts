import type { SpriteSheet } from "../types/spriteSheet";
import {
  HERO_CRUSHING_DOWN_PATH,
  HERO_PIERCING_DOWN_PATH,
  HERO_SLICING_DOWN_PATH,
  HERO_STANDING_DOWN_PATH,
  HERO_STANDING_SIDE_PATH,
  HERO_STANDING_UP_PATH,
  HERO_WALKING_DOWN_PATH,
  HERO_WALKING_SIDE_PATH,
  HERO_WALKING_UP_PATH
} from "../constants/spriteSheetPaths";
import { loadSpriteSheet } from "./loadSpriteSheet";

export interface HeroSprites {
  standingDown: SpriteSheet;
  standingSide: SpriteSheet;
  standingUp: SpriteSheet;
  walkingDown: SpriteSheet;
  walkingSide: SpriteSheet;
  walkingUp: SpriteSheet;
  slicing: SpriteSheet;
  crushing: SpriteSheet;
  piercing: SpriteSheet;
}

export async function loadHeroSprites(): Promise<HeroSprites> {
  const [
    standingDown,
    standingSide,
    standingUp,
    walkingDown,
    walkingSide,
    walkingUp,
    slicing,
    crushing,
    piercing
  ] = await Promise.all([
    loadSpriteSheet(HERO_STANDING_DOWN_PATH),
    loadSpriteSheet(HERO_STANDING_SIDE_PATH),
    loadSpriteSheet(HERO_STANDING_UP_PATH),
    loadSpriteSheet(HERO_WALKING_DOWN_PATH),
    loadSpriteSheet(HERO_WALKING_SIDE_PATH),
    loadSpriteSheet(HERO_WALKING_UP_PATH),
    loadSpriteSheet(HERO_SLICING_DOWN_PATH),
    loadSpriteSheet(HERO_CRUSHING_DOWN_PATH),
    loadSpriteSheet(HERO_PIERCING_DOWN_PATH)
  ]);

  return {
    standingDown,
    standingSide,
    standingUp,
    walkingDown,
    walkingSide,
    walkingUp,
    slicing,
    crushing,
    piercing
  };
}

export type HeroSheetName = keyof HeroSprites;

export function findSheetNameForPlayer(
  activity: string,
  facing: string,
  weaponStyle: string
): HeroSheetName {
  if (activity === "attacking") {
    if (weaponStyle === "crush") {
      return "crushing";
    }

    if (weaponStyle === "pierce") {
      return "piercing";
    }

    return "slicing";
  }

  const isMoving = activity === "walking" || activity === "rolling";

  if (facing === "up") {
    return isMoving ? "walkingUp" : "standingUp";
  }

  if (facing === "left" || facing === "right") {
    return isMoving ? "walkingSide" : "standingSide";
  }

  return isMoving ? "walkingDown" : "standingDown";
}
