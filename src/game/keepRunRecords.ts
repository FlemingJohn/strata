import type { RunRecord } from "../types/runRecord";
import { RUN_RECORDS_KEPT, RUN_RECORD_STORAGE_KEY } from "../constants/ladderSettings";

function isRunRecord(candidate: unknown): candidate is RunRecord {
  if (typeof candidate !== "object" || candidate === null) {
    return false;
  }

  const record = candidate as Record<string, unknown>;

  return (
    typeof record.depthReached === "number" &&
    typeof record.roomsCleared === "number" &&
    typeof record.kills === "number" &&
    typeof record.deepestBlockNumber === "number" &&
    typeof record.survived === "boolean" &&
    typeof record.recordedAt === "number"
  );
}

export function readRunRecords(): RunRecord[] {
  try {
    const stored = window.localStorage.getItem(RUN_RECORD_STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isRunRecord);
  } catch {
    return [];
  }
}

export function rankRunRecords(records: RunRecord[]): RunRecord[] {
  return [...records].sort((first, second) => {
    if (second.depthReached !== first.depthReached) {
      return second.depthReached - first.depthReached;
    }

    if (second.roomsCleared !== first.roomsCleared) {
      return second.roomsCleared - first.roomsCleared;
    }

    return second.kills - first.kills;
  });
}

export function writeRunRecord(record: RunRecord): void {
  try {
    const kept = rankRunRecords([...readRunRecords(), record]).slice(0, RUN_RECORDS_KEPT);
    window.localStorage.setItem(RUN_RECORD_STORAGE_KEY, JSON.stringify(kept));
  } catch {
    return;
  }
}
