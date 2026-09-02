import type { PropSheets } from "../types/prop";
import { PROP_SHEET_PATHS } from "../constants/propSettings";

function loadImage(path: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", () => resolve(null));
    image.src = path;
  });
}

export async function loadPropSheets(): Promise<PropSheets> {
  const names = Object.keys(PROP_SHEET_PATHS);
  const images = await Promise.all(names.map((name) => loadImage(PROP_SHEET_PATHS[name])));
  const sheets: PropSheets = {};

  names.forEach((name, index) => {
    const image = images[index];

    if (image) {
      sheets[name] = image;
    }
  });

  return sheets;
}
