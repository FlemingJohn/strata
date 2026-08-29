import type { DustMote } from "../types/background";
import { DUST_COLOUR } from "../constants/backgroundSettings";

export function drawDustMotes(
  context: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  motes: DustMote[]
): void {
  context.fillStyle = DUST_COLOUR;

  for (const mote of motes) {
    context.globalAlpha = mote.opacity;
    context.fillRect(
      mote.horizontalRatio * canvasWidth,
      mote.verticalRatio * canvasHeight,
      mote.sizeInPixels,
      mote.sizeInPixels
    );
  }

  context.globalAlpha = 1;
}

export function moveDustMotes(
  motes: DustMote[],
  canvasHeight: number,
  secondsElapsed: number
): void {
  for (const mote of motes) {
    const distanceFallen = (mote.fallSpeedPixelsPerSecond * secondsElapsed) / canvasHeight;
    mote.verticalRatio += distanceFallen;

    if (mote.verticalRatio > 1) {
      mote.verticalRatio -= 1;
    }
  }
}
