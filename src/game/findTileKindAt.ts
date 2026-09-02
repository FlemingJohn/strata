import type { RoomTileMap } from "../types/dungeon";
import type { TileKind } from "../types/room";
import { TILE_SIZE } from "../constants/tilesetSettings";
import { SPEED_MULTIPLIER_IN_WATER } from "../constants/waterSettings";

export function findTileKindAt(
  tileMap: RoomTileMap,
  horizontalPosition: number,
  verticalPosition: number
): TileKind {
  const column = Math.floor(horizontalPosition / TILE_SIZE);
  const row = Math.floor(verticalPosition / TILE_SIZE);

  if (column < 0 || row < 0 || column >= tileMap.columnCount || row >= tileMap.rowCount) {
    return "wall";
  }

  return tileMap.tiles[row][column];
}

export function findSpeedMultiplierAt(
  tileMap: RoomTileMap,
  horizontalPosition: number,
  verticalPosition: number
): number {
  return findTileKindAt(tileMap, horizontalPosition, verticalPosition) === "water"
    ? SPEED_MULTIPLIER_IN_WATER
    : 1;
}
