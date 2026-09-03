import type { RoomTileMap } from "../types/dungeon";
import { TILE_SIZE } from "../constants/tilesetSettings";
import { nameTile } from "./blockRoomTiles";

export const UNREACHABLE_DISTANCE = 30000;

export interface PathField {
  columnCount: number;
  rowCount: number;
  distances: Int16Array;
}

function canWalkOn(tileMap: RoomTileMap, column: number, row: number): boolean {
  if (column < 0 || row < 0 || column >= tileMap.columnCount || row >= tileMap.rowCount) {
    return false;
  }

  if (tileMap.tiles[row][column] === "wall") {
    return false;
  }

  return !tileMap.blockedTiles.has(nameTile(column, row));
}

export function buildPathField(
  tileMap: RoomTileMap,
  targetHorizontal: number,
  targetVertical: number
): PathField {
  const columnCount = tileMap.columnCount;
  const rowCount = tileMap.rowCount;
  const distances = new Int16Array(columnCount * rowCount).fill(UNREACHABLE_DISTANCE);

  const startColumn = Math.floor(targetHorizontal / TILE_SIZE);
  const startRow = Math.floor(targetVertical / TILE_SIZE);

  if (!canWalkOn(tileMap, startColumn, startRow)) {
    return { columnCount, rowCount, distances };
  }

  distances[startRow * columnCount + startColumn] = 0;

  let frontier = [{ column: startColumn, row: startRow }];
  let stepsWalked = 0;

  while (frontier.length > 0) {
    stepsWalked += 1;
    const nextFrontier: { column: number; row: number }[] = [];

    for (const spot of frontier) {
      const neighbours = [
        { column: spot.column + 1, row: spot.row },
        { column: spot.column - 1, row: spot.row },
        { column: spot.column, row: spot.row + 1 },
        { column: spot.column, row: spot.row - 1 }
      ];

      for (const neighbour of neighbours) {
        if (!canWalkOn(tileMap, neighbour.column, neighbour.row)) {
          continue;
        }

        const index = neighbour.row * columnCount + neighbour.column;

        if (distances[index] <= stepsWalked) {
          continue;
        }

        distances[index] = stepsWalked;
        nextFrontier.push(neighbour);
      }
    }

    frontier = nextFrontier;
  }

  return { columnCount, rowCount, distances };
}

export function readPathDistance(field: PathField, column: number, row: number): number {
  if (column < 0 || row < 0 || column >= field.columnCount || row >= field.rowCount) {
    return UNREACHABLE_DISTANCE;
  }

  return field.distances[row * field.columnCount + column];
}

export function findStepTowardsTarget(
  field: PathField,
  horizontalPosition: number,
  verticalPosition: number
): { horizontal: number; vertical: number } | null {
  const column = Math.floor(horizontalPosition / TILE_SIZE);
  const row = Math.floor(verticalPosition / TILE_SIZE);
  const hereDistance = readPathDistance(field, column, row);

  if (hereDistance >= UNREACHABLE_DISTANCE) {
    return null;
  }

  const neighbours = [
    { column: column + 1, row, horizontal: 1, vertical: 0 },
    { column: column - 1, row, horizontal: -1, vertical: 0 },
    { column, row: row + 1, horizontal: 0, vertical: 1 },
    { column, row: row - 1, horizontal: 0, vertical: -1 }
  ];

  let bestDistance = hereDistance;
  let bestStep: { horizontal: number; vertical: number } | null = null;

  for (const neighbour of neighbours) {
    const distance = readPathDistance(field, neighbour.column, neighbour.row);

    if (distance < bestDistance) {
      bestDistance = distance;
      bestStep = { horizontal: neighbour.horizontal, vertical: neighbour.vertical };
    }
  }

  if (!bestStep) {
    return null;
  }

  const tileCentreHorizontal = (column + bestStep.horizontal + 0.5) * TILE_SIZE;
  const tileCentreVertical = (row + bestStep.vertical + 0.5) * TILE_SIZE;
  const towardsHorizontal = tileCentreHorizontal - horizontalPosition;
  const towardsVertical = tileCentreVertical - verticalPosition;
  const length = Math.hypot(towardsHorizontal, towardsVertical) || 1;

  return { horizontal: towardsHorizontal / length, vertical: towardsVertical / length };
}
