import type { HowToPlaySection } from "../constants/howToPlaySettings";
import type { RoomPreviewController } from "../rendering/startRoomPreview";
import { CONTROL_LINES } from "../constants/controlSettings";
import { HOW_TO_PLAY_SECTIONS } from "../constants/howToPlaySettings";
import { startRoomPreview } from "../rendering/startRoomPreview";
import { startPracticeRun } from "../game/startPracticeRun";
import { showTitleScreen } from "./showTitleScreen";
import { findSoundEngine } from "../audio/sharedSoundEngine";

function createLine(text: string): HTMLElement {
  const line = document.createElement("p");
  line.className = "screen-description";
  line.textContent = text;
  return line;
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

export function showHowToPlayScreen(container: HTMLElement): void {
  container.replaceChildren();

  const sound = findSoundEngine();
  let sectionIndex = 0;
  let preview: RoomPreviewController | null = null;

  const panel = document.createElement("section");
  panel.className = "screen-panel how-to-play-panel";

  const top = document.createElement("div");
  top.className = "how-top";

  const label = document.createElement("p");
  label.className = "screen-label";

  const counter = document.createElement("span");
  counter.className = "how-counter";

  top.append(label, counter);

  const heading = document.createElement("h2");
  heading.className = "screen-heading";

  const body = document.createElement("div");
  body.className = "how-body";

  const foot = document.createElement("div");
  foot.className = "how-foot";

  const dots = document.createElement("div");
  dots.className = "how-dots";

  const buttons = document.createElement("div");
  buttons.className = "how-buttons";

  const backButton = document.createElement("button");
  backButton.type = "button";
  backButton.className = "how-button";
  backButton.textContent = "Back";

  const nextButton = document.createElement("button");
  nextButton.type = "button";
  nextButton.className = "how-button";

  buttons.append(backButton, nextButton);
  foot.append(dots, buttons);

  const dotButtons: HTMLButtonElement[] = HOW_TO_PLAY_SECTIONS.map((section, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "how-dot";
    dot.setAttribute("aria-label", `Section ${index + 1}, ${section.label}`);
    dot.addEventListener("click", () => showSection(index));
    dots.append(dot);
    return dot;
  });

  function fillBody(section: HowToPlaySection): void {
    body.replaceChildren();

    if (section.shape === "room") {
      preview = startRoomPreview();
      const frame = document.createElement("div");
      frame.className = "preview-frame";
      frame.append(preview.element);
      body.append(frame);
    }

    if (section.lines.length > 0) {
      const lines = document.createElement("div");
      lines.className = "column-stack";

      for (const line of section.lines) {
        lines.append(createLine(line));
      }

      body.append(lines);
    }

    if (section.shape === "steps") {
      const steps = document.createElement("div");
      steps.className = "how-steps";

      section.steps.forEach((step, index) => {
        steps.append(createStepRow(index + 1, step.title, step.detail));
      });

      body.append(steps);
    }

    if (section.shape === "controls") {
      const controls = document.createElement("div");
      controls.className = "control-list";

      for (const line of CONTROL_LINES) {
        controls.append(createControlRow(line.keys, line.action));
      }

      body.append(controls);
    }
  }

  function showSection(index: number): void {
    if (preview) {
      preview.stop();
      preview = null;
    }

    sectionIndex = Math.max(0, Math.min(HOW_TO_PLAY_SECTIONS.length - 1, index));
    const section = HOW_TO_PLAY_SECTIONS[sectionIndex];
    const isLast = sectionIndex === HOW_TO_PLAY_SECTIONS.length - 1;

    label.textContent = section.label;
    counter.textContent = `${sectionIndex + 1} of ${HOW_TO_PLAY_SECTIONS.length}`;
    heading.textContent = section.heading;
    fillBody(section);

    dotButtons.forEach((dot, dotIndex) => {
      dot.setAttribute("aria-current", dotIndex === sectionIndex ? "true" : "false");
    });

    backButton.disabled = sectionIndex === 0;
    nextButton.textContent = isLast ? "Play now" : "Next";
    nextButton.classList.toggle("how-button-go", isLast);
  }

  function leave(): void {
    if (preview) {
      preview.stop();
    }

    window.removeEventListener("keydown", handleKeyDown);
  }

  function handleKeyDown(event: KeyboardEvent): void {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      stepForward();
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      sound.play("menuMove");
      showSection(sectionIndex - 1);
      return;
    }

    if (event.key === "Escape") {
      leave();
      showTitleScreen(container);
    }
  }

  function stepForward(): void {
    if (sectionIndex === HOW_TO_PLAY_SECTIONS.length - 1) {
      sound.play("menuChoose");
      leave();
      startPracticeRun(container);
      return;
    }

    sound.play("menuMove");
    showSection(sectionIndex + 1);
  }

  backButton.addEventListener("click", () => {
    sound.play("menuMove");
    showSection(sectionIndex - 1);
  });

  nextButton.addEventListener("click", stepForward);

  const leaveButton = document.createElement("button");
  leaveButton.type = "button";
  leaveButton.className = "how-leave";
  leaveButton.textContent = "Back to the menu";
  leaveButton.addEventListener("click", () => {
    sound.play("menuChoose");
    leave();
    showTitleScreen(container);
  });

  window.addEventListener("keydown", handleKeyDown);

  panel.append(top, heading, body, foot, leaveButton);
  container.append(panel);
  showSection(0);
}
