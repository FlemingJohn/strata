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
  brickForge: {
    name: "brickForge",
    sheetPath: `${STATION_FOLDER}/Furnace/Bricks_02-Sheet.png`,
    regions: [
      { left: 6, top: 7, width: 36, height: 57 },
      { left: 54, top: 7, width: 36, height: 57 },
      { left: 6, top: 71, width: 36, height: 57 }
    ]
  },
  brickKiln: {
    name: "brickKiln",
    sheetPath: `${STATION_FOLDER}/Furnace/Bricks_01-Sheet.png`,
    regions: [
      { left: 1, top: 7, width: 30, height: 41 },
      { left: 33, top: 7, width: 30, height: 41 },
      { left: 1, top: 55, width: 30, height: 41 }
    ]
  },
  ironForge: {
    name: "ironForge",
    sheetPath: `${STATION_FOLDER}/Furnace/Iron_02-Sheet.png`,
    regions: [
      { left: 5, top: 5, width: 38, height: 59 },
      { left: 53, top: 5, width: 38, height: 59 },
      { left: 5, top: 69, width: 38, height: 59 }
    ]
  },
  stoneForge: {
    name: "stoneForge",
    sheetPath: `${STATION_FOLDER}/Furnace/Stone_02-Sheet.png`,
    regions: [
      { left: 4, top: 15, width: 37, height: 49 },
      { left: 52, top: 15, width: 37, height: 49 },
      { left: 4, top: 79, width: 37, height: 49 }
    ]
  },
  stoneChimney: {
    name: "stoneChimney",
    sheetPath: `${STATION_FOLDER}/Furnace/Stone_03-Sheet.png`,
    regions: [
      { left: 3, top: 2, width: 41, height: 62 },
      { left: 51, top: 2, width: 41, height: 62 },
      { left: 3, top: 66, width: 41, height: 62 }
    ]
  },
  smallAnvil: {
    name: "smallAnvil",
    sheetPath: `${STATION_FOLDER}/Anvil/Anvil_01-Sheet.png`,
    regions: [
      { left: 454, top: 23, width: 53, height: 48 },
      { left: 6, top: 183, width: 53, height: 48 },
      { left: 6, top: 263, width: 53, height: 48 }
    ]
  },
  greatAnvil: {
    name: "greatAnvil",
    sheetPath: `${STATION_FOLDER}/Anvil/Anvil_02-Sheet.png`,
    regions: [
      { left: 160, top: 258, width: 79, height: 58 },
      { left: 0, top: 178, width: 79, height: 58 },
      { left: 240, top: 18, width: 79, height: 58 }
    ]
  },
  millHouse: {
    name: "millHouse",
    sheetPath: `${STATION_FOLDER}/Sawmill/Level_2-Sheet.png`,
    regions: [
      { left: 560, top: 67, width: 72, height: 54 },
      { left: 0, top: 131, width: 72, height: 54 },
      { left: 80, top: 131, width: 72, height: 54 }
    ]
  },
  greatMill: {
    name: "greatMill",
    sheetPath: `${STATION_FOLDER}/Sawmill/Level_3-Sheet.png`,
    regions: [
      { left: 672, top: 1, width: 112, height: 75 },
      { left: 784, top: 1, width: 112, height: 75 },
      { left: 0, top: 81, width: 112, height: 75 }
    ]
  },
  alchemyBench: {
    name: "alchemyBench",
    sheetPath: `${STATION_FOLDER}/Alchemy/Alchemy_Table_01-Sheet.png`,
    regions: [
      { left: 0, top: 0, width: 64, height: 64 },
      { left: 64, top: 64, width: 64, height: 64 },
      { left: 128, top: 128, width: 64, height: 64 },
      { left: 0, top: 192, width: 64, height: 64 },
      { left: 64, top: 256, width: 64, height: 64 },
      { left: 128, top: 320, width: 64, height: 64 }
    ]
  },
  alchemyShelf: {
    name: "alchemyShelf",
    sheetPath: `${STATION_FOLDER}/Alchemy/Alchemy_Table_02-Sheet.png`,
    regions: [
      { left: 0, top: 0, width: 48, height: 64 },
      { left: 96, top: 64, width: 48, height: 64 },
      { left: 192, top: 128, width: 48, height: 64 },
      { left: 288, top: 192, width: 48, height: 64 }
    ]
  },
  alchemyVault: {
    name: "alchemyVault",
    sheetPath: `${STATION_FOLDER}/Alchemy/Alchemy_Table_03-Sheet.png`,
    regions: [
      { left: 0, top: 0, width: 80, height: 80 },
      { left: 80, top: 80, width: 80, height: 80 },
      { left: 160, top: 160, width: 80, height: 80 },
      { left: 240, top: 240, width: 80, height: 80 }
    ]
  },
  greatForge: {
    name: "greatForge",
    sheetPath: `${STATION_FOLDER}/Anvil/Anvil_03-Sheet.png`,
    regions: [
      { left: 0, top: 0, width: 128, height: 140 },
      { left: 256, top: 140, width: 128, height: 140 },
      { left: 512, top: 280, width: 128, height: 140 }
    ]
  },
  brickStack: {
    name: "brickStack",
    sheetPath: `${STATION_FOLDER}/Furnace/Bricks_03-Sheet.png`,
    regions: [
      { left: 0, top: 4, width: 48, height: 60 },
      { left: 48, top: 4, width: 48, height: 60 },
      { left: 0, top: 68, width: 48, height: 60 },
      { left: 48, top: 68, width: 48, height: 60 }
    ]
  },
  ironStack: {
    name: "ironStack",
    sheetPath: `${STATION_FOLDER}/Furnace/Iron_01-Sheet.png`,
    regions: [
      { left: 0, top: 3, width: 32, height: 45 },
      { left: 32, top: 3, width: 32, height: 45 },
      { left: 0, top: 51, width: 32, height: 45 },
      { left: 32, top: 51, width: 32, height: 45 }
    ]
  },
  ironTower: {
    name: "ironTower",
    sheetPath: `${STATION_FOLDER}/Furnace/Iron_03-Sheet.png`,
    regions: [
      { left: 0, top: 0, width: 48, height: 64 },
      { left: 48, top: 0, width: 48, height: 64 },
      { left: 0, top: 64, width: 48, height: 64 },
      { left: 48, top: 64, width: 48, height: 64 }
    ]
  },
  stoneStack: {
    name: "stoneStack",
    sheetPath: `${STATION_FOLDER}/Furnace/Stone_01-Sheet.png`,
    regions: [
      { left: 0, top: 10, width: 32, height: 38 },
      { left: 32, top: 10, width: 32, height: 38 },
      { left: 0, top: 58, width: 32, height: 38 },
      { left: 32, top: 58, width: 32, height: 38 }
    ]
  },
  millStump: {
    name: "millStump",
    sheetPath: `${STATION_FOLDER}/Sawmill/Level_1.png`,
    regions: [{ left: 0, top: 0, width: 32, height: 32 }]
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
  1: ["broadCanopy", "slenderCanopy", "towerCanopy", "brickStack"],
  2: ["brickKiln", "brickStack", "stoneStack", "smallAnvil"],
  3: ["anvil", "smallAnvil", "brickForge", "stoneStack", "ironStack"],
  4: ["anvil", "furnace", "greatAnvil", "stoneForge", "ironStack", "ironTower"]
};

export const FURNACE_LANDMARK_NAMES = [
  "furnace",
  "anvil",
  "ironForge",
  "stoneChimney",
  "greatAnvil",
  "greatForge",
  "ironTower"
];
export const CHANCE_A_ROOM_HOLDS_A_LANDMARK = 0.55;
export const LANDMARK_TOP_BAND_FRACTION = 0.42;
export const LANDMARK_OPACITY = 0.96;
