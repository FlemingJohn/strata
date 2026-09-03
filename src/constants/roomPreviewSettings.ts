import type { EnemyName } from "../types/enemy";

export interface PreviewSpot {
  column: number;
  row: number;
}

export interface PreviewEnemySpot extends PreviewSpot {
  name: EnemyName;
}

export const PREVIEW_COLUMNS = 21;
export const PREVIEW_ROWS = 10;
export const PREVIEW_SCALE = 3;
export const PREVIEW_FRAMES_PER_SECOND = 6;

export const PREVIEW_WATER = {
  leftColumn: 8,
  rightColumn: 13,
  topRow: 4,
  bottomRow: 7
};

export const PREVIEW_PILLARS: PreviewSpot[] = [
  { column: 3, row: 2 },
  { column: 17, row: 2 },
  { column: 3, row: 7 },
  { column: 17, row: 7 }
];

export const PREVIEW_PROP_SPOTS: PreviewSpot[] = [
  { column: 5, row: 3 },
  { column: 6, row: 3 },
  { column: 14, row: 6 },
  { column: 15, row: 6 }
];

export const PREVIEW_FIRE_SPOTS: PreviewSpot[] = [
  { column: 5, row: 1 },
  { column: 15, row: 1 }
];

export const PREVIEW_ENEMY_SPOTS: PreviewEnemySpot[] = [
  { column: 15, row: 2, name: "skeleton" },
  { column: 6, row: 7, name: "skeletonRogue" },
  { column: 16, row: 7, name: "skeletonMage" }
];

export const PREVIEW_HERO_COLUMN = 5;
export const PREVIEW_HERO_ROW = 5;
