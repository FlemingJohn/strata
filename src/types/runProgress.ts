import type { EquippedRelic } from "./relic";

export interface RunProgress {
  provenRelics: EquippedRelic[];
  equippedRelics: EquippedRelic[];
  depth: number;
  roomsClearedSoFar: number;
  killsSoFar: number;
  carriedHealth: number | null;
  walletAddress: string;
  openingNotice?: string;
}
