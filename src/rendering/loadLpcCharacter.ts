import type { DirectionalSpriteSheet, LpcCharacterSheets } from "../types/lpcCharacter";
import type { LpcAnimationName } from "../constants/lpcCharacterSettings";
import {
  LPC_ANIMATIONS,
  LPC_FOLDER,
  LPC_FRAME_SIZE,
  LPC_LAYER_ORDER
} from "../constants/lpcCharacterSettings";

function loadImage(path: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", () => resolve(null));
    image.src = path;
  });
}

async function buildOneAnimation(
  animationName: LpcAnimationName
): Promise<DirectionalSpriteSheet | null> {
  const layerImages = await Promise.all(
    LPC_LAYER_ORDER.map((layerName) => loadImage(`${LPC_FOLDER}/${layerName}/${animationName}.png`))
  );

  const firstLoaded = layerImages.find((image) => image !== null);

  if (!firstLoaded) {
    return null;
  }

  const canvas = document.createElement("canvas");
  canvas.width = firstLoaded.naturalWidth;
  canvas.height = firstLoaded.naturalHeight;

  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  context.imageSmoothingEnabled = false;

  for (const layerImage of layerImages) {
    if (layerImage) {
      context.drawImage(layerImage, 0, 0);
    }
  }

  return {
    canvas,
    frameSize: LPC_FRAME_SIZE,
    frameCount: Math.round(canvas.width / LPC_FRAME_SIZE),
    rowCount: Math.round(canvas.height / LPC_FRAME_SIZE)
  };
}

export async function loadLpcCharacter(): Promise<LpcCharacterSheets> {
  const builtSheets = await Promise.all(LPC_ANIMATIONS.map(buildOneAnimation));
  const sheets = {} as LpcCharacterSheets;

  LPC_ANIMATIONS.forEach((animationName, index) => {
    const sheet = builtSheets[index];

    if (sheet) {
      sheets[animationName] = sheet;
    }
  });

  if (!sheets.idle) {
    throw new Error("The player character sprites could not be loaded");
  }

  return sheets;
}
