import type { Ally } from "../types/ally";
import type { EnemySpriteLibrary } from "./loadEnemySprites";
import { ALLY_ENEMY_NAME, ALLY_TINT_COLOUR } from "../constants/relicPowerSettings";

export function drawAllies(
  context: CanvasRenderingContext2D,
  allies: Ally[],
  sprites: EnemySpriteLibrary,
  animationFrameIndex: number
): void {
  const sheet = sprites[ALLY_ENEMY_NAME].walking;

  for (const ally of allies) {
    const frameIndex = animationFrameIndex % sheet.frameCount;
    const left = Math.round(ally.horizontalPosition - sheet.frameWidth / 2);
    const top = Math.round(ally.verticalPosition - (sheet.frameHeight - 1));
    const isFading = ally.secondsRemaining < 3 && Math.floor(ally.secondsRemaining * 8) % 2 === 0;

    if (isFading) {
      continue;
    }

    context.save();
    context.translate(left + (ally.isFacingLeft ? sheet.frameWidth : 0), top);
    context.scale(ally.isFacingLeft ? -1 : 1, 1);
    context.drawImage(
      sheet.image,
      frameIndex * sheet.frameWidth,
      0,
      sheet.frameWidth,
      sheet.frameHeight,
      0,
      0,
      sheet.frameWidth,
      sheet.frameHeight
    );
    context.globalCompositeOperation = "source-atop";
    context.globalAlpha = 0.45;
    context.fillStyle = ALLY_TINT_COLOUR;
    context.fillRect(0, 0, sheet.frameWidth, sheet.frameHeight);
    context.restore();
  }
}
