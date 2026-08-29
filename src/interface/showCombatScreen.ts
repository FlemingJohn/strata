import type { DungeonFloor } from "../types/dungeon";
import type { EquippedRelic } from "../types/relic";
import { COMBAT_DISPLAY_SCALE, TILE_SIZE } from "../constants/tilesetSettings";
import { chooseWeaponStyle } from "../game/chooseWeaponStyle";
import { createPlayer } from "../game/createPlayer";
import { generateRoomTiles } from "../game/generateRoomTiles";
import { loadHeroSprites } from "../rendering/loadHeroSprites";
import { loadTileSheets } from "../rendering/loadTileSheets";
import { runCombatLoop } from "../game/runCombatLoop";

export function showCombatScreen(
  container: HTMLElement,
  floor: DungeonFloor,
  relics: EquippedRelic[]
): void {
  container.replaceChildren();

  const startRoom = floor.rooms.find((room) => room.purpose === "start") ?? floor.rooms[0];
  const tileMap = generateRoomTiles(startRoom, floor.description.layoutSeed);

  const wrapper = document.createElement("div");
  wrapper.className = "combat-wrapper";

  const status = document.createElement("p");
  status.className = "data-text";
  status.textContent = `block ${floor.description.sourceBlockNumber.toLocaleString("en-GB")} · loading`;

  const canvas = document.createElement("canvas");
  canvas.className = "game-viewport";
  canvas.style.width = `${tileMap.columnCount * TILE_SIZE * COMBAT_DISPLAY_SCALE}px`;
  canvas.style.height = `${tileMap.rowCount * TILE_SIZE * COMBAT_DISPLAY_SCALE}px`;

  const controls = document.createElement("p");
  controls.className = "data-text";
  controls.textContent = "wasd move · j attack · k roll";

  wrapper.append(status, canvas, controls);
  container.append(wrapper);

  const player = createPlayer(
    (tileMap.columnCount * TILE_SIZE) / 2,
    (tileMap.rowCount * TILE_SIZE) / 2,
    chooseWeaponStyle(relics),
    relics
  );

  Promise.all([loadTileSheets(), loadHeroSprites()])
    .then(([sheets, heroSprites]) => {
      status.textContent = `block ${floor.description.sourceBlockNumber.toLocaleString("en-GB")} · ${player.weaponStyle}`;
      runCombatLoop(canvas, player, tileMap, sheets, heroSprites);
    })
    .catch((failure) => {
      status.textContent = failure instanceof Error ? failure.message : String(failure);
    });
}
