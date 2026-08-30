import {
  SIGIL_BASE_OPACITY,
  SIGIL_CELL_PIXELS,
  SIGIL_GRID_SIZE,
  SIGIL_PULSE_AMOUNT,
  SIGIL_PULSE_SPEED,
  SIGIL_RING_RADIUS_PIXELS
} from "../constants/lightingSettings";
import { createSeededRandomFromHash } from "../game/createSeededRandomFromHash";

const RING_MARK_COUNT = 16;

let cachedSeed = "";
let cachedGrid: number[][] = [];

function buildMirroredGrid(layoutSeed: string): number[][] {
  if (cachedSeed === layoutSeed && cachedGrid.length > 0) {
    return cachedGrid;
  }

  const nextRandomNumber = createSeededRandomFromHash(layoutSeed);
  const halfWidth = Math.ceil(SIGIL_GRID_SIZE / 2);
  const grid: number[][] = [];

  for (let row = 0; row < SIGIL_GRID_SIZE; row++) {
    grid[row] = [];

    for (let column = 0; column < halfWidth; column++) {
      const value = nextRandomNumber();
      grid[row][column] = value > 0.62 ? 2 : value > 0.4 ? 1 : 0;
    }

    for (let column = halfWidth; column < SIGIL_GRID_SIZE; column++) {
      grid[row][column] = grid[row][SIGIL_GRID_SIZE - 1 - column];
    }
  }

  const spineColumn = halfWidth - 1;

  for (let row = 2; row < SIGIL_GRID_SIZE - 2; row++) {
    if (grid[row][spineColumn] === 0) {
      grid[row][spineColumn] = 1;
    }
  }

  cachedSeed = layoutSeed;
  cachedGrid = grid;
  return grid;
}

export function drawFloorSigil(
  context: CanvasRenderingContext2D,
  centreHorizontal: number,
  centreVertical: number,
  layoutSeed: string,
  inkColour: string,
  elapsedSeconds: number
): void {
  const grid = buildMirroredGrid(layoutSeed);
  const pulse = SIGIL_BASE_OPACITY + Math.sin(elapsedSeconds * SIGIL_PULSE_SPEED) * SIGIL_PULSE_AMOUNT;
  const gridPixels = SIGIL_GRID_SIZE * SIGIL_CELL_PIXELS;
  const left = Math.round(centreHorizontal - gridPixels / 2);
  const top = Math.round(centreVertical - gridPixels / 2);

  context.globalAlpha = Math.max(0.05, pulse);
  context.fillStyle = inkColour;

  for (let row = 0; row < SIGIL_GRID_SIZE; row++) {
    for (let column = 0; column < SIGIL_GRID_SIZE; column++) {
      const value = grid[row][column];

      if (value === 0) {
        continue;
      }

      context.globalAlpha = Math.max(0.05, pulse * (value === 2 ? 1 : 0.55));
      context.fillRect(
        left + column * SIGIL_CELL_PIXELS,
        top + row * SIGIL_CELL_PIXELS,
        SIGIL_CELL_PIXELS,
        SIGIL_CELL_PIXELS
      );
    }
  }

  context.globalAlpha = Math.max(0.05, pulse * 0.7);
  context.strokeStyle = inkColour;
  context.lineWidth = 1;
  context.beginPath();
  context.arc(centreHorizontal, centreVertical, SIGIL_RING_RADIUS_PIXELS, 0, Math.PI * 2);
  context.stroke();

  for (let markIndex = 0; markIndex < RING_MARK_COUNT; markIndex++) {
    const angle = (markIndex / RING_MARK_COUNT) * Math.PI * 2 + elapsedSeconds * 0.12;
    const markHorizontal = centreHorizontal + Math.cos(angle) * (SIGIL_RING_RADIUS_PIXELS + 4);
    const markVertical = centreVertical + Math.sin(angle) * (SIGIL_RING_RADIUS_PIXELS + 4);

    context.fillRect(Math.round(markHorizontal), Math.round(markVertical), 2, 2);
  }

  context.globalAlpha = 1;
}
