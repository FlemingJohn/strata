import type {
  SpriteAnimationController,
  SpriteCropRegion,
  SpriteSheet
} from "../types/spriteSheet";

export function playSpriteAnimation(
  canvas: HTMLCanvasElement,
  spriteSheet: SpriteSheet,
  framesPerSecond: number,
  displayScale: number,
  cropRegion?: SpriteCropRegion
): SpriteAnimationController {
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("The sprite canvas does not support two dimensional drawing");
  }

  const visibleRegion: SpriteCropRegion = cropRegion ?? {
    left: 0,
    top: 0,
    width: spriteSheet.frameWidth,
    height: spriteSheet.frameHeight
  };

  canvas.width = visibleRegion.width;
  canvas.height = visibleRegion.height;
  canvas.style.width = `${visibleRegion.width * displayScale}px`;
  canvas.style.height = `${visibleRegion.height * displayScale}px`;
  context.imageSmoothingEnabled = false;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const secondsPerFrame = 1 / framesPerSecond;

  let currentFrameIndex = 0;
  let secondsSinceFrameChange = 0;
  let previousTimestamp = 0;
  let animationHandle = 0;
  let isRunning = true;

  function drawCurrentFrame(): void {
    const sourceLeft = currentFrameIndex * spriteSheet.frameWidth + visibleRegion.left;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(
      spriteSheet.image,
      sourceLeft,
      visibleRegion.top,
      visibleRegion.width,
      visibleRegion.height,
      0,
      0,
      visibleRegion.width,
      visibleRegion.height
    );
  }

  function renderFrame(timestamp: number): void {
    if (!isRunning) {
      return;
    }

    const secondsElapsed = previousTimestamp
      ? Math.min(0.05, (timestamp - previousTimestamp) / 1000)
      : 0;
    previousTimestamp = timestamp;
    secondsSinceFrameChange += secondsElapsed;

    if (secondsSinceFrameChange >= secondsPerFrame) {
      secondsSinceFrameChange -= secondsPerFrame;
      currentFrameIndex = (currentFrameIndex + 1) % spriteSheet.frameCount;
      drawCurrentFrame();
    }

    animationHandle = window.requestAnimationFrame(renderFrame);
  }

  drawCurrentFrame();

  if (!prefersReducedMotion) {
    animationHandle = window.requestAnimationFrame(renderFrame);
  }

  return {
    stop(): void {
      isRunning = false;
      window.cancelAnimationFrame(animationHandle);
    }
  };
}
