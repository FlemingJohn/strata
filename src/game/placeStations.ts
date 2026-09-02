import type { PlacedStation, StationKind } from "../types/station";
import type { RoomPurpose } from "../types/dungeon";
import type { RoomTileMap } from "../types/dungeon";
import {
  CHANCE_A_COMBAT_ROOM_HOLDS_A_STATION,
  STATION_DEFINITIONS,
  STATION_KINDS_BY_ROOM_PURPOSE
} from "../constants/stationSettings";
import { TILE_SIZE } from "../constants/tilesetSettings";
import { collidesWithWall } from "./movePlayerThroughRoom";
import { findTileKindAt } from "./findTileKindAt";

function findStationCount(purpose: RoomPurpose, nextRandomNumber: () => number): number {
  if (purpose === "start" || purpose === "relic") {
    return 1;
  }

  if (purpose === "boss") {
    return 0;
  }

  return nextRandomNumber() < CHANCE_A_COMBAT_ROOM_HOLDS_A_STATION ? 1 : 0;
}

export function placeStations(
  tileMap: RoomTileMap,
  purpose: RoomPurpose,
  nextRandomNumber: () => number
): PlacedStation[] {
  const stationCount = findStationCount(purpose, nextRandomNumber);

  if (stationCount === 0) {
    return [];
  }

  const choices: StationKind[] = STATION_KINDS_BY_ROOM_PURPOSE[purpose] ?? [];

  if (choices.length === 0) {
    return [];
  }

  const roomWidth = tileMap.columnCount * TILE_SIZE;
  const roomHeight = tileMap.rowCount * TILE_SIZE;
  const placed: PlacedStation[] = [];

  for (let index = 0; index < stationCount; index++) {
    const definition = STATION_DEFINITIONS[choices[Math.floor(nextRandomNumber() * choices.length)]];

    for (let attempt = 0; attempt < 60; attempt++) {
      const horizontalPosition = TILE_SIZE * 2 + nextRandomNumber() * (roomWidth - TILE_SIZE * 4);
      const verticalPosition = TILE_SIZE * 2 + nextRandomNumber() * (roomHeight - TILE_SIZE * 4);

      const isClear =
        !collidesWithWall(tileMap, horizontalPosition, verticalPosition, 16) &&
        findTileKindAt(tileMap, horizontalPosition, verticalPosition) !== "water";
      const isAwayFromOtherStations = placed.every(
        (other) =>
          Math.hypot(
            other.horizontalPosition - horizontalPosition,
            other.verticalPosition - verticalPosition
          ) > 70
      );

      if (isClear && isAwayFromOtherStations) {
        placed.push({ definition, horizontalPosition, verticalPosition, hasBeenUsed: false });
        break;
      }
    }
  }

  return placed;
}

export function findStationWithinReach(
  stations: PlacedStation[],
  horizontalPosition: number,
  verticalPosition: number
): PlacedStation | null {
  for (const station of stations) {
    if (station.hasBeenUsed) {
      continue;
    }

    const distance = Math.hypot(
      station.horizontalPosition - horizontalPosition,
      station.verticalPosition - verticalPosition
    );

    if (distance <= station.definition.reachPixels) {
      return station;
    }
  }

  return null;
}
