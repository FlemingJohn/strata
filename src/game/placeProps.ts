import type { PlacedProp } from "../types/prop";
import type { RoomTileMap } from "../types/dungeon";
import {
  CLUSTER_SPREAD_PIXELS,
  DISTANCE_CLUSTERS_KEEP_APART,
  DISTANCE_PROPS_KEEP_APART,
  DISTANCE_PROPS_KEEP_FROM_CENTRE,
  PROPS_PER_CLUSTER_MAXIMUM,
  PROPS_PER_CLUSTER_MINIMUM,
  PROP_CLUSTERS_PER_ROOM_MAXIMUM,
  PROP_CLUSTERS_PER_ROOM_MINIMUM,
  PROP_REGIONS
} from "../constants/propSettings";
import { BREAKABLE_PROP_SHEETS } from "../constants/propSettings";
import {
  SMALLEST_SOLID_PROP_WIDTH,
  SOLID_PROP_BASE_HEIGHT_PIXELS
} from "../constants/solidObjectSettings";
import { TILE_SIZE } from "../constants/tilesetSettings";
import { collidesWithWall } from "./movePlayerThroughRoom";
import { findTileKindAt } from "./findTileKindAt";
import { blockRoomTiles } from "./blockRoomTiles";

function pickBetween(
  smallest: number,
  largest: number,
  nextRandomNumber: () => number
): number {
  return smallest + Math.floor(nextRandomNumber() * (largest - smallest + 1));
}

function isSpotClear(
  tileMap: RoomTileMap,
  horizontalPosition: number,
  verticalPosition: number
): boolean {
  return (
    !collidesWithWall(tileMap, horizontalPosition, verticalPosition, 6) &&
    findTileKindAt(tileMap, horizontalPosition, verticalPosition) !== "water"
  );
}

function findClusterCentres(
  tileMap: RoomTileMap,
  nextRandomNumber: () => number
): { horizontalPosition: number; verticalPosition: number }[] {
  const roomWidth = tileMap.columnCount * TILE_SIZE;
  const roomHeight = tileMap.rowCount * TILE_SIZE;
  const centreHorizontal = roomWidth / 2;
  const centreVertical = roomHeight / 2;

  const clusterCount = pickBetween(
    PROP_CLUSTERS_PER_ROOM_MINIMUM,
    PROP_CLUSTERS_PER_ROOM_MAXIMUM,
    nextRandomNumber
  );

  const centres: { horizontalPosition: number; verticalPosition: number }[] = [];

  for (let index = 0; index < clusterCount; index++) {
    for (let attempt = 0; attempt < 50; attempt++) {
      const horizontalPosition =
        TILE_SIZE * 2 + nextRandomNumber() * (roomWidth - TILE_SIZE * 4);
      const verticalPosition = TILE_SIZE * 2 + nextRandomNumber() * (roomHeight - TILE_SIZE * 4);

      const isAwayFromCentre =
        Math.hypot(horizontalPosition - centreHorizontal, verticalPosition - centreVertical) >
        DISTANCE_PROPS_KEEP_FROM_CENTRE;

      const isAwayFromOtherClusters = centres.every(
        (other) =>
          Math.hypot(
            other.horizontalPosition - horizontalPosition,
            other.verticalPosition - verticalPosition
          ) > DISTANCE_CLUSTERS_KEEP_APART
      );

      if (isSpotClear(tileMap, horizontalPosition, verticalPosition) && isAwayFromCentre && isAwayFromOtherClusters) {
        centres.push({ horizontalPosition, verticalPosition });
        break;
      }
    }
  }

  return centres;
}

export function placeProps(
  tileMap: RoomTileMap,
  sheetNames: string[],
  nextRandomNumber: () => number
): PlacedProp[] {
  if (sheetNames.length === 0) {
    return [];
  }

  const placed: PlacedProp[] = [];

  for (const centre of findClusterCentres(tileMap, nextRandomNumber)) {
    const sheetName = sheetNames[Math.floor(nextRandomNumber() * sheetNames.length)];
    const regions = PROP_REGIONS[sheetName];

    if (!regions || regions.length === 0) {
      continue;
    }

    const propCount = pickBetween(
      PROPS_PER_CLUSTER_MINIMUM,
      PROPS_PER_CLUSTER_MAXIMUM,
      nextRandomNumber
    );

    for (let index = 0; index < propCount; index++) {
      const region = regions[Math.floor(nextRandomNumber() * regions.length)];

      for (let attempt = 0; attempt < 20; attempt++) {
        const horizontalPosition =
          centre.horizontalPosition + (nextRandomNumber() * 2 - 1) * CLUSTER_SPREAD_PIXELS;
        const verticalPosition =
          centre.verticalPosition + (nextRandomNumber() * 2 - 1) * CLUSTER_SPREAD_PIXELS;

        const isAwayFromOtherProps = placed.every(
          (other) =>
            Math.hypot(
              other.horizontalPosition - horizontalPosition,
              other.verticalPosition - verticalPosition
            ) > DISTANCE_PROPS_KEEP_APART
        );

        if (isSpotClear(tileMap, horizontalPosition, verticalPosition) && isAwayFromOtherProps) {
          const isSolid = region.width >= SMALLEST_SOLID_PROP_WIDTH;

          placed.push({
            sheetName,
            region,
            horizontalPosition,
            verticalPosition,
            isBreakable: isSolid && BREAKABLE_PROP_SHEETS.includes(sheetName)
          });

          if (isSolid) {
            blockRoomTiles(
              tileMap,
              horizontalPosition,
              verticalPosition,
              region.width,
              SOLID_PROP_BASE_HEIGHT_PIXELS
            );
          }

          break;
        }
      }
    }
  }

  return placed;
}
