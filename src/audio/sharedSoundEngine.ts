import type { SoundEngine } from "../types/sound";
import { MUTE_KEY } from "../constants/soundSettings";
import { createSoundEngine } from "./createSoundEngine";
import { findMusicEngine } from "./sharedMusicEngine";

let sharedEngine: SoundEngine | null = null;
let hasAttachedMuteKey = false;

export function findSoundEngine(): SoundEngine {
  if (!sharedEngine) {
    sharedEngine = createSoundEngine();
    findMusicEngine().setMuted(sharedEngine.isMuted());
  }

  if (!hasAttachedMuteKey) {
    hasAttachedMuteKey = true;
    window.addEventListener("keydown", (event) => {
      if (event.key.toLowerCase() === MUTE_KEY && sharedEngine) {
        findMusicEngine().setMuted(sharedEngine.toggleMute());
      }
    });
  }

  return sharedEngine;
}
