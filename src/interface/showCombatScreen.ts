import type { DungeonFloor } from "../types/dungeon";
import type { EquippedRelic } from "../types/relic";
import { COMBAT_DISPLAY_SCALE, TILE_SIZE } from "../constants/tilesetSettings";
import { ROOM_TILE_COLUMNS, ROOM_TILE_ROWS } from "../constants/dungeonSettings";
import { chooseWeaponStyle, findDeepestRelic } from "../game/chooseWeaponStyle";
import { createPlayer } from "../game/createPlayer";
import { loadEnemySprites } from "../rendering/loadEnemySprites";
import { loadHeroSprites } from "../rendering/loadHeroSprites";
import { loadTileSheets } from "../rendering/loadTileSheets";
import { runCombatLoop } from "../game/runCombatLoop";
import { showDeathScreen } from "./showDeathScreen";

export function showCombatScreen(
  container: HTMLElement,
  floor: DungeonFloor,
  relics: EquippedRelic[]
): void {
  container.replaceChildren();

  const startRoom = floor.rooms.find((room) => room.purpose === "start") ?? floor.rooms[0];
  const wrapper = document.createElement("div");
  wrapper.className = "combat-wrapper";

  const status = document.createElement("p");
  status.className = "data-text";
  status.textContent = "loading the floor";

  const canvas = document.createElement("canvas");
  canvas.className = "game-viewport";
  canvas.style.width = `${ROOM_TILE_COLUMNS * TILE_SIZE * COMBAT_DISPLAY_SCALE}px`;
  canvas.style.height = `${ROOM_TILE_ROWS * TILE_SIZE * COMBAT_DISPLAY_SCALE}px`;

  const controls = document.createElement("p");
  controls.className = "data-text";
  controls.textContent = "wasd move · j attack · k roll · m mute";

  wrapper.append(status, canvas, controls);
  container.append(wrapper);

  const player = createPlayer(
    (ROOM_TILE_COLUMNS * TILE_SIZE) / 2,
    (ROOM_TILE_ROWS * TILE_SIZE) / 2,
    chooseWeaponStyle(relics),
    relics
  );

  const deepestRelic = findDeepestRelic(relics);

  Promise.all([loadTileSheets(), loadHeroSprites(), loadEnemySprites()])
    .then(([sheets, heroSprites, enemySprites]) => {
      runCombatLoop(canvas, player, floor, startRoom, sheets, heroSprites, enemySprites, {
        onRoomEntered: (room, clearedCount) => {
          status.textContent =
            `${room.purpose} room · ${clearedCount} of ${floor.rooms.length} cleared`;
        },
        onFloorCompleted: (clearedCount, kills) => {
          showDeathScreen(container, floor, relics, {
            outcome: "floorCleared",
            roomsCleared: clearedCount,
            kills,
            deepestBlockNumber: deepestRelic ? deepestRelic.sourceBlockNumber : 0
          });
        },
        onPlayerDied: (roomsCleared, kills) => {
          showDeathScreen(container, floor, relics, {
            outcome: "died",
            roomsCleared,
            kills,
            deepestBlockNumber: deepestRelic ? deepestRelic.sourceBlockNumber : 0
          });
        }
      });
    })
    .catch((failure) => {
      status.textContent = failure instanceof Error ? failure.message : String(failure);
    });
}
