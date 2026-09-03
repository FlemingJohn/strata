import { CONTROL_LINES } from "../constants/controlSettings";
import { HOW_IT_WORKS_STEPS, THE_POINT_LINES } from "../constants/howToPlaySettings";
import { createCursorMenu } from "./createCursorMenu";
import { showTitleScreen } from "./showTitleScreen";

function createControlRow(keys: string, action: string): HTMLElement {
  const row = document.createElement("div");
  row.className = "control-row";

  const keyLabel = document.createElement("span");
  keyLabel.className = "control-key";
  keyLabel.textContent = keys;

  const actionLabel = document.createElement("span");
  actionLabel.className = "control-action";
  actionLabel.textContent = action;

  row.append(keyLabel, actionLabel);
  return row;
}

function createStepRow(position: number, title: string, detail: string): HTMLElement {
  const row = document.createElement("div");
  row.className = "how-step";

  const number = document.createElement("span");
  number.className = "how-step-number";
  number.textContent = String(position);

  const body = document.createElement("div");
  body.className = "how-step-body";

  const heading = document.createElement("span");
  heading.className = "how-step-title";
  heading.textContent = title;

  const explanation = document.createElement("span");
  explanation.className = "how-step-detail";
  explanation.textContent = detail;

  body.append(heading, explanation);
  row.append(number, body);
  return row;
}

function createRoomPreview(): HTMLElement {
  const preview = document.createElement("pre");
  preview.className = "room-preview";
  preview.setAttribute("aria-hidden", "true");
  preview.textContent = [
    "#############+++############",
    "#..........................#",
    "#..OO...e..........e...OO..#",
    "#..OO..................OO..#",
    "#.........~~~~~............#",
    "#....@....~~~~~....e.......#",
    "#.........~~~~~............#",
    "#..OO..............F...OO..#",
    "#..OO..................OO..#",
    "#############+++############"
  ].join("\n");
  return preview;
}

function createLegend(): HTMLElement {
  const legend = document.createElement("p");
  legend.className = "data-text";
  legend.textContent = "@ you   e enemy   O cover you can hide behind   ~ water slows you   F a fire you can use   + way out";
  return legend;
}

export function showHowToPlayScreen(container: HTMLElement): void {
  container.replaceChildren();

  const panel = document.createElement("section");
  panel.className = "screen-panel how-to-play-panel";

  const label = document.createElement("p");
  label.className = "screen-label";
  label.textContent = "How to play";

  const heading = document.createElement("h2");
  heading.className = "screen-heading";
  heading.textContent = "Your own payments become the dungeon";

  const point = document.createElement("div");
  point.className = "column-stack";

  for (const line of THE_POINT_LINES) {
    const paragraph = document.createElement("p");
    paragraph.className = "screen-description";
    paragraph.textContent = line;
    point.append(paragraph);
  }

  const stepsLabel = document.createElement("p");
  stepsLabel.className = "screen-label";
  stepsLabel.textContent = "What happens";

  const steps = document.createElement("div");
  steps.className = "how-steps";

  HOW_IT_WORKS_STEPS.forEach((step, index) => {
    steps.append(createStepRow(index + 1, step.title, step.detail));
  });

  const roomLabel = document.createElement("p");
  roomLabel.className = "screen-label";
  roomLabel.textContent = "A room looks like this";

  const controlsLabel = document.createElement("p");
  controlsLabel.className = "screen-label";
  controlsLabel.textContent = "Controls";

  const controls = document.createElement("div");
  controls.className = "control-list";

  for (const line of CONTROL_LINES) {
    controls.append(createControlRow(line.keys, line.action));
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

  panel.append(
    label,
    heading,
    point,
    stepsLabel,
    steps,
    roomLabel,
    createRoomPreview(),
    createLegend(),
    controlsLabel,
    controls,
    menu.element
  );
  container.append(panel);
}
