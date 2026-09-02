import type { FloorDescription, RoomTileMap } from "../types/dungeon";
import type { Survivor } from "../types/survivor";
import { SECONDS_BETWEEN_WANDER_CHANGES, SURVIVOR_NAMES } from "../constants/survivorSettings";
import { TILE_SIZE } from "../constants/tilesetSettings";
import { collidesWithWall } from "./movePlayerThroughRoom";
import { findTileKindAt } from "./findTileKindAt";
import { writeSurvivorRumour } from "./writeSurvivorRumours";

export function placeSurvivors(
  tileMap: RoomTileMap,
  description: FloorDescription,
  nextRandomNumber: () => number
): Survivor[] {
  const roomWidth = tileMap.columnCount * TILE_SIZE;
  const roomHeight = tileMap.rowCount * TILE_SIZE;
  const centreHorizontal = roomWidth / 2;
  const centreVertical = roomHeight / 2;
  const placed: Survivor[] = [];

  for (const name of SURVIVOR_NAMES) {
    for (let attempt = 0; attempt < 60; attempt++) {
      const horizontalPosition = TILE_SIZE * 3 + nextRandomNumber() * (roomWidth - TILE_SIZE * 6);
      const verticalPosition = TILE_SIZE * 3 + nextRandomNumber() * (roomHeight - TILE_SIZE * 6);

      const isClear =
        !collidesWithWall(tileMap, horizontalPosition, verticalPosition, 12) &&
        findTileKindAt(tileMap, horizontalPosition, verticalPosition) !== "water";
      const isAwayFromCentre =
        Math.hypot(horizontalPosition - centreHorizontal, verticalPosition - centreVertical) > 46;
      const isAwayFromOtherSurvivors = placed.every(
        (other) =>
          Math.hypot(
            other.horizontalPosition - horizontalPosition,
            other.verticalPosition - verticalPosition
          ) > 52
      );

      if (isClear && isAwayFromCentre && isAwayFromOtherSurvivors) {
        placed.push({
          name,
          horizontalPosition,
          verticalPosition,
          homeHorizontal: horizontalPosition,
          homeVertical: verticalPosition,
          wanderHorizontal: 0,
          wanderVertical: 0,
          secondsUntilWanderChanges: nextRandomNumber() * SECONDS_BETWEEN_WANDER_CHANGES,
          isFacingLeft: nextRandomNumber() < 0.5,
          isWalking: false,
          rumour: writeSurvivorRumour(name, description),
          hasSpoken: false
        });
        break;
      }
    }
  }

  return placed;
}

export function findSurvivorWithinReach(
  survivors: Survivor[],
  horizontalPosition: number,
  verticalPosition: number,
  reachPixels: number
): Survivor | null {
  for (const survivor of survivors) {
    const distance = Math.hypot(
      survivor.horizontalPosition - horizontalPosition,
      survivor.verticalPosition - verticalPosition
    );

    if (distance <= reachPixels) {
      return survivor;
    }
  }

  return null;
}
