import type { DecodedTransaction } from "./decodedTransaction";

export type ProvingStatus = "waiting" | "building" | "verifying" | "verified" | "failed";

export interface ProvingAttempt {
  transactionHash: string;
  eraName: string;
  year: number;
  blockNumber: number | null;
  status: ProvingStatus;
  merkleSiblingCount: number | null;
  transactionMerkleRoot: string | null;
  continuityRootCount: number | null;
  wasCached: boolean;
  decoded: DecodedTransaction | null;
  failureReason: string | null;
}

export type ProvingProgressListener = (attempts: ProvingAttempt[]) => void;
