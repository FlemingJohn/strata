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
  firstLight: {
    name: "firstLight",
    displayName: "First Light",
    origin: "veryOldTransaction",
    description: "Your swing cuts through everyone it reaches",
    weaponSpriteIndex: 0,
    effect: { ...NO_EFFECT, attacksPassThroughEnemies: true }
  },
  brokenLuck: {
    name: "brokenLuck",
    displayName: "Broken Luck",
    origin: "failedTransaction",
    description: "You hit harder, you also get hurt more",
    weaponSpriteIndex: 1,
    effect: { ...NO_EFFECT, damageDealtMultiplier: 1.3, damageTakenMultiplier: 1.15 }
  },
  wildMask: {
    name: "wildMask",
    displayName: "Wild Mask",
    origin: "tokenMint",
    description: "Every fifth hit calls a helper to fight beside you",
    weaponSpriteIndex: 2,
    effect: { ...NO_EFFECT, spawnAllyEveryFifthHit: true }
  },
  warHelm: {
    name: "warHelm",
    displayName: "War Helm",
    origin: "highGasTransaction",
    description: "Rolling is free while you are above half health",
    weaponSpriteIndex: 3,
    effect: { ...NO_EFFECT, rollCostsNoStaminaAboveHalfHealth: true }
  },
  strongboxSeal: {
    name: "strongboxSeal",
    displayName: "Strongbox Seal",
    origin: "largeValueTransfer",
    description: "You enter every room with twenty armour",
    weaponSpriteIndex: 4,
    effect: { ...NO_EFFECT, shieldGrantedPerRoom: 20 }
  },
  secondChance: {
    name: "secondChance",
    displayName: "Second Chance",
    origin: "contractCreation",
    description: "The first time you fall, you get back up",
    weaponSpriteIndex: 5,
    effect: { ...NO_EFFECT, reviveOnceEachRun: true }
  },
  driftStone: {
    name: "driftStone",
    displayName: "Drift Stone",
    origin: "plainTransfer",
    description: "You move a little faster",
    weaponSpriteIndex: 6,
    effect: { ...NO_EFFECT, movementSpeedMultiplier: 1.12 }
  },
  ashShard: {
    name: "ashShard",
    displayName: "Ash Shard",
    origin: "burnTransfer",
    description: "Every enemy you kill gives back a little health",
    weaponSpriteIndex: 7,
    effect: { ...NO_EFFECT, healthRestoredPerKill: 3 }
  }
};
