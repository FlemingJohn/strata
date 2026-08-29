import type { AnimationPlayback, FacingDirection } from "./spriteSheet";
import type { EquippedRelic } from "./relic";

export type PlayerActivity = "standing" | "walking" | "attacking" | "rolling" | "dying";

export type WeaponStyle = "slice" | "crush" | "pierce";

export interface PlayerCharacter {
  horizontalPosition: number;
  verticalPosition: number;
  collisionRadius: number;

  currentHealth: number;
  maximumHealth: number;
  currentStamina: number;
  maximumStamina: number;

  activity: PlayerActivity;
  facing: FacingDirection;
  animation: AnimationPlayback;

  weaponStyle: WeaponStyle;
  equippedRelics: EquippedRelic[];

  secondsUntilActivityEnds: number;
  secondsUntilStaminaRecovers: number;
  secondsRemainingInvulnerable: number;

  knockbackHorizontal: number;
  knockbackVertical: number;

  rollDirectionHorizontal: number;
  rollDirectionVertical: number;

  currentAttackIdentifier: number;
}
