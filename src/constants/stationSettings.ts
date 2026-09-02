import type { StationAppearance, StationDefinition, StationKind } from "../types/station";

const STATION_FOLDER = "/assets/pixelCrawler/Environment/Structures/Stations";

function describeBonfire(
  sheetName: string,
  fileName: string,
  frameCount: number,
  framesPerSecond: number
): StationAppearance {
  return {
    sheetName,
    sheetPath: `${STATION_FOLDER}/Bonfire/${fileName}`,
    frameWidth: 32,
    frameHeight: 32,
    frameCount,
    framesPerSecond
  };
}

function describeGrill(sheetName: string, fileName: string, frameCount: number): StationAppearance {
  return {
    sheetName,
    sheetPath: `${STATION_FOLDER}/Cooking Station/Grill/${fileName}`,
    frameWidth: 64,
    frameHeight: 64,
    frameCount,
    framesPerSecond: 6
  };
}

export const STATION_DEFINITIONS: Record<StationKind, StationDefinition> = {
  emberFont: {
    kind: "emberFont",
    label: "Ember Font",
    appearances: [
      describeBonfire("emberFontOne", "Bonfire_01-Sheet.png", 4, 8),
      describeBonfire("emberFontTwo", "Bonfire_02-Sheet.png", 4, 8),
      describeBonfire("emberFontThree", "Bonfire_03-Sheet.png", 4, 8),
      describeBonfire("emberFontFour", "Bonfire_04-Sheet.png", 4, 8),
      describeBonfire("emberFontFive", "Bonfire_05-Sheet.png", 4, 8)
    ],
    reward: "restoresHealth",
    rewardAmount: 40,
    reachPixels: 22
  },
  soulBrazier: {
    kind: "soulBrazier",
    label: "Soul Brazier",
    appearances: [
      describeBonfire("soulBrazierOne", "Bonfire_06-Sheet.png", 4, 9),
      describeBonfire("soulBrazierTwo", "Bonfire_07-Sheet.png", 4, 9),
      describeBonfire("soulBrazierThree", "Bonfire_08-Sheet.png", 4, 9),
      describeBonfire("soulBrazierFour", "Bonfire_09-Sheet.png", 10, 12),
      describeBonfire("soulBrazierFive", "Bonfire_10-Sheet.png", 6, 10)
    ],
    reward: "restoresStamina",
    rewardAmount: 100,
    reachPixels: 22
  },
  forgeHearth: {
    kind: "forgeHearth",
    label: "Forge Hearth",
    appearances: [
      describeGrill("forgeHearthOne", "Grill_01-Sheet.png", 4),
      describeGrill("forgeHearthTwo", "Grill_02-Sheet.png", 4),
      describeGrill("forgeHearthThree", "Grill_03-Sheet.png", 4),
      describeGrill("forgeHearthFour", "Grill_04-Sheet.png", 5)
    ],
    reward: "sharpensWeapon",
    rewardAmount: 20,
    reachPixels: 30
  },
  alchemyVat: {
    kind: "alchemyVat",
    label: "Alchemy Vat",
    appearances: [
      {
        sheetName: "alchemyVatOne",
        sheetPath: `${STATION_FOLDER}/Cooking Station/Cooker/Cooker_04-Sheet.png`,
        frameWidth: 80,
        frameHeight: 80,
        frameCount: 4,
        framesPerSecond: 5
      },
      {
        sheetName: "alchemyVatTwo",
        sheetPath: `${STATION_FOLDER}/Cooking Station/Cooker/Cooker_03-Sheet.png`,
        frameWidth: 48,
        frameHeight: 32,
        frameCount: 4,
        framesPerSecond: 5
      },
      {
        sheetName: "alchemyVatThree",
        sheetPath: `${STATION_FOLDER}/Cooking Station/Cooker/Cooker_01.png`,
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 1,
        framesPerSecond: 1
      },
      {
        sheetName: "alchemyVatFour",
        sheetPath: `${STATION_FOLDER}/Cooking Station/Cooker/Cooker_02.png`,
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 1,
        framesPerSecond: 1
      },
      {
        sheetName: "alchemyVatFive",
        sheetPath: `${STATION_FOLDER}/Cooking Station/Butchery/Butchery_01-Sheet.png`,
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 1,
        framesPerSecond: 1
      },
      {
        sheetName: "alchemyVatSix",
        sheetPath: `${STATION_FOLDER}/Cooking Station/Butchery/Butchery_02.png`,
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 1,
        framesPerSecond: 1
      },
      {
        sheetName: "alchemyVatSeven",
        sheetPath: `${STATION_FOLDER}/Cooking Station/Butchery/Butchery_03.png`,
        frameWidth: 80,
        frameHeight: 80,
        frameCount: 1,
        framesPerSecond: 1
      },
      {
        sheetName: "alchemyVatEight",
        sheetPath: `${STATION_FOLDER}/Cooking Station/Butchery/Butchery_04.png`,
        frameWidth: 80,
        frameHeight: 80,
        frameCount: 1,
        framesPerSecond: 1
      }
    ],
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
