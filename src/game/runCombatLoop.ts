import type { HeroSprites } from "../rendering/loadHeroSprites";
import type { PlayerCharacter } from "../types/player";
import type { RoomTileMap } from "../types/dungeon";
import type { TileSheets } from "../rendering/loadTileSheets";
import { ENEMY_ANIMATION_FRAMES_PER_SECOND } from "../constants/animationSettings";
import { TILE_SIZE } from "../constants/tilesetSettings";
import { createInputReader } from "./createInputReader";
import { drawRoomTiles } from "../rendering/drawRoomTiles";
import { drawSpriteFrame } from "../rendering/drawSpriteFrame";
import { findSheetForPlayer } from "../rendering/loadHeroSprites";
import { updatePlayer } from "./updatePlayer";

export interface CombatLoopController {
  stop: () => void;
}

const WALKING_FRAMES_PER_SECOND = 10;
const STANDING_FRAMES_PER_SECOND = 6;

export function runCombatLoop(
  canvas: HTMLCanvasElement,
  player: PlayerCharacter,
  tileMap: RoomTileMap,
  sheets: TileSheets,
  heroSprites: HeroSprites
): CombatLoopController {
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("The combat canvas does not support two dimensional drawing");
  }

  canvas.width = tileMap.columnCount * TILE_SIZE;
  canvas.height = tileMap.rowCount * TILE_SIZE;
  context.imageSmoothingEnabled = false;

  const inputReader = createInputReader();

  let animationFrameIndex = 0;
  let secondsSinceFrameChange = 0;
  let previousTimestamp = 0;
  let animationHandle = 0;
  let isRunning = true;

  function advanceAnimation(secondsElapsed: number, framesPerSecond: number, frameCount: number): void {
    secondsSinceFrameChange += secondsElapsed;
    const secondsPerFrame = 1 / framesPerSecond;

    if (secondsSinceFrameChange >= secondsPerFrame) {
      secondsSinceFrameChange -= secondsPerFrame;
      animationFrameIndex = (animationFrameIndex + 1) % frameCount;
    }
  }

  function drawPlayer(): void {
    const sheet = findSheetForPlayer(
      heroSprites,
      player.activity,
      player.facing,
      player.weaponStyle
    );

    const isFlickering =
      player.secondsRemainingInvulnerable > 0 &&
      Math.floor(performance.now() / 60) % 2 === 0;

    if (isFlickering) {
      return;
    }

    drawSpriteFrame(
      context,
      sheet,
      animationFrameIndex,
      Math.round(player.horizontalPosition - sheet.frameWidth / 2),
      Math.round(player.verticalPosition - sheet.frameHeight / 2),
      player.facing === "left"
    );
  }

  function renderFrame(timestamp: number): void {
    if (!isRunning) {
      return;
    }

    const secondsElapsed = previousTimestamp
      ? Math.min(0.05, (timestamp - previousTimestamp) / 1000)
      : 0;
    previousTimestamp = timestamp;

    const input = inputReader.read();
    const wasStanding = player.activity === "standing";

    updatePlayer(player, input, tileMap, secondsElapsed);

    if (wasStanding && player.activity === "standing") {
      player.activity =
        input.horizontal !== 0 || input.vertical !== 0 ? "walking" : "standing";
    }

    const sheet = findSheetForPlayer(
      heroSprites,
      player.activity,
      player.facing,
      player.weaponStyle
    );

    const framesPerSecond =
      player.activity === "walking"
        ? WALKING_FRAMES_PER_SECOND
        : player.activity === "attacking"
          ? ENEMY_ANIMATION_FRAMES_PER_SECOND.walking
          : STANDING_FRAMES_PER_SECOND;

    advanceAnimation(secondsElapsed, framesPerSecond, sheet.frameCount);

    context.clearRect(0, 0, canvas.width, canvas.height);
    drawRoomTiles(context, tileMap, sheets);
    drawPlayer();

    animationHandle = window.requestAnimationFrame(renderFrame);
  }

  animationHandle = window.requestAnimationFrame(renderFrame);

  return {
    stop(): void {
      isRunning = false;
      window.cancelAnimationFrame(animationHandle);
      inputReader.stopListening();
    }
  };
}
