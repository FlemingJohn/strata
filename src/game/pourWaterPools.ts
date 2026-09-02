import type { TileKind } from "../types/room";
import {
  CHANCE_A_ROOM_HOLDS_POOLS,
  POOLS_PER_ROOM_MAXIMUM,
  POOLS_PER_ROOM_MINIMUM,
  POOL_HEIGHT_MAXIMUM,
  POOL_HEIGHT_MINIMUM,
  POOL_WIDTH_MAXIMUM,
  POOL_WIDTH_MINIMUM
} from "../constants/waterSettings";

function isNearCentre(column: number, row: number, columnCount: number, rowCount: number): boolean {
  return Math.abs(column - columnCount / 2) < 3 && Math.abs(row - rowCount / 2) < 3;
}

function pickBetween(
  smallest: number,
  largest: number,
  nextRandomNumber: () => number
): number {
  return smallest + Math.floor(nextRandomNumber() * (largest - smallest + 1));
}

export function pourWaterPools(
  tiles: TileKind[][],
  nextRandomNumber: () => number
): void {
  if (nextRandomNumber() > CHANCE_A_ROOM_HOLDS_POOLS) {
    return;
  }

  const rowCount = tiles.length;
  const columnCount = tiles[0].length;
  const poolCount = pickBetween(POOLS_PER_ROOM_MINIMUM, POOLS_PER_ROOM_MAXIMUM, nextRandomNumber);

  for (let poolIndex = 0; poolIndex < poolCount; poolIndex++) {
    const width = pickBetween(POOL_WIDTH_MINIMUM, POOL_WIDTH_MAXIMUM, nextRandomNumber);
    const height = pickBetween(POOL_HEIGHT_MINIMUM, POOL_HEIGHT_MAXIMUM, nextRandomNumber);
    const startColumn = 2 + Math.floor(nextRandomNumber() * (columnCount - width - 4));
    const startRow = 2 + Math.floor(nextRandomNumber() * (rowCount - height - 4));

    for (let row = startRow; row < startRow + height; row++) {
      for (let column = startColumn; column < startColumn + width; column++) {
        if (isNearCentre(column, row, columnCount, rowCount)) {
          continue;
        }

        if (tiles[row][column] === "floor") {
          tiles[row][column] = "water";
        }
      }
    }
  }
}
