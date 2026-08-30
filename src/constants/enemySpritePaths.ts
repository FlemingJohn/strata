import type { EnemyName } from "../types/enemy";

const MOB_FOLDER = "/assets/pixelCrawler/Entities/Mobs";

const FOLDER_BY_ENEMY: Record<EnemyName, string> = {
  skeleton: "Skeleton Crew/Skeleton - Base",
  skeletonRogue: "Skeleton Crew/Skeleton - Rogue",
  skeletonMage: "Skeleton Crew/Skeleton - Mage",
  skeletonWarrior: "Skeleton Crew/Skeleton - Warrior",
  orc: "Orc Crew/Orc",
  orcRogue: "Orc Crew/Orc - Rogue",
  orcShaman: "Orc Crew/Orc - Shaman",
  orcWarrior: "Orc Crew/Orc - Warrior"
};

export function findEnemySheetPath(enemyName: EnemyName, action: string): string {
  return encodeURI(`${MOB_FOLDER}/${FOLDER_BY_ENEMY[enemyName]}/${action}/${action}-Sheet.png`);
}

export const ENEMY_NAMES: EnemyName[] = [
  "skeleton",
  "skeletonRogue",
  "skeletonMage",
  "skeletonWarrior",
  "orc",
  "orcRogue",
  "orcShaman",
  "orcWarrior"
];

export const HERO_GROUND_OFFSET_PIXELS = 47;
export const ENEMY_GROUND_OFFSET_PIXELS = 31;
