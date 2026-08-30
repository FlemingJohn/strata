import type { LpcAnimationName } from "../constants/lpcCharacterSettings";

export interface DirectionalSpriteSheet {
  canvas: HTMLCanvasElement;
  frameSize: number;
  frameCount: number;
  rowCount: number;
}

export type LpcCharacterSheets = Record<LpcAnimationName, DirectionalSpriteSheet>;
