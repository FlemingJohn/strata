import type { DungeonFloor } from "../types/dungeon";
import type { EquippedRelic } from "../types/relic";
import { ROOM_TILE_COLUMNS, ROOM_TILE_ROWS } from "../constants/dungeonSettings";
import { TILE_SIZE } from "../constants/tilesetSettings";
import { chooseWeaponStyle, findDeepestRelic } from "../game/chooseWeaponStyle";
import { createPlayer } from "../game/createPlayer";
import { enterFullScreen, leaveFullScreen } from "./enterFullScreen";
import { fitCanvasToViewport } from "../rendering/fitCanvasToViewport";
import { loadEnemySprites } from "../rendering/loadEnemySprites";
import { loadLpcCharacter } from "../rendering/loadLpcCharacter";
import { loadTileSheets } from "../rendering/loadTileSheets";
import { runCombatLoop } from "../game/runCombatLoop";
import { showDeathScreen } from "./showDeathScreen";

const LOGICAL_WIDTH = ROOM_TILE_COLUMNS * TILE_SIZE;
const LOGICAL_HEIGHT = ROOM_TILE_ROWS * TILE_SIZE;

export function showCombatScreen(
  container: HTMLElement,
  floor: DungeonFloor,
  relics: EquippedRelic[]
): void {
  container.replaceChildren();

  const startRoom = floor.rooms.find((room) => room.purpose === "start") ?? floor.rooms[0];

  const stage = document.createElement("div");
  stage.className = "combat-stage";

  const canvas = document.createElement("canvas");
  canvas.className = "game-viewport";

  const status = document.createElement("p");
  status.className = "combat-status";
  status.textContent = "loading the floor";

  const controls = document.createElement("p");
  controls.className = "combat-controls";
  controls.textContent = "wasd move · j attack · k roll · m mute · esc exit";

  stage.append(canvas, status, controls);
  container.append(stage);

  enterFullScreen(document.documentElement);
  const fitController = fitCanvasToViewport(canvas, LOGICAL_WIDTH, LOGICAL_HEIGHT);

  const player = createPlayer(
    LOGICAL_WIDTH / 2,
    LOGICAL_HEIGHT / 2,
    chooseWeaponStyle(relics),
    relics
  );

  const deepestRelic = findDeepestRelic(relics);

  function finishRun(outcome: "died" | "floorCleared", roomsCleared: number, kills: number): void {
    fitController.stop();
    leaveFullScreen();
    showDeathScreen(container, floor, relics, {
      outcome,
      roomsCleared,
      kills,
      deepestBlockNumber: deepestRelic ? deepestRelic.sourceBlockNumber : 0
    });
  }

  Promise.all([loadTileSheets(), loadLpcCharacter(), loadEnemySprites()])
    .then(([sheets, heroSprites, enemySprites]) => {
      runCombatLoop(canvas, player, floor, startRoom, sheets, heroSprites, enemySprites, {
        onRoomEntered: (room, clearedCount) => {
          status.textContent = `${room.purpose} · ${clearedCount} of ${floor.rooms.length} cleared`;
        },
        onFloorCompleted: (clearedCount, kills) => {
          finishRun("floorCleared", clearedCount, kills);
        },
        onPlayerDied: (roomsCleared, kills) => {
          finishRun("died", roomsCleared, kills);
        }
      });
    })
    .catch((failure) => {
      status.textContent = failure instanceof Error ? failure.message : String(failure);
    });
}
