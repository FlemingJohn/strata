import type { DyingEnemy } from "../types/dyingEnemy";
import type { EnemyName } from "../types/enemy";
import { ENEMY_ANIMATION_FRAMES_PER_SECOND } from "../constants/animationSettings";

export function createDyingEnemy(
  enemyName: EnemyName,
  horizontalPosition: number,
  verticalPosition: number
): DyingEnemy {
  return {
    enemyName,
    horizontalPosition,
    verticalPosition,
    secondsElapsed: 0,
    frameIndex: 0,
    secondsSinceFrameChange: 0,
    hasFinished: false
  };
}

export function updateDyingEnemies(
  dying: DyingEnemy[],
  frameCountFor: (enemyName: EnemyName) => number,
  secondsElapsed: number
): void {
  const secondsPerFrame = 1 / ENEMY_ANIMATION_FRAMES_PER_SECOND.dying;

  for (let index = dying.length - 1; index >= 0; index--) {
    const corpse = dying[index];
    corpse.secondsElapsed += secondsElapsed;
    corpse.secondsSinceFrameChange += secondsElapsed;

    if (corpse.secondsSinceFrameChange >= secondsPerFrame) {
      corpse.secondsSinceFrameChange -= secondsPerFrame;
      corpse.frameIndex += 1;

      if (corpse.frameIndex >= frameCountFor(corpse.enemyName) - 1) {
        corpse.frameIndex = frameCountFor(corpse.enemyName) - 1;
        corpse.hasFinished = true;
      }
    }
  }
}
