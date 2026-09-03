import type { PlacedProp } from "../types/prop";
import type { RoomTileMap } from "../types/dungeon";
import {
  DISTANCE_TREES_KEEP_APART,
  DISTANCE_TREES_KEEP_FROM_CENTRE,
  TREES_PER_ROOM_MAXIMUM,
  TREES_PER_ROOM_MINIMUM,
  TREE_REGIONS
} from "../constants/treeSettings";
import { TILE_SIZE } from "../constants/tilesetSettings";
import { collidesWithWall } from "./movePlayerThroughRoom";
import { findTileKindAt } from "./findTileKindAt";
import { blockRoomTiles } from "./blockRoomTiles";
import {
  SOLID_TREE_TRUNK_HEIGHT_PIXELS,
  SOLID_TREE_TRUNK_WIDTH_PIXELS
} from "../constants/solidObjectSettings";

export function plantTrees(
  tileMap: RoomTileMap,
  nextRandomNumber: () => number
): PlacedProp[] {
  const sheetNames = Object.keys(TREE_REGIONS);
  const roomWidth = tileMap.columnCount * TILE_SIZE;
  const roomHeight = tileMap.rowCount * TILE_SIZE;
  const centreHorizontal = roomWidth / 2;
  const centreVertical = roomHeight / 2;

  const treeCount =
    TREES_PER_ROOM_MINIMUM +
    Math.floor(nextRandomNumber() * (TREES_PER_ROOM_MAXIMUM - TREES_PER_ROOM_MINIMUM + 1));

  const planted: PlacedProp[] = [];

  for (let index = 0; index < treeCount; index++) {
    const sheetName = sheetNames[Math.floor(nextRandomNumber() * sheetNames.length)];
    const regions = TREE_REGIONS[sheetName];
    const region = regions[Math.floor(nextRandomNumber() * regions.length)];

    for (let attempt = 0; attempt < 50; attempt++) {
      const horizontalPosition = TILE_SIZE * 2 + nextRandomNumber() * (roomWidth - TILE_SIZE * 4);
      const verticalPosition = TILE_SIZE * 2 + nextRandomNumber() * (roomHeight - TILE_SIZE * 4);

      const isClear =
        !collidesWithWall(tileMap, horizontalPosition, verticalPosition, 12) &&
        findTileKindAt(tileMap, horizontalPosition, verticalPosition) !== "water";
      const isAwayFromCentre =
        Math.hypot(horizontalPosition - centreHorizontal, verticalPosition - centreVertical) >
        DISTANCE_TREES_KEEP_FROM_CENTRE;
      const isAwayFromOtherTrees = planted.every(
        (other) =>
          Math.hypot(
            other.horizontalPosition - horizontalPosition,
            other.verticalPosition - verticalPosition
          ) > DISTANCE_TREES_KEEP_APART
      );

      if (isClear && isAwayFromCentre && isAwayFromOtherTrees) {
        planted.push({ sheetName, region, horizontalPosition, verticalPosition });
        blockRoomTiles(
          tileMap,
          horizontalPosition,
          verticalPosition,
          SOLID_TREE_TRUNK_WIDTH_PIXELS,
          SOLID_TREE_TRUNK_HEIGHT_PIXELS
        );
        break;
      }
    }
  }

  return planted;
}
