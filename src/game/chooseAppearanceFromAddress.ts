import type { AppearanceSlot } from "../constants/characterAppearance";
import {
  HEADGEAR_OPTIONS,
  HEAD_OPTIONS,
  TORSO_OPTIONS
} from "../constants/characterAppearance";

export interface CharacterAppearance {
  head: AppearanceSlot;
  torso: AppearanceSlot;
  headgear: AppearanceSlot;
}

function hashOfAddress(walletAddress: string): number {
  let hash = 2166136261;

  for (let position = 0; position < walletAddress.length; position++) {
    hash ^= walletAddress.charCodeAt(position);
    hash = Math.imul(hash, 16777619) >>> 0;
  }

  return hash >>> 0;
}

function pickOption(options: AppearanceSlot[], seed: number, shift: number): AppearanceSlot {
  return options[(seed >>> shift) % options.length];
}

export function chooseAppearanceFromAddress(walletAddress: string): CharacterAppearance {
  const seed = hashOfAddress(walletAddress.toLowerCase());

  return {
    head: pickOption(HEAD_OPTIONS, seed, 0),
    torso: pickOption(TORSO_OPTIONS, seed, 5),
    headgear: pickOption(HEADGEAR_OPTIONS, seed, 11)
  };
}

export function describeAppearance(appearance: CharacterAppearance): string {
  return `${appearance.head.displayName} · ${appearance.torso.displayName} · ${appearance.headgear.displayName}`;
}
