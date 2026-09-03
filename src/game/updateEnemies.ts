import type { EnemyCharacter, Projectile } from "../types/enemy";
import type { PathField } from "./buildPathField";
import type { PlayerCharacter } from "../types/player";
import type { RoomTileMap } from "../types/dungeon";
import {
  DISTANCE_MAGE_KEEPS_FROM_PLAYER,
  PROJECTILE_DAMAGE,
  PROJECTILE_LIFETIME_SECONDS,
  PROJECTILE_SPEED_PIXELS_PER_SECOND,
  SECONDS_BETWEEN_PROJECTILES,
  STRIKE_ACTIVE_SECONDS,
  STRIKE_LUNGE_PIXELS,
  STRIKE_REACH_PIXELS,
  STRIKE_RECOVERY_SECONDS,
  STRIKE_WIND_UP_SECONDS
} from "../constants/enemySettings";
import { KNOCKBACK_FRICTION_PER_FRAME } from "../constants/playerSettings";
import { findSpeedMultiplierAt } from "./findTileKindAt";
import { collidesWithWall } from "./movePlayerThroughRoom";
import { findStepTowardsTarget } from "./buildPathField";

function moveEnemy(
  enemy: EnemyCharacter,
  tileMap: RoomTileMap,
  horizontalDistance: number,
  verticalDistance: number
): void {
  const radius = enemy.definition.collisionRadius;

  const nextHorizontal = enemy.horizontalPosition + horizontalDistance;

  if (!collidesWithWall(tileMap, nextHorizontal, enemy.verticalPosition, radius)) {
    enemy.horizontalPosition = nextHorizontal;
  }

  const nextVertical = enemy.verticalPosition + verticalDistance;

  if (!collidesWithWall(tileMap, enemy.horizontalPosition, nextVertical, radius)) {
    enemy.verticalPosition = nextVertical;
  }
}

function healNearbyAllies(
  shaman: EnemyCharacter,
  enemies: EnemyCharacter[],
  secondsElapsed: number
): void {
  for (const other of enemies) {
    if (other === shaman) {
      continue;
    }

    const distance = Math.hypot(
      other.horizontalPosition - shaman.horizontalPosition,
      other.verticalPosition - shaman.verticalPosition
    );

    if (distance < 80) {
      other.currentHealth = Math.min(
        other.definition.maximumHealth,
        other.currentHealth + 6 * secondsElapsed
      );
    }
  }
}

function beginStrike(
  enemy: EnemyCharacter,
  directionHorizontal: number,
  directionVertical: number
): void {
  enemy.behaviour = "windingUp";
  enemy.secondsUntilBehaviourChanges = STRIKE_WIND_UP_SECONDS;
  enemy.strikeHorizontal = directionHorizontal;
  enemy.strikeVertical = directionVertical;
  enemy.hasStrikeLanded = false;
}

function advanceStrike(enemy: EnemyCharacter, tileMap: RoomTileMap): void {
  if (enemy.secondsUntilBehaviourChanges > 0) {
    return;
  }

  if (enemy.behaviour === "windingUp") {
    enemy.behaviour = "striking";
    enemy.secondsUntilBehaviourChanges = STRIKE_ACTIVE_SECONDS;
    moveEnemy(
      enemy,
      tileMap,
      enemy.strikeHorizontal * STRIKE_LUNGE_PIXELS,
      enemy.strikeVertical * STRIKE_LUNGE_PIXELS
    );
    return;
  }

  if (enemy.behaviour === "striking") {
    enemy.behaviour = "recovering";
    enemy.secondsUntilBehaviourChanges = STRIKE_RECOVERY_SECONDS;
    return;
  }

  enemy.behaviour = "chasing";
}

function driftWithKnockback(
  enemy: EnemyCharacter,
  tileMap: RoomTileMap,
  secondsElapsed: number
): void {
  moveEnemy(
    enemy,
    tileMap,
    enemy.knockbackHorizontal * secondsElapsed,
    enemy.knockbackVertical * secondsElapsed
  );

  enemy.knockbackHorizontal *= KNOCKBACK_FRICTION_PER_FRAME;
  enemy.knockbackVertical *= KNOCKBACK_FRICTION_PER_FRAME;
}

export function updateEnemies(
  enemies: EnemyCharacter[],
  projectiles: Projectile[],
  player: PlayerCharacter,
  tileMap: RoomTileMap,
  pathField: PathField,
  secondsElapsed: number
): void {
  for (const enemy of enemies) {
    enemy.secondsRemainingFlashing -= secondsElapsed;
    enemy.secondsUntilBehaviourChanges -= secondsElapsed;

    const towardsHorizontal = player.horizontalPosition - enemy.horizontalPosition;
    const towardsVertical = player.verticalPosition - enemy.verticalPosition;
    const distance = Math.hypot(towardsHorizontal, towardsVertical) || 1;
    const directionHorizontal = towardsHorizontal / distance;
    const directionVertical = towardsVertical / distance;

    const enemySpeed =
      enemy.definition.movementSpeed *
      findSpeedMultiplierAt(tileMap, enemy.horizontalPosition, enemy.verticalPosition);

    if (enemy.definition.canHealOtherEnemies) {
      healNearbyAllies(enemy, enemies, secondsElapsed);
    }

    const isMidStrike =
      enemy.behaviour === "windingUp" ||
      enemy.behaviour === "striking" ||
      enemy.behaviour === "recovering";

    if (isMidStrike) {
      advanceStrike(enemy, tileMap);
      driftWithKnockback(enemy, tileMap, secondsElapsed);
      continue;
    }

    if (enemy.definition.canCastProjectiles) {
      const wantsToCloseIn = distance > DISTANCE_MAGE_KEEPS_FROM_PLAYER + 20;
      const wantsToBackAway = distance < DISTANCE_MAGE_KEEPS_FROM_PLAYER - 20;

      if (wantsToCloseIn) {
        const step = findStepTowardsTarget(
          pathField,
          enemy.horizontalPosition,
          enemy.verticalPosition
        );
        const heading = step ?? { horizontal: directionHorizontal, vertical: directionVertical };

        moveEnemy(
          enemy,
          tileMap,
          heading.horizontal * enemySpeed * secondsElapsed,
          heading.vertical * enemySpeed * secondsElapsed
        );
      } else if (wantsToBackAway) {
        moveEnemy(
          enemy,
          tileMap,
          -directionHorizontal * enemySpeed * secondsElapsed,
          -directionVertical * enemySpeed * secondsElapsed
        );
      }

      if (enemy.secondsUntilBehaviourChanges <= 0) {
        enemy.secondsUntilBehaviourChanges = SECONDS_BETWEEN_PROJECTILES;
        projectiles.push({
          horizontalPosition: enemy.horizontalPosition,
          verticalPosition: enemy.verticalPosition,
          velocityHorizontal: directionHorizontal * PROJECTILE_SPEED_PIXELS_PER_SECOND,
          velocityVertical: directionVertical * PROJECTILE_SPEED_PIXELS_PER_SECOND,
          secondsRemaining: PROJECTILE_LIFETIME_SECONDS,
          damage: PROJECTILE_DAMAGE
        });
      }

      driftWithKnockback(enemy, tileMap, secondsElapsed);
      continue;
    }

    const reach =
      STRIKE_REACH_PIXELS + enemy.definition.collisionRadius + player.collisionRadius;

    if (distance <= reach) {
      beginStrike(enemy, directionHorizontal, directionVertical);
      driftWithKnockback(enemy, tileMap, secondsElapsed);
      continue;
    }

    enemy.behaviour = "chasing";

    const step = findStepTowardsTarget(
      pathField,
      enemy.horizontalPosition,
      enemy.verticalPosition
    );
    const heading = step ?? { horizontal: directionHorizontal, vertical: directionVertical };

    moveEnemy(
      enemy,
      tileMap,
      heading.horizontal * enemySpeed * secondsElapsed,
      heading.vertical * enemySpeed * secondsElapsed
    );

    driftWithKnockback(enemy, tileMap, secondsElapsed);
  }
}

export function updateProjectiles(
  projectiles: Projectile[],
  tileMap: RoomTileMap,
  secondsElapsed: number
): void {
  for (let index = projectiles.length - 1; index >= 0; index--) {
    const projectile = projectiles[index];
    projectile.secondsRemaining -= secondsElapsed;
    projectile.horizontalPosition += projectile.velocityHorizontal * secondsElapsed;
    projectile.verticalPosition += projectile.velocityVertical * secondsElapsed;

    const hasExpired = projectile.secondsRemaining <= 0;
    const hasHitWall = collidesWithWall(
      tileMap,
      projectile.horizontalPosition,
      projectile.verticalPosition,
      2
    );

    if (hasExpired || hasHitWall) {
      projectiles.splice(index, 1);
    }
  }
}
