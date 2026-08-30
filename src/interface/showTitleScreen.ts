import { createCursorMenu } from "./createCursorMenu";
import { showProvingScreen } from "./showProvingScreen";
import { loadLpcCharacter } from "../rendering/loadLpcCharacter";
import { drawLpcCharacter } from "../rendering/drawLpcCharacter";
import { startDungeonBackground } from "../rendering/startDungeonBackground";
import {
  LPC_FRAMES_PER_SECOND,
  LPC_FRAME_SIZE,
  TITLE_SCREEN_HERO_SCALE
} from "../constants/lpcCharacterSettings";

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

function createStandingHero(): HTMLCanvasElement {
  const heroCanvas = document.createElement("canvas");
  heroCanvas.className = "title-screen-hero";
  heroCanvas.setAttribute("aria-hidden", "true");
  heroCanvas.width = LPC_FRAME_SIZE;
  heroCanvas.height = LPC_FRAME_SIZE;
  heroCanvas.style.width = `${LPC_FRAME_SIZE * TITLE_SCREEN_HERO_SCALE}px`;
  heroCanvas.style.height = `${LPC_FRAME_SIZE * TITLE_SCREEN_HERO_SCALE}px`;

  const context = heroCanvas.getContext("2d");

  if (!context) {
    return heroCanvas;
  }

  context.imageSmoothingEnabled = false;

  loadLpcCharacter()
    .then((sheets) => {
      const sheet = sheets.idle;
      let frameIndex = 0;

      window.setInterval(() => {
        context.clearRect(0, 0, LPC_FRAME_SIZE, LPC_FRAME_SIZE);
        drawLpcCharacter(context, sheet, frameIndex, "down", 0, 0);
        frameIndex = (frameIndex + 1) % sheet.frameCount;
      }, 1000 / LPC_FRAMES_PER_SECOND.idle);
    })
    .catch(() => {
      heroCanvas.remove();
    });

  return heroCanvas;
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
  startDungeonBackground(createBackgroundCanvas());

  const panel = document.createElement("section");
  panel.className = "screen-panel title-screen-panel";

  const tagline = document.createElement("p");
  tagline.className = "title-screen-tagline";
  tagline.textContent = "Dig through the history you made";

  const menu = createCursorMenu([
    { label: "Connect wallet", onChoose: () => leaveForProving() },
    { label: "Demo wallet", onChoose: () => leaveForProving() },
    { label: "Ladder", onChoose: () => undefined }
  ]);

  function leaveForProving(): void {
    menu.stopListening();
    showProvingScreen(container);
  }

  panel.append(
    createGameName(),
    tagline,
    createStandingHero(),
    menu.element,
    createWorldStatusStrip()
  );
  container.append(panel);
}
