import type { RoomTileMap } from "../types/dungeon";
import type { TileSheets } from "./loadTileSheets";
import {
  EXIT_TILE_COLUMN,
  EXIT_TILE_ROW,
  FLOOR_TILE_VARIANTS,
  STRATUM_TINT_OPACITY_IN_ROOM,
  TILE_SIZE,
  WALL_TILE_VARIANTS
} from "../constants/tilesetSettings";

function chooseVariantIndex(column: number, row: number, variantCount: number): number {
  const scrambled = Math.imul(column + 1, 73856093) ^ Math.imul(row + 1, 19349663);
  return Math.abs(scrambled) % variantCount;
}

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
  sheets: TileSheets,
  stratumInkColour: string
): void {
  for (let row = 0; row < tileMap.rowCount; row++) {
    for (let column = 0; column < tileMap.columnCount; column++) {
      const tile = tileMap.tiles[row][column];

      if (tile === "wall") {
        const variant =
          WALL_TILE_VARIANTS[chooseVariantIndex(column, row, WALL_TILE_VARIANTS.length)];
        drawTile(context, sheets.wallSheet, variant.column, variant.row, column, row);
        continue;
      }

      if (tile === "exit") {
        drawTile(context, sheets.floorSheet, EXIT_TILE_COLUMN, EXIT_TILE_ROW, column, row);
        continue;
      }

      const variant =
        FLOOR_TILE_VARIANTS[chooseVariantIndex(column, row, FLOOR_TILE_VARIANTS.length)];
      drawTile(context, sheets.floorSheet, variant.column, variant.row, column, row);
    }
  }

  context.globalAlpha = STRATUM_TINT_OPACITY_IN_ROOM;
  context.fillStyle = stratumInkColour;
  context.fillRect(0, 0, tileMap.columnCount * TILE_SIZE, tileMap.rowCount * TILE_SIZE);
  context.globalAlpha = 1;
}
