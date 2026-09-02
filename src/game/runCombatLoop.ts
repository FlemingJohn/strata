import type { CombatParticle } from "../types/combat";
import type { DungeonFloor, DungeonRoom, RoomTileMap } from "../types/dungeon";
import type { EnemyCharacter, Projectile } from "../types/enemy";
import type { EnemySpriteLibrary } from "../rendering/loadEnemySprites";
import type { ExitDirection } from "./findAdjacentRoom";
import type { LpcCharacterSheets } from "../types/lpcCharacter";
import type { PlayerCharacter } from "../types/player";
import type { TileSheets } from "../rendering/loadTileSheets";
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
import {
  drawDyingEnemies,
  drawEnemies,
  drawParticles,
  drawProjectiles
} from "../rendering/drawEnemies";
import type { DyingEnemy } from "../types/dyingEnemy";
import type { PlacedProp, PropSheets } from "../types/prop";
import type { Ember, FirePlacement } from "../types/fire";
import type { Shockwave } from "../types/ability";
import { LPC_FRAME_SIZE, LPC_FRAMES_PER_SECOND, LPC_GROUND_OFFSET_PIXELS } from "../constants/lpcCharacterSettings";
import { drawEntityShadow } from "../rendering/drawEntityShadow";
import { drawFloorSigil } from "../rendering/drawFloorSigil";
import { drawRoomTiles } from "../rendering/drawRoomTiles";
import { drawLpcCharacter } from "../rendering/drawLpcCharacter";
import {
  findExitBeingUsed,
  findRoomInDirection,
  placePlayerAtOppositeDoor
} from "./findAdjacentRoom";
import { findAnimationForPlayer } from "../game/findAnimationForPlayer";
import { generateRoomTiles } from "./generateRoomTiles";
import { resolveAttackHits } from "./resolveAttackHits";
import { chooseEliteNames, spawnEnemiesForRoom } from "./createEnemy";
import { updateDyingEnemies } from "./createDyingEnemy";
import { applyDamageToPlayer, updatePlayer } from "./updatePlayer";
import { findSoundEngine } from "../audio/sharedSoundEngine";
import { findAreaTheme } from "../constants/areaThemes";
import { findStratumForBlock } from "./findStratumForBlock";
import { placeFires } from "./placeFires";
import { placeProps } from "./placeProps";
import { drawProps } from "../rendering/drawProps";
import type { PlacedStation, StationSheets } from "../types/station";
import { findStationWithinReach, placeStations } from "./placeStations";
import { drawStationPrompt, drawStations } from "../rendering/drawStations";
import { countdownSharpenedWeapon, useStation } from "./useStation";
import { plantTrees } from "./plantTrees";
import { drawTrees } from "../rendering/drawTrees";
import { TREE_STRATUM_NUMBER } from "../constants/treeSettings";
import {
  FURNACE_PROP_SHEETS,
  PROP_SHEETS_BY_STRATUM
} from "../constants/propSettings";
import {
  createShockwave,
  drawShockwaves,
  findShockwaveRadius,
  updateShockwaves
} from "./createShockwave";
import {
  NOVA_COLOUR,
  NOVA_DAMAGE,
  NOVA_EXPAND_SECONDS,
  NOVA_KNOCKBACK_SPEED,
  NOVA_MAXIMUM_RADIUS_PIXELS,
  NOVA_SELF_DAMAGE,
  SLAM_COLOUR,
  SLAM_COOLDOWN_SECONDS,
  SLAM_DAMAGE,
  SLAM_EXPAND_SECONDS,
  SLAM_MAXIMUM_RADIUS_PIXELS
} from "../constants/abilitySettings";
import { drawEmbers, drawFireSprites, updateEmbers } from "../rendering/drawFires";
import { drawTorchFlames, drawTorchGlow } from "../rendering/drawTorchGlow";
import { placeTorches } from "./placeTorches";
import { FIRE_FRAME_WIDTH } from "../constants/fireSettings";
import {
  FIRE_CONTACT_DAMAGE,
  FIRE_CONTACT_RADIUS_PIXELS,
  FIRE_FRAMES_PER_SECOND
} from "../constants/fireSettings";
import { updateEnemies, updateProjectiles } from "./updateEnemies";

export interface CombatLoopController {
  stop: () => void;
}

export interface CombatLoopHandlers {
  onPlayerDied: (roomsCleared: number, kills: number) => void;
  onRoomEntered: (room: DungeonRoom, roomsCleared: number) => void;
  onFloorCompleted: (roomsCleared: number, kills: number) => void;
  onStationUsed: (message: string) => void;
}

const SECONDS_BLOCKING_REENTRY = 0.4;

export function runCombatLoop(
  canvas: HTMLCanvasElement,
  player: PlayerCharacter,
  floor: DungeonFloor,
  startRoom: DungeonRoom,
  sheets: TileSheets,
  heroSprites: LpcCharacterSheets,
  enemySprites: EnemySpriteLibrary,
  propSheets: PropSheets,
  treeSheets: PropSheets,
  stationSheets: StationSheets,
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
  let torches = placeTorches(tileMap);
  let fires: FirePlacement[] = [];
  let props: PlacedProp[] = [];
  let stations: PlacedStation[] = [];
  let trees: PlacedProp[] = [];
  let wasUsingStationLastFrame = false;
  const embers: Ember[] = [];
  let dyingEnemies: DyingEnemy[] = [];
  const shockwaves: Shockwave[] = [];
  let wasCastingLastFrame = false;
  let secondsUntilBossSlam = SLAM_COOLDOWN_SECONDS;
  let theme = findAreaTheme(stratum.stratumNumber, currentRoom.purpose);
  let elapsedSeconds = 0;
  let fireFrameIndex = 0;
  let secondsSinceFireFrame = 0;

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

  function findPropSheetNames(): string[] {
    if (theme.hasFires) {
      return FURNACE_PROP_SHEETS;
    }

    return PROP_SHEETS_BY_STRATUM[floor.description.stratumNumber] ?? PROP_SHEETS_BY_STRATUM[4];
  }

  function scatterPropsForCurrentRoom(): void {
    props = placeProps(
      tileMap,
      findPropSheetNames(),
      createSeededRandomFromHash(
        `${floor.description.layoutSeed}:${currentRoom.position.column}:${currentRoom.position.row}:props`
      )
    );
  }

  function plantTreesForCurrentRoom(): void {
    trees =
      floor.description.stratumNumber === TREE_STRATUM_NUMBER && currentRoom.purpose !== "boss"
        ? plantTrees(
            tileMap,
            createSeededRandomFromHash(
              `${floor.description.layoutSeed}:${currentRoom.position.column}:${currentRoom.position.row}:trees`
            )
          )
        : [];
  }

  function raiseStationsForCurrentRoom(): void {
    stations = placeStations(
      tileMap,
      currentRoom.purpose,
      createSeededRandomFromHash(
        `${floor.description.layoutSeed}:${currentRoom.position.column}:${currentRoom.position.row}:stations`
      )
    );
  }

  function useStationWhenAsked(): void {
    const input = inputReader.read();
    const isPressing = input.wantsToUseStation;
    const hasJustPressed = isPressing && !wasUsingStationLastFrame;
    wasUsingStationLastFrame = isPressing;

    if (!hasJustPressed) {
      return;
    }

    const station = findStationWithinReach(
      stations,
      player.horizontalPosition,
      player.verticalPosition
    );

    if (!station) {
      return;
    }

    const message = useStation(player, station);
    sound.play("roomCleared");
    burstParticles(
      particles,
      station.horizontalPosition,
      station.verticalPosition - 8,
      16,
      "#F5D18A",
      140
    );
    handlers.onStationUsed(message);
  }

  function spawnForCurrentRoom(): void {
    if (currentRoom.hasBeenCleared) {
      enemies = [];
      return;
    }

    const nextRandomNumber = createSeededRandomFromHash(
      `${floor.description.layoutSeed}:${currentRoom.position.column}:${currentRoom.position.row}:spawn`
    );

    const eliteNames =
      currentRoom.purpose === "combat"
        ? chooseEliteNames(
            floor.description.stratumNumber,
            floor.description.eliteCount,
            nextRandomNumber
          )
        : [];

    enemies = spawnEnemiesForRoom(
      currentRoom.enemyNames.concat(eliteNames),
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
    torches = placeTorches(tileMap);
    theme = findAreaTheme(stratum.stratumNumber, currentRoom.purpose);
    embers.length = 0;
    fires = theme.hasFires
      ? placeFires(
          tileMap,
          createSeededRandomFromHash(
            `${floor.description.layoutSeed}:${currentRoom.position.column}:${currentRoom.position.row}:fire`
          )
        )
      : [];
    projectiles = [];
    particles.length = 0;
    dyingEnemies = [];
    scatterPropsForCurrentRoom();
    plantTreesForCurrentRoom();
    raiseStationsForCurrentRoom();
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

  function releaseCastWhenFinished(): void {
    const isCasting = player.activity === "casting";

    if (wasCastingLastFrame && !isCasting) {
      shockwaves.push(
        createShockwave(
          player.horizontalPosition,
          player.verticalPosition,
          NOVA_MAXIMUM_RADIUS_PIXELS,
          NOVA_EXPAND_SECONDS,
          NOVA_DAMAGE,
          "player",
          NOVA_COLOUR
        )
      );
      sound.play("enemyDies");
      burstParticles(
        particles,
        player.horizontalPosition,
        player.verticalPosition,
        18,
        NOVA_COLOUR,
        150
      );
      player.currentHealth -= NOVA_SELF_DAMAGE;
      feedback.secondsOfHitStopRemaining = Math.max(feedback.secondsOfHitStopRemaining, 0.09);

      if (!respectsReducedMotion) {
        feedback.screenShakePixels = Math.max(feedback.screenShakePixels, 6);
      }
    }

    wasCastingLastFrame = isCasting;
  }

  function releaseBossSlam(secondsElapsed: number): void {
    secondsUntilBossSlam -= secondsElapsed;

    if (secondsUntilBossSlam > 0) {
      return;
    }

    const boss = enemies.find((enemy) => enemy.definition.name === "orcWarrior");

    if (!boss) {
      return;
    }

    secondsUntilBossSlam = SLAM_COOLDOWN_SECONDS;
    shockwaves.push(
      createShockwave(
        boss.horizontalPosition,
        boss.verticalPosition,
        SLAM_MAXIMUM_RADIUS_PIXELS,
        SLAM_EXPAND_SECONDS,
        SLAM_DAMAGE,
        "enemy",
        SLAM_COLOUR
      )
    );
    burstParticles(particles, boss.horizontalPosition, boss.verticalPosition, 14, SLAM_COLOUR, 150);

    if (!respectsReducedMotion) {
      feedback.screenShakePixels = Math.max(feedback.screenShakePixels, 5);
    }
  }

  function applyShockwaveDamage(): void {
    for (const wave of shockwaves) {
      if (wave.hasDealtDamage || wave.secondsElapsed < wave.expandSeconds * 0.5) {
        continue;
      }

      wave.hasDealtDamage = true;
      const radius = findShockwaveRadius(wave);

      if (wave.owner === "player") {
        for (let index = enemies.length - 1; index >= 0; index--) {
          const enemy = enemies[index];
          const distance = Math.hypot(
            enemy.horizontalPosition - wave.horizontalPosition,
            enemy.verticalPosition - wave.verticalPosition
          );

          if (distance > radius + enemy.definition.collisionRadius) {
            continue;
          }

          enemy.currentHealth -= wave.damage;
          enemy.secondsRemainingFlashing = 0.09;
          const away = Math.max(1, distance);
          enemy.knockbackHorizontal =
            ((enemy.horizontalPosition - wave.horizontalPosition) / away) * NOVA_KNOCKBACK_SPEED;
          enemy.knockbackVertical =
            ((enemy.verticalPosition - wave.verticalPosition) / away) * NOVA_KNOCKBACK_SPEED;

          if (enemy.currentHealth <= 0) {
            burstParticles(particles, enemy.horizontalPosition, enemy.verticalPosition, 20, NOVA_COLOUR, 160);
            enemies.splice(index, 1);
            totalKills += 1;
          }
        }

        continue;
      }

      const distanceToPlayer = Math.hypot(
        player.horizontalPosition - wave.horizontalPosition,
        player.verticalPosition - wave.verticalPosition
      );

      if (distanceToPlayer <= radius + player.collisionRadius) {
        const wasHurt = applyDamageToPlayer(
          player,
          wave.damage,
          wave.horizontalPosition,
          wave.verticalPosition,
          NOVA_KNOCKBACK_SPEED
        );

        if (wasHurt) {
          sound.play("playerHurt");
        }
      }
    }
  }

  function applyFireContactDamage(): void {
    for (const fire of fires) {
      const distance = Math.hypot(
        player.horizontalPosition - fire.horizontalPosition,
        player.verticalPosition - fire.verticalPosition
      );

      if (distance > FIRE_CONTACT_RADIUS_PIXELS + player.collisionRadius) {
        continue;
      }

      const wasBurned = applyDamageToPlayer(
        player,
        FIRE_CONTACT_DAMAGE,
        fire.horizontalPosition,
        fire.verticalPosition,
        KNOCKBACK_SPEED_PIXELS_PER_SECOND
      );

      if (wasBurned) {
        sound.play("playerHurt");
        burstParticles(
          particles,
          player.horizontalPosition,
          player.verticalPosition,
          10,
          "#FF7A2E",
          140
        );
      }
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
    const animationName = findAnimationForPlayer(player.activity, player.weaponStyle);
    const sheet = heroSprites[animationName] ?? heroSprites.idle;
    const frameIndex = animationFrameIndex % sheet.frameCount;
    const isFlickering =
      player.secondsRemainingInvulnerable > 0 && Math.floor(performance.now() / 60) % 2 === 0;

    if (isFlickering) {
      return;
    }

    drawLpcCharacter(
      context,
      sheet,
      frameIndex,
      player.facing,
      Math.round(player.horizontalPosition - LPC_FRAME_SIZE / 2),
      Math.round(player.verticalPosition - LPC_GROUND_OFFSET_PIXELS)
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
    drawRoomTiles(context, tileMap, sheets, theme);
    drawTorchGlow(context, torches, elapsedSeconds);
    drawProps(context, props, propSheets);
    drawStations(context, stations, stationSheets, elapsedSeconds);
    drawTrees(context, trees, treeSheets);

    if (currentRoom.purpose === "start" || currentRoom.purpose === "relic") {
      drawFloorSigil(
        context,
        canvas.width / 2,
        canvas.height / 2,
        floor.description.layoutSeed,
        stratum.inkColour,
        elapsedSeconds
      );
    }

    for (const enemy of enemies) {
      drawEntityShadow(
        context,
        enemy.horizontalPosition,
        enemy.verticalPosition,
        enemy.definition.collisionRadius * 2.6
      );
    }

    drawEntityShadow(context, player.horizontalPosition, player.verticalPosition, 14);
    drawDyingEnemies(context, dyingEnemies, enemySprites);
    drawEnemies(context, enemies, enemySprites, animationFrameIndex);
    drawPlayer();
    drawProjectiles(context, projectiles);
    drawParticles(context, particles);

    drawTorchFlames(context, sheets.fireSheet, FIRE_FRAME_WIDTH, torches, fireFrameIndex);

    if (fires.length > 0) {
      drawFireSprites(context, sheets.fireSheet, sheets.smokeSheet, fires, fireFrameIndex);
    }

    drawShockwaves(context, shockwaves);
    drawEmbers(context, embers);

    const stationInReach = findStationWithinReach(
      stations,
      player.horizontalPosition,
      player.verticalPosition
    );

    if (stationInReach) {
      drawStationPrompt(context, stationInReach);
    }

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
    elapsedSeconds += secondsElapsed;
    secondsSinceFireFrame += secondsElapsed;

    if (secondsSinceFireFrame >= 1 / FIRE_FRAMES_PER_SECOND) {
      secondsSinceFireFrame -= 1 / FIRE_FRAMES_PER_SECOND;
      fireFrameIndex += 1;
    }

    updateEmbers(embers, fires, secondsElapsed);
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
        respectsReducedMotion,
        dyingEnemies
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
      useStationWhenAsked();
      countdownSharpenedWeapon(player, secondsElapsed);
      applyEnemyContactDamage();
      applyProjectileDamage();
      applyFireContactDamage();
      releaseCastWhenFinished();
      releaseBossSlam(secondsElapsed);
      updateShockwaves(shockwaves, secondsElapsed);
      applyShockwaveDamage();
      updateParticles(particles, secondsElapsed);
      updateDyingEnemies(
        dyingEnemies,
        (enemyName) => enemySprites[enemyName].dying.frameCount,
        secondsElapsed
      );

      if (enemies.length === 0) {
        grantRoomClearedReward();
        tryToLeaveRoom();
      }

      const currentAnimation = findAnimationForPlayer(player.activity, player.weaponStyle);
      advanceAnimation(secondsElapsed, LPC_FRAMES_PER_SECOND[currentAnimation]);
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
  fires = theme.hasFires
    ? placeFires(
        tileMap,
        createSeededRandomFromHash(
          `${floor.description.layoutSeed}:${currentRoom.position.column}:${currentRoom.position.row}:fire`
        )
      )
    : [];
  scatterPropsForCurrentRoom();
  plantTreesForCurrentRoom();
  raiseStationsForCurrentRoom();
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
