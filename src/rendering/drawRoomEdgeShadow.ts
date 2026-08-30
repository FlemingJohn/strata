import { ROOM_EDGE_SHADOW_OPACITY } from "../constants/tilesetSettings";

export function drawRoomEdgeShadow(
  context: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number
): void {
  const shadow = context.createRadialGradient(
    canvasWidth / 2,
    canvasHeight / 2,
    Math.min(canvasWidth, canvasHeight) * 0.34,
    canvasWidth / 2,
    canvasHeight / 2,
    Math.max(canvasWidth, canvasHeight) * 0.72
  );

  shadow.addColorStop(0, "rgba(0, 0, 0, 0)");
  shadow.addColorStop(1, `rgba(6, 4, 3, ${ROOM_EDGE_SHADOW_OPACITY})`);

  context.fillStyle = shadow;
  context.fillRect(0, 0, canvasWidth, canvasHeight);
}
