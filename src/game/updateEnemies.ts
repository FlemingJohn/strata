import type { EnemyCharacter, Projectile } from "../types/enemy";
import type { PlayerCharacter } from "../types/player";
import type { RoomTileMap } from "../types/dungeon";
import {
  CHARGE_DURATION_SECONDS,
  CHARGE_RECOVERY_SECONDS,
  CHARGE_SPEED_PIXELS_PER_SECOND,
  CHARGE_WIND_UP_SECONDS,
  DISTANCE_MAGE_KEEPS_FROM_PLAYER,
  PROJECTILE_DAMAGE,
  PROJECTILE_LIFETIME_SECONDS,
  PROJECTILE_SPEED_PIXELS_PER_SECOND,
  SECONDS_BETWEEN_PROJECTILES
} from "../constants/enemySettings";
import { KNOCKBACK_FRICTION_PER_FRAME } from "../constants/playerSettings";
import { findSpeedMultiplierAt } from "./findTileKindAt";
import { collidesWithWall } from "./movePlayerThroughRoom";

function moveEnemy(
  enemy: EnemyCharacter,
  tileMap: RoomTileMap,
  horizontalDistance: number,
  verticalDistance: number
): boolean {
  const radius = enemy.definition.collisionRadius;
  let didMove = false;

  const nextHorizontal = enemy.horizontalPosition + horizontalDistance;
  if (!collidesWithWall(tileMap, nextHorizontal, enemy.verticalPosition, radius)) {
    enemy.horizontalPosition = nextHorizontal;
    didMove = didMove || Math.abs(horizontalDistance) > 0.1;
  }

  const nextVertical = enemy.verticalPosition + verticalDistance;
  if (!collidesWithWall(tileMap, enemy.horizontalPosition, nextVertical, radius)) {
    enemy.verticalPosition = nextVertical;
    didMove = didMove || Math.abs(verticalDistance) > 0.1;
  }

  return didMove;
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

export function updateEnemies(
  enemies: EnemyCharacter[],
  projectiles: Projectile[],
  player: PlayerCharacter,
  tileMap: RoomTileMap,
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

    if (enemy.definition.canCastProjectiles) {
      const preferredDirection =
        distance < DISTANCE_MAGE_KEEPS_FROM_PLAYER - 20
          ? -1
          : distance > DISTANCE_MAGE_KEEPS_FROM_PLAYER + 20
            ? 1
            : 0;

      moveEnemy(
        enemy,
        tileMap,
        directionHorizontal * enemySpeed * preferredDirection * secondsElapsed,
        directionVertical * enemySpeed * preferredDirection * secondsElapsed
      );

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
    } else if (enemy.definition.maximumHealth >= 55) {
      if (enemy.behaviour === "chasing" || enemy.behaviour === "keepingDistance") {
        enemy.behaviour = "windingUp";
        enemy.secondsUntilBehaviourChanges = CHARGE_WIND_UP_SECONDS;
      } else if (enemy.behaviour === "windingUp" && enemy.secondsUntilBehaviourChanges <= 0) {
        enemy.behaviour = "charging";
        enemy.secondsUntilBehaviourChanges = CHARGE_DURATION_SECONDS;
        enemy.chargeVelocityHorizontal = directionHorizontal * CHARGE_SPEED_PIXELS_PER_SECOND;
        enemy.chargeVelocityVertical = directionVertical * CHARGE_SPEED_PIXELS_PER_SECOND;
      } else if (enemy.behaviour === "charging") {
        const didMove = moveEnemy(
          enemy,
          tileMap,
          enemy.chargeVelocityHorizontal * secondsElapsed,
          enemy.chargeVelocityVertical * secondsElapsed
        );

        if (!didMove || enemy.secondsUntilBehaviourChanges <= 0) {
          enemy.behaviour = "recovering";
          enemy.secondsUntilBehaviourChanges = CHARGE_RECOVERY_SECONDS;
        }
      } else if (enemy.behaviour === "recovering" && enemy.secondsUntilBehaviourChanges <= 0) {
        enemy.behaviour = "chasing";
      }
    } else {
      enemy.behaviour = "chasing";
      moveEnemy(
        enemy,
        tileMap,
        directionHorizontal * enemySpeed * secondsElapsed,
        directionVertical * enemySpeed * secondsElapsed
      );
    }

    moveEnemy(
      enemy,
      tileMap,
      enemy.knockbackHorizontal * secondsElapsed,
      enemy.knockbackVertical * secondsElapsed
    );

    enemy.knockbackHorizontal *= KNOCKBACK_FRICTION_PER_FRAME;
    enemy.knockbackVertical *= KNOCKBACK_FRICTION_PER_FRAME;
  }
}

export function updateProjectiles(
  projectiles: Projectile[],
  tileMap: RoomTileMap,
  secondsElapsed: number
): void {
  for (let index = projectiles.length - 1; index >= 0; index--) {
    const projectile = projectiles[index];
    projectile.horizontalPosition += projectile.velocityHorizontal * secondsElapsed;
    projectile.verticalPosition += projectile.velocityVertical * secondsElapsed;
    projectile.secondsRemaining -= secondsElapsed;

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
