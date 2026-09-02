import type { RunRecord } from "../types/runRecord";
import { LADDER_ROWS_SHOWN } from "../constants/ladderSettings";
import { createCursorMenu } from "./createCursorMenu";
import { rankRunRecords, readRunRecords } from "../game/keepRunRecords";
import { showTitleScreen } from "./showTitleScreen";

function createLadderRow(position: number, record: RunRecord): HTMLElement {
  const row = document.createElement("div");
  row.className = "floor-fact-row";

  const label = document.createElement("span");
  label.textContent = `${position}.  depth ${record.depthReached}${record.survived ? "  cleared" : ""}`;

  const reading = document.createElement("span");
  reading.className = "floor-fact-value";
  reading.textContent = `${record.roomsCleared} rooms · ${record.kills} kills`;

  row.append(label, reading);
  return row;
}

export function showLadderScreen(container: HTMLElement): void {
  container.replaceChildren();

  const panel = document.createElement("section");
  panel.className = "screen-panel";

  const heading = document.createElement("h2");
  heading.className = "death-heading";
  heading.textContent = "LADDER";

  const scope = document.createElement("p");
  scope.className = "screen-description";
  scope.textContent = "Runs recorded in this browser";

  const records = rankRunRecords(readRunRecords()).slice(0, LADDER_ROWS_SHOWN);
  const rows = document.createElement("div");
  rows.className = "floor-facts";

  if (records.length === 0) {
    const empty = document.createElement("p");
    empty.className = "data-text";
    empty.textContent = "No runs yet. Dig one.";
    rows.append(empty);
  } else {
    records.forEach((record, index) => {
      rows.append(createLadderRow(index + 1, record));
    });
  }

  const menu = createCursorMenu([
    {
      label: "Back",
      onChoose: () => {
        menu.stopListening();
        showTitleScreen(container);
      }
    }
  ]);

  panel.append(heading, scope, rows, menu.element);
  container.append(panel);
}
