import type { Ember, FirePlacement } from "../types/fire";
import {
  EMBER_COOL_COLOUR,
  EMBER_HOT_COLOUR,
  EMBER_LIMIT,
  EMBER_RISE_SPEED,
  EMBER_SPAWN_CHANCE_PER_FRAME,
  FIRE_FRAME_WIDTH
} from "../constants/fireSettings";

export function drawFireSprites(
  context: CanvasRenderingContext2D,
  fireSheet: HTMLImageElement,
  secondFireSheet: HTMLImageElement,
  smokeSheet: HTMLImageElement,
  fires: FirePlacement[],
  animationFrameIndex: number
): void {
  const smokeFrames = Math.max(1, Math.round(smokeSheet.naturalWidth / FIRE_FRAME_WIDTH));

  fires.forEach((fire, index) => {
    const chosenFireSheet = index % 2 === 0 ? fireSheet : secondFireSheet;
    const fireFrames = Math.max(1, Math.round(chosenFireSheet.naturalWidth / FIRE_FRAME_WIDTH));
    const smokeFrame = (animationFrameIndex + index) % smokeFrames;
    context.globalAlpha = 0.5;
    context.drawImage(
      smokeSheet,
      smokeFrame * FIRE_FRAME_WIDTH,
      0,
      FIRE_FRAME_WIDTH,
      smokeSheet.naturalHeight,
      Math.round(fire.horizontalPosition - FIRE_FRAME_WIDTH / 2),
      Math.round(fire.verticalPosition - smokeSheet.naturalHeight - 16),
      FIRE_FRAME_WIDTH,
      smokeSheet.naturalHeight
    );
    context.globalAlpha = 1;

    const fireFrame = (animationFrameIndex + index * 2) % fireFrames;
    context.drawImage(
      chosenFireSheet,
      fireFrame * FIRE_FRAME_WIDTH,
      0,
      FIRE_FRAME_WIDTH,
      chosenFireSheet.naturalHeight,
      Math.round(fire.horizontalPosition - FIRE_FRAME_WIDTH / 2),
      Math.round(fire.verticalPosition - chosenFireSheet.naturalHeight),
      FIRE_FRAME_WIDTH,
      chosenFireSheet.naturalHeight
    );
  });
}

export function updateEmbers(
  embers: Ember[],
  fires: FirePlacement[],
  secondsElapsed: number
): void {
  if (fires.length > 0 && embers.length < EMBER_LIMIT && Math.random() < EMBER_SPAWN_CHANCE_PER_FRAME) {
    const source = fires[Math.floor(Math.random() * fires.length)];
    const life = 1 + Math.random() * 1.2;

    embers.push({
      horizontalPosition: source.horizontalPosition + (Math.random() * 14 - 7),
      verticalPosition: source.verticalPosition - 10,
      velocityHorizontal: Math.random() * 10 - 5,
      velocityVertical: -EMBER_RISE_SPEED - Math.random() * 18,
      secondsRemaining: life,
      totalSeconds: life
    });
  }

  for (let index = embers.length - 1; index >= 0; index--) {
    const ember = embers[index];
    ember.horizontalPosition += ember.velocityHorizontal * secondsElapsed;
    ember.verticalPosition += ember.velocityVertical * secondsElapsed;
    ember.velocityVertical += 3 * secondsElapsed;
    ember.secondsRemaining -= secondsElapsed;

    if (ember.secondsRemaining <= 0) {
      embers.splice(index, 1);
    }
  }
}

export function drawEmbers(context: CanvasRenderingContext2D, embers: Ember[]): void {
  for (const ember of embers) {
    const remaining = ember.secondsRemaining / ember.totalSeconds;
    context.globalAlpha = Math.max(0, remaining);
    context.fillStyle = remaining > 0.6 ? EMBER_HOT_COLOUR : EMBER_COOL_COLOUR;
    context.fillRect(
      Math.round(ember.horizontalPosition),
      Math.round(ember.verticalPosition),
      1,
      1
    );
  }

  context.globalAlpha = 1;
}
