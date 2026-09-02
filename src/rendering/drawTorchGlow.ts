import type { TorchPlacement } from "../types/lighting";
import {
  SHAFT_TORCH_FLICKER_AMOUNT,
  SHAFT_TORCH_FLICKER_SPEED,
  SHAFT_TORCH_GLOW_OPACITY,
  SHAFT_TORCH_GLOW_RADIUS_PIXELS
} from "../constants/backgroundSettings";

export function drawTorchGlow(
  context: CanvasRenderingContext2D,
  torches: TorchPlacement[],
  elapsedSeconds: number
): void {
  context.globalCompositeOperation = "lighter";

  for (const torch of torches) {
    const flicker =
      1 +
      Math.sin(elapsedSeconds * SHAFT_TORCH_FLICKER_SPEED + torch.flickerPhase) *
        SHAFT_TORCH_FLICKER_AMOUNT;
    const radius = SHAFT_TORCH_GLOW_RADIUS_PIXELS * flicker;
    const centreVertical = torch.verticalPosition - 8;

    const glow = context.createRadialGradient(
      torch.horizontalPosition,
      centreVertical,
      0,
      torch.horizontalPosition,
      centreVertical,
      radius
    );

    glow.addColorStop(0, `rgba(255, 150, 60, ${SHAFT_TORCH_GLOW_OPACITY})`);
    glow.addColorStop(0.5, `rgba(255, 120, 40, ${SHAFT_TORCH_GLOW_OPACITY * 0.35})`);
    glow.addColorStop(1, "rgba(255, 110, 30, 0)");

    context.fillStyle = glow;
    context.fillRect(
      torch.horizontalPosition - radius,
      centreVertical - radius,
      radius * 2,
      radius * 2
    );
  }

  context.globalCompositeOperation = "source-over";
}

export function drawTorchFlames(
  context: CanvasRenderingContext2D,
  fireSheet: HTMLImageElement,
  frameWidth: number,
  torches: TorchPlacement[],
  animationFrameIndex: number
): void {
  const frameCount = Math.max(1, Math.round(fireSheet.naturalWidth / frameWidth));

  torches.forEach((torch, index) => {
    const frame = (animationFrameIndex + index) % frameCount;

    context.drawImage(
      fireSheet,
      frame * frameWidth,
      0,
      frameWidth,
      fireSheet.naturalHeight,
      Math.round(torch.horizontalPosition - frameWidth / 2),
      Math.round(torch.verticalPosition - fireSheet.naturalHeight),
      frameWidth,
      fireSheet.naturalHeight
    );
  });
}
