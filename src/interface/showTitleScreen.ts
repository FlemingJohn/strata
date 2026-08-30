import { createCursorMenu } from "./createCursorMenu";
import { showProvingScreen } from "./showProvingScreen";
import { loadSpriteSheet } from "../rendering/loadSpriteSheet";
import { playSpriteAnimation } from "../rendering/playSpriteAnimation";
import { startDungeonBackground } from "../rendering/startDungeonBackground";
import {
  HERO_BODY_CROP_REGION,
  HERO_STANDING_DOWN_PATH,
  TITLE_SCREEN_HERO_FRAMES_PER_SECOND,
  TITLE_SCREEN_HERO_SCALE
} from "../constants/spriteSheetPaths";
import { DEFAULT_TUNIC_COLOUR } from "../constants/heroClothingSettings";

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

  loadSpriteSheet(HERO_STANDING_DOWN_PATH)
    .then((spriteSheet) => {
      playSpriteAnimation(
        heroCanvas,
        spriteSheet,
        TITLE_SCREEN_HERO_FRAMES_PER_SECOND,
        TITLE_SCREEN_HERO_SCALE,
        HERO_BODY_CROP_REGION,
        DEFAULT_TUNIC_COLOUR,
        "standingDown"
      );
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
