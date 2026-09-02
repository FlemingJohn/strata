import type { Survivor, SurvivorSpriteLibrary } from "../types/survivor";
import {
  SURVIVOR_FRAMES_PER_SECOND,
  SURVIVOR_GROUND_OFFSET_PIXELS,
  SURVIVOR_LABELS,
  SURVIVOR_PROMPT_RISE_PIXELS
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

export function drawSurvivorPrompt(
  context: CanvasRenderingContext2D,
  survivor: Survivor
): void {
  const text = `F  ${SURVIVOR_LABELS[survivor.name]}`;
  const top = survivor.verticalPosition - SURVIVOR_PROMPT_RISE_PIXELS;

  context.font = "6px 'Silkscreen', monospace";
  context.textAlign = "center";
  context.textBaseline = "middle";

  const width = context.measureText(text).width + 8;

  context.fillStyle = "rgba(14, 10, 8, 0.82)";
  context.fillRect(Math.round(survivor.horizontalPosition - width / 2), Math.round(top - 6), width, 12);
  context.fillStyle = survivor.hasSpoken ? "#9C8C7A" : "#BFD8FF";
  context.fillText(text, Math.round(survivor.horizontalPosition), Math.round(top));
  context.textAlign = "left";
  context.textBaseline = "alphabetic";
}
