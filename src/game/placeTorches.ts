import type { RoomTileMap } from "../types/dungeon";
import type { TorchPlacement } from "../types/lighting";
import { TILE_SIZE } from "../constants/tilesetSettings";
import { TORCH_SPACING_TILES } from "../constants/lightingSettings";

function isWall(tileMap: RoomTileMap, column: number, row: number): boolean {
  if (column < 0 || row < 0 || column >= tileMap.columnCount || row >= tileMap.rowCount) {
    return false;
  }

  return tileMap.tiles[row][column] === "wall";
}

function isFloor(tileMap: RoomTileMap, column: number, row: number): boolean {
  if (column < 0 || row < 0 || column >= tileMap.columnCount || row >= tileMap.rowCount) {
    return false;
  }

  return tileMap.tiles[row][column] !== "wall";
}

export function placeTorches(tileMap: RoomTileMap): TorchPlacement[] {
  const torches: TorchPlacement[] = [];
  let phaseSeed = 0;

  for (let column = 2; column < tileMap.columnCount - 2; column += TORCH_SPACING_TILES) {
    if (isWall(tileMap, column, 0) && isFloor(tileMap, column, 1)) {
      torches.push({
        horizontalPosition: column * TILE_SIZE + TILE_SIZE / 2,
        verticalPosition: TILE_SIZE + 2,
        flickerPhase: phaseSeed
      });
      phaseSeed += 1.7;
    }

    const bottomRow = tileMap.rowCount - 1;

    if (isWall(tileMap, column, bottomRow) && isFloor(tileMap, column, bottomRow - 1)) {
      torches.push({
        horizontalPosition: column * TILE_SIZE + TILE_SIZE / 2,
        verticalPosition: bottomRow * TILE_SIZE - 2,
        flickerPhase: phaseSeed
      });
      phaseSeed += 1.7;
    }
  }

  for (let row = 3; row < tileMap.rowCount - 3; row += TORCH_SPACING_TILES) {
    if (isWall(tileMap, 0, row) && isFloor(tileMap, 1, row)) {
      torches.push({
        horizontalPosition: TILE_SIZE + 2,
        verticalPosition: row * TILE_SIZE + TILE_SIZE / 2,
        flickerPhase: phaseSeed
      });
      phaseSeed += 1.7;
    }

    const rightColumn = tileMap.columnCount - 1;

    if (isWall(tileMap, rightColumn, row) && isFloor(tileMap, rightColumn - 1, row)) {
      torches.push({
        horizontalPosition: rightColumn * TILE_SIZE - 2,
        verticalPosition: row * TILE_SIZE + TILE_SIZE / 2,
        flickerPhase: phaseSeed
      });
      phaseSeed += 1.7;
    }
  }

  return torches;
}
