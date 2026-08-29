export type ProvingStatus = "waiting" | "building" | "verifying" | "verified" | "failed";

export interface ProvingAttempt {
  transactionHash: string;
  eraName: string;
  year: number;
  blockNumber: number | null;
  status: ProvingStatus;
  merkleSiblingCount: number | null;
  continuityRootCount: number | null;
  wasCached: boolean;
  failureReason: string | null;
}

export type ProvingProgressListener = (attempts: ProvingAttempt[]) => void;
