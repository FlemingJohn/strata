import type { AnimatedPropDefinition } from "../types/animatedProp";

const ANIMATED_PROP_FOLDER = "/assets/pixelCrawler/Environment/Props/Animated";

export const ANIMATED_PROP_DEFINITIONS: Record<string, AnimatedPropDefinition> = {
  simmeringPan: {
    name: "simmeringPan",
    sheetPath: `${ANIMATED_PROP_FOLDER}/Pan_01-Sheet.png`,
    frameSize: 32,
    frameCount: 4,
    framesPerSecond: 6
  },
  restingPan: {
    name: "restingPan",
    sheetPath: `${ANIMATED_PROP_FOLDER}/Pan_02-Sheet.png`,
    frameSize: 32,
    frameCount: 2,
    framesPerSecond: 3
  },
  boilingPan: {
    name: "boilingPan",
    sheetPath: `${ANIMATED_PROP_FOLDER}/Pan_03-Sheet.png`,
    frameSize: 32,
    frameCount: 12,
    framesPerSecond: 10
  },
  smokingPan: {
    name: "smokingPan",
    sheetPath: `${ANIMATED_PROP_FOLDER}/Pan_04-Sheet.png`,
    frameSize: 32,
    frameCount: 4,
    framesPerSecond: 5
  },
  steamingPan: {
    name: "steamingPan",
    sheetPath: `${ANIMATED_PROP_FOLDER}/Pan_05-Sheet.png`,
    frameSize: 32,
    frameCount: 8,
    framesPerSecond: 8
  }
};

export const ANIMATED_PROPS_PER_ROOM_MINIMUM = 1;
export const ANIMATED_PROPS_PER_ROOM_MAXIMUM = 3;
export const DISTANCE_ANIMATED_PROPS_KEEP_APART = 38;
export const CHANCE_A_ROOM_HOLDS_ANIMATED_PROPS = 0.5;
