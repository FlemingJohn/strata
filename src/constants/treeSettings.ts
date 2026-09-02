import type { PropRegion } from "./propSettings";

const TREE_FOLDER = "/assets/pixelCrawler/Environment/Props/Static/Trees";

export const TREE_SHEET_PATHS: Record<string, string> = {
  broadTrees: `${TREE_FOLDER}/Model_01/Size_02.png`,
  tallTrees: `${TREE_FOLDER}/Model_02/Size_03.png`
};

export const TREE_REGIONS: Record<string, PropRegion[]> = {
  broadTrees: [
    { left: 96, top: 66, width: 32, height: 62 },
    { left: 32, top: 2, width: 32, height: 62 },
    { left: 96, top: 2, width: 32, height: 62 },
    { left: 32, top: 66, width: 32, height: 62 },
    { left: 225, top: 18, width: 26, height: 46 },
    { left: 225, top: 82, width: 26, height: 46 },
    { left: 161, top: 17, width: 26, height: 47 },
    { left: 161, top: 82, width: 26, height: 46 }
  ],
  tallTrees: [
    { left: 4, top: 4, width: 37, height: 76 },
    { left: 52, top: 4, width: 37, height: 76 },
    { left: 4, top: 84, width: 37, height: 76 },
    { left: 52, top: 84, width: 37, height: 76 },
    { left: 99, top: 6, width: 40, height: 74 }
  ]
};

export const TREE_STRATUM_NUMBER = 1;
export const TREES_PER_ROOM_MINIMUM = 2;
export const TREES_PER_ROOM_MAXIMUM = 5;
export const DISTANCE_TREES_KEEP_APART = 46;
export const DISTANCE_TREES_KEEP_FROM_CENTRE = 62;
export const TREE_TRUNK_RADIUS_PIXELS = 5;
