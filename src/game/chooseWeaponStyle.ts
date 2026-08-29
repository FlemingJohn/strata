import type { EquippedRelic } from "../types/relic";
import type { WeaponStyle } from "../types/player";

const WEAPON_STYLE_BY_STRATUM: Record<number, WeaponStyle> = {
  1: "pierce",
  2: "slice",
  3: "slice",
  4: "crush"
};

export function findDeepestRelic(relics: EquippedRelic[]): EquippedRelic | null {
  if (relics.length === 0) {
    return null;
  }

  return relics.reduce((deepest, relic) =>
    relic.sourceBlockNumber < deepest.sourceBlockNumber ? relic : deepest
  );
}

export function chooseWeaponStyle(relics: EquippedRelic[]): WeaponStyle {
  const deepestRelic = findDeepestRelic(relics);

  if (!deepestRelic) {
    return "slice";
  }

  return WEAPON_STYLE_BY_STRATUM[deepestRelic.stratumNumber] ?? "slice";
}
