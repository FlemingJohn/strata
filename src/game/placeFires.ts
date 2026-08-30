import type { FirePlacement } from "../types/fire";
import type { RoomTileMap } from "../types/dungeon";
import { FIRES_PER_FURNACE_ROOM } from "../constants/fireSettings";
import { TILE_SIZE } from "../constants/tilesetSettings";
import { collidesWithWall } from "./movePlayerThroughRoom";

export function placeFires(
  tileMap: RoomTileMap,
  nextRandomNumber: () => number
): FirePlacement[] {
  const roomWidth = tileMap.columnCount * TILE_SIZE;
  const roomHeight = tileMap.rowCount * TILE_SIZE;
  const centreHorizontal = roomWidth / 2;
  const centreVertical = roomHeight / 2;
  const fires: FirePlacement[] = [];

  for (let index = 0; index < FIRES_PER_FURNACE_ROOM; index++) {
    for (let attempt = 0; attempt < 50; attempt++) {
      const horizontalPosition = TILE_SIZE * 3 + nextRandomNumber() * (roomWidth - TILE_SIZE * 6);
      const verticalPosition = TILE_SIZE * 3 + nextRandomNumber() * (roomHeight - TILE_SIZE * 6);

      const isClear = !collidesWithWall(tileMap, horizontalPosition, verticalPosition, 12);
      const isAwayFromCentre =
        Math.hypot(horizontalPosition - centreHorizontal, verticalPosition - centreVertical) > 56;
      const isAwayFromOtherFires = fires.every(
        (fire) =>
          Math.hypot(
            fire.horizontalPosition - horizontalPosition,
            fire.verticalPosition - verticalPosition
          ) > 60
      );

      if (isClear && isAwayFromCentre && isAwayFromOtherFires) {
        fires.push({
          horizontalPosition,
          verticalPosition,
          flickerPhase: index * 1.7
        });
        break;
      }
    }
  }

  return fires;
}
