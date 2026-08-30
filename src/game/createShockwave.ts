import type { Shockwave, ShockwaveOwner } from "../types/ability";
import { RING_THICKNESS_PIXELS } from "../constants/abilitySettings";

export function createShockwave(
  horizontalPosition: number,
  verticalPosition: number,
  maximumRadius: number,
  expandSeconds: number,
  damage: number,
  owner: ShockwaveOwner,
  colour: string
): Shockwave {
  return {
    horizontalPosition,
    verticalPosition,
    secondsElapsed: 0,
    expandSeconds,
    maximumRadius,
    damage,
    owner,
    colour,
    hasDealtDamage: false
  };
}

export function findShockwaveRadius(wave: Shockwave): number {
  const progress = Math.min(1, wave.secondsElapsed / wave.expandSeconds);
  return progress * wave.maximumRadius;
}

export function updateShockwaves(waves: Shockwave[], secondsElapsed: number): void {
  for (let index = waves.length - 1; index >= 0; index--) {
    waves[index].secondsElapsed += secondsElapsed;

    if (waves[index].secondsElapsed > waves[index].expandSeconds + 0.2) {
      waves.splice(index, 1);
    }
  }
}

export function drawShockwaves(
  context: CanvasRenderingContext2D,
  waves: Shockwave[]
): void {
  for (const wave of waves) {
    const progress = Math.min(1, wave.secondsElapsed / wave.expandSeconds);
    const radius = findShockwaveRadius(wave);

    context.globalAlpha = Math.max(0, 1 - progress);
    context.strokeStyle = wave.colour;
    context.lineWidth = RING_THICKNESS_PIXELS;
    context.beginPath();
    context.arc(wave.horizontalPosition, wave.verticalPosition, radius, 0, Math.PI * 2);
    context.stroke();

    context.globalAlpha = Math.max(0, 0.6 - progress);
    context.beginPath();
    context.arc(wave.horizontalPosition, wave.verticalPosition, radius * 0.7, 0, Math.PI * 2);
    context.stroke();
  }

  context.globalAlpha = 1;
}
