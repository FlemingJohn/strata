import type { AnimatedPropSheets } from "../types/animatedProp";
import { ANIMATED_PROP_DEFINITIONS } from "../constants/animatedPropSettings";

function loadImage(path: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", () => resolve(null));
    image.src = path;
  });
}

export async function loadAnimatedPropSheets(): Promise<AnimatedPropSheets> {
  const names = Object.keys(ANIMATED_PROP_DEFINITIONS);
  const images = await Promise.all(
    names.map((name) => loadImage(ANIMATED_PROP_DEFINITIONS[name].sheetPath))
  );

  const sheets: AnimatedPropSheets = {};

  names.forEach((name, index) => {
    const image = images[index];

    if (image) {
      sheets[name] = image;
    }
  });

  return sheets;
}
