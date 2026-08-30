import type { BackgroundController } from "../types/background";
import type { TileSheets } from "./loadTileSheets";
import {
  DOWNWARD_SCROLL_PIXELS_PER_SECOND,
  RENDER_SCALE_DIVISOR
} from "../constants/backgroundSettings";
import { createDustMotes } from "./createDustMotes";
import { drawDungeonShaft } from "./drawDungeonShaft";
import { drawDustMotes, moveDustMotes } from "./drawDustMotes";
import { drawReadabilityOverlay } from "./drawReadabilityOverlay";
import { loadTileSheets } from "./loadTileSheets";

export function startDungeonBackground(canvas: HTMLCanvasElement): BackgroundController {
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("The background canvas does not support two dimensional drawing");
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dustMotes = createDustMotes();

  let tileSheets: TileSheets | null = null;
  let canvasWidth = 0;
  let canvasHeight = 0;
  let scrollOffsetPixels = 0;
  let previousTimestamp = 0;
  let animationHandle = 0;
  let isRunning = true;

  function drawEverything(): void {
    if (!tileSheets) {
      return;
    }

    drawDungeonShaft(context, canvasWidth, canvasHeight, scrollOffsetPixels, tileSheets);
    drawDustMotes(context, canvasWidth, canvasHeight, dustMotes);
    drawReadabilityOverlay(context, canvasWidth, canvasHeight);
  }

  function resizeCanvas(): void {
    canvasWidth = Math.ceil(window.innerWidth / RENDER_SCALE_DIVISOR);
    canvasHeight = Math.ceil(window.innerHeight / RENDER_SCALE_DIVISOR);
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.width = `${canvasWidth * RENDER_SCALE_DIVISOR}px`;
    canvas.style.height = `${canvasHeight * RENDER_SCALE_DIVISOR}px`;
    context.imageSmoothingEnabled = false;

    if (prefersReducedMotion) {
      drawEverything();
    }
  }

  function renderFrame(timestamp: number): void {
    if (!isRunning) {
      return;
    }

    const secondsElapsed = previousTimestamp
      ? Math.min(0.05, (timestamp - previousTimestamp) / 1000)
      : 0;
    previousTimestamp = timestamp;

    scrollOffsetPixels += DOWNWARD_SCROLL_PIXELS_PER_SECOND * secondsElapsed;
    moveDustMotes(dustMotes, canvasHeight, secondsElapsed);
    drawEverything();

    animationHandle = window.requestAnimationFrame(renderFrame);
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  loadTileSheets()
    .then((sheets) => {
      tileSheets = sheets;

      if (prefersReducedMotion) {
        drawEverything();
      } else if (isRunning) {
        animationHandle = window.requestAnimationFrame(renderFrame);
      }
    })
    .catch(() => {
      isRunning = false;
    });

  return {
    stop(): void {
      isRunning = false;
      window.cancelAnimationFrame(animationHandle);
      window.removeEventListener("resize", resizeCanvas);
    }
  };
}
