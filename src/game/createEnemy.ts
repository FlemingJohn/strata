import type { EnemyCharacter, EnemyName } from "../types/enemy";
import type { RoomTileMap } from "../types/dungeon";
import { ENEMY_DEFINITIONS } from "../constants/enemySettings";
import { ENEMY_ANIMATION_FRAMES_PER_SECOND } from "../constants/animationSettings";
import { TILE_SIZE } from "../constants/tilesetSettings";
import { collidesWithWall } from "./movePlayerThroughRoom";

export function createEnemy(
  enemyName: EnemyName,
  horizontalPosition: number,
  verticalPosition: number,
  healthMultiplier: number
): EnemyCharacter {
  const definition = ENEMY_DEFINITIONS[enemyName];

  return {
    definition,
    horizontalPosition,
    verticalPosition,
    currentHealth: Math.round(definition.maximumHealth * healthMultiplier),
    behaviour: definition.canCastProjectiles ? "keepingDistance" : "chasing",
    animation: {
      definition: {
        spriteSheetName: enemyName,
        framesPerSecond: ENEMY_ANIMATION_FRAMES_PER_SECOND.standing,
        shouldLoop: true
      },
      currentFrameIndex: 0,
      secondsSinceFrameChange: 0,
      hasFinished: false
    },
    secondsUntilBehaviourChanges: 0,
    secondsRemainingFlashing: 0,
    knockbackHorizontal: 0,
    knockbackVertical: 0,
    chargeVelocityHorizontal: 0,
    chargeVelocityVertical: 0,
    lastAttackIdentifierReceived: -1
  };
}

export function spawnEnemiesForRoom(
  enemyNames: EnemyName[],
  tileMap: RoomTileMap,
  healthMultiplier: number,
  nextRandomNumber: () => number
): EnemyCharacter[] {
  const roomWidth = tileMap.columnCount * TILE_SIZE;
  const roomHeight = tileMap.rowCount * TILE_SIZE;
  const centreHorizontal = roomWidth / 2;
  const centreVertical = roomHeight / 2;

  return enemyNames.map((enemyName) => {
    const definition = ENEMY_DEFINITIONS[enemyName];
    let horizontalPosition = centreHorizontal;
    let verticalPosition = centreVertical;

    for (let attempt = 0; attempt < 60; attempt++) {
      const candidateHorizontal = TILE_SIZE * 2 + nextRandomNumber() * (roomWidth - TILE_SIZE * 4);
      const candidateVertical = TILE_SIZE * 2 + nextRandomNumber() * (roomHeight - TILE_SIZE * 4);

      const isClearOfWalls = !collidesWithWall(
        tileMap,
        candidateHorizontal,
        candidateVertical,
        definition.collisionRadius
      );
      const isAwayFromCentre =
        Math.hypot(candidateHorizontal - centreHorizontal, candidateVertical - centreVertical) > 64;

      if (isClearOfWalls && isAwayFromCentre) {
        horizontalPosition = candidateHorizontal;
        verticalPosition = candidateVertical;
        break;
      }
    }

    return createEnemy(enemyName, horizontalPosition, verticalPosition, healthMultiplier);
  });
}
