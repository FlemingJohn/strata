import { createCursorMenu } from "./createCursorMenu";
import { startStrataBackground } from "../rendering/startStrataBackground";

function createBackgroundCanvas(): HTMLCanvasElement {
  const existingCanvas = document.querySelector<HTMLCanvasElement>(".background-canvas");

  if (existingCanvas) {
    return existingCanvas;
  }

  const canvas = document.createElement("canvas");
  canvas.className = "background-canvas";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);
  return canvas;
}

function createGameName(): HTMLElement {
  const name = document.createElement("h1");
  name.className = "title-screen-name";

  const beforeAccent = document.createTextNode("STRA");
  const accent = document.createElement("span");
  accent.textContent = "T";
  const afterAccent = document.createTextNode("A");

  name.append(beforeAccent, accent, afterAccent);
  return name;
}

function createWorldStatusStrip(): HTMLElement {
  const strip = document.createElement("div");
  strip.className = "world-status-strip";

  const worldLine = document.createElement("span");
  worldLine.className = "data-text";
  worldLine.textContent = "season 4 · era 1892 · 41904 blocks excavated";

  const networkLine = document.createElement("span");
  networkLine.className = "data-text network-indicator";
  networkLine.textContent = "creditcoin testnet";

  strip.append(worldLine, networkLine);
  return strip;
}

export function showTitleScreen(container: HTMLElement): void {
  container.replaceChildren();
  startStrataBackground(createBackgroundCanvas());

  const panel = document.createElement("section");
  panel.className = "screen-panel title-screen-panel";

  const tagline = document.createElement("p");
  tagline.className = "title-screen-tagline";
  tagline.textContent = "Dig through the history you made";

  const menu = createCursorMenu([
    { label: "Connect wallet", onChoose: () => undefined },
    { label: "Demo wallet", onChoose: () => undefined },
    { label: "Ladder", onChoose: () => undefined }
  ]);

  panel.append(createGameName(), tagline, menu.element, createWorldStatusStrip());
  container.append(panel);
}
