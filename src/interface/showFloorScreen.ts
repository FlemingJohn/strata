import type { DungeonFloor, DungeonRoom, RoomPurpose } from "../types/dungeon";
import type { RunProgress } from "../types/runProgress";
import { FLOOR_GRID_COLUMNS, FLOOR_GRID_ROWS } from "../constants/dungeonSettings";
import { STRATUM_SETTINGS } from "../constants/stratumSettings";
import { createFloorDescription, estimateTransactionCount } from "../game/createFloorDescription";
import { generateDungeonFloor } from "../game/generateDungeonFloor";
import { chooseRelicForDepth, countFloorsAvailable } from "../game/chooseBlockForDepth";
import { createCursorMenu } from "./createCursorMenu";
import { showCombatScreen } from "./showCombatScreen";

const PURPOSE_SYMBOLS: Record<RoomPurpose, string> = {
  start: "◉",
  combat: "▣",
  relic: "◆",
  boss: "☠"
};

function findStratumColour(stratumNumber: number): string {
  const stratum = STRATUM_SETTINGS.find((entry) => entry.stratumNumber === stratumNumber);
  return stratum ? stratum.inkColour : "#9C8C7A";
}

function findRoomAt(floor: DungeonFloor, column: number, row: number): DungeonRoom | undefined {
  return floor.rooms.find(
    (room) => room.position.column === column && room.position.row === row
  );
}

function createFactRow(name: string, value: string): HTMLElement {
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

function createFloorGrid(floor: DungeonFloor): HTMLElement {
  const grid = document.createElement("div");
  grid.className = "floor-grid";

  for (let row = 0; row < FLOOR_GRID_ROWS; row++) {
    for (let column = 0; column < FLOOR_GRID_COLUMNS; column++) {
      const room = findRoomAt(floor, column, row);
      const cell = document.createElement("div");
      cell.className = room ? "floor-cell floor-cell-present" : "floor-cell";

      if (room) {
        cell.textContent = PURPOSE_SYMBOLS[room.purpose];
        cell.style.color = findStratumColour(floor.description.stratumNumber);

        if (room.purpose === "boss") {
          cell.classList.add("floor-cell-boss");
        }
      }

      grid.append(cell);
    }
  }

  return grid;
}

export function showFloorScreen(container: HTMLElement, run: RunProgress): void {
  container.replaceChildren();

  const relicForThisFloor = chooseRelicForDepth(run.provenRelics, run.depth);
  const floorsAvailable = countFloorsAvailable(run.provenRelics);

  const panel = document.createElement("section");
  panel.className = "screen-panel";

  const label = document.createElement("p");
  label.className = "screen-label";
  label.textContent = `Opening floor ${run.depth} of ${floorsAvailable}`;

  const heading = document.createElement("h2");
  heading.className = "screen-heading";

  if (!relicForThisFloor) {
    heading.textContent = "No block left to open";
    panel.append(label, heading);
    container.append(panel);
    return;
  }

  const description = createFloorDescription(run.depth, {
    blockNumber: relicForThisFloor.sourceBlockNumber,
    transactionMerkleRoot: relicForThisFloor.sourceMerkleRoot,
    merkleSiblingCount: relicForThisFloor.sourceMerkleDepth,
    continuityRootCount: 0
  });

  const floor = generateDungeonFloor(description);

  heading.textContent = `Block ${description.sourceBlockNumber.toLocaleString("en-GB")}`;

  const subheading = document.createElement("p");
  subheading.className = "screen-description";
  subheading.textContent =
    "This floor was built from that real block. Anyone can check it.";

  const facts = document.createElement("div");
  facts.className = "floor-facts";
  facts.append(
    createFactRow(
      "payments in this block",
      `about ${estimateTransactionCount(description.blockBusyness)}`
    ),
    createFactRow("rooms", String(description.roomCount)),
    createFactRow("how hard", `x${description.difficultyMultiplier}`),
    createFactRow("champions", String(description.eliteCount)),
    createFactRow("treasure", String(description.treasureTier)),
    createFactRow("built from", `${description.layoutSeed.slice(0, 18)}…`)
  );

  const legend = document.createElement("p");
  legend.className = "data-text";
  legend.textContent = "◉ start   ▣ fight   ◆ treasure   ☠ boss";

  const menu = createCursorMenu([
    {
      label: run.depth > 1 ? "Go further down" : "Go in",
      onChoose: () => {
        menu.stopListening();
        showCombatScreen(container, floor, run);
      }
    }
  ]);

  panel.append(label, heading, subheading, facts, createFloorGrid(floor), legend, menu.element);
  container.append(panel);
}
