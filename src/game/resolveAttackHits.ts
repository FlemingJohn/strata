import type { CombatParticle, ImpactFeedback } from "../types/combat";
import type { DyingEnemy } from "../types/dyingEnemy";
import type { EnemyCharacter } from "../types/enemy";
import type { PlayerCharacter } from "../types/player";
import {
  CRUSH_DAMAGE,
  CRUSH_DURATION_SECONDS,
  CRUSH_REACH_PIXELS,
  PIERCE_DAMAGE,
  PIERCE_DURATION_SECONDS,
  PIERCE_REACH_PIXELS,
  SLICE_DAMAGE,
  SLICE_DURATION_SECONDS,
  SLICE_REACH_PIXELS
} from "../constants/playerSettings";
import { DAMAGE_MULTIPLIER_WHILE_RECOVERING } from "../constants/enemySettings";
import { SHARPENED_DAMAGE_MULTIPLIER } from "../constants/stationSettings";
import { KNOCKBACK_SPEED_PIXELS_PER_SECOND } from "../constants/animationSettings";
import { burstParticles, recordHit, recordKill } from "./createImpactFeedback";
import { createDyingEnemy } from "./createDyingEnemy";

const ATTACK_SHAPES = {
  slice: { damage: SLICE_DAMAGE, reach: SLICE_REACH_PIXELS, radius: 13, duration: SLICE_DURATION_SECONDS },
  crush: { damage: CRUSH_DAMAGE, reach: CRUSH_REACH_PIXELS, radius: 15, duration: CRUSH_DURATION_SECONDS },
  pierce: { damage: PIERCE_DAMAGE, reach: PIERCE_REACH_PIXELS, radius: 9, duration: PIERCE_DURATION_SECONDS }
};

const FACING_VECTORS = {
  down: { horizontal: 0, vertical: 1 },
  up: { horizontal: 0, vertical: -1 },
  left: { horizontal: -1, vertical: 0 },
  right: { horizontal: 1, vertical: 0 }
};

export function findActiveAttackArea(
  player: PlayerCharacter
): { horizontal: number; vertical: number; radius: number } | null {
  if (player.activity !== "attacking") {
    return null;
  }

  const shape = ATTACK_SHAPES[player.weaponStyle];
  const elapsed = shape.duration - player.secondsUntilActivityEnds;
  const isWithinActiveWindow = elapsed > shape.duration * 0.3 && elapsed < shape.duration * 0.7;

  if (!isWithinActiveWindow) {
    return null;
  }

  const facing = FACING_VECTORS[player.facing];

  return {
    horizontal: player.horizontalPosition + facing.horizontal * shape.reach,
    vertical: player.verticalPosition + facing.vertical * shape.reach,
    radius: shape.radius
  };
}

export function resolveAttackHits(
  player: PlayerCharacter,
  enemies: EnemyCharacter[],
  particles: CombatParticle[],
  feedback: ImpactFeedback,
  respectsReducedMotion: boolean,
  dyingEnemies: DyingEnemy[]
): number {
  const area = findActiveAttackArea(player);

  if (!area) {
    return 0;
  }

  const shape = ATTACK_SHAPES[player.weaponStyle];
  const sharpenedMultiplier =
    player.secondsOfSharpenedWeapon > 0 ? SHARPENED_DAMAGE_MULTIPLIER : 1;
  const damageMultiplier = player.equippedRelics.reduce(
    (multiplier, relic) => multiplier * relic.definition.effect.damageDealtMultiplier,
    sharpenedMultiplier
  );
  const passesThrough = player.equippedRelics.some(
    (relic) => relic.definition.effect.attacksPassThroughEnemies
  );

  let killCount = 0;

  for (let index = enemies.length - 1; index >= 0; index--) {
    const enemy = enemies[index];

    if (enemy.lastAttackIdentifierReceived === player.currentAttackIdentifier) {
      continue;
    }

    const distance = Math.hypot(
      area.horizontal - enemy.horizontalPosition,
      area.vertical - enemy.verticalPosition
    );

    if (distance > area.radius + enemy.definition.collisionRadius) {
      continue;
    }

    enemy.lastAttackIdentifierReceived = player.currentAttackIdentifier;

    const isRecovering = enemy.behaviour === "recovering";
    const damage =
      shape.damage * damageMultiplier * (isRecovering ? DAMAGE_MULTIPLIER_WHILE_RECOVERING : 1);

    enemy.currentHealth -= damage;
    enemy.secondsRemainingFlashing = 0.09;

    const awayHorizontal = enemy.horizontalPosition - player.horizontalPosition;
    const awayVertical = enemy.verticalPosition - player.verticalPosition;
    const awayDistance = Math.hypot(awayHorizontal, awayVertical) || 1;

    enemy.knockbackHorizontal = (awayHorizontal / awayDistance) * KNOCKBACK_SPEED_PIXELS_PER_SECOND;
    enemy.knockbackVertical = (awayVertical / awayDistance) * KNOCKBACK_SPEED_PIXELS_PER_SECOND;

    burstParticles(particles, enemy.horizontalPosition, enemy.verticalPosition, 7, "#FFFFFF", 130);
    recordHit(feedback, respectsReducedMotion);

    if (enemy.currentHealth <= 0) {
      burstParticles(particles, enemy.horizontalPosition, enemy.verticalPosition, 20, "#C4523A", 160);
      recordKill(feedback, respectsReducedMotion);
      dyingEnemies.push(
        createDyingEnemy(
          enemy.definition.name,
          enemy.horizontalPosition,
          enemy.verticalPosition
        )
      );
      enemies.splice(index, 1);
      killCount += 1;

      const healPerKill = player.equippedRelics.reduce(
        (total, relic) => total + relic.definition.effect.healthRestoredPerKill,
        0
      );

      if (healPerKill > 0) {
        player.currentHealth = Math.min(player.maximumHealth, player.currentHealth + healPerKill);
      }
    }

    if (!passesThrough) {
      break;
    }
  }

  return killCount;
}
