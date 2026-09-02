import type { LandmarkDefinition } from "../types/landmark";

const STATION_FOLDER = "/assets/pixelCrawler/Environment/Structures/Stations";
const TREE_FOLDER = "/assets/pixelCrawler/Environment/Props/Static/Trees";

export const LANDMARK_DEFINITIONS: Record<string, LandmarkDefinition> = {
  anvil: {
    name: "anvil",
    sheetPath: `${STATION_FOLDER}/Anvil/Anvil.png`,
    regions: [
      { left: 176, top: 14, width: 96, height: 82 },
      { left: 80, top: 36, width: 79, height: 56 },
      { left: 6, top: 37, width: 53, height: 34 }
    ]
  },
  workbench: {
    name: "workbench",
    sheetPath: `${STATION_FOLDER}/Workbench/Workbench.png`,
    regions: [
      { left: 112, top: 115, width: 80, height: 61 },
      { left: 103, top: 64, width: 73, height: 48 },
      { left: 112, top: 294, width: 80, height: 58 },
      { left: 104, top: 246, width: 72, height: 42 }
    ]
  },
  furnace: {
    name: "furnace",
    sheetPath: `${STATION_FOLDER}/Furnace/Furnace.png`,
    regions: [
      { left: 115, top: 2, width: 41, height: 62 },
      { left: 115, top: 194, width: 41, height: 62 },
      { left: 53, top: 133, width: 38, height: 59 },
      { left: 53, top: 325, width: 38, height: 59 }
    ]
  },
  sawmill: {
    name: "sawmill",
    sheetPath: `${STATION_FOLDER}/Sawmill/Base.png`,
    regions: [
      { left: 48, top: 3, width: 72, height: 54 },
      { left: 48, top: 83, width: 72, height: 45 },
      { left: 0, top: 22, width: 31, height: 26 }
    ]
  },
  broadCanopy: {
    name: "broadCanopy",
    sheetPath: `${TREE_FOLDER}/Model_01/Size_04.png`,
    regions: [
      { left: 3, top: 2, width: 73, height: 126 },
      { left: 83, top: 2, width: 73, height: 126 },
      { left: 3, top: 130, width: 73, height: 126 },
      { left: 83, top: 130, width: 73, height: 126 }
    ]
  },
  slenderCanopy: {
    name: "slenderCanopy",
    sheetPath: `${TREE_FOLDER}/Model_02/Size_04.png`,
    regions: [
      { left: 4, top: 9, width: 54, height: 103 },
      { left: 68, top: 9, width: 54, height: 103 },
      { left: 4, top: 121, width: 54, height: 103 },
      { left: 68, top: 121, width: 54, height: 103 }
    ]
  },
  towerCanopy: {
    name: "towerCanopy",
    sheetPath: `${TREE_FOLDER}/Model_03/Size_03.png`,
    regions: [
      { left: 0, top: 1, width: 63, height: 143 },
      { left: 64, top: 1, width: 63, height: 143 },
      { left: 0, top: 145, width: 63, height: 143 },
      { left: 64, top: 145, width: 63, height: 143 }
    ]
  }
};

export const LANDMARK_NAMES_BY_STRATUM: Record<number, string[]> = {
  1: ["broadCanopy", "slenderCanopy", "towerCanopy"],
  2: ["sawmill", "workbench"],
  3: ["anvil", "workbench"],
  4: ["anvil", "furnace"]
};

export const FURNACE_LANDMARK_NAMES = ["furnace", "anvil"];
export const CHANCE_A_ROOM_HOLDS_A_LANDMARK = 0.55;
export const LANDMARK_TOP_BAND_FRACTION = 0.42;
export const LANDMARK_OPACITY = 0.96;
