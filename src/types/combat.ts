export interface ImpactFeedback {
  secondsOfHitStopRemaining: number;
  screenShakePixels: number;
}

export interface CombatParticle {
  horizontalPosition: number;
  verticalPosition: number;
  velocityHorizontal: number;
  velocityVertical: number;
  secondsRemaining: number;
  totalSeconds: number;
  colour: string;
  sizeInPixels: number;
}

export interface CombatOutcome {
  enemiesKilled: number;
  playerDied: boolean;
  roomWasCleared: boolean;
}
