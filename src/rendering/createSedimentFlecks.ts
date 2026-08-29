import type { SedimentFleck } from "../types/background";
import {
  BACKGROUND_SEED,
  FLECKS_PER_BAND,
  FLECK_MAXIMUM_SIZE_PIXELS
} from "../constants/backgroundSettings";
import { createSeededRandom } from "./createSeededRandom";

export function createSedimentFlecks(bandCount: number): SedimentFleck[][] {
  const flecksByBand: SedimentFleck[][] = [];

  for (let bandIndex = 0; bandIndex < bandCount; bandIndex++) {
    const nextRandomNumber = createSeededRandom(BACKGROUND_SEED + bandIndex * 7919);
    const flecks: SedimentFleck[] = [];

    for (let fleckIndex = 0; fleckIndex < FLECKS_PER_BAND; fleckIndex++) {
      flecks.push({
        horizontalRatio: nextRandomNumber(),
        verticalRatio: nextRandomNumber(),
        sizeInPixels: 1 + Math.floor(nextRandomNumber() * FLECK_MAXIMUM_SIZE_PIXELS)
      });
    }

    flecksByBand.push(flecks);
  }

  return flecksByBand;
}
