import type { TileCoordinate } from "./areaThemes";

export const WATER_TILESET_PATH = "/assets/pixelCrawler/Environment/Tilesets/Water_tiles.png";

export const WATER_TILE_LEFT_COLUMN = 1;
export const WATER_TILE_MIDDLE_COLUMN = 2;
export const WATER_TILE_RIGHT_COLUMN = 3;
export const WATER_TILE_TOP_ROW = 6;
export const WATER_TILE_MIDDLE_ROW = 7;
export const WATER_TILE_BOTTOM_ROW = 8;

export const WATER_TILE_UNDER_SURFACE: TileCoordinate = {
  column: WATER_TILE_MIDDLE_COLUMN,
  row: WATER_TILE_MIDDLE_ROW
};

export const POOLS_PER_ROOM_MINIMUM = 1;
export const POOLS_PER_ROOM_MAXIMUM = 3;
export const POOL_WIDTH_MINIMUM = 2;
export const POOL_WIDTH_MAXIMUM = 5;
export const POOL_HEIGHT_MINIMUM = 2;
export const POOL_HEIGHT_MAXIMUM = 4;

export const CHANCE_A_ROOM_HOLDS_POOLS = 0.45;
export const SPEED_MULTIPLIER_IN_WATER = 0.55;
export const WATER_RIPPLE_SPEED = 1.8;
export const WATER_RIPPLE_OPACITY = 0.18;
