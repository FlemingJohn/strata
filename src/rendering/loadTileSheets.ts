import { FLOOR_TILESET_PATH, WALL_TILESET_PATH } from "../constants/tilesetSettings";

export interface TileSheets {
  floorSheet: HTMLImageElement;
  wallSheet: HTMLImageElement;
}

function loadImage(path: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", () => reject(new Error(`Could not load ${path}`)));
    image.src = path;
  });
}

export async function loadTileSheets(): Promise<TileSheets> {
  const [floorSheet, wallSheet] = await Promise.all([
    loadImage(FLOOR_TILESET_PATH),
    loadImage(WALL_TILESET_PATH)
  ]);

  return { floorSheet, wallSheet };
}
