import type { RoomTileMap } from "../types/dungeon";
import type { TileCoordinate } from "../constants/areaThemes";
import {
  WATER_TILE_BOTTOM_ROW,
  WATER_TILE_LEFT_COLUMN,
  WATER_TILE_MIDDLE_COLUMN,
  WATER_TILE_MIDDLE_ROW,
  WATER_TILE_RIGHT_COLUMN,
  WATER_TILE_TOP_ROW
} from "../constants/waterSettings";

function isWaterAt(tileMap: RoomTileMap, column: number, row: number): boolean {
  if (column < 0 || row < 0 || column >= tileMap.columnCount || row >= tileMap.rowCount) {
    return false;
  }

  return tileMap.tiles[row][column] === "water";
}

export function findWaterTile(
  tileMap: RoomTileMap,
  column: number,
  row: number
): TileCoordinate {
  const hasWaterLeft = isWaterAt(tileMap, column - 1, row);
  const hasWaterRight = isWaterAt(tileMap, column + 1, row);
  const hasWaterAbove = isWaterAt(tileMap, column, row - 1);
  const hasWaterBelow = isWaterAt(tileMap, column, row + 1);

  const sheetColumn = !hasWaterLeft
    ? WATER_TILE_LEFT_COLUMN
    : !hasWaterRight
      ? WATER_TILE_RIGHT_COLUMN
      : WATER_TILE_MIDDLE_COLUMN;

  const sheetRow = !hasWaterAbove
    ? WATER_TILE_TOP_ROW
    : !hasWaterBelow
      ? WATER_TILE_BOTTOM_ROW
      : WATER_TILE_MIDDLE_ROW;

  return { column: sheetColumn, row: sheetRow };
}
