import type { PlacedAnimatedProp } from "../types/animatedProp";
import type { RoomTileMap } from "../types/dungeon";
import {
  ANIMATED_PROPS_PER_ROOM_MAXIMUM,
  ANIMATED_PROPS_PER_ROOM_MINIMUM,
  ANIMATED_PROP_DEFINITIONS,
  CHANCE_A_ROOM_HOLDS_ANIMATED_PROPS,
  DISTANCE_ANIMATED_PROPS_KEEP_APART
} from "../constants/animatedPropSettings";
import { TILE_SIZE } from "../constants/tilesetSettings";
import { collidesWithWall } from "./movePlayerThroughRoom";
import { findTileKindAt } from "./findTileKindAt";

export function placeAnimatedProps(
  tileMap: RoomTileMap,
  nextRandomNumber: () => number
): PlacedAnimatedProp[] {
  if (nextRandomNumber() > CHANCE_A_ROOM_HOLDS_ANIMATED_PROPS) {
    return [];
  }

  const names = Object.keys(ANIMATED_PROP_DEFINITIONS);
  const roomWidth = tileMap.columnCount * TILE_SIZE;
  const roomHeight = tileMap.rowCount * TILE_SIZE;
  const centreHorizontal = roomWidth / 2;
  const centreVertical = roomHeight / 2;

  const propCount =
    ANIMATED_PROPS_PER_ROOM_MINIMUM +
    Math.floor(
      nextRandomNumber() *
        (ANIMATED_PROPS_PER_ROOM_MAXIMUM - ANIMATED_PROPS_PER_ROOM_MINIMUM + 1)
    );

  const placed: PlacedAnimatedProp[] = [];

  for (let index = 0; index < propCount; index++) {
    const definition = ANIMATED_PROP_DEFINITIONS[names[Math.floor(nextRandomNumber() * names.length)]];

    for (let attempt = 0; attempt < 40; attempt++) {
      const horizontalPosition = TILE_SIZE * 2 + nextRandomNumber() * (roomWidth - TILE_SIZE * 4);
      const verticalPosition = TILE_SIZE * 2 + nextRandomNumber() * (roomHeight - TILE_SIZE * 4);

      const isClear =
        !collidesWithWall(tileMap, horizontalPosition, verticalPosition, 12) &&
        findTileKindAt(tileMap, horizontalPosition, verticalPosition) !== "water";
      const isAwayFromCentre =
        Math.hypot(horizontalPosition - centreHorizontal, verticalPosition - centreVertical) > 50;
      const isAwayFromOthers = placed.every(
        (other) =>
          Math.hypot(
            other.horizontalPosition - horizontalPosition,
            other.verticalPosition - verticalPosition
          ) > DISTANCE_ANIMATED_PROPS_KEEP_APART
      );

      if (isClear && isAwayFromCentre && isAwayFromOthers) {
        placed.push({ definition, horizontalPosition, verticalPosition });
        break;
      }
    }
  }

  return placed;
}
