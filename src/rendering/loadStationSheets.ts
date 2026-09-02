import type { StationAppearance, StationKind, StationSheets } from "../types/station";
import { STATION_DEFINITIONS } from "../constants/stationSettings";

function loadImage(path: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", () => resolve(null));
    image.src = encodeURI(path);
  });
}

function listAppearances(): StationAppearance[] {
  const kinds = Object.keys(STATION_DEFINITIONS) as StationKind[];
  const appearances: StationAppearance[] = [];

  for (const kind of kinds) {
    appearances.push(...STATION_DEFINITIONS[kind].appearances);
  }

  return appearances;
}

export async function loadStationSheets(): Promise<StationSheets> {
  const appearances = listAppearances();
  const images = await Promise.all(
    appearances.map((appearance) => loadImage(appearance.sheetPath))
  );

  const sheets: StationSheets = {};

  appearances.forEach((appearance, index) => {
    const image = images[index];

    if (image) {
      sheets[appearance.sheetName] = image;
    }
  });

  return sheets;
}
