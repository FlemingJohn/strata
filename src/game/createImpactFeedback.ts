import type { CombatParticle, ImpactFeedback } from "../types/combat";
import {
  SCREEN_SHAKE_DECAY_PER_SECOND,
  SCREEN_SHAKE_PIXELS_ON_HIT,
  SCREEN_SHAKE_PIXELS_ON_KILL,
  HIT_STOP_SECONDS_ON_HIT,
  HIT_STOP_SECONDS_ON_KILL
} from "../constants/animationSettings";

export function createImpactFeedback(): ImpactFeedback {
  return { secondsOfHitStopRemaining: 0, screenShakePixels: 0 };
}

export function recordHit(feedback: ImpactFeedback, respectsReducedMotion: boolean): void {
  feedback.secondsOfHitStopRemaining = Math.max(
    feedback.secondsOfHitStopRemaining,
    HIT_STOP_SECONDS_ON_HIT
  );

  if (!respectsReducedMotion) {
    feedback.screenShakePixels = Math.max(
      feedback.screenShakePixels,
      SCREEN_SHAKE_PIXELS_ON_HIT
    );
  }
}

export function recordKill(feedback: ImpactFeedback, respectsReducedMotion: boolean): void {
  feedback.secondsOfHitStopRemaining = Math.max(
    feedback.secondsOfHitStopRemaining,
    HIT_STOP_SECONDS_ON_KILL
  );

  if (!respectsReducedMotion) {
    feedback.screenShakePixels = Math.max(
      feedback.screenShakePixels,
      SCREEN_SHAKE_PIXELS_ON_KILL
    );
  }
}

export function decayImpactFeedback(feedback: ImpactFeedback, secondsElapsed: number): void {
  feedback.screenShakePixels = Math.max(
    0,
    feedback.screenShakePixels - SCREEN_SHAKE_DECAY_PER_SECOND * secondsElapsed
  );
}

export function burstParticles(
  particles: CombatParticle[],
  horizontalPosition: number,
  verticalPosition: number,
  count: number,
  colour: string,
  speed: number
): void {
  for (let index = 0; index < count; index++) {
    const angle = Math.random() * Math.PI * 2;
    const chosenSpeed = speed * (0.35 + Math.random() * 0.9);
    const life = 0.22 + Math.random() * 0.32;

    particles.push({
      horizontalPosition,
      verticalPosition,
      velocityHorizontal: Math.cos(angle) * chosenSpeed,
      velocityVertical: Math.sin(angle) * chosenSpeed,
      secondsRemaining: life,
      totalSeconds: life,
      colour,
      sizeInPixels: Math.random() < 0.4 ? 2 : 1
    });
  }
}

export function updateParticles(particles: CombatParticle[], secondsElapsed: number): void {
  for (let index = particles.length - 1; index >= 0; index--) {
    const particle = particles[index];
    particle.horizontalPosition += particle.velocityHorizontal * secondsElapsed;
    particle.verticalPosition += particle.velocityVertical * secondsElapsed;
    particle.velocityHorizontal *= 0.9;
    particle.velocityVertical *= 0.9;
    particle.secondsRemaining -= secondsElapsed;

    if (particle.secondsRemaining <= 0) {
      particles.splice(index, 1);
    }
  }
}
