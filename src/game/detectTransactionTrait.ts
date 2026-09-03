import type { DecodedTransaction } from "../types/decodedTransaction";
import type { RelicOrigin } from "../types/relic";
import {
  DEAD_ADDRESS,
  TRANSFER_EVENT_TOPIC,
  ZERO_ADDRESS,
  ZERO_TOPIC
} from "../constants/transactionSignatures";
import {
  BEDROCK_HIGHEST_BLOCK_NUMBER,
  HIGH_GAS_PRICE_THRESHOLD_IN_WEI,
  LARGE_TRANSFER_THRESHOLD_IN_WEI
} from "../constants/stratumSettings";
import {
  BUSY_TRANSACTION_LOG_COUNT,
  CARRIED_INPUT_DATA_LENGTH,
  ORDINARY_ORIGINS
} from "../constants/relicOriginSettings";
import { createSeededRandomFromHash } from "./createSeededRandomFromHash";

function hasMintedToken(decoded: DecodedTransaction): boolean {
  return decoded.logs.some(
    (log) => log.topics[0] === TRANSFER_EVENT_TOPIC && log.topics[1] === ZERO_TOPIC
  );
}

function wasSentToBurnAddress(decoded: DecodedTransaction): boolean {
  return decoded.toAddress === ZERO_ADDRESS || decoded.toAddress === DEAD_ADDRESS;
}

function paidUnusualGas(decoded: DecodedTransaction): boolean {
  return decoded.gasPriceInWei !== null && decoded.gasPriceInWei > HIGH_GAS_PRICE_THRESHOLD_IN_WEI;
}

function spokeToAContract(decoded: DecodedTransaction): boolean {
  return decoded.inputData.length > CARRIED_INPUT_DATA_LENGTH || decoded.logs.length > 0;
}

function stirredUpTheChain(decoded: DecodedTransaction): boolean {
  return decoded.logs.length >= BUSY_TRANSACTION_LOG_COUNT;
}

function shareOfOrdinaryOrigins(transactionHash: string): RelicOrigin {
  const nextRandomNumber = createSeededRandomFromHash(transactionHash);
  return ORDINARY_ORIGINS[Math.floor(nextRandomNumber() * ORDINARY_ORIGINS.length)];
}

export function detectTransactionTrait(
  decoded: DecodedTransaction,
  blockNumber: number,
  transactionHash: string
): RelicOrigin {
  if (!decoded.wasSuccessful) {
    return "failedTransaction";
  }

  if (decoded.isContractCreation) {
    return "contractCreation";
  }

  if (hasMintedToken(decoded)) {
    return "tokenMint";
  }

  if (wasSentToBurnAddress(decoded)) {
    return "burnTransfer";
  }

  if (decoded.valueInWei >= LARGE_TRANSFER_THRESHOLD_IN_WEI) {
    return "largeValueTransfer";
  }

  if (paidUnusualGas(decoded)) {
    return "highGasTransaction";
  }

  if (blockNumber <= BEDROCK_HIGHEST_BLOCK_NUMBER) {
    return "veryOldTransaction";
  }

  if (stirredUpTheChain(decoded)) {
    return "tokenMint";
  }

  if (spokeToAContract(decoded)) {
    return "contractCreation";
  }

  return shareOfOrdinaryOrigins(transactionHash);
}
