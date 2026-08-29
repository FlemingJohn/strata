import type { RelicDefinition, RelicEffect, RelicName } from "../types/relic";

const NO_EFFECT: RelicEffect = {
  damageDealtMultiplier: 1,
  damageTakenMultiplier: 1,
  movementSpeedMultiplier: 1,
  shieldGrantedPerRoom: 0,
  healthRestoredPerKill: 0,
  rollCostsNoStaminaAboveHalfHealth: false,
  attacksPassThroughEnemies: false,
  reviveOnceEachRun: false,
  spawnAllyEveryFifthHit: false
};

export const RELIC_DEFINITIONS: Record<RelicName, RelicDefinition> = {
  frontierEmber: {
    name: "frontierEmber",
    displayName: "Frontier Ember",
    origin: "veryOldTransaction",
    description: "Attacks pass through enemies",
    weaponSpriteIndex: 0,
    effect: { ...NO_EFFECT, attacksPassThroughEnemies: true }
  },
  cursedSherd: {
    name: "cursedSherd",
    displayName: "Cursed Sherd",
    origin: "failedTransaction",
    description: "Deal thirty percent more damage and take fifteen percent more",
    weaponSpriteIndex: 1,
    effect: { ...NO_EFFECT, damageDealtMultiplier: 1.3, damageTakenMultiplier: 1.15 }
  },
  apeMask: {
    name: "apeMask",
    displayName: "Ape Mask",
    origin: "tokenMint",
    description: "Every fifth hit summons an ally",
    weaponSpriteIndex: 2,
    effect: { ...NO_EFFECT, spawnAllyEveryFifthHit: true }
  },
  warHelm: {
    name: "warHelm",
    displayName: "War Helm",
    origin: "highGasTransaction",
    description: "Rolling costs no stamina above half health",
    weaponSpriteIndex: 3,
    effect: { ...NO_EFFECT, rollCostsNoStaminaAboveHalfHealth: true }
  },
  vaultSeal: {
    name: "vaultSeal",
    displayName: "Vault Seal",
    origin: "largeValueTransfer",
    description: "Begin every room with twenty shield",
    weaponSpriteIndex: 4,
    effect: { ...NO_EFFECT, shieldGrantedPerRoom: 20 }
  },
  forkCairn: {
    name: "forkCairn",
    displayName: "Fork Cairn",
    origin: "contractCreation",
    description: "Return to life once each run at thirty percent health",
    weaponSpriteIndex: 5,
    effect: { ...NO_EFFECT, reviveOnceEachRun: true }
  },
  driftStone: {
    name: "driftStone",
    displayName: "Drift Stone",
    origin: "plainTransfer",
    description: "Move twelve percent faster",
    weaponSpriteIndex: 6,
    effect: { ...NO_EFFECT, movementSpeedMultiplier: 1.12 }
  },
  ashShard: {
    name: "ashShard",
    displayName: "Ash Shard",
    origin: "burnTransfer",
    description: "Restore three health for every enemy killed",
    weaponSpriteIndex: 7,
    effect: { ...NO_EFFECT, healthRestoredPerKill: 3 }
  }
};
