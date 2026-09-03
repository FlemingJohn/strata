import type { RoomTileMap } from "../types/dungeon";
import { nameTile } from "./blockRoomTiles";

function canStandOn(tileMap: RoomTileMap, column: number, row: number): boolean {
  if (column < 0 || row < 0 || column >= tileMap.columnCount || row >= tileMap.rowCount) {
    return false;
  }

  if (tileMap.tiles[row][column] === "wall") {
    return false;
  }

  return !tileMap.blockedTiles.has(nameTile(column, row));
}

function findReachableTiles(tileMap: RoomTileMap): Set<string> {
  const startColumn = Math.floor(tileMap.columnCount / 2);
  const startRow = Math.floor(tileMap.rowCount / 2);
  const reached = new Set<string>();

  if (!canStandOn(tileMap, startColumn, startRow)) {
    return reached;
  }

  const waiting = [{ column: startColumn, row: startRow }];
  reached.add(nameTile(startColumn, startRow));

  while (waiting.length > 0) {
    const spot = waiting.pop();

    if (!spot) {
      break;
    }

    const neighbours = [
      { column: spot.column + 1, row: spot.row },
      { column: spot.column - 1, row: spot.row },
      { column: spot.column, row: spot.row + 1 },
      { column: spot.column, row: spot.row - 1 }
    ];

    for (const neighbour of neighbours) {
      const name = nameTile(neighbour.column, neighbour.row);

      if (reached.has(name) || !canStandOn(tileMap, neighbour.column, neighbour.row)) {
        continue;
      }

      reached.add(name);
      waiting.push(neighbour);
    }
  }

  return reached;
}

function findDoorTiles(tileMap: RoomTileMap): { column: number; row: number }[] {
  const doors: { column: number; row: number }[] = [];

  for (let row = 0; row < tileMap.rowCount; row++) {
    for (let column = 0; column < tileMap.columnCount; column++) {
      if (tileMap.tiles[row][column] === "exit") {
        doors.push({ column, row });
      }
    }
  }

  return doors;
}

export function keepRoomWalkable(tileMap: RoomTileMap): boolean {
  if (tileMap.blockedTiles.size === 0) {
    return true;
  }

  const reached = findReachableTiles(tileMap);

  const isEveryDoorReachable = findDoorTiles(tileMap).every((door) => {
    const stepInside = {
      column: Math.min(tileMap.columnCount - 2, Math.max(1, door.column)),
      row: Math.min(tileMap.rowCount - 2, Math.max(1, door.row))
    };

    return reached.has(nameTile(stepInside.column, stepInside.row));
  });

  if (isEveryDoorReachable) {
    return true;
  }

  tileMap.blockedTiles.clear();
  return false;
}
