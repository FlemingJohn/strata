import type { StationDefinition, StationKind } from "../types/station";

const STATION_FOLDER = "/assets/pixelCrawler/Environment/Structures/Stations";

export const STATION_DEFINITIONS: Record<StationKind, StationDefinition> = {
  emberFont: {
    kind: "emberFont",
    label: "Ember Font",
    sheetPath: `${STATION_FOLDER}/Bonfire/Bonfire_05-Sheet.png`,
    frameSize: 32,
    frameCount: 4,
    framesPerSecond: 8,
    reward: "restoresHealth",
    rewardAmount: 40,
    reachPixels: 22
  },
  soulBrazier: {
    kind: "soulBrazier",
    label: "Soul Brazier",
    sheetPath: `${STATION_FOLDER}/Bonfire/Bonfire_09-Sheet.png`,
    frameSize: 32,
    frameCount: 10,
    framesPerSecond: 12,
    reward: "restoresStamina",
    rewardAmount: 100,
    reachPixels: 22
  },
  forgeHearth: {
    kind: "forgeHearth",
    label: "Forge Hearth",
    sheetPath: `${STATION_FOLDER}/Cooking Station/Grill/Grill_02-Sheet.png`,
    frameSize: 64,
    frameCount: 4,
    framesPerSecond: 6,
    reward: "sharpensWeapon",
    rewardAmount: 20,
    reachPixels: 30
  },
  alchemyVat: {
    kind: "alchemyVat",
    label: "Alchemy Vat",
    sheetPath: `${STATION_FOLDER}/Cooking Station/Cooker/Cooker_04-Sheet.png`,
    frameSize: 80,
    frameCount: 4,
    framesPerSecond: 5,
    reward: "raisesMaximumHealth",
    rewardAmount: 15,
    reachPixels: 34
  }
};

export const STATION_KINDS_BY_ROOM_PURPOSE: Record<string, StationKind[]> = {
  start: ["emberFont", "soulBrazier"],
  relic: ["forgeHearth", "alchemyVat"],
  combat: ["emberFont", "soulBrazier", "forgeHearth"],
  boss: ["emberFont"]
};

export const CHANCE_A_COMBAT_ROOM_HOLDS_A_STATION = 0.4;
export const SHARPENED_DAMAGE_MULTIPLIER = 1.6;
export const STATION_GLOW_RADIUS_PIXELS = 26;
export const STATION_GLOW_OPACITY = 0.3;
export const STATION_PROMPT_RISE_PIXELS = 30;
