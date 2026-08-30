import type { SpriteSheet } from "../types/spriteSheet";
import {
  BELT_BOTTOM_IN_FRAME,
  BELT_COLOUR,
  BELT_OPACITY,
  BELT_TOP_IN_FRAME,
  CLOTHING_OPACITY,
  DEFAULT_TUNIC_COLOUR,
  LEGS_BOTTOM_IN_FRAME,
  LEGS_TOP_IN_FRAME,
  TORSO_BOTTOM_IN_FRAME,
  TORSO_TOP_IN_FRAME,
  TROUSERS_COLOUR,
  TROUSERS_OPACITY
} from "../constants/heroClothingSettings";

let dressingCanvas: HTMLCanvasElement | null = null;

function findDressingCanvas(size: number): HTMLCanvasElement {
  if (!dressingCanvas) {
    dressingCanvas = document.createElement("canvas");
  }

  if (dressingCanvas.width !== size || dressingCanvas.height !== size) {
    dressingCanvas.width = size;
    dressingCanvas.height = size;
  }

  return dressingCanvas;
}

function paintBand(
  context: CanvasRenderingContext2D,
  frameSize: number,
  topInFrame: number,
  bottomInFrame: number,
  colour: string,
  opacity: number
): void {
  context.globalCompositeOperation = "source-atop";
  context.globalAlpha = opacity;
  context.fillStyle = colour;
  context.fillRect(0, topInFrame, frameSize, bottomInFrame - topInFrame);
  context.globalAlpha = 1;
  context.globalCompositeOperation = "source-over";
}

export function drawClothedHero(
  targetContext: CanvasRenderingContext2D,
  spriteSheet: SpriteSheet,
  frameIndex: number,
  destinationLeft: number,
  destinationTop: number,
  shouldMirrorHorizontally: boolean,
  tunicColour: string
): void {
  const frameSize = spriteSheet.frameWidth;
  const canvas = findDressingCanvas(frameSize);
  const context = canvas.getContext("2d");

  if (!context) {
    return;
  }

  context.globalCompositeOperation = "source-over";
  context.globalAlpha = 1;
  context.imageSmoothingEnabled = false;
  context.clearRect(0, 0, frameSize, frameSize);

  context.drawImage(
    spriteSheet.image,
    (frameIndex % spriteSheet.frameCount) * spriteSheet.frameWidth,
    0,
    spriteSheet.frameWidth,
    spriteSheet.frameHeight,
    0,
    0,
    spriteSheet.frameWidth,
    spriteSheet.frameHeight
  );

  paintBand(
    context,
    frameSize,
    TORSO_TOP_IN_FRAME,
    TORSO_BOTTOM_IN_FRAME,
    tunicColour || DEFAULT_TUNIC_COLOUR,
    CLOTHING_OPACITY
  );
  paintBand(
    context,
    frameSize,
    LEGS_TOP_IN_FRAME,
    LEGS_BOTTOM_IN_FRAME,
    TROUSERS_COLOUR,
    TROUSERS_OPACITY
  );
  paintBand(
    context,
    frameSize,
    BELT_TOP_IN_FRAME,
    BELT_BOTTOM_IN_FRAME,
    BELT_COLOUR,
    BELT_OPACITY
  );

  if (!shouldMirrorHorizontally) {
    targetContext.drawImage(canvas, destinationLeft, destinationTop);
    return;
  }

  targetContext.save();
  targetContext.translate(destinationLeft + frameSize, destinationTop);
  targetContext.scale(-1, 1);
  targetContext.drawImage(canvas, 0, 0);
  targetContext.restore();
}
