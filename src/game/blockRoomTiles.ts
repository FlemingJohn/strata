import type { RoomTileMap } from "../types/dungeon";
import {
  DOOR_LANE_DEPTH_TILES,
  DOOR_LANE_HALF_WIDTH_TILES
} from "../constants/solidObjectSettings";
import { TILE_SIZE } from "../constants/tilesetSettings";

export function nameTile(column: number, row: number): string {
  return `${column},${row}`;
}

export function isOnDoorLane(tileMap: RoomTileMap, column: number, row: number): boolean {
  const middleColumn = Math.floor(tileMap.columnCount / 2);
  const middleRow = Math.floor(tileMap.rowCount / 2);

  const isInVerticalLane =
    Math.abs(column - middleColumn) <= DOOR_LANE_HALF_WIDTH_TILES &&
    (row < DOOR_LANE_DEPTH_TILES || row >= tileMap.rowCount - DOOR_LANE_DEPTH_TILES);

  const isInHorizontalLane =
    Math.abs(row - middleRow) <= DOOR_LANE_HALF_WIDTH_TILES &&
    (column < DOOR_LANE_DEPTH_TILES || column >= tileMap.columnCount - DOOR_LANE_DEPTH_TILES);

  return isInVerticalLane || isInHorizontalLane;
}

export function blockRoomTiles(
  tileMap: RoomTileMap,
  centreHorizontal: number,
  verticalPosition: number,
  widthInPixels: number,
  heightInPixels: number
): void {
  const leftColumn = Math.floor((centreHorizontal - widthInPixels / 2) / TILE_SIZE);
  const rightColumn = Math.floor((centreHorizontal + widthInPixels / 2 - 1) / TILE_SIZE);
  const topRow = Math.floor((verticalPosition - heightInPixels) / TILE_SIZE);
  const bottomRow = Math.floor((verticalPosition - 1) / TILE_SIZE);

  for (let row = topRow; row <= bottomRow; row++) {
    for (let column = leftColumn; column <= rightColumn; column++) {
      if (column < 1 || row < 1 || column >= tileMap.columnCount - 1 || row >= tileMap.rowCount - 1) {
        continue;
      }

      if (isOnDoorLane(tileMap, column, row)) {
        continue;
      }

      tileMap.blockedTiles.add(nameTile(column, row));
    }
  }
}

export function unblockRoomTiles(
  tileMap: RoomTileMap,
  centreHorizontal: number,
  verticalPosition: number,
  widthInPixels: number,
  heightInPixels: number
): void {
  const leftColumn = Math.floor((centreHorizontal - widthInPixels / 2) / TILE_SIZE);
  const rightColumn = Math.floor((centreHorizontal + widthInPixels / 2 - 1) / TILE_SIZE);
  const topRow = Math.floor((verticalPosition - heightInPixels) / TILE_SIZE);
  const bottomRow = Math.floor((verticalPosition - 1) / TILE_SIZE);

  for (let row = topRow; row <= bottomRow; row++) {
    for (let column = leftColumn; column <= rightColumn; column++) {
      tileMap.blockedTiles.delete(nameTile(column, row));
    }
  }
}
