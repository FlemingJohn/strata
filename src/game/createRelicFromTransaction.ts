import type { EquippedRelic, RelicName } from "../types/relic";
import type { ProvingAttempt } from "../types/proving";
import { RELIC_DEFINITIONS } from "../constants/relicDefinitions";
import { findStratumForBlock } from "./findStratumForBlock";

const RELIC_NAMES_BY_STRATUM: Record<number, RelicName[]> = {
  1: ["driftStone", "warHelm"],
  2: ["cursedSherd", "apeMask"],
  3: ["ashShard", "vaultSeal"],
  4: ["frontierEmber", "forkCairn"]
};

function chooseIndexFromHash(transactionHash: string, choiceCount: number): number {
  let total = 0;

  for (let position = 2; position < transactionHash.length; position++) {
    total = (total + transactionHash.charCodeAt(position)) % 65536;
  }

  return total % choiceCount;
}

export function createRelicFromTransaction(attempt: ProvingAttempt): EquippedRelic | null {
  if (attempt.status !== "verified" || attempt.blockNumber === null) {
    return null;
  }

  const stratum = findStratumForBlock(attempt.blockNumber);
  const candidateNames = RELIC_NAMES_BY_STRATUM[stratum.stratumNumber];
  const chosenName = candidateNames[chooseIndexFromHash(attempt.transactionHash, candidateNames.length)];

  return {
    definition: RELIC_DEFINITIONS[chosenName],
    sourceTransactionHash: attempt.transactionHash,
    sourceBlockNumber: attempt.blockNumber,
    sourceYear: attempt.year,
    stratumNumber: stratum.stratumNumber
  };
}

export function createRelicsFromTransactions(attempts: ProvingAttempt[]): EquippedRelic[] {
  const relics: EquippedRelic[] = [];

  for (const attempt of attempts) {
    const relic = createRelicFromTransaction(attempt);

    if (relic) {
      relics.push(relic);
    }
  }

  return relics;
}
