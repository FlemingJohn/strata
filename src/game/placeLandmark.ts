import type { PlacedLandmark } from "../types/landmark";
import type { RoomTileMap } from "../types/dungeon";
import {
  CHANCE_A_ROOM_HOLDS_A_LANDMARK,
  LANDMARK_DEFINITIONS,
  LANDMARK_TOP_BAND_FRACTION
} from "../constants/landmarkSettings";
import { TILE_SIZE } from "../constants/tilesetSettings";
import { collidesWithWall } from "./movePlayerThroughRoom";
import { findTileKindAt } from "./findTileKindAt";

export function placeLandmark(
  tileMap: RoomTileMap,
  landmarkNames: string[],
  nextRandomNumber: () => number
): PlacedLandmark | null {
  if (landmarkNames.length === 0 || nextRandomNumber() > CHANCE_A_ROOM_HOLDS_A_LANDMARK) {
    return null;
  }

  const definition =
    LANDMARK_DEFINITIONS[landmarkNames[Math.floor(nextRandomNumber() * landmarkNames.length)]];

  if (!definition) {
    return null;
  }

  const region = definition.regions[Math.floor(nextRandomNumber() * definition.regions.length)];
  const roomWidth = tileMap.columnCount * TILE_SIZE;
  const roomHeight = tileMap.rowCount * TILE_SIZE;
  const bandBottom = roomHeight * LANDMARK_TOP_BAND_FRACTION;

  for (let attempt = 0; attempt < 60; attempt++) {
    const horizontalPosition = TILE_SIZE * 3 + nextRandomNumber() * (roomWidth - TILE_SIZE * 6);
    const verticalPosition = TILE_SIZE * 2 + nextRandomNumber() * (bandBottom - TILE_SIZE * 2);

    const isClear =
      !collidesWithWall(tileMap, horizontalPosition, verticalPosition, 18) &&
      findTileKindAt(tileMap, horizontalPosition, verticalPosition) !== "water";
    const isAwayFromTheDoorLine = Math.abs(horizontalPosition - roomWidth / 2) > 34;

    if (isClear && isAwayFromTheDoorLine) {
      return { definition, region, horizontalPosition, verticalPosition };
    }
  }

  return null;
}
