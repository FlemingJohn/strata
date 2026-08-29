import { AbiCoder } from "ethers";
import type { DecodedTransaction, DecodedTransactionLog } from "../types/decodedTransaction";
import {
  COMMON_FIELD_TYPES,
  ENCODED_TRANSACTION_TYPES,
  GAS_PRICE_CHUNK_LAYOUT_BY_TRANSACTION_TYPE,
  RECEIPT_FIELD_TYPES
} from "../constants/transactionSignatures";

function readGasPrice(coder: AbiCoder, chunk: string, transactionType: number): bigint | null {
  const layout = GAS_PRICE_CHUNK_LAYOUT_BY_TRANSACTION_TYPE[transactionType];

  if (!layout) {
    return null;
  }

  try {
    const decoded = coder.decode(layout.types, chunk);
    return BigInt(decoded[layout.gasPricePosition]);
  } catch {
    return null;
  }
}

function readLogs(rawLogs: unknown): DecodedTransactionLog[] {
  if (!Array.isArray(rawLogs)) {
    return [];
  }

  return rawLogs.map((entry) => ({
    emitterAddress: String(entry[0]).toLowerCase(),
    topics: Array.from(entry[1]).map((topic) => String(topic).toLowerCase()),
    data: String(entry[2])
  }));
}

export function decodeTransactionBytes(transactionBytes: string): DecodedTransaction | null {
  const coder = AbiCoder.defaultAbiCoder();

  let transactionType: number;
  let chunks: string[];

  try {
    const outer = coder.decode(ENCODED_TRANSACTION_TYPES, transactionBytes);
    transactionType = Number(outer[0]);
    chunks = Array.from(outer[1]).map(String);
  } catch {
    return null;
  }

  if (chunks.length < 2) {
    return null;
  }

  try {
    const common = coder.decode(COMMON_FIELD_TYPES, chunks[0]);
    const receipt = coder.decode(RECEIPT_FIELD_TYPES, chunks[chunks.length - 1]);

    return {
      transactionType,
      nonce: BigInt(common[0]),
      gasLimit: BigInt(common[1]),
      fromAddress: String(common[2]).toLowerCase(),
      isContractCreation: Boolean(common[3]),
      toAddress: String(common[4]).toLowerCase(),
      valueInWei: BigInt(common[5]),
      inputData: String(common[6]),
      wasSuccessful: Number(receipt[0]) === 1,
      gasUsed: BigInt(receipt[1]),
      gasPriceInWei: readGasPrice(coder, chunks[1], transactionType),
      logs: readLogs(receipt[2])
    };
  } catch {
    return null;
  }
}
