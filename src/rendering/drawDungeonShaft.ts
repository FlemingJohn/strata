import type { TileSheets } from "./loadTileSheets";
import {
  DOORWAY_WIDTH_TILES,
  LEVEL_DIVIDER_EVERY_ROWS,
  ROWS_PER_STRATUM,
  SHAFT_WALL_COLUMNS,
  STRATUM_TINT_OPACITY
} from "../constants/backgroundSettings";
import {
  FLOOR_TILE_VARIANTS,
  TILE_SIZE,
  WALL_TILE_VARIANTS
} from "../constants/tilesetSettings";
import { STRATUM_SETTINGS } from "../constants/stratumSettings";

const GROUND_COLOUR = "#14110F";

function chooseVariantIndex(column: number, row: number, variantCount: number): number {
  const scrambled = Math.imul(column + 1, 73856093) ^ Math.imul(row + 1, 19349663);
  return Math.abs(scrambled) % variantCount;
}

function wrapIndex(value: number, length: number): number {
  return ((value % length) + length) % length;
}

function findStratumForRow(worldRow: number) {
  const bandIndex = Math.floor(worldRow / ROWS_PER_STRATUM);
  return STRATUM_SETTINGS[wrapIndex(bandIndex, STRATUM_SETTINGS.length)];
}

function isDoorwayGap(worldColumn: number, columnCount: number): boolean {
  const middleColumn = Math.floor(columnCount / 2);
  const halfWidth = Math.floor(DOORWAY_WIDTH_TILES / 2);
  return worldColumn >= middleColumn - halfWidth && worldColumn < middleColumn + halfWidth;
}

function isWallTile(worldColumn: number, worldRow: number, columnCount: number): boolean {
  const isShaftEdge =
    worldColumn < SHAFT_WALL_COLUMNS || worldColumn >= columnCount - SHAFT_WALL_COLUMNS;

  if (isShaftEdge) {
    return true;
  }

  const isLevelDivider = wrapIndex(worldRow, LEVEL_DIVIDER_EVERY_ROWS) === 0;

  return isLevelDivider && !isDoorwayGap(worldColumn, columnCount);
}

function drawTile(
  context: CanvasRenderingContext2D,
  sheet: HTMLImageElement,
  sheetColumn: number,
  sheetRow: number,
  destinationLeft: number,
  destinationTop: number
): void {
  context.drawImage(
    sheet,
    sheetColumn * TILE_SIZE,
    sheetRow * TILE_SIZE,
    TILE_SIZE,
    TILE_SIZE,
    destinationLeft,
    destinationTop,
    TILE_SIZE,
    TILE_SIZE
  );
}

export function drawDungeonShaft(
  context: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  scrollOffsetPixels: number,
  sheets: TileSheets
): void {
  context.fillStyle = GROUND_COLOUR;
  context.fillRect(0, 0, canvasWidth, canvasHeight);

  const columnCount = Math.ceil(canvasWidth / TILE_SIZE) + 1;
  const rowCount = Math.ceil(canvasHeight / TILE_SIZE) + 2;
  const pixelsScrolledWithinTile = Math.floor(scrollOffsetPixels % TILE_SIZE);
  const rowsAlreadyPassed = Math.floor(scrollOffsetPixels / TILE_SIZE);

  for (let visibleRow = -1; visibleRow < rowCount; visibleRow++) {
    const worldRow = visibleRow + rowsAlreadyPassed;
    const destinationTop = visibleRow * TILE_SIZE - pixelsScrolledWithinTile;
    const stratum = findStratumForRow(worldRow);

    for (let column = 0; column < columnCount; column++) {
      const destinationLeft = column * TILE_SIZE;

      if (isWallTile(column, worldRow, columnCount)) {
        const wallVariant =
          WALL_TILE_VARIANTS[chooseVariantIndex(column, worldRow, WALL_TILE_VARIANTS.length)];
        drawTile(
          context,
          sheets.wallSheet,
          wallVariant.column,
          wallVariant.row,
          destinationLeft,
          destinationTop
        );
      } else {
        const floorVariant =
          FLOOR_TILE_VARIANTS[chooseVariantIndex(column, worldRow, FLOOR_TILE_VARIANTS.length)];
        drawTile(
          context,
          sheets.floorSheet,
          floorVariant.column,
          floorVariant.row,
          destinationLeft,
          destinationTop
        );
      }
    }

    context.globalAlpha = STRATUM_TINT_OPACITY;
    context.fillStyle = stratum.inkColour;
    context.fillRect(0, destinationTop, canvasWidth, TILE_SIZE);
    context.globalAlpha = 1;
  }
}
