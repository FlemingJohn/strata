import type { PlayerCharacter } from "../types/player";
import {
  HEALTH_SHARE_ON_REVIVE,
  HITS_BETWEEN_SUMMONED_ALLIES
} from "../constants/relicPowerSettings";

export function grantShieldForNewRoom(player: PlayerCharacter): void {
  const shield = player.equippedRelics.reduce(
    (total, relic) => total + relic.definition.effect.shieldGrantedPerRoom,
    0
  );

  if (shield > 0) {
    player.currentShield = shield;
  }
}

export function countHitTowardsAnAlly(player: PlayerCharacter): boolean {
  const canSummon = player.equippedRelics.some(
    (relic) => relic.definition.effect.spawnAllyEveryFifthHit
  );

  if (!canSummon) {
    return false;
  }

  player.hitsLandedSinceLastAlly += 1;

  if (player.hitsLandedSinceLastAlly < HITS_BETWEEN_SUMMONED_ALLIES) {
    return false;
  }

  player.hitsLandedSinceLastAlly = 0;
  return true;
}

export function reviveWhenAllowed(player: PlayerCharacter): boolean {
  if (player.currentHealth > 0 || player.hasUsedRevive) {
    return false;
  }

  const canRevive = player.equippedRelics.some(
    (relic) => relic.definition.effect.reviveOnceEachRun
  );

  if (!canRevive) {
    return false;
  }

  player.hasUsedRevive = true;
  player.currentHealth = Math.round(player.maximumHealth * HEALTH_SHARE_ON_REVIVE);
  player.secondsRemainingInvulnerable = 2;
  return true;
}
