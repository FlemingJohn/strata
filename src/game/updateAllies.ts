import type { Ally } from "../types/ally";
import type { EnemyCharacter } from "../types/enemy";
import type { RoomTileMap } from "../types/dungeon";
import { ALLY_ENEMY_NAME } from "../constants/relicPowerSettings";
import { ENEMY_DEFINITIONS } from "../constants/enemySettings";
import { KNOCKBACK_SPEED_PIXELS_PER_SECOND } from "../constants/animationSettings";
import { collidesWithWall } from "./movePlayerThroughRoom";

const SECONDS_BETWEEN_ALLY_STRIKES = 0.6;
const ALLY_REACH_PIXELS = 10;

function findNearestEnemy(ally: Ally, enemies: EnemyCharacter[]): EnemyCharacter | null {
  let nearest: EnemyCharacter | null = null;
  let shortestDistance = Number.POSITIVE_INFINITY;

  for (const enemy of enemies) {
    const distance = Math.hypot(
      enemy.horizontalPosition - ally.horizontalPosition,
      enemy.verticalPosition - ally.verticalPosition
    );

    if (distance < shortestDistance) {
      shortestDistance = distance;
      nearest = enemy;
    }
  }

  return nearest;
}

export function updateAllies(
  allies: Ally[],
  enemies: EnemyCharacter[],
  tileMap: RoomTileMap,
  secondsElapsed: number
): number {
  const speed = ENEMY_DEFINITIONS[ALLY_ENEMY_NAME].movementSpeed;
  const damage = ENEMY_DEFINITIONS[ALLY_ENEMY_NAME].contactDamage;
  let killCount = 0;

  for (let index = allies.length - 1; index >= 0; index--) {
    const ally = allies[index];
    ally.secondsRemaining -= secondsElapsed;
    ally.secondsUntilNextStrike -= secondsElapsed;

    if (ally.secondsRemaining <= 0 || ally.currentHealth <= 0) {
      allies.splice(index, 1);
      continue;
    }

    const target = findNearestEnemy(ally, enemies);

    if (!target) {
      continue;
    }

    const towardsHorizontal = target.horizontalPosition - ally.horizontalPosition;
    const towardsVertical = target.verticalPosition - ally.verticalPosition;
    const distance = Math.hypot(towardsHorizontal, towardsVertical) || 1;

    ally.isFacingLeft = towardsHorizontal < 0;

    if (distance > ALLY_REACH_PIXELS) {
      const step = (speed * secondsElapsed) / distance;
      const nextHorizontal = ally.horizontalPosition + towardsHorizontal * step;
      const nextVertical = ally.verticalPosition + towardsVertical * step;

      if (!collidesWithWall(tileMap, nextHorizontal, ally.verticalPosition, 5)) {
        ally.horizontalPosition = nextHorizontal;
      }

      if (!collidesWithWall(tileMap, ally.horizontalPosition, nextVertical, 5)) {
        ally.verticalPosition = nextVertical;
      }

      continue;
    }

    if (ally.secondsUntilNextStrike > 0) {
      continue;
    }

    ally.secondsUntilNextStrike = SECONDS_BETWEEN_ALLY_STRIKES;
    target.currentHealth -= damage;
    target.secondsRemainingFlashing = 0.09;
    target.knockbackHorizontal =
      (towardsHorizontal / distance) * KNOCKBACK_SPEED_PIXELS_PER_SECOND * 0.5;
    target.knockbackVertical =
      (towardsVertical / distance) * KNOCKBACK_SPEED_PIXELS_PER_SECOND * 0.5;

    if (target.currentHealth <= 0) {
      enemies.splice(enemies.indexOf(target), 1);
      killCount += 1;
    }
  }

  return killCount;
}
