import type { AnimationDefinition } from "../types/spriteSheet";

export const HERO_FRAME_SIZE_PIXELS = 64;
export const ENEMY_FRAME_SIZE_PIXELS = 32;
export const TILE_SIZE_PIXELS = 16;
export const TILES_PER_SHEET_ROW = 25;

export const PLAYER_ANIMATIONS: Record<string, AnimationDefinition> = {
  standingDown: { spriteSheetName: "heroStandingDown", framesPerSecond: 6, shouldLoop: true },
  standingSide: { spriteSheetName: "heroStandingSide", framesPerSecond: 6, shouldLoop: true },
  standingUp: { spriteSheetName: "heroStandingUp", framesPerSecond: 6, shouldLoop: true },

  walkingDown: { spriteSheetName: "heroWalkingDown", framesPerSecond: 10, shouldLoop: true },
  walkingSide: { spriteSheetName: "heroWalkingSide", framesPerSecond: 10, shouldLoop: true },
  walkingUp: { spriteSheetName: "heroWalkingUp", framesPerSecond: 10, shouldLoop: true },

  slicingDown: {
    spriteSheetName: "heroSlicingDown",
    framesPerSecond: 14,
    shouldLoop: false,
    activeFrameStart: 3,
    activeFrameEnd: 5
  },
  crushingDown: {
    spriteSheetName: "heroCrushingDown",
    framesPerSecond: 12,
    shouldLoop: false,
    activeFrameStart: 4,
    activeFrameEnd: 6
  },
  piercingDown: {
    spriteSheetName: "heroPiercingDown",
    framesPerSecond: 16,
    shouldLoop: false,
    activeFrameStart: 2,
    activeFrameEnd: 3
  },

  dyingDown: { spriteSheetName: "heroDyingDown", framesPerSecond: 8, shouldLoop: false }
};

export const ENEMY_ANIMATION_FRAMES_PER_SECOND = {
  standing: 6,
  walking: 10,
  dying: 9
};

export const HIT_STOP_SECONDS_ON_HIT = 0.07;
export const HIT_STOP_SECONDS_ON_KILL = 0.1;
export const SCREEN_SHAKE_PIXELS_ON_HIT = 3;
export const SCREEN_SHAKE_PIXELS_ON_KILL = 5;
export const SCREEN_SHAKE_PIXELS_ON_PLAYER_DEATH = 7;
export const SCREEN_SHAKE_DECAY_PER_SECOND = 26;
export const KNOCKBACK_SPEED_PIXELS_PER_SECOND = 200;
