import type { DungeonFloor } from "../types/dungeon";
import type { RunProgress } from "../types/runProgress";
import { ROOM_TILE_COLUMNS, ROOM_TILE_ROWS } from "../constants/dungeonSettings";
import { TILE_SIZE } from "../constants/tilesetSettings";
import { chooseWeaponStyle } from "../game/chooseWeaponStyle";
import { countFloorsAvailable } from "../game/chooseBlockForDepth";
import {
  HEALTH_KEPT_LOWEST_SHARE,
  HEALTH_RESTORED_BETWEEN_FLOORS
} from "../constants/runSettings";
import { showFloorScreen } from "./showFloorScreen";
import { createPlayer } from "../game/createPlayer";
import { enterFullScreen, leaveFullScreen } from "./enterFullScreen";
import { fitCanvasToViewport } from "../rendering/fitCanvasToViewport";
import { loadEnemySprites } from "../rendering/loadEnemySprites";
import { loadLpcCharacter } from "../rendering/loadLpcCharacter";
import { chooseAppearanceFromAddress, describeAppearance } from "../game/chooseAppearanceFromAddress";
import { loadPropSheets } from "../rendering/loadPropSheets";
import { loadStationSheets } from "../rendering/loadStationSheets";
import { loadTreeSheets } from "../rendering/loadTreeSheets";
import { loadAnimatedPropSheets } from "../rendering/loadAnimatedPropSheets";
import { loadLandmarkSheets } from "../rendering/loadLandmarkSheets";
import { createCombatOverlay } from "./createCombatOverlay";
import { waitForPixelFonts } from "../rendering/waitForPixelFonts";
import { loadTileSheets } from "../rendering/loadTileSheets";
import { runCombatLoop } from "../game/runCombatLoop";
import { showDeathScreen } from "./showDeathScreen";
import { showTitleScreen } from "./showTitleScreen";

const LOGICAL_WIDTH = ROOM_TILE_COLUMNS * TILE_SIZE;
const LOGICAL_HEIGHT = ROOM_TILE_ROWS * TILE_SIZE;

export function showCombatScreen(
  container: HTMLElement,
  floor: DungeonFloor,
  run: RunProgress
): void {
  container.replaceChildren();

  const relics = run.equippedRelics;

  const startRoom = floor.rooms.find((room) => room.purpose === "start") ?? floor.rooms[0];

  const stage = document.createElement("div");
  stage.className = "combat-stage";

  const frame = document.createElement("div");
  frame.className = "game-frame";

  const canvas = document.createElement("canvas");
  canvas.className = "game-viewport";

  const status = document.createElement("p");
  status.className = "combat-status";
  status.textContent = "getting the floor ready";

  const controls = document.createElement("p");
  controls.className = "combat-controls";
  controls.textContent =
    "wasd move · click swing · right click blast · space dodge · e use · esc leave";

  frame.append(canvas);
  stage.append(frame, status, controls);
  container.append(stage);

  enterFullScreen(document.documentElement);
  const fitController = fitCanvasToViewport(canvas, LOGICAL_WIDTH, LOGICAL_HEIGHT);
  const overlay = createCombatOverlay(() => fitController.findScale());
  frame.append(overlay.element);

  const player = createPlayer(
    LOGICAL_WIDTH / 2,
    LOGICAL_HEIGHT / 2,
    chooseWeaponStyle(relics),
    relics
  );

  if (run.carriedHealth !== null) {
    player.currentHealth = Math.max(
      Math.round(player.maximumHealth * HEALTH_KEPT_LOWEST_SHARE),
      Math.min(
        player.maximumHealth,
        run.carriedHealth + HEALTH_RESTORED_BETWEEN_FLOORS
      )
    );
  }

  const floorsAvailable = countFloorsAvailable(run.provenRelics);

  function goDeeper(roomsCleared: number, kills: number): void {
    fitController.stop();
    showFloorScreen(container, {
      ...run,
      depth: run.depth + 1,
      roomsClearedSoFar: run.roomsClearedSoFar + roomsCleared,
      killsSoFar: run.killsSoFar + kills,
      carriedHealth: player.currentHealth
    });
  }

  const appearance = chooseAppearanceFromAddress(run.walletAddress);

  function finishRun(outcome: "died" | "runEnded", roomsCleared: number, kills: number): void {
    fitController.stop();
    leaveFullScreen();
    showDeathScreen(container, floor, run, {
      outcome,
      roomsCleared,
      kills
    });
  }

  Promise.all([
    loadTileSheets(),
    loadLpcCharacter(appearance),
    loadEnemySprites(),
    loadPropSheets(),
    loadStationSheets(),
    loadTreeSheets(),
    loadAnimatedPropSheets(),
    loadLandmarkSheets(),
    waitForPixelFonts()
  ])
    .then((loaded) => {
      const [
        sheets,
        heroSprites,
        enemySprites,
        propSheets,
        stationSheets,
        treeSheets,
        animatedPropSheets,
        landmarkSheets
      ] = loaded;

      runCombatLoop(
        canvas,
        player,
        floor,
        startRoom,
        sheets,
        heroSprites,
        enemySprites,
        propSheets,
        treeSheets,
        stationSheets,
        animatedPropSheets,
        landmarkSheets,
        overlay,
        () => fitController.findScale(),
        {
          onRunAbandoned: () => {
            fitController.stop();
            leaveFullScreen();
            showTitleScreen(container);
          },
          onRoomEntered: (room, clearedCount) => {
            status.textContent =
              `${room.purpose} · ${clearedCount} of ${floor.rooms.length} cleared · ` +
              describeAppearance(appearance);
          },
          onStationUsed: (message) => {
            status.textContent = message;
          },
          onFloorCompleted: (clearedCount, kills) => {
            if (run.depth < floorsAvailable) {
              goDeeper(clearedCount, kills);
              return;
            }

            finishRun("runEnded", clearedCount, kills);
          },
          onPlayerDied: (roomsCleared, kills) => {
            finishRun("died", roomsCleared, kills);
          }
        }
      );
    })
    .catch((failure) => {
      status.textContent = failure instanceof Error ? failure.message : String(failure);
    });
}
