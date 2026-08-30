import type { HeroBodyBands } from "../constants/heroBodyBands";
import type { SpriteSheet } from "../types/spriteSheet";
import { HERO_BODY_BANDS } from "../constants/heroBodyBands";
import {
  BELT_COLOUR,
  BELT_THICKNESS,
  BOOT_COLOUR,
  BOOT_THICKNESS,
  CLOAK_OPACITY,
  DEFAULT_TUNIC_COLOUR,
  HOOD_COLOUR,
  HOOD_OPACITY,
  HOOD_SHARE_OF_HEAD,
  TROUSERS_COLOUR,
  TROUSERS_OPACITY,
  TUNIC_OPACITY
} from "../constants/heroClothingSettings";

const FALLBACK_BANDS: HeroBodyBands = {
  headTop: 19,
  headBottom: 31,
  torsoTop: 31,
  torsoBottom: 40,
  legsTop: 40,
  legsBottom: 48
};

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

export function findBodyBands(sheetName: string, frameIndex: number): HeroBodyBands {
  const framesForSheet = HERO_BODY_BANDS[sheetName];

  if (!framesForSheet || framesForSheet.length === 0) {
    return FALLBACK_BANDS;
  }

  return framesForSheet[frameIndex % framesForSheet.length];
}

function paintGarment(
  context: CanvasRenderingContext2D,
  frameSize: number,
  topRow: number,
  bottomRow: number,
  colour: string,
  opacity: number
): void {
  const height = bottomRow - topRow;

  if (height <= 0) {
    return;
  }

  context.globalCompositeOperation = "source-atop";
  context.globalAlpha = opacity;
  context.fillStyle = colour;
  context.fillRect(0, topRow, frameSize, height);
  context.globalAlpha = 1;
  context.globalCompositeOperation = "source-over";
}

export function drawClothedHero(
  targetContext: CanvasRenderingContext2D,
  spriteSheet: SpriteSheet,
  sheetName: string,
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

  const bands = findBodyBands(sheetName, frameIndex);

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

  const headHeight = bands.headBottom - bands.headTop;
  const hoodBottom = bands.headTop + Math.max(1, Math.round(headHeight * HOOD_SHARE_OF_HEAD));

  paintGarment(context, frameSize, bands.headTop, hoodBottom, HOOD_COLOUR, HOOD_OPACITY);
  paintGarment(
    context,
    frameSize,
    bands.torsoTop,
    bands.torsoBottom,
    tunicColour || DEFAULT_TUNIC_COLOUR,
    TUNIC_OPACITY
  );
  paintGarment(
    context,
    frameSize,
    bands.torsoBottom - BELT_THICKNESS,
    bands.torsoBottom,
    BELT_COLOUR,
    CLOAK_OPACITY
  );
  paintGarment(
    context,
    frameSize,
    bands.legsTop,
    bands.legsBottom - BOOT_THICKNESS,
    TROUSERS_COLOUR,
    TROUSERS_OPACITY
  );
  paintGarment(
    context,
    frameSize,
    bands.legsBottom - BOOT_THICKNESS,
    bands.legsBottom,
    BOOT_COLOUR,
    TROUSERS_OPACITY
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
