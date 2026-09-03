import type { EnemyDefinition, EnemyName } from "../types/enemy";

export const ENEMY_DEFINITIONS: Record<EnemyName, EnemyDefinition> = {
  skeleton: {
    name: "skeleton",
    maximumHealth: 30,
    movementSpeed: 42,
    contactDamage: 10,
    collisionRadius: 6,
    canCastProjectiles: false,
    canHealOtherEnemies: false
  },
  skeletonRogue: {
    name: "skeletonRogue",
    maximumHealth: 22,
    movementSpeed: 68,
    contactDamage: 8,
    collisionRadius: 6,
    canCastProjectiles: false,
    canHealOtherEnemies: false
  },
  skeletonMage: {
    name: "skeletonMage",
    maximumHealth: 20,
    movementSpeed: 34,
    contactDamage: 6,
    collisionRadius: 6,
    canCastProjectiles: true,
    canHealOtherEnemies: false
  },
  skeletonWarrior: {
    name: "skeletonWarrior",
    maximumHealth: 55,
    movementSpeed: 30,
    contactDamage: 16,
    collisionRadius: 7,
    canCastProjectiles: false,
    canHealOtherEnemies: false
  },
  orc: {
    name: "orc",
    maximumHealth: 45,
    movementSpeed: 38,
    contactDamage: 14,
    collisionRadius: 7,
    canCastProjectiles: false,
    canHealOtherEnemies: false
  },
  orcRogue: {
    name: "orcRogue",
    maximumHealth: 30,
    movementSpeed: 74,
    contactDamage: 12,
    collisionRadius: 6,
    canCastProjectiles: false,
    canHealOtherEnemies: false
  },
  orcShaman: {
    name: "orcShaman",
    maximumHealth: 25,
    movementSpeed: 32,
    contactDamage: 6,
    collisionRadius: 6,
    canCastProjectiles: false,
    canHealOtherEnemies: true
  },
  orcWarrior: {
    name: "orcWarrior",
    maximumHealth: 140,
    movementSpeed: 26,
    contactDamage: 20,
    collisionRadius: 10,
    canCastProjectiles: false,
    canHealOtherEnemies: false
  },
  eliteKnight: {
    name: "eliteKnight",
    maximumHealth: 80,
    movementSpeed: 34,
    contactDamage: 18,
    collisionRadius: 8,
    canCastProjectiles: false,
    canHealOtherEnemies: false
  },
  eliteRogue: {
    name: "eliteRogue",
    maximumHealth: 46,
    movementSpeed: 88,
    contactDamage: 14,
    collisionRadius: 7,
    canCastProjectiles: false,
    canHealOtherEnemies: false
  },
  eliteWizard: {
    name: "eliteWizard",
    maximumHealth: 38,
    movementSpeed: 30,
    contactDamage: 10,
    collisionRadius: 7,
    canCastProjectiles: true,
    canHealOtherEnemies: false
  }
};

export const ENEMY_NAMES_BY_STRATUM: Record<number, EnemyName[]> = {
  1: ["skeleton", "skeleton", "skeletonRogue", "skeletonMage"],
  2: ["skeleton", "skeletonRogue", "skeletonMage", "skeletonWarrior", "orc"],
  3: ["orc", "orcRogue", "orcShaman", "skeletonWarrior"],
  4: ["orcWarrior", "orcShaman", "orcRogue", "skeletonWarrior", "orc"]
};

export const BOSS_NAME: EnemyName = "orcWarrior";

export const ELITE_NAMES_BY_STRATUM: Record<number, EnemyName[]> = {
  1: ["eliteRogue"],
  2: ["eliteRogue", "eliteKnight"],
  3: ["eliteKnight", "eliteWizard"],
  4: ["eliteKnight", "eliteWizard", "eliteRogue"]
};

export const PROJECTILE_SPEED_PIXELS_PER_SECOND = 78;
export const PROJECTILE_LIFETIME_SECONDS = 2.6;
export const PROJECTILE_DAMAGE = 8;
export const SECONDS_BETWEEN_PROJECTILES = 1.5;

export const DISTANCE_MAGE_KEEPS_FROM_PLAYER = 90;

export const STRIKE_REACH_PIXELS = 15;
export const STRIKE_WIND_UP_SECONDS = 0.42;
export const STRIKE_ACTIVE_SECONDS = 0.16;
export const STRIKE_RECOVERY_SECONDS = 0.5;
export const STRIKE_LUNGE_PIXELS = 9;
export const STRIKE_DAMAGE_MULTIPLIER = 1.6;
export const SECONDS_STUCK_BEFORE_GIVING_UP = 6;
export const CHARGE_WIND_UP_SECONDS = 0.9;
export const CHARGE_DURATION_SECONDS = 0.65;
export const CHARGE_RECOVERY_SECONDS = 0.85;
export const CHARGE_SPEED_PIXELS_PER_SECOND = 205;
export const DAMAGE_MULTIPLIER_WHILE_RECOVERING = 2;
