import type { TorchPlacement } from "../types/lighting";
import {
  SHAFT_TORCH_EVERY_ROWS,
  SHAFT_WALL_COLUMNS
} from "../constants/backgroundSettings";
import { TILE_SIZE } from "../constants/tilesetSettings";

export function placeShaftTorches(
  canvasWidth: number,
  canvasHeight: number,
  scrollOffsetPixels: number
): TorchPlacement[] {
  const columnCount = Math.ceil(canvasWidth / TILE_SIZE) + 1;
  const leftColumn = SHAFT_WALL_COLUMNS - 1;
  const rightColumn = columnCount - SHAFT_WALL_COLUMNS;

  const pixelsScrolledWithinTile = scrollOffsetPixels % TILE_SIZE;
  const rowsAlreadyPassed = Math.floor(scrollOffsetPixels / TILE_SIZE);
  const rowCount = Math.ceil(canvasHeight / TILE_SIZE) + 2;

  const torches: TorchPlacement[] = [];

  for (let visibleRow = -1; visibleRow < rowCount; visibleRow++) {
    const worldRow = visibleRow + rowsAlreadyPassed;

    if (((worldRow % SHAFT_TORCH_EVERY_ROWS) + SHAFT_TORCH_EVERY_ROWS) % SHAFT_TORCH_EVERY_ROWS !== 0) {
      continue;
    }

    const verticalPosition = visibleRow * TILE_SIZE - pixelsScrolledWithinTile + TILE_SIZE;

    torches.push({
      horizontalPosition: leftColumn * TILE_SIZE + TILE_SIZE / 2,
      verticalPosition,
      flickerPhase: worldRow * 0.7
    });

    torches.push({
      horizontalPosition: rightColumn * TILE_SIZE + TILE_SIZE / 2,
      verticalPosition,
      flickerPhase: worldRow * 0.7 + 1.9
    });
  }

  return torches;
}
