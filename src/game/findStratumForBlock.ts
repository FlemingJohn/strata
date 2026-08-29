import type { StratumSettings } from "../constants/stratumSettings";
import { STRATUM_SETTINGS } from "../constants/stratumSettings";

export function findStratumForBlock(blockNumber: number): StratumSettings {
  const matchingStratum = STRATUM_SETTINGS.find(
    (stratum) =>
      blockNumber >= stratum.earliestBlockNumber && blockNumber <= stratum.latestBlockNumber
  );

  return matchingStratum ?? STRATUM_SETTINGS[STRATUM_SETTINGS.length - 1];
}
