import type { DungeonFloor, DungeonRoom, RoomPosition } from "../types/dungeon";
import type { FloorDescription } from "../types/dungeon";
import type { EnemyName } from "../types/enemy";
import {
  ENEMY_INCREASE_PER_FLOOR,
  FLOOR_GRID_COLUMNS,
  FLOOR_GRID_ROWS,
  MAXIMUM_ENEMIES_PER_ROOM,
  MINIMUM_ENEMIES_PER_ROOM
} from "../constants/dungeonSettings";
import { BOSS_NAME, ENEMY_NAMES_BY_STRATUM } from "../constants/enemySettings";
import { createSeededRandomFromHash } from "./createSeededRandomFromHash";

const STEP_DIRECTIONS = [
  { column: 0, row: -1 },
  { column: 0, row: 1 },
  { column: 1, row: 0 },
  { column: -1, row: 0 }
];

function positionKey(position: RoomPosition): string {
  return `${position.column},${position.row}`;
}

function isInsideGrid(position: RoomPosition): boolean {
  return (
    position.column >= 0 &&
    position.row >= 0 &&
    position.column < FLOOR_GRID_COLUMNS &&
    position.row < FLOOR_GRID_ROWS
  );
}

function distanceBetween(first: RoomPosition, second: RoomPosition): number {
  return Math.abs(first.column - second.column) + Math.abs(first.row - second.row);
}

function chooseEnemyNames(
  description: FloorDescription,
  nextRandomNumber: () => number
): EnemyName[] {
  const stratumKey = Math.min(4, Math.max(1, description.stratumNumber));
  const pool = ENEMY_NAMES_BY_STRATUM[stratumKey] ?? ENEMY_NAMES_BY_STRATUM[1];

  const desiredCount = Math.min(
    MAXIMUM_ENEMIES_PER_ROOM,
    Math.round(
      MINIMUM_ENEMIES_PER_ROOM + description.floorNumber * ENEMY_INCREASE_PER_FLOOR
    )
  );

  const chosen: EnemyName[] = [];

  for (let index = 0; index < desiredCount; index++) {
    chosen.push(pool[Math.floor(nextRandomNumber() * pool.length)]);
  }

  return chosen;
}

function walkRoomPositions(
  roomCount: number,
  nextRandomNumber: () => number
): RoomPosition[] {
  const startPosition: RoomPosition = {
    column: Math.floor(FLOOR_GRID_COLUMNS / 2),
    row: Math.floor(FLOOR_GRID_ROWS / 2)
  };

  const visited = new Map<string, RoomPosition>();
  visited.set(positionKey(startPosition), startPosition);

  let current = startPosition;
  let attempts = 0;

  while (visited.size < roomCount && attempts < roomCount * 40) {
    attempts++;

    const direction = STEP_DIRECTIONS[Math.floor(nextRandomNumber() * STEP_DIRECTIONS.length)];
    const candidate: RoomPosition = {
      column: current.column + direction.column,
      row: current.row + direction.row
    };

    if (!isInsideGrid(candidate)) {
      current = startPosition;
      continue;
    }

    visited.set(positionKey(candidate), candidate);
    current = candidate;
  }

  return Array.from(visited.values());
}

export function generateDungeonFloor(description: FloorDescription): DungeonFloor {
  const nextRandomNumber = createSeededRandomFromHash(description.layoutSeed);
  const positions = walkRoomPositions(description.roomCount, nextRandomNumber);
  const startPosition = positions[0];

  const bossPosition = positions.reduce((farthest, position) =>
    distanceBetween(position, startPosition) > distanceBetween(farthest, startPosition)
      ? position
      : farthest
  );

  const relicCandidates = positions.filter(
    (position) =>
      positionKey(position) !== positionKey(startPosition) &&
      positionKey(position) !== positionKey(bossPosition)
  );

  const relicPosition =
    relicCandidates.length > 0
      ? relicCandidates[Math.floor(nextRandomNumber() * relicCandidates.length)]
      : null;

  const occupied = new Set(positions.map(positionKey));

  const rooms: DungeonRoom[] = positions.map((position) => {
    const isStart = positionKey(position) === positionKey(startPosition);
    const isBoss = positionKey(position) === positionKey(bossPosition);
    const isRelic = relicPosition !== null && positionKey(position) === positionKey(relicPosition);

    const purpose = isStart ? "start" : isBoss ? "boss" : isRelic ? "relic" : "combat";

    const enemyNames = isStart || isRelic
      ? []
      : isBoss
        ? [BOSS_NAME]
        : chooseEnemyNames(description, nextRandomNumber);

    return {
      position,
      purpose,
      hasBeenCleared: isStart || isRelic,
      connectedNorth: occupied.has(`${position.column},${position.row - 1}`),
      connectedSouth: occupied.has(`${position.column},${position.row + 1}`),
      connectedEast: occupied.has(`${position.column + 1},${position.row}`),
      connectedWest: occupied.has(`${position.column - 1},${position.row}`),
      enemyNames
    };
  });

  return { description, rooms, startPosition, bossPosition };
}
