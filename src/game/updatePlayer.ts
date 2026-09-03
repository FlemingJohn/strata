import type { PlayerCharacter } from "../types/player";
import type { PlayerInput } from "../types/input";
import type { RoomTileMap } from "../types/dungeon";
import {
  CRUSH_DURATION_SECONDS,
  INVULNERABLE_SECONDS_AFTER_TAKING_DAMAGE,
  KNOCKBACK_FRICTION_PER_FRAME,
  PIERCE_DURATION_SECONDS,
  PLAYER_ROLLING_SPEED_PIXELS_PER_SECOND,
  PLAYER_SPEED_WHILE_ATTACKING_PIXELS_PER_SECOND,
  PLAYER_WALKING_SPEED_PIXELS_PER_SECOND,
  ROLL_DURATION_SECONDS,
  ROLL_INVULNERABLE_SECONDS,
  ROLL_STAMINA_COST,
  SLICE_DURATION_SECONDS,
  STAMINA_RECOVERY_DELAY_SECONDS,
  STAMINA_RECOVERY_PER_SECOND
} from "../constants/playerSettings";
import {
  CAST_COOLDOWN_SECONDS,
  CAST_DURATION_SECONDS,
  CAST_STAMINA_COST
} from "../constants/abilitySettings";
import { movePlayerThroughRoom } from "./movePlayerThroughRoom";
import { findSpeedMultiplierAt } from "./findTileKindAt";
import { POINTER_DEAD_ZONE_PIXELS } from "../constants/controlSettings";

const ATTACK_DURATIONS = {
  slice: SLICE_DURATION_SECONDS,
  crush: CRUSH_DURATION_SECONDS,
  pierce: PIERCE_DURATION_SECONDS
};

function findFacingFromInput(
  horizontal: number,
  vertical: number
): PlayerCharacter["facing"] | null {
  if (horizontal === 0 && vertical === 0) {
    return null;
  }

  if (Math.abs(horizontal) > Math.abs(vertical)) {
    return horizontal > 0 ? "right" : "left";
  }

  return vertical > 0 ? "down" : "up";
}

function findMovementSpeed(player: PlayerCharacter): number {
  if (player.activity === "rolling") {
    return PLAYER_ROLLING_SPEED_PIXELS_PER_SECOND;
  }

  if (player.activity === "casting") {
    return 0;
  }

  if (player.activity === "attacking") {
    return PLAYER_SPEED_WHILE_ATTACKING_PIXELS_PER_SECOND;
  }

  const speedMultiplier = player.equippedRelics.reduce(
    (multiplier, relic) => multiplier * relic.definition.effect.movementSpeedMultiplier,
    1
  );

  return PLAYER_WALKING_SPEED_PIXELS_PER_SECOND * speedMultiplier;
}

function rollIsFree(player: PlayerCharacter): boolean {
  const hasFreeRollRelic = player.equippedRelics.some(
    (relic) => relic.definition.effect.rollCostsNoStaminaAboveHalfHealth
  );

  return hasFreeRollRelic && player.currentHealth > player.maximumHealth / 2;
}

function findFacingFromPointer(
  player: PlayerCharacter,
  input: PlayerInput
): PlayerCharacter["facing"] | null {
  if (input.pointerHorizontal === null || input.pointerVertical === null) {
    return null;
  }

  const towardsHorizontal = input.pointerHorizontal - player.horizontalPosition;
  const towardsVertical = input.pointerVertical - player.verticalPosition;

  if (Math.hypot(towardsHorizontal, towardsVertical) < POINTER_DEAD_ZONE_PIXELS) {
    return null;
  }

  if (Math.abs(towardsHorizontal) > Math.abs(towardsVertical)) {
    return towardsHorizontal > 0 ? "right" : "left";
  }

  return towardsVertical > 0 ? "down" : "up";
}

export function updatePlayer(
  player: PlayerCharacter,
  input: PlayerInput,
  tileMap: RoomTileMap,
  secondsElapsed: number
): void {
  player.secondsUntilActivityEnds -= secondsElapsed;
  player.secondsUntilStaminaRecovers -= secondsElapsed;
  player.secondsRemainingInvulnerable -= secondsElapsed;
  player.secondsUntilCastReady -= secondsElapsed;

  if (player.secondsUntilActivityEnds <= 0 && player.activity !== "standing") {
    player.activity = "standing";
  }

  const length = Math.hypot(input.horizontal, input.vertical) || 1;
  const normalisedHorizontal = input.horizontal / length;
  const normalisedVertical = input.vertical / length;

  if (player.activity === "standing") {
    const facingFromPointer = findFacingFromPointer(player, input);
    const facing = facingFromPointer ?? findFacingFromInput(input.horizontal, input.vertical);

    if (facing) {
      player.facing = facing;
    }

    if (
      input.wantsToCast &&
      player.secondsUntilCastReady <= 0 &&
      player.currentStamina >= CAST_STAMINA_COST
    ) {
      player.activity = "casting";
      player.secondsUntilActivityEnds = CAST_DURATION_SECONDS;
      player.secondsUntilCastReady = CAST_COOLDOWN_SECONDS;
      player.currentStamina -= CAST_STAMINA_COST;
      player.secondsUntilStaminaRecovers = STAMINA_RECOVERY_DELAY_SECONDS;
    } else if (input.wantsToAttack) {
      player.activity = "attacking";
      player.secondsUntilActivityEnds = ATTACK_DURATIONS[player.weaponStyle];
      player.currentAttackIdentifier += 1;
    } else if (
      input.wantsToRoll &&
      (input.horizontal !== 0 || input.vertical !== 0) &&
      (rollIsFree(player) || player.currentStamina >= ROLL_STAMINA_COST)
    ) {
      player.activity = "rolling";
      player.secondsUntilActivityEnds = ROLL_DURATION_SECONDS;
      player.rollDirectionHorizontal = normalisedHorizontal;
      player.rollDirectionVertical = normalisedVertical;

      if (!rollIsFree(player)) {
        player.currentStamina -= ROLL_STAMINA_COST;
        player.secondsUntilStaminaRecovers = STAMINA_RECOVERY_DELAY_SECONDS;
      }
    }
  }

  if (player.activity === "rolling") {
    const remaining = player.secondsUntilActivityEnds;

    if (remaining > ROLL_DURATION_SECONDS - ROLL_INVULNERABLE_SECONDS) {
      player.secondsRemainingInvulnerable = Math.max(
        player.secondsRemainingInvulnerable,
        0.02
      );
    }
  }

  const speed =
    findMovementSpeed(player) *
    findSpeedMultiplierAt(tileMap, player.horizontalPosition, player.verticalPosition);
  const directionHorizontal =
    player.activity === "rolling" ? player.rollDirectionHorizontal : normalisedHorizontal;
  const directionVertical =
    player.activity === "rolling" ? player.rollDirectionVertical : normalisedVertical;

  movePlayerThroughRoom(
    player,
    tileMap,
    directionHorizontal * speed * secondsElapsed + player.knockbackHorizontal * secondsElapsed,
    directionVertical * speed * secondsElapsed + player.knockbackVertical * secondsElapsed
  );

  player.knockbackHorizontal *= KNOCKBACK_FRICTION_PER_FRAME;
  player.knockbackVertical *= KNOCKBACK_FRICTION_PER_FRAME;

  if (player.secondsUntilStaminaRecovers <= 0) {
    player.currentStamina = Math.min(
      player.maximumStamina,
      player.currentStamina + STAMINA_RECOVERY_PER_SECOND * secondsElapsed
    );
  }
}

export function applyDamageToPlayer(
  player: PlayerCharacter,
  damage: number,
  fromHorizontal: number,
  fromVertical: number,
  knockbackSpeed: number
): boolean {
  if (player.secondsRemainingInvulnerable > 0) {
    return false;
  }

  const damageMultiplier = player.equippedRelics.reduce(
    (multiplier, relic) => multiplier * relic.definition.effect.damageTakenMultiplier,
    1
  );

  const damageTaken = damage * damageMultiplier;
  const damageAbsorbed = Math.min(player.currentShield, damageTaken);

  player.currentShield -= damageAbsorbed;
  player.currentHealth -= damageTaken - damageAbsorbed;
  player.secondsRemainingInvulnerable = INVULNERABLE_SECONDS_AFTER_TAKING_DAMAGE;

  const awayHorizontal = player.horizontalPosition - fromHorizontal;
  const awayVertical = player.verticalPosition - fromVertical;
  const distance = Math.hypot(awayHorizontal, awayVertical) || 1;

  player.knockbackHorizontal = (awayHorizontal / distance) * knockbackSpeed;
  player.knockbackVertical = (awayVertical / distance) * knockbackSpeed;

  return true;
}
