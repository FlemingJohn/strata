import type { CombatParticle } from "../types/combat";
import type { DungeonFloor, DungeonRoom, RoomTileMap } from "../types/dungeon";
import type { EnemyCharacter, Projectile } from "../types/enemy";
import type { EnemySpriteLibrary } from "../rendering/loadEnemySprites";
import type { HeroSprites } from "../rendering/loadHeroSprites";
import type { PlayerCharacter } from "../types/player";
import type { TileSheets } from "../rendering/loadTileSheets";
import { HERO_GROUND_OFFSET_PIXELS } from "../constants/enemySpritePaths";
import { KNOCKBACK_SPEED_PIXELS_PER_SECOND } from "../constants/animationSettings";
import { TILE_SIZE } from "../constants/tilesetSettings";
import { createInputReader } from "./createInputReader";
import { createSeededRandomFromHash } from "./createSeededRandomFromHash";
import {
  burstParticles,
  createImpactFeedback,
  decayImpactFeedback,
  updateParticles
} from "./createImpactFeedback";
import { drawCombatHud } from "../rendering/drawCombatHud";
import { drawEnemies, drawParticles, drawProjectiles } from "../rendering/drawEnemies";
import { drawRoomTiles } from "../rendering/drawRoomTiles";
import { drawSpriteFrame } from "../rendering/drawSpriteFrame";
import { findSheetForPlayer } from "../rendering/loadHeroSprites";
import { generateRoomTiles } from "./generateRoomTiles";
import { resolveAttackHits } from "./resolveAttackHits";
import { spawnEnemiesForRoom } from "./createEnemy";
import { applyDamageToPlayer, updatePlayer } from "./updatePlayer";
import { updateEnemies, updateProjectiles } from "./updateEnemies";

export interface CombatLoopController {
  stop: () => void;
}

export interface CombatLoopHandlers {
  onPlayerDied: (roomsCleared: number, kills: number) => void;
  onRoomCleared: (roomsCleared: number) => void;
}

const WALKING_FRAMES_PER_SECOND = 10;
const STANDING_FRAMES_PER_SECOND = 6;
const ATTACK_FRAMES_PER_SECOND = 14;

export function runCombatLoop(
  canvas: HTMLCanvasElement,
  player: PlayerCharacter,
  floor: DungeonFloor,
  startRoom: DungeonRoom,
  sheets: TileSheets,
  heroSprites: HeroSprites,
  enemySprites: EnemySpriteLibrary,
  handlers: CombatLoopHandlers
): CombatLoopController {
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("The combat canvas does not support two dimensional drawing");
  }

  const tileMap: RoomTileMap = generateRoomTiles(startRoom, floor.description.layoutSeed);

  canvas.width = tileMap.columnCount * TILE_SIZE;
  canvas.height = tileMap.rowCount * TILE_SIZE;
  context.imageSmoothingEnabled = false;

  const respectsReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const inputReader = createInputReader();
  const feedback = createImpactFeedback();
  const particles: CombatParticle[] = [];
  const projectiles: Projectile[] = [];

  const nextRandomNumber = createSeededRandomFromHash(
    `${floor.description.layoutSeed}:${startRoom.position.column}:${startRoom.position.row}:spawn`
  );

  const enemies: EnemyCharacter[] = spawnEnemiesForRoom(
    startRoom.enemyNames,
    tileMap,
    floor.description.difficultyMultiplier,
    nextRandomNumber
  );

  let roomsCleared = 0;
  let totalKills = 0;
  let hasReportedClear = enemies.length === 0;
  let animationFrameIndex = 0;
  let secondsSinceFrameChange = 0;
  let previousTimestamp = 0;
  let animationHandle = 0;
  let isRunning = true;

  function advanceAnimation(secondsElapsed: number, framesPerSecond: number): void {
    secondsSinceFrameChange += secondsElapsed;
    const secondsPerFrame = 1 / framesPerSecond;

    if (secondsSinceFrameChange >= secondsPerFrame) {
      secondsSinceFrameChange -= secondsPerFrame;
      animationFrameIndex += 1;
    }
  }

  function applyEnemyContactDamage(): void {
    for (const enemy of enemies) {
      const distance = Math.hypot(
        player.horizontalPosition - enemy.horizontalPosition,
        player.verticalPosition - enemy.verticalPosition
      );

      if (distance > enemy.definition.collisionRadius + player.collisionRadius + 1) {
        continue;
      }

      const isCharging = enemy.behaviour === "charging";
      const wasHurt = applyDamageToPlayer(
        player,
        enemy.definition.contactDamage * (isCharging ? 1.4 : 1),
        enemy.horizontalPosition,
        enemy.verticalPosition,
        KNOCKBACK_SPEED_PIXELS_PER_SECOND * 1.2
      );

      if (wasHurt) {
        burstParticles(
          particles,
          player.horizontalPosition,
          player.verticalPosition,
          10,
          "#C4523A",
          140
        );
        feedback.secondsOfHitStopRemaining = Math.max(feedback.secondsOfHitStopRemaining, 0.09);

        if (!respectsReducedMotion) {
          feedback.screenShakePixels = Math.max(feedback.screenShakePixels, 5);
        }
      }
    }
  }

  function applyProjectileDamage(): void {
    for (let index = projectiles.length - 1; index >= 0; index--) {
      const projectile = projectiles[index];
      const distance = Math.hypot(
        projectile.horizontalPosition - player.horizontalPosition,
        projectile.verticalPosition - player.verticalPosition
      );

      if (distance > player.collisionRadius + 3) {
        continue;
      }

      const wasHurt = applyDamageToPlayer(
        player,
        projectile.damage,
        projectile.horizontalPosition,
        projectile.verticalPosition,
        KNOCKBACK_SPEED_PIXELS_PER_SECOND
      );

      if (wasHurt) {
        burstParticles(
          particles,
          player.horizontalPosition,
          player.verticalPosition,
          8,
          "#C4523A",
          120
        );
        feedback.secondsOfHitStopRemaining = Math.max(feedback.secondsOfHitStopRemaining, 0.07);
      }

      projectiles.splice(index, 1);
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
      player.secondsRemainingInvulnerable > 0 && Math.floor(performance.now() / 60) % 2 === 0;

    if (isFlickering) {
      return;
    }

    drawSpriteFrame(
      context,
      sheet,
      animationFrameIndex % sheet.frameCount,
      Math.round(player.horizontalPosition - sheet.frameWidth / 2),
      Math.round(player.verticalPosition - HERO_GROUND_OFFSET_PIXELS),
      player.facing === "left"
    );
  }

  function drawEverything(): void {
    context.save();

    if (feedback.screenShakePixels > 0.1) {
      context.translate(
        Math.round((Math.random() * 2 - 1) * feedback.screenShakePixels),
        Math.round((Math.random() * 2 - 1) * feedback.screenShakePixels)
      );
    }

    context.clearRect(-16, -16, canvas.width + 32, canvas.height + 32);
    drawRoomTiles(context, tileMap, sheets);
    drawEnemies(context, enemies, enemySprites, animationFrameIndex);
    drawPlayer();
    drawProjectiles(context, projectiles);
    drawParticles(context, particles);
    context.restore();

    drawCombatHud(
      context,
      canvas.width,
      player,
      floor.description.floorNumber,
      floor.description.sourceBlockNumber,
      enemies.length
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

    if (feedback.secondsOfHitStopRemaining > 0) {
      feedback.secondsOfHitStopRemaining -= secondsElapsed;
    } else {
      const input = inputReader.read();
      const wasStanding = player.activity === "standing";

      updatePlayer(player, input, tileMap, secondsElapsed);

      if (wasStanding && player.activity === "standing") {
        player.activity = input.horizontal !== 0 || input.vertical !== 0 ? "walking" : "standing";
      }

      updateEnemies(enemies, projectiles, player, tileMap, secondsElapsed);
      updateProjectiles(projectiles, tileMap, secondsElapsed);
      totalKills += resolveAttackHits(player, enemies, particles, feedback, respectsReducedMotion);
      applyEnemyContactDamage();
      applyProjectileDamage();
      updateParticles(particles, secondsElapsed);

      const framesPerSecond =
        player.activity === "attacking"
          ? ATTACK_FRAMES_PER_SECOND
          : player.activity === "walking"
            ? WALKING_FRAMES_PER_SECOND
            : STANDING_FRAMES_PER_SECOND;

      advanceAnimation(secondsElapsed, framesPerSecond);
    }

    decayImpactFeedback(feedback, secondsElapsed);
    drawEverything();

    if (!hasReportedClear && enemies.length === 0) {
      hasReportedClear = true;
      roomsCleared += 1;
      handlers.onRoomCleared(roomsCleared);
    }

    if (player.currentHealth <= 0) {
      isRunning = false;
      inputReader.stopListening();
      handlers.onPlayerDied(roomsCleared, totalKills);
      return;
    }

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
