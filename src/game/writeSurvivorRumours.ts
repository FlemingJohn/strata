import type { FloorDescription } from "../types/dungeon";
import type { SurvivorName } from "../types/survivor";

function describeCrowding(blockBusyness: number): string {
  if (blockBusyness > 0.75) {
    return "packed shoulder to shoulder";
  }

  if (blockBusyness > 0.4) {
    return "busy but walkable";
  }

  return "near empty";
}

function describeTreasure(treasureTier: number): string {
  if (treasureTier >= 4) {
    return "a relic worth the whole descent";
  }

  if (treasureTier >= 3) {
    return "a relic with real weight to it";
  }

  if (treasureTier >= 2) {
    return "a relic of middling worth";
  }

  return "a thin relic, barely a keepsake";
}

export function writeSurvivorRumour(
  name: SurvivorName,
  description: FloorDescription
): string {
  if (name === "peasant") {
    return (
      `Block ${description.sourceBlockNumber.toLocaleString("en-GB")} was ` +
      `${describeCrowding(description.blockBusyness)}. ` +
      `It settled into ${description.roomCount} rooms down here.`
    );
  }

  if (name === "innkeeper") {
    const eliteCount = description.eliteCount;

    if (eliteCount === 0) {
      return "No champions walk this floor. Only the usual dead.";
    }

    return (
      `${eliteCount} champion${eliteCount === 1 ? "" : "s"} came through with that block. ` +
      "They hit harder than anything else you will meet."
    );
  }

  return (
    `The vault below holds ${describeTreasure(description.treasureTier)}. ` +
    `Everything here swings ${Math.round(description.difficultyMultiplier * 100)} percent as hard as the surface.`
  );
}
