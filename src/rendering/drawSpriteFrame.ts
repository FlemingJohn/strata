import type { SpriteSheet } from "../types/spriteSheet";

export function drawSpriteFrame(
  context: CanvasRenderingContext2D,
  spriteSheet: SpriteSheet,
  frameIndex: number,
  destinationLeft: number,
  destinationTop: number,
  shouldMirrorHorizontally: boolean
): void {
  const safeFrameIndex = frameIndex % spriteSheet.frameCount;
  const sourceLeft = safeFrameIndex * spriteSheet.frameWidth;

  if (!shouldMirrorHorizontally) {
    context.drawImage(
      spriteSheet.image,
      sourceLeft,
      0,
      spriteSheet.frameWidth,
      spriteSheet.frameHeight,
      destinationLeft,
      destinationTop,
      spriteSheet.frameWidth,
      spriteSheet.frameHeight
    );
    return;
  }

  context.save();
  context.translate(destinationLeft + spriteSheet.frameWidth, destinationTop);
  context.scale(-1, 1);
  context.drawImage(
    spriteSheet.image,
    sourceLeft,
    0,
    spriteSheet.frameWidth,
    spriteSheet.frameHeight,
    0,
    0,
    spriteSheet.frameWidth,
    spriteSheet.frameHeight
  );
  context.restore();
}
