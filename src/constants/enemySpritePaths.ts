import type { EnemyName } from "../types/enemy";

const MOB_FOLDER = "/assets/pixelCrawler/Entities/Mobs";

const NPC_FOLDER = "/assets/pixelCrawler/Entities/Npc's";

const FOLDER_BY_ENEMY: Record<EnemyName, string> = {
  skeleton: "Skeleton Crew/Skeleton - Base",
  skeletonRogue: "Skeleton Crew/Skeleton - Rogue",
  skeletonMage: "Skeleton Crew/Skeleton - Mage",
  skeletonWarrior: "Skeleton Crew/Skeleton - Warrior",
  orc: "Orc Crew/Orc",
  orcRogue: "Orc Crew/Orc - Rogue",
  orcShaman: "Orc Crew/Orc - Shaman",
  orcWarrior: "Orc Crew/Orc - Warrior",
  eliteKnight: "Knight",
  eliteRogue: "Rogue",
  eliteWizard: "Wizzard"
};

const ELITE_NAMES: EnemyName[] = ["eliteKnight", "eliteRogue", "eliteWizard"];

export function findEnemySheetPath(enemyName: EnemyName, action: string): string {
  const baseFolder = ELITE_NAMES.includes(enemyName) ? NPC_FOLDER : MOB_FOLDER;
  return encodeURI(`${baseFolder}/${FOLDER_BY_ENEMY[enemyName]}/${action}/${action}-Sheet.png`);
}

export const ENEMY_NAMES: EnemyName[] = [
  "skeleton",
  "skeletonRogue",
  "skeletonMage",
  "skeletonWarrior",
  "orc",
  "orcRogue",
  "orcShaman",
  "orcWarrior",
  "eliteKnight",
  "eliteRogue",
  "eliteWizard"
];

export const ENEMY_GROUND_OFFSET_PIXELS = 31;
