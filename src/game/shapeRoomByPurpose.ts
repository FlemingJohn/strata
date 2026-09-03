import type { RoomPurpose } from "../types/dungeon";
import type { TileKind } from "../types/room";
import {
  ARENA_CORNER_CUT_TILES,
  HALL_PILLAR_GAP_TILES,
  HALL_PILLAR_INSET_TILES,
  PASSAGE_WALL_THICKNESS_TILES,
  VAULT_INSET_TILES
} from "../constants/roomShapeSettings";

function isNearCentre(
  column: number,
  row: number,
  columnCount: number,
  rowCount: number
): boolean {
  return Math.abs(column - columnCount / 2) < 3 && Math.abs(row - rowCount / 2) < 3;
}

function fillWall(tiles: TileKind[][], column: number, row: number): void {
  if (!tiles[row] || tiles[row][column] !== "floor") {
    return;
  }

  tiles[row][column] = "wall";
}

function shapePillaredHall(tiles: TileKind[][]): void {
  const rowCount = tiles.length;
  const columnCount = tiles[0].length;

  for (
    let row = HALL_PILLAR_INSET_TILES;
    row < rowCount - HALL_PILLAR_INSET_TILES;
    row += HALL_PILLAR_GAP_TILES
  ) {
    for (
      let column = HALL_PILLAR_INSET_TILES;
      column < columnCount - HALL_PILLAR_INSET_TILES;
      column += HALL_PILLAR_GAP_TILES
    ) {
      if (isNearCentre(column, row, columnCount, rowCount)) {
        continue;
      }

      fillWall(tiles, column, row);
      fillWall(tiles, column + 1, row);
      fillWall(tiles, column, row + 1);
      fillWall(tiles, column + 1, row + 1);
    }
  }
}

function shapeNarrowPassage(tiles: TileKind[][], nextRandomNumber: () => number): void {
  const rowCount = tiles.length;
  const columnCount = tiles[0].length;
  const middleRow = Math.floor(rowCount / 2);
  const gapHalfHeight = 2;

  for (let column = 4; column < columnCount - 4; column++) {
    if (Math.abs(column - columnCount / 2) < 4) {
      continue;
    }

    if (nextRandomNumber() < 0.35) {
      continue;
    }

    for (let thickness = 0; thickness < PASSAGE_WALL_THICKNESS_TILES; thickness++) {
      fillWall(tiles, column, middleRow - gapHalfHeight - thickness - 1);
      fillWall(tiles, column, middleRow + gapHalfHeight + thickness + 1);
    }
  }
}

function shapeArena(tiles: TileKind[][]): void {
  const rowCount = tiles.length;
  const columnCount = tiles[0].length;

  for (let step = 0; step < ARENA_CORNER_CUT_TILES; step++) {
    for (let offset = 0; offset <= ARENA_CORNER_CUT_TILES - step; offset++) {
      fillWall(tiles, 1 + offset, 1 + step);
      fillWall(tiles, columnCount - 2 - offset, 1 + step);
      fillWall(tiles, 1 + offset, rowCount - 2 - step);
      fillWall(tiles, columnCount - 2 - offset, rowCount - 2 - step);
    }
  }
}

function shapeVault(tiles: TileKind[][]): void {
  const rowCount = tiles.length;
  const columnCount = tiles[0].length;

  for (let row = 1; row < rowCount - 1; row++) {
    for (let column = 1; column < columnCount - 1; column++) {
      const isInsideVault =
        column >= VAULT_INSET_TILES &&
        column < columnCount - VAULT_INSET_TILES &&
        row >= Math.floor(VAULT_INSET_TILES / 2) &&
        row < rowCount - Math.floor(VAULT_INSET_TILES / 2);

      const isOnDoorLane =
        Math.abs(column - Math.floor(columnCount / 2)) <= 2 ||
        Math.abs(row - Math.floor(rowCount / 2)) <= 2;

      if (!isInsideVault && !isOnDoorLane) {
        fillWall(tiles, column, row);
      }
    }
  }
}

export function shapeRoomByPurpose(
  tiles: TileKind[][],
  purpose: RoomPurpose,
  nextRandomNumber: () => number
): void {
  if (purpose === "boss") {
    shapeArena(tiles);
    return;
  }

  if (purpose === "relic") {
    shapeVault(tiles);
    return;
  }

  if (purpose === "start") {
    shapePillaredHall(tiles);
    return;
  }

  if (nextRandomNumber() < 0.45) {
    shapeNarrowPassage(tiles, nextRandomNumber);
    return;
  }

  shapePillaredHall(tiles);
}
