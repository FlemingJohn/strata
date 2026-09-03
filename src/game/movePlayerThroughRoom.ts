import type { PlayerCharacter } from "../types/player";
import type { RoomTileMap } from "../types/dungeon";
import { TILE_SIZE } from "../constants/tilesetSettings";
import { nameTile } from "./blockRoomTiles";

export function isTileBlocking(tileMap: RoomTileMap, column: number, row: number): boolean {
  if (column < 0 || row < 0 || column >= tileMap.columnCount || row >= tileMap.rowCount) {
    return true;
  }

  if (tileMap.tiles[row][column] === "wall") {
    return true;
  }

  return tileMap.blockedTiles.has(nameTile(column, row));
}

export function collidesWithWall(
  tileMap: RoomTileMap,
  horizontalPosition: number,
  verticalPosition: number,
  radius: number
): boolean {
  const leftColumn = Math.floor((horizontalPosition - radius) / TILE_SIZE);
  const rightColumn = Math.floor((horizontalPosition + radius) / TILE_SIZE);
  const topRow = Math.floor((verticalPosition - radius) / TILE_SIZE);
  const bottomRow = Math.floor((verticalPosition + radius) / TILE_SIZE);

  for (let row = topRow; row <= bottomRow; row++) {
    for (let column = leftColumn; column <= rightColumn; column++) {
      if (isTileBlocking(tileMap, column, row)) {
        return true;
      }
    }
  }

  return false;
}

export function movePlayerThroughRoom(
  player: PlayerCharacter,
  tileMap: RoomTileMap,
  horizontalDistance: number,
  verticalDistance: number
): void {
  const nextHorizontal = player.horizontalPosition + horizontalDistance;

  if (
    !collidesWithWall(tileMap, nextHorizontal, player.verticalPosition, player.collisionRadius)
  ) {
    player.horizontalPosition = nextHorizontal;
  }

  const nextVertical = player.verticalPosition + verticalDistance;

  if (
    !collidesWithWall(tileMap, player.horizontalPosition, nextVertical, player.collisionRadius)
  ) {
    player.verticalPosition = nextVertical;
  }
}
