import type { Ally } from "../types/ally";
import {
  ALLY_HEALTH_SHARE,
  ALLY_LIFETIME_SECONDS,
  ALLY_SPAWN_DISTANCE_PIXELS
} from "../constants/relicPowerSettings";
import { ENEMY_DEFINITIONS } from "../constants/enemySettings";
import { ALLY_ENEMY_NAME } from "../constants/relicPowerSettings";

export function createAlly(
  horizontalPosition: number,
  verticalPosition: number
): Ally {
  return {
    horizontalPosition: horizontalPosition + ALLY_SPAWN_DISTANCE_PIXELS,
    verticalPosition,
    currentHealth: ENEMY_DEFINITIONS[ALLY_ENEMY_NAME].maximumHealth * ALLY_HEALTH_SHARE,
    secondsRemaining: ALLY_LIFETIME_SECONDS,
    secondsUntilNextStrike: 0,
    isFacingLeft: false
  };
}
