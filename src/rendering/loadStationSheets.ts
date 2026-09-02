import type { StationKind, StationSheets } from "../types/station";
import { STATION_DEFINITIONS } from "../constants/stationSettings";

function loadImage(path: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", () => resolve(null));
    image.src = path;
  });
}

export async function loadStationSheets(): Promise<StationSheets> {
  const kinds = Object.keys(STATION_DEFINITIONS) as StationKind[];
  const images = await Promise.all(
    kinds.map((kind) => loadImage(STATION_DEFINITIONS[kind].sheetPath))
  );

  const sheets = {} as StationSheets;

  kinds.forEach((kind, index) => {
    sheets[kind] = images[index];
  });

  return sheets;
}
