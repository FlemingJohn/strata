import type { GameSettings } from "../types/gameSettings";
import { LOUDEST_VOLUME, VOLUME_STEPS } from "../constants/gameSettingsDefaults";
import { changeGameSettings, findGameSettings } from "../game/keepGameSettings";
import { createCursorMenu } from "./createCursorMenu";
import { findSoundEngine } from "../audio/sharedSoundEngine";
import { showTitleScreen } from "./showTitleScreen";

function findStepFromVolume(volume: number): number {
  return Math.round((volume / LOUDEST_VOLUME) * VOLUME_STEPS);
}

function findVolumeFromStep(step: number): number {
  return (step / VOLUME_STEPS) * LOUDEST_VOLUME;
}

function createVolumeRow(
  name: string,
  readStep: () => number,
  writeStep: (step: number) => void
): HTMLElement {
  const row = document.createElement("div");
  row.className = "setting-row";

  const label = document.createElement("span");
  label.className = "setting-name";
  label.textContent = name;

  const controls = document.createElement("div");
  controls.className = "setting-controls";

  const quieter = document.createElement("button");
  quieter.type = "button";
  quieter.className = "setting-step";
  quieter.textContent = "◀";
  quieter.setAttribute("aria-label", `Turn ${name} down`);

  const meter = document.createElement("span");
  meter.className = "setting-meter";

  const louder = document.createElement("button");
  louder.type = "button";
  louder.className = "setting-step";
  louder.textContent = "▶";
  louder.setAttribute("aria-label", `Turn ${name} up`);

  function paint(): void {
    const step = readStep();
    const filled = "■".repeat(step);
    const empty = "□".repeat(VOLUME_STEPS - step);
    meter.textContent = `${filled}${empty}`;
    meter.classList.toggle("setting-meter-silent", step === 0);
    quieter.disabled = step === 0;
    louder.disabled = step === VOLUME_STEPS;
  }

  quieter.addEventListener("click", () => {
    writeStep(Math.max(0, readStep() - 1));
    paint();
  });

  louder.addEventListener("click", () => {
    writeStep(Math.min(VOLUME_STEPS, readStep() + 1));
    paint();
  });

  controls.append(quieter, meter, louder);
  row.append(label, controls);
  paint();
  return row;
}

function createSwitchRow(
  name: string,
  detail: string,
  readValue: () => boolean,
  writeValue: (value: boolean) => void
): HTMLElement {
  const row = document.createElement("div");
  row.className = "setting-row";

  const text = document.createElement("div");
  text.className = "setting-text";

  const label = document.createElement("span");
  label.className = "setting-name";
  label.textContent = name;

  const note = document.createElement("span");
  note.className = "setting-detail";
  note.textContent = detail;

  text.append(label, note);

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "setting-switch";

  function paint(): void {
    const isOn = readValue();
    toggle.textContent = isOn ? "ON" : "OFF";
    toggle.classList.toggle("setting-switch-on", isOn);
    toggle.setAttribute("aria-pressed", isOn ? "true" : "false");
  }

  toggle.addEventListener("click", () => {
    writeValue(!readValue());
    paint();
  });

  row.append(text, toggle);
  paint();
  return row;
}

export function showSettingsScreen(container: HTMLElement): void {
  container.replaceChildren();

  const sound = findSoundEngine();

  function current(): GameSettings {
    return findGameSettings();
  }

  const panel = document.createElement("section");
  panel.className = "screen-panel";

  const label = document.createElement("p");
  label.className = "screen-label";
  label.textContent = "Settings";

  const heading = document.createElement("h2");
  heading.className = "screen-heading";
  heading.textContent = "Sound and screen";

  const note = document.createElement("p");
  note.className = "screen-description";
  note.textContent = "These are kept in this browser and used every time you play.";

  const rows = document.createElement("div");
  rows.className = "setting-list";

  rows.append(
    createVolumeRow(
      "Sound effects",
      () => findStepFromVolume(current().effectVolume),
      (step) => {
        changeGameSettings({ effectVolume: findVolumeFromStep(step) });
        sound.play("menuMove");
      }
    ),
    createVolumeRow(
      "Music",
      () => findStepFromVolume(current().musicVolume),
      (step) => changeGameSettings({ musicVolume: findVolumeFromStep(step) })
    ),
    createSwitchRow(
      "Screen shake",
      "the picture jolts when you land a hit",
      () => current().shakesTheScreen,
      (value) => changeGameSettings({ shakesTheScreen: value })
    ),
    createSwitchRow(
      "Full screen",
      "fill the screen when a run starts",
      () => current().entersFullScreen,
      (value) => changeGameSettings({ entersFullScreen: value })
    )
  );

  const menu = createCursorMenu([
    {
      label: "Back",
      onChoose: () => {
        menu.stopListening();
        showTitleScreen(container);
      }
    }
  ]);

  panel.append(label, heading, note, rows, menu.element);
  container.append(panel);
}
