import type { CombatHudState } from "../types/combatOverlay";

function createBar(className: string): HTMLElement {
  const track = document.createElement("div");
  track.className = `hud-bar ${className}`;

  const fill = document.createElement("div");
  fill.className = "hud-bar-fill";

  track.append(fill);
  return track;
}

function createReading(className: string): HTMLElement {
  const reading = document.createElement("span");
  reading.className = `hud-reading ${className}`;
  return reading;
}

export interface CombatHud {
  element: HTMLElement;
  update: (state: CombatHudState) => void;
}

export function createCombatHud(): CombatHud {
  const element = document.createElement("div");
  element.className = "combat-hud";

  const meters = document.createElement("div");
  meters.className = "hud-meters";

  const healthBar = createBar("hud-bar-health");
  const staminaBar = createBar("hud-bar-stamina");
  const healthReading = createReading("hud-reading-health");
  const shieldReading = createReading("hud-reading-shield");

  meters.append(healthBar, staminaBar);

  const middle = document.createElement("div");
  middle.className = "hud-middle";

  const depthReading = createReading("hud-reading-depth");
  const blockReading = createReading("hud-reading-faint");
  const roomReading = createReading("hud-reading-faint");

  middle.append(depthReading, blockReading, roomReading);

  const right = document.createElement("div");
  right.className = "hud-right";

  const enemyReading = createReading("hud-reading-enemies");
  const weaponReading = createReading("hud-reading-faint");
  const blastReading = createReading("hud-reading-blast");
  const sharpReading = createReading("hud-reading-sharp");

  right.append(enemyReading, weaponReading, blastReading, sharpReading);

  element.append(meters, healthReading, shieldReading, middle, right);

  const healthFill = healthBar.firstElementChild as HTMLElement;
  const staminaFill = staminaBar.firstElementChild as HTMLElement;

  return {
    element,

    update(state: CombatHudState): void {
      const healthShare = Math.max(0, state.currentHealth / state.maximumHealth);
      const staminaShare = Math.max(0, state.currentStamina / state.maximumStamina);

      healthFill.style.width = `${Math.round(healthShare * 100)}%`;
      staminaFill.style.width = `${Math.round(staminaShare * 100)}%`;

      healthReading.textContent = String(Math.max(0, Math.ceil(state.currentHealth)));

      const hasShield = state.currentShield > 0;
      shieldReading.hidden = !hasShield;
      shieldReading.textContent = hasShield ? `+${Math.ceil(state.currentShield)}` : "";
      depthReading.textContent = `DEPTH ${state.floorNumber}`;
      blockReading.textContent = `BLOCK ${state.sourceBlockNumber.toLocaleString("en-GB")}`;
      roomReading.textContent = `ROOM ${state.roomProgress}`;
      roomReading.classList.toggle("hud-reading-danger", state.roomPurpose === "boss");

      const isClear = state.enemiesRemaining === 0;
      enemyReading.textContent = isClear ? "WAY OUT OPEN" : `${state.enemiesRemaining} LEFT`;
      enemyReading.classList.toggle("hud-reading-clear", isClear);

      weaponReading.textContent = state.weaponStyle.toUpperCase();

      const isCastReady = state.secondsUntilCastReady <= 0;
      blastReading.textContent = isCastReady
        ? "BLAST READY"
        : `BLAST ${Math.ceil(state.secondsUntilCastReady)}s`;
      blastReading.classList.toggle("hud-reading-ready", isCastReady);

      const isSharpened = state.secondsOfSharpenedWeapon > 0;
      sharpReading.hidden = !isSharpened;
      sharpReading.textContent = isSharpened
        ? `SHARP ${Math.ceil(state.secondsOfSharpenedWeapon)}s`
        : "";
    }
  };
}
