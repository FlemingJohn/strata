import type { EquippedRelic } from "../types/relic";
import { FIRST_DEPTH } from "../constants/runSettings";

export function sortRelicsFromNewestToOldest(relics: EquippedRelic[]): EquippedRelic[] {
  return [...relics].sort((first, second) => second.sourceBlockNumber - first.sourceBlockNumber);
}

export function countFloorsAvailable(provenRelics: EquippedRelic[]): number {
  const seenBlocks = new Set(provenRelics.map((relic) => relic.sourceBlockNumber));
  return seenBlocks.size;
}

export function chooseRelicForDepth(
  provenRelics: EquippedRelic[],
  depth: number
): EquippedRelic | null {
  const seenBlocks = new Set<number>();
  const oneRelicPerBlock: EquippedRelic[] = [];

  for (const relic of sortRelicsFromNewestToOldest(provenRelics)) {
    if (seenBlocks.has(relic.sourceBlockNumber)) {
      continue;
    }

    seenBlocks.add(relic.sourceBlockNumber);
    oneRelicPerBlock.push(relic);
  }

  return oneRelicPerBlock[depth - FIRST_DEPTH] ?? null;
}
