import {
  DUNGEON_TILESET_PATH,
  FLOOR_TILESET_PATH,
  WALL_TILESET_PATH
} from "../constants/tilesetSettings";
import { FIRE_SHEET_PATH, SMOKE_SHEET_PATH } from "../constants/fireSettings";

export interface TileSheets {
  floorSheet: HTMLImageElement;
  wallSheet: HTMLImageElement;
  dungeonSheet: HTMLImageElement;
  fireSheet: HTMLImageElement;
  smokeSheet: HTMLImageElement;
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
  const [floorSheet, wallSheet, dungeonSheet, fireSheet, smokeSheet] = await Promise.all([
    loadImage(FLOOR_TILESET_PATH),
    loadImage(WALL_TILESET_PATH),
    loadImage(DUNGEON_TILESET_PATH),
    loadImage(FIRE_SHEET_PATH),
    loadImage(SMOKE_SHEET_PATH)
  ]);

  return { floorSheet, wallSheet, dungeonSheet, fireSheet, smokeSheet };
}
