import type { SedimentFleck } from "../types/background";
import { STRATUM_SETTINGS } from "../constants/stratumSettings";
import {
  BAND_HEIGHT_PIXELS,
  FLECK_OPACITY,
  INK_OPACITY_OVER_GROUND,
  STRATUM_SEAM_OPACITY,
  STRATUM_SEAM_THICKNESS_PIXELS,
  YEAR_LABEL_FONT,
  YEAR_LABEL_LEFT_MARGIN_PIXELS,
  YEAR_LABEL_OPACITY
} from "../constants/backgroundSettings";

const GROUND_COLOUR = "#14110F";
const LABEL_COLOUR = "#EDE4D8";

function wrapIndex(value: number, length: number): number {
  return ((value % length) + length) % length;
}

export function drawSedimentBands(
  context: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  driftOffsetPixels: number,
  flecksByBand: SedimentFleck[][]
): void {
  const stratumCount = STRATUM_SETTINGS.length;
  const pixelsScrolledWithinBand = driftOffsetPixels % BAND_HEIGHT_PIXELS;
  const bandsAlreadyPassed = Math.floor(driftOffsetPixels / BAND_HEIGHT_PIXELS);
  const bandsNeeded = Math.ceil(canvasHeight / BAND_HEIGHT_PIXELS) + 2;

  context.fillStyle = GROUND_COLOUR;
  context.fillRect(0, 0, canvasWidth, canvasHeight);

  for (let visibleIndex = -1; visibleIndex < bandsNeeded; visibleIndex++) {
    const bandTop = visibleIndex * BAND_HEIGHT_PIXELS - pixelsScrolledWithinBand;
    const stratumIndex = wrapIndex(visibleIndex + bandsAlreadyPassed, stratumCount);
    const stratum = STRATUM_SETTINGS[stratumIndex];

    context.globalAlpha = INK_OPACITY_OVER_GROUND;
    context.fillStyle = stratum.inkColour;
    context.fillRect(0, bandTop, canvasWidth, BAND_HEIGHT_PIXELS);

    context.globalAlpha = FLECK_OPACITY;
    context.fillStyle = stratum.inkColour;

    for (const fleck of flecksByBand[stratumIndex]) {
      context.fillRect(
        fleck.horizontalRatio * canvasWidth,
        bandTop + fleck.verticalRatio * BAND_HEIGHT_PIXELS,
        fleck.sizeInPixels,
        fleck.sizeInPixels
      );
    }

    context.globalAlpha = STRATUM_SEAM_OPACITY;
    context.fillStyle = "#000000";
    context.fillRect(0, bandTop, canvasWidth, STRATUM_SEAM_THICKNESS_PIXELS);

    context.globalAlpha = YEAR_LABEL_OPACITY;
    context.fillStyle = LABEL_COLOUR;
    context.font = YEAR_LABEL_FONT;
    context.fillText(
      String(stratum.approximateYear),
      YEAR_LABEL_LEFT_MARGIN_PIXELS,
      bandTop + 9
    );
  }

  context.globalAlpha = 1;
}
