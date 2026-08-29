import type { EnemyName } from "./enemy";
import type { TileKind } from "./room";

export type RoomPurpose = "start" | "combat" | "relic" | "boss";

export interface RoomPosition {
  column: number;
  row: number;
}

export interface DungeonRoom {
  position: RoomPosition;
  purpose: RoomPurpose;
  hasBeenCleared: boolean;
  connectedNorth: boolean;
  connectedSouth: boolean;
  connectedEast: boolean;
  connectedWest: boolean;
  enemyNames: EnemyName[];
}

export interface FloorDescription {
  floorNumber: number;
  sourceBlockNumber: number;
  layoutSeed: string;
  roomCount: number;
  difficultyMultiplier: number;
  eliteCount: number;
  treasureTier: number;
  stratumNumber: number;
  blockBusyness: number;
}

export interface DungeonFloor {
  description: FloorDescription;
  rooms: DungeonRoom[];
  startPosition: RoomPosition;
  bossPosition: RoomPosition;
}

export interface RoomTileMap {
  columnCount: number;
  rowCount: number;
  tiles: TileKind[][];
}
