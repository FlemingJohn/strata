import type { EnemyName } from "../types/enemy";
import type { SpriteSheet } from "../types/spriteSheet";
import { ENEMY_NAMES, findEnemySheetPath } from "../constants/enemySpritePaths";
import { loadSpriteSheet } from "./loadSpriteSheet";

export interface EnemySpriteSet {
  standing: SpriteSheet;
  walking: SpriteSheet;
  dying: SpriteSheet;
}

export type EnemySpriteLibrary = Record<EnemyName, EnemySpriteSet>;

async function loadOneEnemy(enemyName: EnemyName): Promise<EnemySpriteSet> {
  const [standing, walking, dying] = await Promise.all([
    loadSpriteSheet(findEnemySheetPath(enemyName, "Idle")),
    loadSpriteSheet(findEnemySheetPath(enemyName, "Run")),
    loadSpriteSheet(findEnemySheetPath(enemyName, "Death"))
  ]);

  return { standing, walking, dying };
}

export async function loadEnemySprites(): Promise<EnemySpriteLibrary> {
  const loadedSets = await Promise.all(ENEMY_NAMES.map(loadOneEnemy));
  const library = {} as EnemySpriteLibrary;

  ENEMY_NAMES.forEach((enemyName, index) => {
    library[enemyName] = loadedSets[index];
  });

  return library;
}
