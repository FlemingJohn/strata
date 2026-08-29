import type { ProvenBlockFacts } from "../game/createFloorDescription";
import type { ProvingAttempt } from "../types/proving";

export function readBlockFactsFromAttempt(
  attempt: ProvingAttempt,
  transactionMerkleRoot: string
): ProvenBlockFacts | null {
  if (attempt.blockNumber === null || attempt.merkleSiblingCount === null) {
    return null;
  }

  return {
    blockNumber: attempt.blockNumber,
    transactionMerkleRoot,
    merkleSiblingCount: attempt.merkleSiblingCount,
    continuityRootCount: attempt.continuityRootCount ?? 0
  };
}
