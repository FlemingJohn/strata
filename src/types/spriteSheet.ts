export interface SpriteSheet {
  image: HTMLImageElement;
  frameWidth: number;
  frameHeight: number;
  frameCount: number;
}

export interface AnimationDefinition {
  spriteSheetName: string;
  framesPerSecond: number;
  shouldLoop: boolean;
  activeFrameStart?: number;
  activeFrameEnd?: number;
}

export interface AnimationPlayback {
  definition: AnimationDefinition;
  currentFrameIndex: number;
  secondsSinceFrameChange: number;
  hasFinished: boolean;
}

export type FacingDirection = "down" | "up" | "left" | "right";
