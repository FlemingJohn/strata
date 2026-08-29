import type { BackgroundController } from "../types/background";
import { STRATUM_SETTINGS } from "../constants/stratumSettings";
import {
  RENDER_SCALE_DIVISOR,
  UPWARD_DRIFT_PIXELS_PER_SECOND
} from "../constants/backgroundSettings";
import { createDustMotes } from "./createDustMotes";
import { createSedimentFlecks } from "./createSedimentFlecks";
import { drawDustMotes, moveDustMotes } from "./drawDustMotes";
import { drawReadabilityOverlay } from "./drawReadabilityOverlay";
import { drawSedimentBands } from "./drawSedimentBands";

export function startStrataBackground(canvas: HTMLCanvasElement): BackgroundController {
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("The background canvas does not support two dimensional drawing");
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const flecksByBand = createSedimentFlecks(STRATUM_SETTINGS.length);
  const dustMotes = createDustMotes();

  let canvasWidth = 0;
  let canvasHeight = 0;
  let driftOffsetPixels = 0;
  let previousTimestamp = 0;
  let animationHandle = 0;
  let isRunning = true;

  function resizeCanvas(): void {
    canvasWidth = Math.ceil(window.innerWidth / RENDER_SCALE_DIVISOR);
    canvasHeight = Math.ceil(window.innerHeight / RENDER_SCALE_DIVISOR);
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    context.imageSmoothingEnabled = false;

    if (prefersReducedMotion) {
      drawEverything();
    }
  }

  function drawEverything(): void {
    drawSedimentBands(context, canvasWidth, canvasHeight, driftOffsetPixels, flecksByBand);
    drawDustMotes(context, canvasWidth, canvasHeight, dustMotes);
    drawReadabilityOverlay(context, canvasWidth, canvasHeight);
  }

  function renderFrame(timestamp: number): void {
    if (!isRunning) {
      return;
    }

    const secondsElapsed = previousTimestamp
      ? Math.min(0.05, (timestamp - previousTimestamp) / 1000)
      : 0;
    previousTimestamp = timestamp;

    driftOffsetPixels += UPWARD_DRIFT_PIXELS_PER_SECOND * secondsElapsed;
    moveDustMotes(dustMotes, canvasHeight, secondsElapsed);
    drawEverything();

    animationHandle = window.requestAnimationFrame(renderFrame);
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  if (prefersReducedMotion) {
    drawEverything();
  } else {
    animationHandle = window.requestAnimationFrame(renderFrame);
  }

  return {
    stop(): void {
      isRunning = false;
      window.cancelAnimationFrame(animationHandle);
      window.removeEventListener("resize", resizeCanvas);
    }
  };
}
