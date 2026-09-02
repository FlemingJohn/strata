import type { RoomTileMap } from "../types/dungeon";
import type { Survivor } from "../types/survivor";
import {
  SECONDS_BETWEEN_WANDER_CHANGES,
  SURVIVOR_WALKING_SPEED_PIXELS_PER_SECOND,
  SURVIVOR_WANDER_RADIUS_PIXELS
} from "../constants/survivorSettings";
import { collidesWithWall } from "./movePlayerThroughRoom";
import { findTileKindAt } from "./findTileKindAt";

function chooseNewWanderDirection(survivor: Survivor): void {
  const angle = Math.random() * Math.PI * 2;
  const shouldRest = Math.random() < 0.35;

  survivor.wanderHorizontal = shouldRest ? 0 : Math.cos(angle);
  survivor.wanderVertical = shouldRest ? 0 : Math.sin(angle);
  survivor.secondsUntilWanderChanges = SECONDS_BETWEEN_WANDER_CHANGES;
}

export function updateSurvivors(
  survivors: Survivor[],
  tileMap: RoomTileMap,
  secondsElapsed: number
): void {
  for (const survivor of survivors) {
    survivor.secondsUntilWanderChanges -= secondsElapsed;

    if (survivor.secondsUntilWanderChanges <= 0) {
      chooseNewWanderDirection(survivor);
    }

    const distanceFromHome = Math.hypot(
      survivor.horizontalPosition - survivor.homeHorizontal,
      survivor.verticalPosition - survivor.homeVertical
    );

    if (distanceFromHome > SURVIVOR_WANDER_RADIUS_PIXELS) {
      survivor.wanderHorizontal =
        (survivor.homeHorizontal - survivor.horizontalPosition) / distanceFromHome;
      survivor.wanderVertical =
        (survivor.homeVertical - survivor.verticalPosition) / distanceFromHome;
    }

    const step = SURVIVOR_WALKING_SPEED_PIXELS_PER_SECOND * secondsElapsed;
    const nextHorizontal = survivor.horizontalPosition + survivor.wanderHorizontal * step;
    const nextVertical = survivor.verticalPosition + survivor.wanderVertical * step;

    if (
      !collidesWithWall(tileMap, nextHorizontal, survivor.verticalPosition, 6) &&
      findTileKindAt(tileMap, nextHorizontal, survivor.verticalPosition) !== "water"
    ) {
      survivor.horizontalPosition = nextHorizontal;
    }

    if (
      !collidesWithWall(tileMap, survivor.horizontalPosition, nextVertical, 6) &&
      findTileKindAt(tileMap, survivor.horizontalPosition, nextVertical) !== "water"
    ) {
      survivor.verticalPosition = nextVertical;
    }

    survivor.isWalking = survivor.wanderHorizontal !== 0 || survivor.wanderVertical !== 0;

    if (survivor.wanderHorizontal !== 0) {
      survivor.isFacingLeft = survivor.wanderHorizontal < 0;
    }
  }
}
