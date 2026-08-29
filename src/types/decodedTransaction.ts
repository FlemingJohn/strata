export interface DecodedTransactionLog {
  emitterAddress: string;
  topics: string[];
  data: string;
}

export interface DecodedTransaction {
  transactionType: number;
  nonce: bigint;
  gasLimit: bigint;
  fromAddress: string;
  isContractCreation: boolean;
  toAddress: string;
  valueInWei: bigint;
  inputData: string;
  wasSuccessful: boolean;
  gasUsed: bigint;
  gasPriceInWei: bigint | null;
  logs: DecodedTransactionLog[];
}
