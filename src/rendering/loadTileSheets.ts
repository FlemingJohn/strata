import {
  DUNGEON_TILESET_PATH,
  FLOOR_TILESET_PATH,
  INTERIOR_WALL_TILESET_PATH,
  WALL_TILESET_PATH,
  WALL_VARIATION_TILESET_PATH
} from "../constants/tilesetSettings";
import { WATER_TILESET_PATH } from "../constants/waterSettings";
import {
  FIRE_SHEET_PATH,
  SECOND_FIRE_SHEET_PATH,
  SMOKE_SHEET_PATH
} from "../constants/fireSettings";

export interface TileSheets {
  floorSheet: HTMLImageElement;
  wallSheet: HTMLImageElement;
  dungeonSheet: HTMLImageElement;
  fireSheet: HTMLImageElement;
  secondFireSheet: HTMLImageElement;
  smokeSheet: HTMLImageElement;
  waterSheet: HTMLImageElement;
  wallVariationSheet: HTMLImageElement;
  interiorWallSheet: HTMLImageElement;
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
  const [
    floorSheet,
    wallSheet,
    dungeonSheet,
    fireSheet,
    secondFireSheet,
    smokeSheet,
    waterSheet,
    wallVariationSheet,
    interiorWallSheet
  ] = await Promise.all([
    loadImage(FLOOR_TILESET_PATH),
    loadImage(WALL_TILESET_PATH),
    loadImage(DUNGEON_TILESET_PATH),
    loadImage(FIRE_SHEET_PATH),
    loadImage(SECOND_FIRE_SHEET_PATH),
    loadImage(SMOKE_SHEET_PATH),
    loadImage(WATER_TILESET_PATH),
    loadImage(WALL_VARIATION_TILESET_PATH),
    loadImage(INTERIOR_WALL_TILESET_PATH)
  ]);

  return {
    floorSheet,
    wallSheet,
    dungeonSheet,
    fireSheet,
    secondFireSheet,
    smokeSheet,
    waterSheet,
    wallVariationSheet,
    interiorWallSheet
  };
}
