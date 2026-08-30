export interface TileCoordinate {
  column: number;
  row: number;
}

export interface AreaTheme {
  name: string;
  floorSheet: "floors" | "dungeon";
  wallSheet: "walls";
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

const WARM_BROWN_WALL: TileCoordinate[] = [
  { column: 4, row: 5 },
  { column: 1, row: 6 },
  { column: 2, row: 6 },
  { column: 3, row: 6 },
  { column: 1, row: 7 },
  { column: 3, row: 7 }
];

const BLUE_GREY_WALL: TileCoordinate[] = [
  { column: 8, row: 1 },
  { column: 9, row: 1 },
  { column: 7, row: 2 },
  { column: 8, row: 2 },
  { column: 9, row: 2 },
  { column: 10, row: 2 }
];

const NEAR_BLACK_WALL: TileCoordinate[] = [
  { column: 13, row: 6 },
  { column: 14, row: 6 },
  { column: 15, row: 6 },
  { column: 16, row: 6 },
  { column: 13, row: 7 },
  { column: 14, row: 7 }
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
    wallSheet: "walls",
    floorTiles: SAND_FLOOR,
    wallTiles: WARM_BROWN_WALL,
    hasFires: false,
    lightColour: "#FFD9A0"
  },
  3: {
    name: "The Winter",
    floorSheet: "floors",
    wallSheet: "walls",
    floorTiles: ICE_FLOOR,
    wallTiles: BLUE_GREY_WALL,
    hasFires: false,
    lightColour: "#CFE4FF"
  },
  4: {
    name: "Bedrock",
    floorSheet: "floors",
    wallSheet: "walls",
    floorTiles: STONE_FLOOR,
    wallTiles: NEAR_BLACK_WALL,
    hasFires: false,
    lightColour: "#FFD9A0"
  }
};

export const FURNACE_THEME: AreaTheme = {
  name: "The Furnace",
  floorSheet: "dungeon",
  wallSheet: "walls",
  floorTiles: FURNACE_FLOOR,
  wallTiles: NEAR_BLACK_WALL,
  hasFires: true,
  lightColour: "#FF8C32"
};

export function findAreaTheme(stratumNumber: number, isBossRoom: boolean): AreaTheme {
  if (isBossRoom) {
    return FURNACE_THEME;
  }

  return AREA_THEME_BY_STRATUM[stratumNumber] ?? AREA_THEME_BY_STRATUM[4];
}
