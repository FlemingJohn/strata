export const LPC_FOLDER = "/assets/lpc";
export const LPC_FRAME_SIZE = 64;

export const LPC_ROW_FACING_UP = 0;
export const LPC_ROW_FACING_LEFT = 1;
export const LPC_ROW_FACING_DOWN = 2;
export const LPC_ROW_FACING_RIGHT = 3;

export const LPC_GROUND_OFFSET_PIXELS = 58;
export const TITLE_SCREEN_HERO_SCALE = 3;

export type LpcAnimationName =
  | "idle"
  | "walk"
  | "slash"
  | "backslash"
  | "thrust"
  | "hurt"
  | "spellcast";

export const LPC_ANIMATIONS: LpcAnimationName[] = [
  "idle",
  "walk",
  "slash",
  "backslash",
  "thrust",
  "hurt",
  "spellcast"
];

export const LPC_FRAMES_PER_SECOND: Record<LpcAnimationName, number> = {
  idle: 4,
  walk: 12,
  slash: 14,
  backslash: 14,
  thrust: 14,
  hurt: 8,
  spellcast: 10
};
