export interface WalletTransactionSummary {
  transactionHash: string;
  blockNumber: number;
  timestampInSeconds: number;
  fromAddress: string;
  toAddress: string | null;
  valueInWei: string;
  gasPriceInWei: string;
  wasSuccessful: boolean;
  hasInputData: boolean;
}

export interface MerkleProofEntry {
  siblingHash: string;
  isLeftSibling: boolean;
}

export interface TransactionProof {
  chainKey: number;
  blockNumber: number;
  transactionHash: string;
  transactionBytes: string;
  merkleRoot: string;
  merkleSiblings: MerkleProofEntry[];
  lowerEndpointDigest: string;
  continuityRoots: string[];
  wasCached: boolean;
}

export interface ProvenTransaction {
  proof: TransactionProof;
  creditcoinTransactionHash: string;
  verifiedAt: number;
}

export interface HistoryByYear {
  year: number;
  transactionCount: number;
}
