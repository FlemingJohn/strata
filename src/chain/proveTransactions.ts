import { blockProver, proofProvider } from "@gluwa/usc-sdk";
import type { JsonRpcProvider } from "ethers";
import type { DemoTransaction } from "../constants/demoTransactions";
import type { ProvingAttempt, ProvingProgressListener } from "../types/proving";
import { PROOF_REQUEST_TIMEOUT_MILLISECONDS } from "../constants/networkSettings";
import { resolveProofBuilderUrl } from "./resolveServiceUrls";

function createWaitingAttempts(transactions: DemoTransaction[]): ProvingAttempt[] {
  return transactions.map((transaction) => ({
    transactionHash: transaction.transactionHash,
    eraName: transaction.eraName,
    year: transaction.year,
    blockNumber: null,
    status: "waiting",
    merkleSiblingCount: null,
    continuityRootCount: null,
    wasCached: false,
    failureReason: null
  }));
}

export async function proveTransactions(
  provider: JsonRpcProvider,
  chainKey: number,
  transactions: DemoTransaction[],
  onProgress: ProvingProgressListener
): Promise<ProvingAttempt[]> {
  const attempts = createWaitingAttempts(transactions);
  const builder = new proofProvider.service.ProofBuilder(
    chainKey,
    resolveProofBuilderUrl(),
    PROOF_REQUEST_TIMEOUT_MILLISECONDS
  );
  const prover = new blockProver.PrecompileBlockProver(provider);

  onProgress(attempts);

  for (let index = 0; index < transactions.length; index++) {
    const attempt = attempts[index];

    try {
      attempt.status = "building";
      onProgress(attempts);

      const proofResult = await builder.getProof(attempt.transactionHash);

      if (!proofResult.success || !proofResult.data) {
        attempt.status = "failed";
        attempt.failureReason = "The proof service returned no proof";
        onProgress(attempts);
        continue;
      }

      const proof = proofResult.data;
      attempt.blockNumber = proof.headerNumber;
      attempt.merkleSiblingCount = proof.merkleProof.siblings.length;
      attempt.continuityRootCount = proof.continuityProof.roots.length;
      attempt.wasCached = proof.cached;
      attempt.status = "verifying";
      onProgress(attempts);

      const wasVerified = await prover.verifySingle(
        proof.chainKey,
        proof.headerNumber,
        proof.txBytes,
        proof.merkleProof,
        proof.continuityProof
      );

      attempt.status = wasVerified ? "verified" : "failed";

      if (!wasVerified) {
        attempt.failureReason = "The precompile rejected the proof";
      }
    } catch (failure) {
      attempt.status = "failed";
      attempt.failureReason = failure instanceof Error ? failure.message : String(failure);
    }

    onProgress(attempts);
  }

  return attempts;
}
