import type { PlayerCharacter, WeaponStyle } from "../types/player";
import type { EquippedRelic } from "../types/relic";
import {
  PLAYER_COLLISION_RADIUS,
  PLAYER_MAXIMUM_HEALTH,
  PLAYER_MAXIMUM_STAMINA
} from "../constants/playerSettings";
import { PLAYER_ANIMATIONS } from "../constants/animationSettings";

export function createPlayer(
  startHorizontal: number,
  startVertical: number,
  weaponStyle: WeaponStyle,
  equippedRelics: EquippedRelic[]
): PlayerCharacter {
  return {
    horizontalPosition: startHorizontal,
    verticalPosition: startVertical,
    collisionRadius: PLAYER_COLLISION_RADIUS,

    currentHealth: PLAYER_MAXIMUM_HEALTH,
    maximumHealth: PLAYER_MAXIMUM_HEALTH,
    currentStamina: PLAYER_MAXIMUM_STAMINA,
    maximumStamina: PLAYER_MAXIMUM_STAMINA,

    activity: "standing",
    facing: "down",
    animation: {
      definition: PLAYER_ANIMATIONS.standingDown,
      currentFrameIndex: 0,
      secondsSinceFrameChange: 0,
      hasFinished: false
    },

    weaponStyle,
    equippedRelics,

    secondsUntilActivityEnds: 0,
    secondsUntilStaminaRecovers: 0,
    secondsRemainingInvulnerable: 0,

    knockbackHorizontal: 0,
    knockbackVertical: 0,

    rollDirectionHorizontal: 0,
    rollDirectionVertical: 1,

    currentAttackIdentifier: 0,
    secondsUntilCastReady: 0,
    secondsOfSharpenedWeapon: 0
  };
}
