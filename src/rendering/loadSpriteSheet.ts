import type { SpriteSheet } from "../types/spriteSheet";

export function loadSpriteSheet(imagePath: string): Promise<SpriteSheet> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.addEventListener("load", () => {
      const frameHeight = image.naturalHeight;
      const frameWidth = frameHeight;
      const frameCount = Math.max(1, Math.round(image.naturalWidth / frameHeight));

      resolve({ image, frameWidth, frameHeight, frameCount });
    });

    image.addEventListener("error", () => {
      reject(new Error(`The sprite sheet at ${imagePath} could not be loaded`));
    });

    image.src = imagePath;
  });
}
