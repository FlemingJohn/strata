export interface StratumSettings {
  stratumNumber: number;
  displayName: string;
  earliestBlockNumber: number;
  latestBlockNumber: number;
  approximateYear: number;
  proofCostInCreditcoin: number;
  inkColour: string;
}

export const STRATUM_SETTINGS: StratumSettings[] = [
  {
    stratumNumber: 1,
    displayName: "Surface",
    earliestBlockNumber: 20000000,
    latestBlockNumber: 99999999,
    approximateYear: 2025,
    proofCostInCreditcoin: 0.00003,
    inkColour: "#5B9C77"
  },
  {
    stratumNumber: 2,
    displayName: "The Boom",
    earliestBlockNumber: 10000000,
    latestBlockNumber: 19999999,
    approximateYear: 2021,
    proofCostInCreditcoin: 0.00031,
    inkColour: "#C4523A"
  },
  {
    stratumNumber: 3,
    displayName: "The Winter",
    earliestBlockNumber: 3000000,
    latestBlockNumber: 9999999,
    approximateYear: 2018,
    proofCostInCreditcoin: 0.0018,
    inkColour: "#4A7CA0"
  },
  {
    stratumNumber: 4,
    displayName: "Bedrock",
    earliestBlockNumber: 0,
    latestBlockNumber: 2999999,
    approximateYear: 2015,
    proofCostInCreditcoin: 0.0031,
    inkColour: "#E0A233"
  }
];

export const HIGH_GAS_PRICE_THRESHOLD_IN_WEI = 200000000000n;
export const LARGE_TRANSFER_THRESHOLD_IN_WEI = 10000000000000000000n;
export const BURN_ADDRESS = "0x0000000000000000000000000000000000000000";
