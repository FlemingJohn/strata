export interface TileCoordinate {
  column: number;
  row: number;
}

export interface AreaTheme {
  name: string;
  floorSheet: "floors" | "dungeon";
  wallSheet: "walls" | "wallVariations" | "interiorWalls";
  floorTiles: TileCoordinate[];
  wallTiles: TileCoordinate[];
  hasFires: boolean;
  lightColour: string;
}

const GRASS_FLOOR: TileCoordinate[] = [
  { column: 1, row: 10 },
  { column: 2, row: 10 },
  { column: 3, row: 10 },
  { column: 1, row: 11 },
  { column: 2, row: 11 },
  { column: 3, row: 11 }
];

const SAND_FLOOR: TileCoordinate[] = [
  { column: 7, row: 13 },
  { column: 6, row: 14 },
  { column: 7, row: 14 },
  { column: 8, row: 14 },
  { column: 7, row: 15 },
  { column: 7, row: 18 }
];

const ICE_FLOOR: TileCoordinate[] = [
  { column: 2, row: 13 },
  { column: 1, row: 14 },
  { column: 2, row: 14 },
  { column: 3, row: 14 },
  { column: 2, row: 15 },
  { column: 2, row: 18 }
];

const STONE_FLOOR: TileCoordinate[] = [
  { column: 16, row: 0 },
  { column: 17, row: 0 },
  { column: 18, row: 0 },
  { column: 15, row: 1 },
  { column: 16, row: 1 },
  { column: 17, row: 1 }
];

const FURNACE_FLOOR: TileCoordinate[] = [
  { column: 0, row: 0 },
  { column: 1, row: 0 },
  { column: 2, row: 0 },
  { column: 3, row: 0 },
  { column: 0, row: 1 },
  { column: 2, row: 1 }
];

const TIMBER_WALL: TileCoordinate[] = [
  { column: 2, row: 1 },
  { column: 3, row: 1 },
  { column: 1, row: 2 },
  { column: 2, row: 2 },
  { column: 3, row: 2 },
  { column: 4, row: 2 }
];

const BROWN_VARIATION_WALL: TileCoordinate[] = [
  { column: 1, row: 0 },
  { column: 2, row: 0 },
  { column: 3, row: 0 },
  { column: 1, row: 1 },
  { column: 3, row: 1 },
  { column: 1, row: 2 }
];

const SLATE_VARIATION_WALL: TileCoordinate[] = [
  { column: 1, row: 10 },
  { column: 2, row: 10 },
  { column: 3, row: 10 },
  { column: 1, row: 11 },
  { column: 3, row: 11 },
  { column: 1, row: 12 }
];

const EARTH_VARIATION_WALL: TileCoordinate[] = [
  { column: 1, row: 20 },
  { column: 2, row: 20 },
  { column: 3, row: 20 },
  { column: 1, row: 21 },
  { column: 3, row: 21 },
  { column: 1, row: 22 }
];

const GOLDEN_TIMBER_WALL: TileCoordinate[] = [
  { column: 1, row: 21 },
  { column: 2, row: 21 },
  { column: 3, row: 21 },
  { column: 1, row: 22 },
  { column: 2, row: 22 },
  { column: 3, row: 22 }
];

const GREY_STONE_WALL: TileCoordinate[] = [
  { column: 6, row: 21 },
  { column: 7, row: 21 },
  { column: 8, row: 21 },
  { column: 6, row: 22 },
  { column: 7, row: 22 },
  { column: 8, row: 22 }
];

export const AREA_THEME_BY_STRATUM: Record<number, AreaTheme> = {
  1: {
    name: "Surface",
    floorSheet: "floors",
    wallSheet: "walls",
    floorTiles: GRASS_FLOOR,
    wallTiles: TIMBER_WALL,
    hasFires: false,
    lightColour: "#FFE7B0"
  },
  2: {
    name: "The Boom",
    floorSheet: "floors",
    wallSheet: "wallVariations",
    floorTiles: SAND_FLOOR,
    wallTiles: BROWN_VARIATION_WALL,
    hasFires: false,
    lightColour: "#FFD9A0"
  },
  3: {
    name: "The Winter",
    floorSheet: "floors",
    wallSheet: "wallVariations",
    floorTiles: ICE_FLOOR,
    wallTiles: SLATE_VARIATION_WALL,
    hasFires: false,
    lightColour: "#CFE4FF"
  },
  4: {
    name: "Bedrock",
    floorSheet: "floors",
    wallSheet: "wallVariations",
    floorTiles: STONE_FLOOR,
    wallTiles: EARTH_VARIATION_WALL,
    hasFires: false,
    lightColour: "#FFD9A0"
  }
};

export const VAULT_THEME: AreaTheme = {
  name: "The Vault",
  floorSheet: "dungeon",
  wallSheet: "interiorWalls",
  floorTiles: FURNACE_FLOOR,
  wallTiles: GOLDEN_TIMBER_WALL,
  hasFires: false,
  lightColour: "#BFD8FF"
};

export const FURNACE_THEME: AreaTheme = {
  name: "The Furnace",
  floorSheet: "dungeon",
  wallSheet: "interiorWalls",
  floorTiles: FURNACE_FLOOR,
  wallTiles: GREY_STONE_WALL,
  hasFires: true,
  lightColour: "#FF8C32"
};

export function findAreaTheme(stratumNumber: number, roomPurpose: string): AreaTheme {
  if (roomPurpose === "boss") {
    return FURNACE_THEME;
  }

  if (roomPurpose === "relic") {
    return VAULT_THEME;
  }

  return AREA_THEME_BY_STRATUM[stratumNumber] ?? AREA_THEME_BY_STRATUM[4];
}
