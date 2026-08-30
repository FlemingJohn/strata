import type { LightSource, TorchPlacement } from "../types/lighting";
import {
  DARKNESS_COLOUR,
  TORCH_CORE_COLOUR,
  TORCH_CORE_RADIUS_PIXELS,
  TORCH_FLICKER_AMOUNT,
  TORCH_FLICKER_SPEED,
  TORCH_LIGHT_RADIUS_PIXELS
} from "../constants/lightingSettings";

let maskCanvas: HTMLCanvasElement | null = null;

function findMaskCanvas(width: number, height: number): HTMLCanvasElement {
  if (!maskCanvas) {
    maskCanvas = document.createElement("canvas");
  }

  if (maskCanvas.width !== width || maskCanvas.height !== height) {
    maskCanvas.width = width;
    maskCanvas.height = height;
  }

  return maskCanvas;
}

function cutLightHole(
  maskContext: CanvasRenderingContext2D,
  light: LightSource
): void {
  const gradient = maskContext.createRadialGradient(
    light.horizontalPosition,
    light.verticalPosition,
    0,
    light.horizontalPosition,
    light.verticalPosition,
    light.radiusInPixels
  );

  gradient.addColorStop(0, "rgba(0, 0, 0, 1)");
  gradient.addColorStop(0.45, "rgba(0, 0, 0, 0.72)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  maskContext.fillStyle = gradient;
  maskContext.beginPath();
  maskContext.arc(
    light.horizontalPosition,
    light.verticalPosition,
    light.radiusInPixels,
    0,
    Math.PI * 2
  );
  maskContext.fill();
}

export function buildTorchLights(
  torches: TorchPlacement[],
  elapsedSeconds: number
): LightSource[] {
  return torches.map((torch) => {
    const flicker =
      1 + Math.sin(elapsedSeconds * TORCH_FLICKER_SPEED + torch.flickerPhase) * TORCH_FLICKER_AMOUNT;

    return {
      horizontalPosition: torch.horizontalPosition,
      verticalPosition: torch.verticalPosition,
      radiusInPixels: TORCH_LIGHT_RADIUS_PIXELS * flicker,
      flickerPhase: torch.flickerPhase
    };
  });
}

export function drawDarknessWithLights(
  context: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  lights: LightSource[]
): void {
  const mask = findMaskCanvas(canvasWidth, canvasHeight);
  const maskContext = mask.getContext("2d");

  if (!maskContext) {
    return;
  }

  maskContext.globalCompositeOperation = "source-over";
  maskContext.clearRect(0, 0, canvasWidth, canvasHeight);
  maskContext.fillStyle = DARKNESS_COLOUR;
  maskContext.fillRect(0, 0, canvasWidth, canvasHeight);

  maskContext.globalCompositeOperation = "destination-out";

  for (const light of lights) {
    cutLightHole(maskContext, light);
  }

  maskContext.globalCompositeOperation = "source-over";
  context.drawImage(mask, 0, 0);
}

export function drawTorchCores(
  context: CanvasRenderingContext2D,
  torches: TorchPlacement[],
  elapsedSeconds: number
): void {
  for (const torch of torches) {
    const flicker =
      1 + Math.sin(elapsedSeconds * TORCH_FLICKER_SPEED + torch.flickerPhase) * TORCH_FLICKER_AMOUNT;

    context.globalAlpha = 0.85;
    context.fillStyle = TORCH_CORE_COLOUR;
    context.beginPath();
    context.arc(
      torch.horizontalPosition,
      torch.verticalPosition,
      TORCH_CORE_RADIUS_PIXELS * flicker,
      0,
      Math.PI * 2
    );
    context.fill();
    context.globalAlpha = 1;
  }
}
