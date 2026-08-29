export const TRANSFER_EVENT_TOPIC =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const DEAD_ADDRESS = "0x000000000000000000000000000000000000dead";

export const ZERO_TOPIC =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

export const COMMON_FIELD_TYPES = [
  "uint64",
  "uint64",
  "address",
  "bool",
  "address",
  "uint256",
  "bytes"
];

export const RECEIPT_FIELD_TYPES = [
  "uint8",
  "uint64",
  "tuple(address, bytes32[], bytes)[]",
  "bytes"
];

export const ENCODED_TRANSACTION_TYPES = ["uint8", "bytes[]"];

export interface GasPriceChunkLayout {
  types: string[];
  gasPricePosition: number;
}

export const GAS_PRICE_CHUNK_LAYOUT_BY_TRANSACTION_TYPE: Record<number, GasPriceChunkLayout> = {
  0: { types: ["uint128", "uint256", "bytes32", "bytes32"], gasPricePosition: 0 },
  1: {
    types: ["uint64", "uint128", "tuple(address,bytes32[])[]", "uint8", "bytes32", "bytes32"],
    gasPricePosition: 1
  },
  2: {
    types: [
      "uint64",
      "uint128",
      "uint128",
      "tuple(address,bytes32[])[]",
      "uint8",
      "bytes32",
      "bytes32"
    ],
    gasPricePosition: 2
  },
  3: {
    types: ["uint64", "uint128", "uint128", "tuple(address,bytes32[])[]"],
    gasPricePosition: 2
  },
  4: {
    types: ["uint64", "uint128", "uint128", "tuple(address,bytes32[])[]"],
    gasPricePosition: 2
  }
};
