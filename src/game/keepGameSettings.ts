import type { GameSettings } from "../types/gameSettings";
import { DEFAULT_SETTINGS, SETTINGS_STORAGE_KEY } from "../constants/gameSettingsDefaults";

let heldSettings: GameSettings | null = null;
const listeners: ((settings: GameSettings) => void)[] = [];

function readStoredSettings(): GameSettings {
  try {
    const stored = window.localStorage.getItem(SETTINGS_STORAGE_KEY);

    if (!stored) {
      return { ...DEFAULT_SETTINGS };
    }

    const parsed: unknown = JSON.parse(stored);

    if (typeof parsed !== "object" || parsed === null) {
      return { ...DEFAULT_SETTINGS };
    }

    const candidate = parsed as Partial<GameSettings>;

    return {
      effectVolume:
        typeof candidate.effectVolume === "number"
          ? candidate.effectVolume
          : DEFAULT_SETTINGS.effectVolume,
      musicVolume:
        typeof candidate.musicVolume === "number"
          ? candidate.musicVolume
          : DEFAULT_SETTINGS.musicVolume,
      shakesTheScreen:
        typeof candidate.shakesTheScreen === "boolean"
          ? candidate.shakesTheScreen
          : DEFAULT_SETTINGS.shakesTheScreen,
      entersFullScreen:
        typeof candidate.entersFullScreen === "boolean"
          ? candidate.entersFullScreen
          : DEFAULT_SETTINGS.entersFullScreen
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function findGameSettings(): GameSettings {
  if (!heldSettings) {
    heldSettings = readStoredSettings();
  }

  return heldSettings;
}

export function changeGameSettings(changes: Partial<GameSettings>): GameSettings {
  const next = { ...findGameSettings(), ...changes };
  heldSettings = next;

  try {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next));
  } catch {
    heldSettings = next;
  }

  for (const listener of listeners) {
    listener(next);
  }

  return next;
}

export function watchGameSettings(listener: (settings: GameSettings) => void): void {
  listeners.push(listener);
}
