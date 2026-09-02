import type { SurvivorName } from "../types/survivor";

const CITIZEN_FOLDER = "/assets/pixelCrawler/Entities/Npc's/Citizen_F";

export const SURVIVOR_NAMES: SurvivorName[] = ["peasant", "innkeeper", "cellarhand"];

export const SURVIVOR_LABELS: Record<SurvivorName, string> = {
  peasant: "Ledger Keeper",
  innkeeper: "Wayfare Host",
  cellarhand: "Cellar Hand"
};

export const SURVIVOR_STANDING_SHEETS: Record<SurvivorName, string> = {
  peasant: `${CITIZEN_FOLDER}/Peasant_A/Idle/Idle-Sheet.png`,
  innkeeper: `${CITIZEN_FOLDER}/Tavern_A/Idle_Hold/Idle_Side-Sheet.png`,
  cellarhand: `${CITIZEN_FOLDER}/Tavern_B/Idle/Idle_Side-Sheet.png`
};

export const SURVIVOR_WALKING_SHEETS: Record<SurvivorName, string> = {
  peasant: `${CITIZEN_FOLDER}/Peasant_A/Walk/Walk-Sheet.png`,
  innkeeper: `${CITIZEN_FOLDER}/Tavern_A/Walk_Hold/Walk_Side-Sheet.png`,
  cellarhand: `${CITIZEN_FOLDER}/Tavern_B/Walk/Walk_Side-Sheet.png`
};

export const SURVIVOR_GROUND_OFFSET_PIXELS = 46;
export const SURVIVOR_FRAMES_PER_SECOND = 8;
export const SURVIVOR_WALKING_SPEED_PIXELS_PER_SECOND = 18;
export const SURVIVOR_WANDER_RADIUS_PIXELS = 34;
export const SECONDS_BETWEEN_WANDER_CHANGES = 2.4;
export const SURVIVOR_TALK_REACH_PIXELS = 24;
export const SURVIVOR_PROMPT_RISE_PIXELS = 34;
