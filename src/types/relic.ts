export type RelicName =
  | "frontierEmber"
  | "cursedSherd"
  | "apeMask"
  | "warHelm"
  | "vaultSeal"
  | "forkCairn"
  | "driftStone"
  | "ashShard";

export type RelicOrigin =
  | "failedTransaction"
  | "highGasTransaction"
  | "tokenMint"
  | "veryOldTransaction"
  | "largeValueTransfer"
  | "contractCreation"
  | "plainTransfer"
  | "burnTransfer";

export interface RelicEffect {
  damageDealtMultiplier: number;
  damageTakenMultiplier: number;
  movementSpeedMultiplier: number;
  shieldGrantedPerRoom: number;
  healthRestoredPerKill: number;
  rollCostsNoStaminaAboveHalfHealth: boolean;
  attacksPassThroughEnemies: boolean;
  reviveOnceEachRun: boolean;
  spawnAllyEveryFifthHit: boolean;
}

export interface RelicDefinition {
  name: RelicName;
  displayName: string;
  origin: RelicOrigin;
  description: string;
  weaponSpriteIndex: number;
  effect: RelicEffect;
}

export interface EquippedRelic {
  definition: RelicDefinition;
  sourceTransactionHash: string;
  sourceBlockNumber: number;
  sourceMerkleRoot: string;
  sourceMerkleDepth: number;
  sourceYear: number;
  stratumNumber: number;
}
