import type { MusicEngine } from "../types/music";
import { createMusicEngine } from "./createMusicEngine";

let sharedEngine: MusicEngine | null = null;

export function findMusicEngine(): MusicEngine {
  if (!sharedEngine) {
    sharedEngine = createMusicEngine();
  }

  return sharedEngine;
}
