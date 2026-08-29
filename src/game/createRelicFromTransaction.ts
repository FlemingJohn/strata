import type { EquippedRelic, RelicDefinition, RelicName, RelicOrigin } from "../types/relic";
import type { ProvingAttempt } from "../types/proving";
import { RELIC_DEFINITIONS } from "../constants/relicDefinitions";
import { detectTransactionTrait } from "./detectTransactionTrait";
import { findStratumForBlock } from "./findStratumForBlock";

const RELIC_NAME_BY_ORIGIN: Record<RelicOrigin, RelicName> = {
  failedTransaction: "cursedSherd",
  contractCreation: "forkCairn",
  tokenMint: "apeMask",
  burnTransfer: "ashShard",
  veryOldTransaction: "frontierEmber",
  largeValueTransfer: "vaultSeal",
  highGasTransaction: "warHelm",
  plainTransfer: "driftStone"
};

function findDefinitionForOrigin(origin: RelicOrigin): RelicDefinition {
  return RELIC_DEFINITIONS[RELIC_NAME_BY_ORIGIN[origin]];
}

export function createRelicFromTransaction(attempt: ProvingAttempt): EquippedRelic | null {
  if (attempt.status !== "verified" || attempt.blockNumber === null || !attempt.decoded) {
    return null;
  }

  const origin = detectTransactionTrait(attempt.decoded, attempt.blockNumber);
  const stratum = findStratumForBlock(attempt.blockNumber);

  return {
    definition: findDefinitionForOrigin(origin),
    sourceTransactionHash: attempt.transactionHash,
    sourceBlockNumber: attempt.blockNumber,
    sourceMerkleRoot: attempt.transactionMerkleRoot ?? attempt.transactionHash,
    sourceMerkleDepth: attempt.merkleSiblingCount ?? 0,
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
