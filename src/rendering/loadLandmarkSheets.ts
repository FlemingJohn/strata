import type { LandmarkSheets } from "../types/landmark";
import { LANDMARK_DEFINITIONS } from "../constants/landmarkSettings";

function loadImage(path: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", () => resolve(null));
    image.src = encodeURI(path);
  });
}

export async function loadLandmarkSheets(): Promise<LandmarkSheets> {
  const names = Object.keys(LANDMARK_DEFINITIONS);
  const images = await Promise.all(
    names.map((name) => loadImage(LANDMARK_DEFINITIONS[name].sheetPath))
  );

  const sheets: LandmarkSheets = {};

  names.forEach((name, index) => {
    const image = images[index];

    if (image) {
      sheets[name] = image;
    }
  });

  return sheets;
}
