import type { EnemyName } from "./enemy";

export interface DyingEnemy {
  enemyName: EnemyName;
  horizontalPosition: number;
  verticalPosition: number;
  secondsElapsed: number;
  frameIndex: number;
  secondsSinceFrameChange: number;
  hasFinished: boolean;
}
