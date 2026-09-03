import type { CombatParticle } from "../types/combat";
import type { EnemyCharacter, Projectile } from "../types/enemy";
import type { EnemySpriteLibrary } from "./loadEnemySprites";
import type { DyingEnemy } from "../types/dyingEnemy";
import {
  STRIKE_REACH_PIXELS,
  STRIKE_WIND_UP_SECONDS
} from "../constants/enemySettings";

const PROJECTILE_COLOUR = "#7FB4D8";
const TELEGRAPH_COLOUR = "#C4523A";
const STRIKE_COLOUR = "#FFE7B0";
const MARKER_COLOUR = "#E0A233";

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
      const readiness = Math.max(
        0,
        Math.min(1, 1 - enemy.secondsUntilBehaviourChanges / STRIKE_WIND_UP_SECONDS)
      );
      const facing = Math.atan2(enemy.strikeVertical, enemy.strikeHorizontal);

      context.globalAlpha = 0.2 + readiness * 0.5;
      context.fillStyle = TELEGRAPH_COLOUR;
      context.beginPath();
      context.moveTo(enemy.horizontalPosition, enemy.verticalPosition - 6);
      context.arc(
        enemy.horizontalPosition,
        enemy.verticalPosition - 6,
        STRIKE_REACH_PIXELS + 6,
        facing - 0.6,
        facing + 0.6
      );
      context.closePath();
      context.fill();
      context.globalAlpha = 1;
    }

    if (enemy.behaviour === "striking") {
      const facing = Math.atan2(enemy.strikeVertical, enemy.strikeHorizontal);

      context.globalAlpha = 0.8;
      context.fillStyle = STRIKE_COLOUR;
      context.beginPath();
      context.moveTo(enemy.horizontalPosition, enemy.verticalPosition - 6);
      context.arc(
        enemy.horizontalPosition,
        enemy.verticalPosition - 6,
        STRIKE_REACH_PIXELS + 8,
        facing - 0.7,
        facing + 0.7
      );
      context.closePath();
      context.fill();
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

export function drawEnemyMarkers(
  context: CanvasRenderingContext2D,
  enemies: EnemyCharacter[],
  elapsedSeconds: number
): void {
  const bob = Math.round(Math.sin(elapsedSeconds * 5) * 2);

  for (const enemy of enemies) {
    const centre = Math.round(enemy.horizontalPosition);
    const top = Math.round(enemy.verticalPosition - 40) + bob;

    context.fillStyle = MARKER_COLOUR;
    context.beginPath();
    context.moveTo(centre - 5, top);
    context.lineTo(centre + 5, top);
    context.lineTo(centre, top + 6);
    context.closePath();
    context.fill();
  }
}
