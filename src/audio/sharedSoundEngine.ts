import type { SoundEngine } from "../types/sound";
import { MUTE_KEY } from "../constants/soundSettings";
import { createSoundEngine } from "./createSoundEngine";

let sharedEngine: SoundEngine | null = null;
let hasAttachedMuteKey = false;

export function findSoundEngine(): SoundEngine {
  if (!sharedEngine) {
    sharedEngine = createSoundEngine();
  }

  if (!hasAttachedMuteKey) {
    hasAttachedMuteKey = true;
    window.addEventListener("keydown", (event) => {
      if (event.key.toLowerCase() === MUTE_KEY && sharedEngine) {
        sharedEngine.toggleMute();
      }
    });
  }

  return sharedEngine;
}
