import { ENTITY_SHADOW_OPACITY } from "../constants/tilesetSettings";

export function drawEntityShadow(
  context: CanvasRenderingContext2D,
  horizontalPosition: number,
  verticalPosition: number,
  widthInPixels: number
): void {
  context.globalAlpha = ENTITY_SHADOW_OPACITY;
  context.fillStyle = "#000000";
  context.beginPath();
  context.ellipse(
    Math.round(horizontalPosition),
    Math.round(verticalPosition + 1),
    widthInPixels / 2,
    widthInPixels / 4,
    0,
    0,
    Math.PI * 2
  );
  context.fill();
  context.globalAlpha = 1;
}
