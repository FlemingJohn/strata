import type { DecodedTransaction } from "../types/decodedTransaction";
import type { RelicOrigin } from "../types/relic";
import {
  DEAD_ADDRESS,
  TRANSFER_EVENT_TOPIC,
  ZERO_ADDRESS,
  ZERO_TOPIC
} from "../constants/transactionSignatures";
import {
  HIGH_GAS_PRICE_THRESHOLD_IN_WEI,
  LARGE_TRANSFER_THRESHOLD_IN_WEI
} from "../constants/stratumSettings";
import { BEDROCK_HIGHEST_BLOCK_NUMBER } from "../constants/stratumSettings";

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

export function detectTransactionTrait(
  decoded: DecodedTransaction,
  blockNumber: number
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

  if (blockNumber <= BEDROCK_HIGHEST_BLOCK_NUMBER) {
    return "veryOldTransaction";
  }

  if (decoded.valueInWei >= LARGE_TRANSFER_THRESHOLD_IN_WEI) {
    return "largeValueTransfer";
  }

  if (paidUnusualGas(decoded)) {
    return "highGasTransaction";
  }

  return "plainTransfer";
}
