import type { SurvivorName, SurvivorSpriteLibrary, SurvivorSpriteSet } from "../types/survivor";
import {
  SURVIVOR_NAMES,
  SURVIVOR_STANDING_SHEETS,
  SURVIVOR_WALKING_SHEETS
} from "../constants/survivorSettings";
import { loadSpriteSheet } from "./loadSpriteSheet";

async function loadOneSurvivor(name: SurvivorName): Promise<SurvivorSpriteSet> {
  const [standing, walking] = await Promise.all([
    loadSpriteSheet(encodeURI(SURVIVOR_STANDING_SHEETS[name])),
    loadSpriteSheet(encodeURI(SURVIVOR_WALKING_SHEETS[name]))
  ]);

  return { standing, walking };
}

export async function loadSurvivorSprites(): Promise<SurvivorSpriteLibrary> {
  const loadedSets = await Promise.all(SURVIVOR_NAMES.map(loadOneSurvivor));
  const library = {} as SurvivorSpriteLibrary;

  SURVIVOR_NAMES.forEach((name, index) => {
    library[name] = loadedSets[index];
  });

  return library;
}
