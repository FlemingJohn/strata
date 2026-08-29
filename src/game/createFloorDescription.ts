import type { FloorDescription } from "../types/dungeon";
import {
  BUSYNESS_ROOM_CONTRIBUTION,
  DIFFICULTY_INCREASE_PER_FLOOR,
  MAXIMUM_ROOMS_PER_FLOOR,
  MINIMUM_ROOMS_PER_FLOOR,
  TREASURE_TIER_COUNT
} from "../constants/dungeonSettings";
import { findStratumForBlock } from "./findStratumForBlock";

export interface ProvenBlockFacts {
  blockNumber: number;
  transactionMerkleRoot: string;
  merkleSiblingCount: number;
  continuityRootCount: number;
}

function clampNumber(value: number, lowest: number, highest: number): number {
  return Math.max(lowest, Math.min(highest, value));
}

export function estimateTransactionCount(merkleSiblingCount: number): number {
  return Math.pow(2, merkleSiblingCount);
}

export function createFloorDescription(
  floorNumber: number,
  facts: ProvenBlockFacts
): FloorDescription {
  const stratum = findStratumForBlock(facts.blockNumber);
  const blockBusyness = facts.merkleSiblingCount;

  const roomCount = clampNumber(
    Math.round(MINIMUM_ROOMS_PER_FLOOR + blockBusyness * BUSYNESS_ROOM_CONTRIBUTION),
    MINIMUM_ROOMS_PER_FLOOR,
    MAXIMUM_ROOMS_PER_FLOOR
  );

  const difficultyMultiplier =
    1 + floorNumber * DIFFICULTY_INCREASE_PER_FLOOR + blockBusyness * 0.04;

  const eliteCount = clampNumber(Math.floor(blockBusyness / 3), 0, 4);

  return {
    floorNumber,
    sourceBlockNumber: facts.blockNumber,
    layoutSeed: facts.transactionMerkleRoot,
    roomCount,
    difficultyMultiplier: Number(difficultyMultiplier.toFixed(2)),
    eliteCount,
    treasureTier: clampNumber(stratum.stratumNumber, 1, TREASURE_TIER_COUNT),
    stratumNumber: stratum.stratumNumber,
    blockBusyness
  };
}
