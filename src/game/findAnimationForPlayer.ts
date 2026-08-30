import type { LpcAnimationName } from "../constants/lpcCharacterSettings";
import type { PlayerActivity, WeaponStyle } from "../types/player";

const ANIMATION_FOR_WEAPON: Record<WeaponStyle, LpcAnimationName> = {
  slice: "slash",
  crush: "backslash",
  pierce: "thrust"
};

export function findAnimationForPlayer(
  activity: PlayerActivity,
  weaponStyle: WeaponStyle
): LpcAnimationName {
  if (activity === "attacking") {
    return ANIMATION_FOR_WEAPON[weaponStyle];
  }

  if (activity === "dying") {
    return "hurt";
  }

  if (activity === "walking" || activity === "rolling") {
    return "walk";
  }

  return "idle";
}
