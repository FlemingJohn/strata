import type { EnemyName } from "./enemy";

export type TileKind = "floor" | "wall" | "cursed" | "exit" | "water";

export interface RoomLayout {
  columnCount: number;
  rowCount: number;
  tiles: TileKind[][];
  playerStartColumn: number;
  playerStartRow: number;
  exitColumn: number;
  exitRow: number;
}

export interface EnemySpawn {
  enemyName: EnemyName;
  horizontalPosition: number;
  verticalPosition: number;
}

export interface FloorDescription {
  floorNumber: number;
  sourceBlockNumber: number;
  roomCount: number;
  difficultyMultiplier: number;
  eliteCount: number;
  cursedTileCount: number;
  treasureTier: number;
  layoutSeed: string;
}
