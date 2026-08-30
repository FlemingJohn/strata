import {
  MENU_BAND_FEATHER_RATIO,
  MENU_BAND_MINIMUM_INSET_PIXELS,
  MENU_BAND_OPACITY,
  MENU_BAND_WIDTH_RATIO
} from "../constants/backgroundSettings";

export function drawMenuProtectionBand(
  context: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number
): void {
  const centredWidth = canvasWidth * MENU_BAND_WIDTH_RATIO;
  const centredLeft = (canvasWidth - centredWidth) / 2;
  const bandLeft = Math.max(centredLeft, MENU_BAND_MINIMUM_INSET_PIXELS);
  const bandWidth = Math.max(48, canvasWidth - bandLeft * 2);
  const featherWidth = bandWidth * MENU_BAND_FEATHER_RATIO;

  const band = context.createLinearGradient(bandLeft, 0, bandLeft + bandWidth, 0);
  band.addColorStop(0, "rgba(12, 9, 7, 0)");
  band.addColorStop(MENU_BAND_FEATHER_RATIO, `rgba(12, 9, 7, ${MENU_BAND_OPACITY})`);
  band.addColorStop(1 - MENU_BAND_FEATHER_RATIO, `rgba(12, 9, 7, ${MENU_BAND_OPACITY})`);
  band.addColorStop(1, "rgba(12, 9, 7, 0)");

  context.fillStyle = band;
  context.fillRect(bandLeft - featherWidth, 0, bandWidth + featherWidth * 2, canvasHeight);
}
