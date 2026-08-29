import type { DustMote } from "../types/background";
import {
  BACKGROUND_SEED,
  DUST_FALL_SPEED_MAXIMUM,
  DUST_FALL_SPEED_MINIMUM,
  DUST_MOTE_COUNT,
  DUST_OPACITY_MAXIMUM,
  DUST_OPACITY_MINIMUM
} from "../constants/backgroundSettings";
import { createSeededRandom } from "./createSeededRandom";

export function createDustMotes(): DustMote[] {
  const nextRandomNumber = createSeededRandom(BACKGROUND_SEED + 104729);
  const motes: DustMote[] = [];

  for (let moteIndex = 0; moteIndex < DUST_MOTE_COUNT; moteIndex++) {
    const speedRange = DUST_FALL_SPEED_MAXIMUM - DUST_FALL_SPEED_MINIMUM;
    const opacityRange = DUST_OPACITY_MAXIMUM - DUST_OPACITY_MINIMUM;

    motes.push({
      horizontalRatio: nextRandomNumber(),
      verticalRatio: nextRandomNumber(),
      fallSpeedPixelsPerSecond: DUST_FALL_SPEED_MINIMUM + nextRandomNumber() * speedRange,
      sizeInPixels: nextRandomNumber() > 0.7 ? 2 : 1,
      opacity: DUST_OPACITY_MINIMUM + nextRandomNumber() * opacityRange
    });
  }

  return motes;
}
