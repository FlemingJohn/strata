import type { DungeonFloor } from "../types/dungeon";
import type { EquippedRelic } from "../types/relic";
import { createCursorMenu } from "./createCursorMenu";
import { showTitleScreen } from "./showTitleScreen";
import { writeRunRecord } from "../game/keepRunRecords";

export type RunOutcome = "died" | "floorCleared";

export interface RunSummary {
  outcome: RunOutcome;
  roomsCleared: number;
  kills: number;
  deepestBlockNumber: number;
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
  relics: EquippedRelic[],
  summary: RunSummary
): void {
  container.replaceChildren();

  const panel = document.createElement("section");
  panel.className = "screen-panel";

  const survived = summary.outcome === "floorCleared";

  writeRunRecord({
    depthReached: floor.description.floorNumber,
    roomsCleared: summary.roomsCleared,
    kills: summary.kills,
    deepestBlockNumber: summary.deepestBlockNumber,
    survived,
    recordedAt: Date.now()
  });

  const heading = document.createElement("h2");
  heading.className = survived ? "death-heading death-heading-survived" : "death-heading";
  heading.textContent = survived ? "FLOOR CLEARED" : "BURIED";

  const facts = document.createElement("div");
  facts.className = "floor-facts";
  facts.append(
    createSummaryRow("depth reached", String(floor.description.floorNumber)),
    createSummaryRow("rooms cleared", String(summary.roomsCleared)),
    createSummaryRow("kills", String(summary.kills)),
    createSummaryRow("deepest block", summary.deepestBlockNumber.toLocaleString("en-GB"))
  );

  const relicLine = document.createElement("p");
  relicLine.className = "data-text";
  relicLine.textContent = relics.map((relic) => relic.definition.displayName).join("  ");

  const keepLine = document.createElement("p");
  keepLine.className = "screen-description";
  keepLine.textContent = "Your relics are kept. They are your history.";

  const menu = createCursorMenu([
    {
      label: "Return to the surface",
      onChoose: () => {
        menu.stopListening();
        showTitleScreen(container);
      }
    }
  ]);

  panel.append(heading, facts, relicLine, keepLine, menu.element);
  container.append(panel);
}
