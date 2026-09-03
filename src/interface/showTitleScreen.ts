import { createCursorMenu } from "./createCursorMenu";
import { showProvingScreen } from "./showProvingScreen";
import { startDungeonBackground } from "../rendering/startDungeonBackground";
import { fetchAttestationReach } from "../chain/fetchAttestationReach";
import { findMusicEngine } from "../audio/sharedMusicEngine";
import { findSoundEngine } from "../audio/sharedSoundEngine";
import { resumeAudioContext } from "../audio/findAudioContext";
import { showLadderScreen } from "./showLadderScreen";
import { showHowToPlayScreen } from "./showHowToPlayScreen";
import { startPracticeRun } from "../game/startPracticeRun";
import { TITLE_SCREEN_CONTROL_HINT } from "../constants/titleScreenSettings";

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
  worldLine.textContent = "reading the attested range";

  const networkLine = document.createElement("span");
  networkLine.className = "data-text network-indicator network-indicator-waiting";
  networkLine.textContent = "creditcoin testnet";

  fetchAttestationReach()
    .then((reach) => {
      worldLine.textContent =
        `${reach.latestAttestedBlock.toLocaleString("en-GB")} blocks attested · ` +
        `every block from ${reach.earliestAttestedBlock.toLocaleString("en-GB")}`;
      networkLine.classList.remove("network-indicator-waiting");
      networkLine.classList.add("network-indicator-reached");
    })
    .catch(() => {
      worldLine.textContent = "the attested range could not be read";
      networkLine.classList.remove("network-indicator-waiting");
      networkLine.classList.add("network-indicator-unreached");
    });

  strip.append(worldLine, networkLine);
  return strip;
}

function createControlHint(): HTMLElement {
  const hint = document.createElement("p");
  hint.className = "title-screen-hint";
  hint.textContent = TITLE_SCREEN_CONTROL_HINT;
  return hint;
}

function startTitleMusicOnFirstAction(): () => void {
  const music = findMusicEngine();

  function beginPlaying(): void {
    resumeAudioContext();
    music.playTrack("title", null);
    window.removeEventListener("keydown", beginPlaying);
    window.removeEventListener("pointerdown", beginPlaying);
  }

  window.addEventListener("keydown", beginPlaying);
  window.addEventListener("pointerdown", beginPlaying);

  return function stopWaiting(): void {
    window.removeEventListener("keydown", beginPlaying);
    window.removeEventListener("pointerdown", beginPlaying);
  };
}

export function showTitleScreen(container: HTMLElement): void {
  container.replaceChildren();
  startDungeonBackground(createBackgroundCanvas());

  findSoundEngine();
  const music = findMusicEngine();
  music.playTrack("title", null);
  const stopWaitingForFirstAction = startTitleMusicOnFirstAction();

  const panel = document.createElement("section");
  panel.className = "screen-panel title-screen-panel";

  const tagline = document.createElement("p");
  tagline.className = "title-screen-tagline";
  tagline.textContent = "Dig through the history you made";

  const menu = createCursorMenu([
    { label: "Play now", onChoose: () => leaveForPractice() },
    { label: "Connect wallet", onChoose: () => leaveForProving() },
    { label: "Demo wallet", onChoose: () => leaveForProving() },
    { label: "How to play", onChoose: () => leaveForHowToPlay() },
    { label: "Ladder", onChoose: () => leaveForLadder() }
  ]);

  function leaveForProving(): void {
    menu.stopListening();
    stopWaitingForFirstAction();
    showProvingScreen(container);
  }

  function leaveForPractice(): void {
    menu.stopListening();
    stopWaitingForFirstAction();
    startPracticeRun(container);
  }

  function leaveForHowToPlay(): void {
    menu.stopListening();
    stopWaitingForFirstAction();
    showHowToPlayScreen(container);
  }

  function leaveForLadder(): void {
    menu.stopListening();
    stopWaitingForFirstAction();
    showLadderScreen(container);
  }

  panel.append(
    createGameName(),
    tagline,
    menu.element,
    createWorldStatusStrip(),
    createControlHint()
  );
  container.append(panel);
}
