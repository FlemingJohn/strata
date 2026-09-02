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
  resources: `${PROP_FOLDER}/Resources.png`
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
  ]
};

export const PROP_SHEETS_BY_STRATUM: Record<number, string[]> = {
  1: ["vegetation", "rocks"],
  2: ["resources", "rocks"],
  3: ["rocks", "dungeon"],
  4: ["esoteric", "dungeon"]
};

export const FURNACE_PROP_SHEETS = ["dungeon", "esoteric"];
export const PROPS_PER_ROOM_MINIMUM = 5;
export const PROPS_PER_ROOM_MAXIMUM = 12;
export const PROP_OPACITY = 0.95;
