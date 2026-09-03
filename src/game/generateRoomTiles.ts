import type { DungeonRoom, RoomTileMap } from "../types/dungeon";
import type { TileKind } from "../types/room";
import {
  OBSTACLE_BLOCKS_MAXIMUM,
  OBSTACLE_BLOCKS_MINIMUM,
  ROOM_TILE_COLUMNS,
  ROOM_TILE_ROWS
} from "../constants/dungeonSettings";
import { createSeededRandomFromHash } from "./createSeededRandomFromHash";
import { pourWaterPools } from "./pourWaterPools";

const DOOR_HALF_WIDTH = 1;

function createEmptyRoom(): TileKind[][] {
  const tiles: TileKind[][] = [];

  for (let row = 0; row < ROOM_TILE_ROWS; row++) {
    tiles[row] = [];

    for (let column = 0; column < ROOM_TILE_COLUMNS; column++) {
      const isEdge =
        row === 0 ||
        column === 0 ||
        row === ROOM_TILE_ROWS - 1 ||
        column === ROOM_TILE_COLUMNS - 1;

      tiles[row][column] = isEdge ? "wall" : "floor";
    }
  }

  return tiles;
}

function isNearCentre(column: number, row: number): boolean {
  return (
    Math.abs(column - ROOM_TILE_COLUMNS / 2) < 3 && Math.abs(row - ROOM_TILE_ROWS / 2) < 3
  );
}

function addObstacles(tiles: TileKind[][], nextRandomNumber: () => number): void {
  const blockCount =
    OBSTACLE_BLOCKS_MINIMUM +
    Math.floor(nextRandomNumber() * (OBSTACLE_BLOCKS_MAXIMUM - OBSTACLE_BLOCKS_MINIMUM + 1));

  for (let blockIndex = 0; blockIndex < blockCount; blockIndex++) {
    const startColumn = 2 + Math.floor(nextRandomNumber() * (ROOM_TILE_COLUMNS - 6));
    const startRow = 2 + Math.floor(nextRandomNumber() * (ROOM_TILE_ROWS - 6));
    const width = 1 + Math.floor(nextRandomNumber() * 3);
    const height = 1 + Math.floor(nextRandomNumber() * 2);

    for (let row = startRow; row < startRow + height; row++) {
      for (let column = startColumn; column < startColumn + width; column++) {
        if (isNearCentre(column, row)) {
          continue;
        }

        if (tiles[row] && tiles[row][column] === "floor") {
          tiles[row][column] = "wall";
        }
      }
    }
  }
}

function carveDoors(tiles: TileKind[][], room: DungeonRoom): void {
  const middleColumn = Math.floor(ROOM_TILE_COLUMNS / 2);
  const middleRow = Math.floor(ROOM_TILE_ROWS / 2);

  for (let offset = -DOOR_HALF_WIDTH; offset <= DOOR_HALF_WIDTH; offset++) {
    if (room.connectedNorth) {
      tiles[0][middleColumn + offset] = "exit";
    }

    if (room.connectedSouth) {
      tiles[ROOM_TILE_ROWS - 1][middleColumn + offset] = "exit";
    }

    if (room.connectedWest) {
      tiles[middleRow + offset][0] = "exit";
    }

    if (room.connectedEast) {
      tiles[middleRow + offset][ROOM_TILE_COLUMNS - 1] = "exit";
    }
  }
}

export function generateRoomTiles(room: DungeonRoom, layoutSeed: string): RoomTileMap {
  const roomSeed = `${layoutSeed}:${room.position.column}:${room.position.row}`;
  const nextRandomNumber = createSeededRandomFromHash(roomSeed);
  const tiles = createEmptyRoom();

  if (room.purpose === "combat") {
    addObstacles(tiles, nextRandomNumber);
  }

  if (room.purpose !== "boss") {
    pourWaterPools(tiles, nextRandomNumber);
  }

  carveDoors(tiles, room);

  return {
    columnCount: ROOM_TILE_COLUMNS,
    rowCount: ROOM_TILE_ROWS,
    tiles,
    blockedTiles: new Set<string>()
  };
}
