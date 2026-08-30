import type { DungeonFloor, DungeonRoom, RoomTileMap } from "../types/dungeon";
import type { PlayerCharacter } from "../types/player";
import { TILE_SIZE } from "../constants/tilesetSettings";

export type ExitDirection = "north" | "south" | "east" | "west";

const OPPOSITE_ENTRY_INSET_TILES = 2;

export function findExitBeingUsed(
  player: PlayerCharacter,
  tileMap: RoomTileMap
): ExitDirection | null {
  const column = Math.floor(player.horizontalPosition / TILE_SIZE);
  const row = Math.floor(player.verticalPosition / TILE_SIZE);

  if (column < 0 || row < 0 || column >= tileMap.columnCount || row >= tileMap.rowCount) {
    return null;
  }

  if (tileMap.tiles[row][column] !== "exit") {
    return null;
  }

  if (row === 0) {
    return "north";
  }

  if (row === tileMap.rowCount - 1) {
    return "south";
  }

  if (column === 0) {
    return "west";
  }

  if (column === tileMap.columnCount - 1) {
    return "east";
  }

  return null;
}

export function findRoomInDirection(
  floor: DungeonFloor,
  fromRoom: DungeonRoom,
  direction: ExitDirection
): DungeonRoom | null {
  const columnStep = direction === "east" ? 1 : direction === "west" ? -1 : 0;
  const rowStep = direction === "south" ? 1 : direction === "north" ? -1 : 0;

  const targetColumn = fromRoom.position.column + columnStep;
  const targetRow = fromRoom.position.row + rowStep;

  return (
    floor.rooms.find(
      (room) => room.position.column === targetColumn && room.position.row === targetRow
    ) ?? null
  );
}

export function placePlayerAtOppositeDoor(
  player: PlayerCharacter,
  tileMap: RoomTileMap,
  direction: ExitDirection
): void {
  const middleHorizontal = (tileMap.columnCount * TILE_SIZE) / 2;
  const middleVertical = (tileMap.rowCount * TILE_SIZE) / 2;
  const inset = OPPOSITE_ENTRY_INSET_TILES * TILE_SIZE;

  if (direction === "north") {
    player.horizontalPosition = middleHorizontal;
    player.verticalPosition = tileMap.rowCount * TILE_SIZE - inset;
    player.facing = "up";
    return;
  }

  if (direction === "south") {
    player.horizontalPosition = middleHorizontal;
    player.verticalPosition = inset;
    player.facing = "down";
    return;
  }

  if (direction === "west") {
    player.horizontalPosition = tileMap.columnCount * TILE_SIZE - inset;
    player.verticalPosition = middleVertical;
    player.facing = "left";
    return;
  }

  player.horizontalPosition = inset;
  player.verticalPosition = middleVertical;
  player.facing = "right";
}
