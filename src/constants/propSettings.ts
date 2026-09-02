const PROP_FOLDER = "/assets/pixelCrawler/Environment/Props/Static";

export interface PropRegion {
  left: number;
  top: number;
  width: number;
  height: number;
}

export const PROP_SHEET_PATHS: Record<string, string> = {
  rocks: `${PROP_FOLDER}/Rocks.png`,
  vegetation: `${PROP_FOLDER}/Vegetation.png`,
  dungeon: `${PROP_FOLDER}/Dungeon_Props.png`,
  esoteric: `${PROP_FOLDER}/Esoteric.png`,
  resources: `${PROP_FOLDER}/Resources.png`,
  farm: `${PROP_FOLDER}/Farm.png`,
  furniture: `${PROP_FOLDER}/Furniture.png`,
  tools: `${PROP_FOLDER}/Tools.png`,
  meat: `${PROP_FOLDER}/Meat.png`,
  pan: `${PROP_FOLDER}/Pan.png`
};

export const PROP_REGIONS: Record<string, PropRegion[]> = {
  rocks: [
    { left: 80, top: 17, width: 16, height: 14 },
    { left: 176, top: 17, width: 16, height: 14 },
    { left: 80, top: 113, width: 16, height: 14 },
    { left: 65, top: 19, width: 14, height: 11 },
    { left: 161, top: 19, width: 14, height: 11 },
    { left: 65, top: 115, width: 14, height: 11 },
    { left: 179, top: 289, width: 10, height: 15 },
    { left: 48, top: 51, width: 15, height: 10 }
  ],
  vegetation: [
    { left: 64, top: 187, width: 16, height: 21 },
    { left: 64, top: 235, width: 16, height: 21 },
    { left: 64, top: 144, width: 16, height: 16 },
    { left: 97, top: 177, width: 14, height: 15 },
    { left: 97, top: 225, width: 14, height: 15 },
    { left: 97, top: 273, width: 14, height: 15 },
    { left: 49, top: 338, width: 14, height: 14 },
    { left: 242, top: 133, width: 12, height: 11 }
  ],
  dungeon: [
    { left: 113, top: 2, width: 14, height: 20 },
    { left: 129, top: 2, width: 14, height: 20 },
    { left: 97, top: 1, width: 14, height: 21 },
    { left: 67, top: 70, width: 10, height: 21 },
    { left: 83, top: 70, width: 10, height: 21 },
    { left: 99, top: 70, width: 10, height: 21 }
  ],
  esoteric: [
    { left: 17, top: 169, width: 14, height: 18 },
    { left: 88, top: 19, width: 17, height: 13 },
    { left: 88, top: 35, width: 17, height: 13 },
    { left: 35, top: 91, width: 11, height: 21 },
    { left: 0, top: 162, width: 15, height: 12 },
    { left: 50, top: 113, width: 12, height: 14 },
    { left: 2, top: 91, width: 11, height: 21 },
    { left: 82, top: 52, width: 13, height: 12 }
  ],
  resources: [
    { left: 16, top: 156, width: 15, height: 20 },
    { left: 0, top: 157, width: 15, height: 19 },
    { left: 20, top: 97, width: 22, height: 13 },
    { left: 36, top: 0, width: 12, height: 16 },
    { left: 49, top: 17, width: 14, height: 11 },
    { left: 83, top: 20, width: 9, height: 10 }
  ],
  farm: [
    { left: 366, top: 79, width: 22, height: 20 },
    { left: 80, top: 46, width: 16, height: 18 },
    { left: 0, top: 16, width: 15, height: 16 },
    { left: 256, top: 16, width: 15, height: 16 },
    { left: 0, top: 48, width: 15, height: 16 },
    { left: 0, top: 80, width: 15, height: 16 },
    { left: 0, top: 112, width: 15, height: 16 },
    { left: 0, top: 144, width: 15, height: 16 }
  ],
  furniture: [
    { left: 132, top: 355, width: 24, height: 25 },
    { left: 101, top: 356, width: 22, height: 22 },
    { left: 114, top: 489, width: 12, height: 23 },
    { left: 769, top: 13, width: 14, height: 19 },
    { left: 785, top: 13, width: 14, height: 19 },
    { left: 162, top: 422, width: 12, height: 23 },
    { left: 112, top: 514, width: 16, height: 14 },
    { left: 770, top: 44, width: 12, height: 20 }
  ],
  tools: [
    { left: 148, top: 93, width: 26, height: 19 },
    { left: 150, top: 54, width: 20, height: 20 },
    { left: 150, top: 160, width: 20, height: 16 },
    { left: 0, top: 240, width: 16, height: 16 },
    { left: 0, top: 125, width: 16, height: 19 },
    { left: 151, top: 23, width: 18, height: 18 },
    { left: 146, top: 184, width: 11, height: 24 },
    { left: 0, top: 259, width: 16, height: 13 }
  ],
  meat: [
    { left: 64, top: 32, width: 16, height: 16 },
    { left: 32, top: 65, width: 23, height: 14 },
    { left: 32, top: 81, width: 16, height: 14 },
    { left: 34, top: 96, width: 13, height: 15 },
    { left: 19, top: 65, width: 12, height: 15 },
    { left: 65, top: 21, width: 14, height: 9 },
    { left: 18, top: 82, width: 13, height: 13 },
    { left: 1, top: 66, width: 14, height: 13 }
  ],
  pan: [
    { left: 33, top: 85, width: 20, height: 27 },
    { left: 113, top: 85, width: 20, height: 27 },
    { left: 64, top: 10, width: 16, height: 22 },
    { left: 144, top: 10, width: 16, height: 22 },
    { left: 64, top: 42, width: 16, height: 22 },
    { left: 144, top: 42, width: 16, height: 22 },
    { left: 7, top: 91, width: 18, height: 21 },
    { left: 87, top: 91, width: 18, height: 21 }
  ]
};

export const PROP_SHEETS_BY_STRATUM: Record<number, string[]> = {
  1: ["vegetation", "rocks", "farm"],
  2: ["resources", "rocks", "tools"],
  3: ["rocks", "dungeon", "furniture"],
  4: ["esoteric", "dungeon", "furniture"]
};

export const FURNACE_PROP_SHEETS = ["dungeon", "esoteric", "meat", "pan"];
export const PROPS_PER_ROOM_MINIMUM = 5;
export const PROPS_PER_ROOM_MAXIMUM = 12;
export const PROP_OPACITY = 0.95;
