import type { CombatParticle } from "../types/combat";
import type { DungeonFloor, DungeonRoom, RoomTileMap } from "../types/dungeon";
import type { EnemyCharacter, Projectile } from "../types/enemy";
import type { EnemySpriteLibrary } from "../rendering/loadEnemySprites";
import type { ExitDirection } from "./findAdjacentRoom";
import type { HeroSprites } from "../rendering/loadHeroSprites";
import type { PlayerCharacter } from "../types/player";
import type { TileSheets } from "../rendering/loadTileSheets";
import { HERO_GROUND_OFFSET_PIXELS } from "../constants/enemySpritePaths";
import { KNOCKBACK_SPEED_PIXELS_PER_SECOND } from "../constants/animationSettings";
import { HEALTH_RESTORED_ON_ROOM_CLEARED } from "../constants/playerSettings";
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
import { drawEntityShadow } from "../rendering/drawEntityShadow";
import { drawRoomEdgeShadow } from "../rendering/drawRoomEdgeShadow";
import { drawRoomTiles } from "../rendering/drawRoomTiles";
import { drawSpriteFrame } from "../rendering/drawSpriteFrame";
import {
  findExitBeingUsed,
  findRoomInDirection,
  placePlayerAtOppositeDoor
} from "./findAdjacentRoom";
import { findSheetForPlayer } from "../rendering/loadHeroSprites";
import { generateRoomTiles } from "./generateRoomTiles";
import { resolveAttackHits } from "./resolveAttackHits";
import { spawnEnemiesForRoom } from "./createEnemy";
import { applyDamageToPlayer, updatePlayer } from "./updatePlayer";
import { findSoundEngine } from "../audio/sharedSoundEngine";
import { findStratumForBlock } from "./findStratumForBlock";
import { updateEnemies, updateProjectiles } from "./updateEnemies";

export interface CombatLoopController {
  stop: () => void;
}

export interface CombatLoopHandlers {
  onPlayerDied: (roomsCleared: number, kills: number) => void;
  onRoomEntered: (room: DungeonRoom, roomsCleared: number) => void;
  onFloorCompleted: (roomsCleared: number, kills: number) => void;
}

const WALKING_FRAMES_PER_SECOND = 10;
const STANDING_FRAMES_PER_SECOND = 6;
const ATTACK_FRAMES_PER_SECOND = 14;
const SECONDS_BLOCKING_REENTRY = 0.4;

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

  const sound = findSoundEngine();
  const stratum = findStratumForBlock(floor.description.sourceBlockNumber);
  const respectsReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const inputReader = createInputReader();
  const feedback = createImpactFeedback();
  const particles: CombatParticle[] = [];
  let projectiles: Projectile[] = [];

  let currentRoom: DungeonRoom = startRoom;
  let tileMap: RoomTileMap = generateRoomTiles(currentRoom, floor.description.layoutSeed);
  let enemies: EnemyCharacter[] = [];

  canvas.width = tileMap.columnCount * TILE_SIZE;
  canvas.height = tileMap.rowCount * TILE_SIZE;
  context.imageSmoothingEnabled = false;

  let roomsCleared = 0;
  let totalKills = 0;
  let secondsUntilExitAllowed = SECONDS_BLOCKING_REENTRY;
  let animationFrameIndex = 0;
  let secondsSinceFrameChange = 0;
  let previousTimestamp = 0;
  let animationHandle = 0;
  let isRunning = true;

  function countClearedRooms(): number {
    return floor.rooms.filter((room) => room.hasBeenCleared).length;
  }

  function spawnForCurrentRoom(): void {
    if (currentRoom.hasBeenCleared) {
      enemies = [];
      return;
    }

    const nextRandomNumber = createSeededRandomFromHash(
      `${floor.description.layoutSeed}:${currentRoom.position.column}:${currentRoom.position.row}:spawn`
    );

    enemies = spawnEnemiesForRoom(
      currentRoom.enemyNames,
      tileMap,
      floor.description.difficultyMultiplier,
      nextRandomNumber
    );

    if (enemies.length === 0) {
      currentRoom.hasBeenCleared = true;
    }
  }

  function enterRoom(room: DungeonRoom, cameFrom: ExitDirection | null): void {
    currentRoom = room;
    tileMap = generateRoomTiles(currentRoom, floor.description.layoutSeed);
    projectiles = [];
    particles.length = 0;
    spawnForCurrentRoom();

    if (cameFrom) {
      placePlayerAtOppositeDoor(player, tileMap, cameFrom);
    }

    secondsUntilExitAllowed = SECONDS_BLOCKING_REENTRY;
    handlers.onRoomEntered(currentRoom, countClearedRooms());
  }

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
        sound.play("playerHurt");
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
        sound.play("playerHurt");
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

  function grantRoomClearedReward(): void {
    if (currentRoom.hasBeenCleared) {
      return;
    }

    currentRoom.hasBeenCleared = true;
    roomsCleared += 1;
    sound.play("roomCleared");
    player.currentHealth = Math.min(
      player.maximumHealth,
      player.currentHealth + HEALTH_RESTORED_ON_ROOM_CLEARED
    );
  }

  function tryToLeaveRoom(): void {
    if (enemies.length > 0 || secondsUntilExitAllowed > 0) {
      return;
    }

    const direction = findExitBeingUsed(player, tileMap);

    if (!direction) {
      return;
    }

    if (currentRoom.purpose === "boss") {
      isRunning = false;
      inputReader.stopListening();
      handlers.onFloorCompleted(countClearedRooms(), totalKills);
      return;
    }

    const nextRoom = findRoomInDirection(floor, currentRoom, direction);

    if (!nextRoom) {
      return;
    }

    sound.play("doorOpens");
    enterRoom(nextRoom, direction);
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
    drawRoomTiles(context, tileMap, sheets, stratum.inkColour);

    for (const enemy of enemies) {
      drawEntityShadow(
        context,
        enemy.horizontalPosition,
        enemy.verticalPosition,
        enemy.definition.collisionRadius * 2.6
      );
    }

    drawEntityShadow(context, player.horizontalPosition, player.verticalPosition, 14);
    drawEnemies(context, enemies, enemySprites, animationFrameIndex);
    drawPlayer();
    drawProjectiles(context, projectiles);
    drawParticles(context, particles);
    drawRoomEdgeShadow(context, canvas.width, canvas.height);
    context.restore();

    drawCombatHud(
      context,
      canvas.width,
      player,
      floor.description.floorNumber,
      floor.description.sourceBlockNumber,
      enemies.length,
      `${countClearedRooms()}/${floor.rooms.length}`,
      currentRoom.purpose
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
    secondsUntilExitAllowed -= secondsElapsed;

    if (feedback.secondsOfHitStopRemaining > 0) {
      feedback.secondsOfHitStopRemaining -= secondsElapsed;
    } else {
      const input = inputReader.read();
      const wasStanding = player.activity === "standing";

      updatePlayer(player, input, tileMap, secondsElapsed);

      if (wasStanding && player.activity === "standing") {
        player.activity = input.horizontal !== 0 || input.vertical !== 0 ? "walking" : "standing";
      }

      if (wasStanding && player.activity === "attacking") {
        sound.play("swing");
      }

      if (wasStanding && player.activity === "rolling") {
        sound.play("roll");
      }

      updateEnemies(enemies, projectiles, player, tileMap, secondsElapsed);
      updateProjectiles(projectiles, tileMap, secondsElapsed);
      const enemiesBeforeAttack = enemies.length;
      const killsThisFrame = resolveAttackHits(
        player,
        enemies,
        particles,
        feedback,
        respectsReducedMotion
      );
      totalKills += killsThisFrame;

      if (killsThisFrame > 0) {
        sound.play("enemyDies");
      } else if (
        feedback.secondsOfHitStopRemaining > 0 &&
        enemiesBeforeAttack === enemies.length
      ) {
        sound.play("hitConnects");
      }
      applyEnemyContactDamage();
      applyProjectileDamage();
      updateParticles(particles, secondsElapsed);

      if (enemies.length === 0) {
        grantRoomClearedReward();
        tryToLeaveRoom();
      }

      const framesPerSecond =
        player.activity === "attacking"
          ? ATTACK_FRAMES_PER_SECOND
          : player.activity === "walking"
            ? WALKING_FRAMES_PER_SECOND
            : STANDING_FRAMES_PER_SECOND;

      advanceAnimation(secondsElapsed, framesPerSecond);
    }

    if (!isRunning) {
      return;
    }

    decayImpactFeedback(feedback, secondsElapsed);
    drawEverything();

    if (player.currentHealth <= 0) {
      isRunning = false;
      inputReader.stopListening();
      handlers.onPlayerDied(countClearedRooms(), totalKills);
      return;
    }

    animationHandle = window.requestAnimationFrame(renderFrame);
  }

  sound.resumeAfterUserAction();
  sound.startDrone();
  spawnForCurrentRoom();
  handlers.onRoomEntered(currentRoom, countClearedRooms());
  animationHandle = window.requestAnimationFrame(renderFrame);

  return {
    stop(): void {
      isRunning = false;
      window.cancelAnimationFrame(animationHandle);
      inputReader.stopListening();
      sound.stopDrone();
    }
  };
}
