import type { BackgroundController } from "../types/background";
import type { Ember } from "../types/fire";
import type { FirePlacement } from "../types/fire";
import type { TileSheets } from "./loadTileSheets";
import type { TorchPlacement } from "../types/lighting";
import {
  DOWNWARD_SCROLL_PIXELS_PER_SECOND,
  RENDER_SCALE_DIVISOR,
  SHAFT_TORCH_FLICKER_AMOUNT,
  SHAFT_TORCH_FLICKER_SPEED,
  SHAFT_TORCH_LIGHT_RADIUS_PIXELS
} from "../constants/backgroundSettings";
import { FIRE_FRAMES_PER_SECOND, FIRE_FRAME_WIDTH } from "../constants/fireSettings";
import { createDustMotes } from "./createDustMotes";
import { drawDungeonShaft } from "./drawDungeonShaft";
import { drawDustMotes, moveDustMotes } from "./drawDustMotes";
import { drawEmbers, updateEmbers } from "./drawFires";
import { drawDarknessWithLights } from "./drawTorchLight";
import { drawMenuProtectionBand } from "./drawMenuProtectionBand";
import { loadTileSheets } from "./loadTileSheets";
import { placeShaftTorches } from "./placeShaftTorches";

export function startDungeonBackground(canvas: HTMLCanvasElement): BackgroundController {
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("The background canvas does not support two dimensional drawing");
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dustMotes = createDustMotes();
  const embers: Ember[] = [];

  let tileSheets: TileSheets | null = null;
  let canvasWidth = 0;
  let canvasHeight = 0;
  let scrollOffsetPixels = 0;
  let previousTimestamp = 0;
  let animationHandle = 0;
  let fireFrameIndex = 0;
  let secondsSinceFireFrame = 0;
  let elapsedSeconds = 0;
  let isRunning = true;

  function findFlicker(phase: number): number {
    return 1 + Math.sin(elapsedSeconds * SHAFT_TORCH_FLICKER_SPEED + phase) * SHAFT_TORCH_FLICKER_AMOUNT;
  }

  function drawTorchFlames(torches: TorchPlacement[], sheets: TileSheets): void {
    const frameCount = Math.max(1, Math.round(sheets.fireSheet.naturalWidth / FIRE_FRAME_WIDTH));

    torches.forEach((torch, index) => {
      const frame = (fireFrameIndex + index) % frameCount;
      context.drawImage(
        sheets.fireSheet,
        frame * FIRE_FRAME_WIDTH,
        0,
        FIRE_FRAME_WIDTH,
        sheets.fireSheet.naturalHeight,
        Math.round(torch.horizontalPosition - FIRE_FRAME_WIDTH / 2),
        Math.round(torch.verticalPosition - sheets.fireSheet.naturalHeight),
        FIRE_FRAME_WIDTH,
        sheets.fireSheet.naturalHeight
      );
    });
  }

  function findEmberSources(torches: TorchPlacement[]): FirePlacement[] {
    return torches.map((torch) => ({
      horizontalPosition: torch.horizontalPosition,
      verticalPosition: torch.verticalPosition,
      flickerPhase: torch.flickerPhase
    }));
  }

  function drawEverything(): void {
    if (!tileSheets) {
      return;
    }

    const torches = placeShaftTorches(canvasWidth, canvasHeight, scrollOffsetPixels);

    drawDungeonShaft(context, canvasWidth, canvasHeight, scrollOffsetPixels, tileSheets);
    drawTorchFlames(torches, tileSheets);
    drawDustMotes(context, canvasWidth, canvasHeight, dustMotes);

    const lights = torches.map((torch) => ({
      horizontalPosition: torch.horizontalPosition,
      verticalPosition: torch.verticalPosition - 6,
      radiusInPixels: SHAFT_TORCH_LIGHT_RADIUS_PIXELS * findFlicker(torch.flickerPhase),
      flickerPhase: torch.flickerPhase
    }));

    drawDarknessWithLights(context, canvasWidth, canvasHeight, lights);
    drawEmbers(context, embers);
    drawMenuProtectionBand(context, canvasWidth, canvasHeight);
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

    elapsedSeconds += secondsElapsed;
    scrollOffsetPixels += DOWNWARD_SCROLL_PIXELS_PER_SECOND * secondsElapsed;
    secondsSinceFireFrame += secondsElapsed;

    if (secondsSinceFireFrame >= 1 / FIRE_FRAMES_PER_SECOND) {
      secondsSinceFireFrame -= 1 / FIRE_FRAMES_PER_SECOND;
      fireFrameIndex += 1;
    }

    moveDustMotes(dustMotes, canvasHeight, secondsElapsed);
    updateEmbers(
      embers,
      findEmberSources(placeShaftTorches(canvasWidth, canvasHeight, scrollOffsetPixels)),
      secondsElapsed
    );
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
