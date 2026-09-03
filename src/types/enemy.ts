import type { AnimationPlayback } from "./spriteSheet";

export type EnemyName =
  | "skeleton"
  | "skeletonRogue"
  | "skeletonMage"
  | "skeletonWarrior"
  | "orc"
  | "orcRogue"
  | "orcShaman"
  | "orcWarrior"
  | "eliteKnight"
  | "eliteRogue"
  | "eliteWizard";

export type EnemyBehaviour =
  | "chasing"
  | "keepingDistance"
  | "windingUp"
  | "striking"
  | "charging"
  | "recovering";

export interface EnemyDefinition {
  name: EnemyName;
  maximumHealth: number;
  movementSpeed: number;
  contactDamage: number;
  collisionRadius: number;
  canCastProjectiles: boolean;
  canHealOtherEnemies: boolean;
}

export interface EnemyCharacter {
  definition: EnemyDefinition;
  horizontalPosition: number;
  verticalPosition: number;
  currentHealth: number;
  behaviour: EnemyBehaviour;
  animation: AnimationPlayback;
  secondsUntilBehaviourChanges: number;
  secondsRemainingFlashing: number;
  knockbackHorizontal: number;
  knockbackVertical: number;
  chargeVelocityHorizontal: number;
  chargeVelocityVertical: number;
  lastAttackIdentifierReceived: number;
  strikeHorizontal: number;
  strikeVertical: number;
  hasStrikeLanded: boolean;
}

export interface Projectile {
  horizontalPosition: number;
  verticalPosition: number;
  velocityHorizontal: number;
  velocityVertical: number;
  secondsRemaining: number;
  damage: number;
}
