import type { RoomTileMap } from "../types/dungeon";
import type { TileSheets } from "./loadTileSheets";
import {
  EXIT_TILE_COLUMN,
  EXIT_TILE_ROW,
  FLOOR_TILE_COLUMN,
  FLOOR_TILE_ROW,
  TILE_SIZE,
  WALL_TILE_COLUMN,
  WALL_TILE_ROW
} from "../constants/tilesetSettings";

function drawTile(
  context: CanvasRenderingContext2D,
  sheet: HTMLImageElement,
  sheetColumn: number,
  sheetRow: number,
  destinationColumn: number,
  destinationRow: number
): void {
  context.drawImage(
    sheet,
    sheetColumn * TILE_SIZE,
    sheetRow * TILE_SIZE,
    TILE_SIZE,
    TILE_SIZE,
    destinationColumn * TILE_SIZE,
    destinationRow * TILE_SIZE,
    TILE_SIZE,
    TILE_SIZE
  );
}

export function drawRoomTiles(
  context: CanvasRenderingContext2D,
  tileMap: RoomTileMap,
  sheets: TileSheets
): void {
  for (let row = 0; row < tileMap.rowCount; row++) {
    for (let column = 0; column < tileMap.columnCount; column++) {
      const tile = tileMap.tiles[row][column];

      if (tile === "wall") {
        drawTile(context, sheets.wallSheet, WALL_TILE_COLUMN, WALL_TILE_ROW, column, row);
        continue;
      }

      if (tile === "exit") {
        drawTile(context, sheets.floorSheet, EXIT_TILE_COLUMN, EXIT_TILE_ROW, column, row);
        continue;
      }

      drawTile(context, sheets.floorSheet, FLOOR_TILE_COLUMN, FLOOR_TILE_ROW, column, row);
    }
  }
}
