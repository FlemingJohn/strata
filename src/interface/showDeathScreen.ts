import type { DungeonFloor } from "../types/dungeon";
import type { RunProgress } from "../types/runProgress";
import { createCursorMenu } from "./createCursorMenu";
import { showTitleScreen } from "./showTitleScreen";
import { writeRunRecord } from "../game/keepRunRecords";
import { countFloorsAvailable } from "../game/chooseBlockForDepth";

export type RunOutcome = "died" | "runEnded";

export interface RunSummary {
  outcome: RunOutcome;
  roomsCleared: number;
  kills: number;
}

function createSummaryRow(name: string, value: string): HTMLElement {
  const row = document.createElement("div");
  row.className = "floor-fact-row";

  const label = document.createElement("span");
  label.textContent = name;

  const reading = document.createElement("span");
  reading.className = "floor-fact-value";
  reading.textContent = value;

  row.append(label, reading);
  return row;
}

export function showDeathScreen(
  container: HTMLElement,
  floor: DungeonFloor,
  run: RunProgress,
  summary: RunSummary
): void {
  container.replaceChildren();

  const relics = run.equippedRelics;
  const panel = document.createElement("section");
  panel.className = "screen-panel";

  const survived = summary.outcome === "runEnded";
  const roomsCleared = run.roomsClearedSoFar + summary.roomsCleared;
  const kills = run.killsSoFar + summary.kills;
  const floorsAvailable = countFloorsAvailable(run.provenRelics);

  writeRunRecord({
    depthReached: run.depth,
    roomsCleared,
    kills,
    deepestBlockNumber: floor.description.sourceBlockNumber,
    survived,
    recordedAt: Date.now()
  });

  const heading = document.createElement("h2");
  heading.className = survived ? "death-heading death-heading-survived" : "death-heading";
  heading.textContent = survived ? "YOU REACHED THE BOTTOM" : "BURIED";

  const facts = document.createElement("div");
  facts.className = "floor-facts";
  facts.append(
    createSummaryRow("floors reached", `${run.depth} of ${floorsAvailable}`),
    createSummaryRow("rooms cleared", String(roomsCleared)),
    createSummaryRow("kills", String(kills)),
    createSummaryRow(
      "deepest block",
      floor.description.sourceBlockNumber.toLocaleString("en-GB")
    )
  );

  const relicLine = document.createElement("p");
  relicLine.className = "data-text";
  relicLine.textContent = relics.map((relic) => relic.definition.displayName).join("  ");

  const keepLine = document.createElement("p");
  keepLine.className = "screen-description";
  keepLine.textContent = "You keep every relic. They came from your own history.";

  const menu = createCursorMenu([
    {
      label: "Back to the top",
      onChoose: () => {
        menu.stopListening();
        showTitleScreen(container);
      }
    }
  ]);

  panel.append(heading, facts, relicLine, keepLine, menu.element);
  container.append(panel);
}
