import type { CombatParticle } from "../types/combat";
import type { EnemyCharacter, Projectile } from "../types/enemy";
import type { EnemySpriteLibrary } from "./loadEnemySprites";
import type { DyingEnemy } from "../types/dyingEnemy";

const PROJECTILE_COLOUR = "#7FB4D8";
const TELEGRAPH_COLOUR = "#C4523A";

export function drawEnemies(
  context: CanvasRenderingContext2D,
  enemies: EnemyCharacter[],
  library: EnemySpriteLibrary,
  animationFrameIndex: number
): void {
  for (const enemy of enemies) {
    const spriteSet = library[enemy.definition.name];
    const sheet = enemy.behaviour === "recovering" ? spriteSet.standing : spriteSet.walking;
    const frameIndex = animationFrameIndex % sheet.frameCount;

    const left = Math.round(enemy.horizontalPosition - sheet.frameWidth / 2);
    const top = Math.round(enemy.verticalPosition - (sheet.frameHeight - 1));

    if (enemy.behaviour === "windingUp") {
      context.globalAlpha = 0.55;
      context.fillStyle = TELEGRAPH_COLOUR;
      context.fillRect(
        Math.round(enemy.horizontalPosition - 10),
        Math.round(enemy.verticalPosition + 2),
        20,
        2
      );
      context.globalAlpha = 1;
    }

    context.drawImage(
      sheet.image,
      frameIndex * sheet.frameWidth,
      0,
      sheet.frameWidth,
      sheet.frameHeight,
      left,
      top,
      sheet.frameWidth,
      sheet.frameHeight
    );

    if (enemy.secondsRemainingFlashing > 0) {
      context.globalAlpha = 0.75;
      context.globalCompositeOperation = "lighter";
      context.drawImage(
        sheet.image,
        frameIndex * sheet.frameWidth,
        0,
        sheet.frameWidth,
        sheet.frameHeight,
        left,
        top,
        sheet.frameWidth,
        sheet.frameHeight
      );
      context.globalCompositeOperation = "source-over";
      context.globalAlpha = 1;
    }
  }
}

export function drawProjectiles(
  context: CanvasRenderingContext2D,
  projectiles: Projectile[]
): void {
  context.fillStyle = PROJECTILE_COLOUR;

  for (const projectile of projectiles) {
    context.fillRect(
      Math.round(projectile.horizontalPosition - 2),
      Math.round(projectile.verticalPosition - 2),
      4,
      4
    );
  }
}

export function drawParticles(
  context: CanvasRenderingContext2D,
  particles: CombatParticle[]
): void {
  for (const particle of particles) {
    context.globalAlpha = Math.max(0, particle.secondsRemaining / particle.totalSeconds);
    context.fillStyle = particle.colour;
    context.fillRect(
      Math.round(particle.horizontalPosition),
      Math.round(particle.verticalPosition),
      particle.sizeInPixels,
      particle.sizeInPixels
    );
  }

  context.globalAlpha = 1;
}

export function drawDyingEnemies(
  context: CanvasRenderingContext2D,
  dying: DyingEnemy[],
  library: EnemySpriteLibrary
): void {
  for (const corpse of dying) {
    const sheet = library[corpse.enemyName].dying;
    const frameIndex = Math.min(corpse.frameIndex, sheet.frameCount - 1);

    context.drawImage(
      sheet.image,
      frameIndex * sheet.frameWidth,
      0,
      sheet.frameWidth,
      sheet.frameHeight,
      Math.round(corpse.horizontalPosition - sheet.frameWidth / 2),
      Math.round(corpse.verticalPosition - (sheet.frameHeight - 1)),
      sheet.frameWidth,
      sheet.frameHeight
    );
  }
}
