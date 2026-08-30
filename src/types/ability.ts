export type ShockwaveOwner = "player" | "enemy";

export interface Shockwave {
  horizontalPosition: number;
  verticalPosition: number;
  secondsElapsed: number;
  expandSeconds: number;
  maximumRadius: number;
  damage: number;
  owner: ShockwaveOwner;
  colour: string;
  hasDealtDamage: boolean;
}

export interface AbilityState {
  secondsUntilReady: number;
  isCasting: boolean;
  secondsRemainingInCast: number;
}
