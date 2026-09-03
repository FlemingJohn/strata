import type { RelicOrigin } from "../types/relic";

export const CARRIED_INPUT_DATA_LENGTH = 10;
export const BUSY_TRANSACTION_LOG_COUNT = 3;

export const ORDINARY_ORIGINS: RelicOrigin[] = [
  "plainTransfer",
  "highGasTransaction",
  "largeValueTransfer",
  "burnTransfer",
  "veryOldTransaction"
];
