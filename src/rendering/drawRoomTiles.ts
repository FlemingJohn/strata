import type { AreaTheme, TileCoordinate } from "../constants/areaThemes";
import type { RoomTileMap } from "../types/dungeon";
import type { TileSheets } from "./loadTileSheets";
import { EXIT_TILE_COLUMN, EXIT_TILE_ROW, TILE_SIZE } from "../constants/tilesetSettings";

function chooseVariantIndex(column: number, row: number, variantCount: number): number {
  const scrambled = Math.imul(column + 1, 73856093) ^ Math.imul(row + 1, 19349663);
  return Math.abs(scrambled) % variantCount;
}

function drawTile(
  context: CanvasRenderingContext2D,
  sheet: HTMLImageElement,
  tile: TileCoordinate,
  destinationColumn: number,
  destinationRow: number
): void {
  context.drawImage(
    sheet,
    tile.column * TILE_SIZE,
    tile.row * TILE_SIZE,
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
  theme: AreaTheme
): void {
  const floorSheet = theme.floorSheet === "dungeon" ? sheets.dungeonSheet : sheets.floorSheet;

  for (let row = 0; row < tileMap.rowCount; row++) {
    for (let column = 0; column < tileMap.columnCount; column++) {
      const tile = tileMap.tiles[row][column];

      if (tile === "wall") {
        const wallTile = theme.wallTiles[chooseVariantIndex(column, row, theme.wallTiles.length)];
        drawTile(context, sheets.wallSheet, wallTile, column, row);
        continue;
      }

      if (tile === "exit") {
        drawTile(
          context,
          sheets.floorSheet,
          { column: EXIT_TILE_COLUMN, row: EXIT_TILE_ROW },
          column,
          row
        );
        continue;
      }

      const floorTile = theme.floorTiles[chooseVariantIndex(column, row, theme.floorTiles.length)];
      drawTile(context, floorSheet, floorTile, column, row);
    }
  }
}
