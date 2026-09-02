import type { PlacedProp } from "../types/prop";
import type { RoomTileMap } from "../types/dungeon";
import {
  PROPS_PER_ROOM_MAXIMUM,
  PROPS_PER_ROOM_MINIMUM,
  PROP_REGIONS
} from "../constants/propSettings";
import { TILE_SIZE } from "../constants/tilesetSettings";
import { collidesWithWall } from "./movePlayerThroughRoom";

export function placeProps(
  tileMap: RoomTileMap,
  sheetNames: string[],
  nextRandomNumber: () => number
): PlacedProp[] {
  if (sheetNames.length === 0) {
    return [];
  }

  const roomWidth = tileMap.columnCount * TILE_SIZE;
  const roomHeight = tileMap.rowCount * TILE_SIZE;
  const centreHorizontal = roomWidth / 2;
  const centreVertical = roomHeight / 2;

  const propCount =
    PROPS_PER_ROOM_MINIMUM +
    Math.floor(nextRandomNumber() * (PROPS_PER_ROOM_MAXIMUM - PROPS_PER_ROOM_MINIMUM + 1));

  const placed: PlacedProp[] = [];

  for (let index = 0; index < propCount; index++) {
    const sheetName = sheetNames[Math.floor(nextRandomNumber() * sheetNames.length)];
    const regions = PROP_REGIONS[sheetName];

    if (!regions || regions.length === 0) {
      continue;
    }

    const region = regions[Math.floor(nextRandomNumber() * regions.length)];

    for (let attempt = 0; attempt < 40; attempt++) {
      const horizontalPosition = TILE_SIZE * 2 + nextRandomNumber() * (roomWidth - TILE_SIZE * 4);
      const verticalPosition = TILE_SIZE * 2 + nextRandomNumber() * (roomHeight - TILE_SIZE * 4);

      const isClear = !collidesWithWall(tileMap, horizontalPosition, verticalPosition, 10);
      const isAwayFromCentre =
        Math.hypot(horizontalPosition - centreHorizontal, verticalPosition - centreVertical) > 44;
      const isAwayFromOtherProps = placed.every(
        (other) =>
          Math.hypot(
            other.horizontalPosition - horizontalPosition,
            other.verticalPosition - verticalPosition
          ) > 26
      );

      if (isClear && isAwayFromCentre && isAwayFromOtherProps) {
        placed.push({ sheetName, region, horizontalPosition, verticalPosition });
        break;
      }
    }
  }

  return placed;
}
