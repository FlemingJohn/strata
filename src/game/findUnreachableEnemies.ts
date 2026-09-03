import type { EnemyCharacter } from "../types/enemy";
import type { PathField } from "./buildPathField";
import { UNREACHABLE_DISTANCE, readPathDistance } from "./buildPathField";
import { TILE_SIZE } from "../constants/tilesetSettings";

export function countReachableEnemies(
  enemies: EnemyCharacter[],
  pathField: PathField
): number {
  let reachableCount = 0;

  for (const enemy of enemies) {
    const column = Math.floor(enemy.horizontalPosition / TILE_SIZE);
    const row = Math.floor(enemy.verticalPosition / TILE_SIZE);

    if (readPathDistance(pathField, column, row) < UNREACHABLE_DISTANCE) {
      reachableCount += 1;
    }
  }

  return reachableCount;
}
