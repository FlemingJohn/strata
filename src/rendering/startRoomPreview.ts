import type { EnemyName } from "../types/enemy";
import type { RoomTileMap } from "../types/dungeon";
import type { TileKind } from "../types/room";
import {
  PREVIEW_COLUMNS,
  PREVIEW_ENEMY_SPOTS,
  PREVIEW_FIRE_SPOTS,
  PREVIEW_FRAMES_PER_SECOND,
  PREVIEW_HERO_COLUMN,
  PREVIEW_HERO_ROW,
  PREVIEW_PILLARS,
  PREVIEW_PROP_SPOTS,
  PREVIEW_ROWS,
  PREVIEW_SCALE,
  PREVIEW_WATER
} from "../constants/roomPreviewSettings";
import { TILE_SIZE } from "../constants/tilesetSettings";
import { FIRE_FRAMES_PER_SECOND, FIRE_FRAME_WIDTH } from "../constants/fireSettings";
import { LPC_FRAME_SIZE, LPC_GROUND_OFFSET_PIXELS } from "../constants/lpcCharacterSettings";
import { PROP_REGIONS } from "../constants/propSettings";
import { findAreaTheme } from "../constants/areaThemes";
import { chooseAppearanceFromAddress } from "../game/chooseAppearanceFromAddress";
import { DEMO_WALLET_ADDRESS } from "../constants/characterAppearance";
import { drawEntityShadow } from "./drawEntityShadow";
import { drawLpcCharacter } from "./drawLpcCharacter";
import { drawProps } from "./drawProps";
import { drawRoomTiles } from "./drawRoomTiles";
import { loadEnemySprites } from "./loadEnemySprites";
import { loadLpcCharacter } from "./loadLpcCharacter";
import { loadPropSheets } from "./loadPropSheets";
import { loadTileSheets } from "./loadTileSheets";

export interface RoomPreviewController {
  element: HTMLCanvasElement;
  stop: () => void;
}

function buildPreviewRoom(): RoomTileMap {
  const tiles: TileKind[][] = [];

  for (let row = 0; row < PREVIEW_ROWS; row++) {
    tiles[row] = [];

    for (let column = 0; column < PREVIEW_COLUMNS; column++) {
      const isEdge =
        row === 0 ||
        column === 0 ||
        row === PREVIEW_ROWS - 1 ||
        column === PREVIEW_COLUMNS - 1;

      tiles[row][column] = isEdge ? "wall" : "floor";
    }
  }

  const middleColumn = Math.floor(PREVIEW_COLUMNS / 2);

  for (let offset = -1; offset <= 1; offset++) {
    tiles[0][middleColumn + offset] = "exit";
  }

  for (let row = PREVIEW_WATER.topRow; row < PREVIEW_WATER.bottomRow; row++) {
    for (let column = PREVIEW_WATER.leftColumn; column < PREVIEW_WATER.rightColumn; column++) {
      tiles[row][column] = "water";
    }
  }

  for (const pillar of PREVIEW_PILLARS) {
    tiles[pillar.row][pillar.column] = "wall";
    tiles[pillar.row][pillar.column + 1] = "wall";
    tiles[pillar.row + 1][pillar.column] = "wall";
    tiles[pillar.row + 1][pillar.column + 1] = "wall";
  }

  return {
    columnCount: PREVIEW_COLUMNS,
    rowCount: PREVIEW_ROWS,
    tiles,
    blockedTiles: new Set<string>()
  };
}

function findTileCentre(column: number): number {
  return column * TILE_SIZE + TILE_SIZE / 2;
}

function findTileFloor(row: number): number {
  return row * TILE_SIZE + TILE_SIZE;
}

export function startRoomPreview(): RoomPreviewController {
  const canvas = document.createElement("canvas");
  canvas.className = "room-preview-canvas";
  canvas.setAttribute("aria-hidden", "true");
  canvas.width = PREVIEW_COLUMNS * TILE_SIZE;
  canvas.height = PREVIEW_ROWS * TILE_SIZE;
  canvas.style.width = `${canvas.width * PREVIEW_SCALE}px`;
  canvas.style.height = `${canvas.height * PREVIEW_SCALE}px`;

  const context = canvas.getContext("2d");
  let animationHandle = 0;
  let isRunning = true;

  if (!context) {
    return { element: canvas, stop: () => undefined };
  }

  context.imageSmoothingEnabled = false;

  const tileMap = buildPreviewRoom();
  const theme = findAreaTheme(4, "combat");
  const respectsReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  Promise.all([
    loadTileSheets(),
    loadPropSheets(),
    loadLpcCharacter(chooseAppearanceFromAddress(DEMO_WALLET_ADDRESS)),
    loadEnemySprites()
  ])
    .then((loaded) => {
      const [sheets, propSheets, heroSprites, enemySprites] = loaded;
      const dungeonRegions = PROP_REGIONS.dungeon ?? [];

      const props = PREVIEW_PROP_SPOTS.map((spot, index) => ({
        sheetName: "dungeon",
        region: dungeonRegions[index % Math.max(1, dungeonRegions.length)],
        horizontalPosition: findTileCentre(spot.column),
        verticalPosition: findTileFloor(spot.row),
        isBreakable: true
      }));

      function drawEnemy(name: EnemyName, column: number, row: number, frame: number): void {
        const sheet = enemySprites[name].standing;
        const centre = findTileCentre(column);
        const ground = findTileFloor(row);

        drawEntityShadow(context, centre, ground, 13);
        context.drawImage(
          sheet.image,
          (frame % sheet.frameCount) * sheet.frameWidth,
          0,
          sheet.frameWidth,
          sheet.frameHeight,
          Math.round(centre - sheet.frameWidth / 2),
          Math.round(ground - (sheet.frameHeight - 1)),
          sheet.frameWidth,
          sheet.frameHeight
        );
      }

      function drawFires(frame: number): void {
        const fireSheet = sheets.fireSheet;
        const frameCount = Math.max(1, Math.round(fireSheet.naturalWidth / FIRE_FRAME_WIDTH));

        PREVIEW_FIRE_SPOTS.forEach((spot, index) => {
          const centre = findTileCentre(spot.column);
          const ground = findTileFloor(spot.row);
          const glowRadius = 30;

          context.globalCompositeOperation = "lighter";
          const glow = context.createRadialGradient(centre, ground - 8, 0, centre, ground - 8, glowRadius);
          glow.addColorStop(0, "rgba(255, 150, 60, 0.30)");
          glow.addColorStop(1, "rgba(255, 110, 30, 0)");
          context.fillStyle = glow;
          context.fillRect(centre - glowRadius, ground - 8 - glowRadius, glowRadius * 2, glowRadius * 2);
          context.globalCompositeOperation = "source-over";

          context.drawImage(
            fireSheet,
            ((frame + index * 2) % frameCount) * FIRE_FRAME_WIDTH,
            0,
            FIRE_FRAME_WIDTH,
            fireSheet.naturalHeight,
            Math.round(centre - FIRE_FRAME_WIDTH / 2),
            Math.round(ground - fireSheet.naturalHeight),
            FIRE_FRAME_WIDTH,
            fireSheet.naturalHeight
          );
        });
      }

      function drawFrame(elapsedSeconds: number): void {
        const idleFrame = Math.floor(elapsedSeconds * PREVIEW_FRAMES_PER_SECOND);
        const fireFrame = Math.floor(elapsedSeconds * FIRE_FRAMES_PER_SECOND);

        context.clearRect(0, 0, canvas.width, canvas.height);
        drawRoomTiles(context, tileMap, sheets, theme);
        drawProps(context, props, propSheets);
        drawFires(fireFrame);

        PREVIEW_ENEMY_SPOTS.forEach((spot, index) => {
          drawEnemy(spot.name, spot.column, spot.row, idleFrame + index);
        });

        const heroHorizontal = findTileCentre(PREVIEW_HERO_COLUMN);
        const heroVertical = findTileFloor(PREVIEW_HERO_ROW);

        drawEntityShadow(context, heroHorizontal, heroVertical, 14);
        drawLpcCharacter(
          context,
          heroSprites.idle,
          idleFrame,
          "right",
          Math.round(heroHorizontal - LPC_FRAME_SIZE / 2),
          Math.round(heroVertical - LPC_GROUND_OFFSET_PIXELS)
        );
      }

      function renderFrame(timestamp: number): void {
        if (!isRunning) {
          return;
        }

        drawFrame(timestamp / 1000);
        animationHandle = window.requestAnimationFrame(renderFrame);
      }

      if (respectsReducedMotion) {
        drawFrame(0);
        return;
      }

      animationHandle = window.requestAnimationFrame(renderFrame);
    })
    .catch(() => {
      canvas.remove();
    });

  return {
    element: canvas,
    stop(): void {
      isRunning = false;
      window.cancelAnimationFrame(animationHandle);
    }
  };
}
