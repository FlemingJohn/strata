import {
  READABILITY_OVERLAY_COLOUR,
  VIGNETTE_INNER_RATIO,
  VIGNETTE_OUTER_COLOUR
} from "../constants/backgroundSettings";

export function drawReadabilityOverlay(
  context: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number
): void {
  context.fillStyle = READABILITY_OVERLAY_COLOUR;
  context.fillRect(0, 0, canvasWidth, canvasHeight);

  const centreHorizontal = canvasWidth / 2;
  const centreVertical = canvasHeight / 2;
  const longestSide = Math.max(canvasWidth, canvasHeight);

  const vignette = context.createRadialGradient(
    centreHorizontal,
    centreVertical,
    longestSide * VIGNETTE_INNER_RATIO,
    centreHorizontal,
    centreVertical,
    longestSide * 0.78
  );

  vignette.addColorStop(0, "rgba(8, 6, 5, 0)");
  vignette.addColorStop(1, VIGNETTE_OUTER_COLOUR);

  context.fillStyle = vignette;
  context.fillRect(0, 0, canvasWidth, canvasHeight);
}
