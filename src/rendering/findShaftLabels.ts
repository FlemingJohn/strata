import type { ShaftLabel } from "../types/shaftLabel";
import { ROWS_PER_STRATUM } from "../constants/backgroundSettings";
import { STRATUM_SETTINGS } from "../constants/stratumSettings";
import { TILE_SIZE } from "../constants/tilesetSettings";

function wrapIndex(value: number, length: number): number {
  return ((value % length) + length) % length;
}

export function findShaftLabels(
  canvasHeight: number,
  scrollOffsetPixels: number
): ShaftLabel[] {
  const rowCount = Math.ceil(canvasHeight / TILE_SIZE) + 2;
  const pixelsScrolledWithinTile = Math.floor(scrollOffsetPixels % TILE_SIZE);
  const rowsAlreadyPassed = Math.floor(scrollOffsetPixels / TILE_SIZE);
  const labels: ShaftLabel[] = [];

  for (let visibleRow = -1; visibleRow < rowCount; visibleRow++) {
    const worldRow = visibleRow + rowsAlreadyPassed;

    if (wrapIndex(worldRow, ROWS_PER_STRATUM) !== 0) {
      continue;
    }

    const stratum =
      STRATUM_SETTINGS[
        wrapIndex(Math.floor(worldRow / ROWS_PER_STRATUM), STRATUM_SETTINGS.length)
      ];

    labels.push({
      year: stratum.approximateYear,
      stratumName: stratum.displayName.toUpperCase(),
      inkColour: stratum.inkColour,
      verticalPosition: visibleRow * TILE_SIZE - pixelsScrolledWithinTile
    });
  }

  return labels;
}
