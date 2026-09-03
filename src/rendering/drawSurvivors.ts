import type { Survivor, SurvivorSpriteLibrary } from "../types/survivor";
import {
  SURVIVOR_FRAMES_PER_SECOND,
  SURVIVOR_GROUND_OFFSET_PIXELS
} from "../constants/survivorSettings";

export function drawSurvivors(
  context: CanvasRenderingContext2D,
  survivors: Survivor[],
  sprites: SurvivorSpriteLibrary,
  elapsedSeconds: number
): void {
  for (const survivor of survivors) {
    const set = sprites[survivor.name];
    const sheet = survivor.isWalking ? set.walking : set.standing;
    const frameIndex = Math.floor(elapsedSeconds * SURVIVOR_FRAMES_PER_SECOND) % sheet.frameCount;
    const left = Math.round(survivor.horizontalPosition - sheet.frameWidth / 2);
    const top = Math.round(survivor.verticalPosition - SURVIVOR_GROUND_OFFSET_PIXELS);

    context.save();

    if (survivor.isFacingLeft) {
      context.translate(left + sheet.frameWidth, top);
      context.scale(-1, 1);
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
    } else {
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
    }

    context.restore();
  }
}
