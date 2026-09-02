import type { PlayerCharacter } from "../types/player";

const HUD_HEIGHT = 22;
const BAR_WIDTH = 90;
const BAR_HEIGHT = 6;

const BACKDROP_COLOUR = "#0B0908";
const HEALTH_COLOUR = "#C4523A";
const HEALTH_EMPTY_COLOUR = "#2A1512";
const STAMINA_COLOUR = "#5B9C77";
const STAMINA_EMPTY_COLOUR = "#16221B";
const LABEL_COLOUR = "#9C8C7A";
const HIGHLIGHT_COLOUR = "#E0A233";
const SHARPENED_COLOUR = "#F5D18A";

export function drawCombatHud(
  context: CanvasRenderingContext2D,
  canvasWidth: number,
  player: PlayerCharacter,
  floorNumber: number,
  sourceBlockNumber: number,
  enemiesRemaining: number,
  roomProgress: string,
  roomPurpose: string
): void {
  context.fillStyle = BACKDROP_COLOUR;
  context.fillRect(0, 0, canvasWidth, HUD_HEIGHT);

  context.fillStyle = HEALTH_EMPTY_COLOUR;
  context.fillRect(5, 4, BAR_WIDTH, BAR_HEIGHT);
  context.fillStyle = HEALTH_COLOUR;
  context.fillRect(
    5,
    4,
    Math.max(0, Math.round((player.currentHealth / player.maximumHealth) * BAR_WIDTH)),
    BAR_HEIGHT
  );

  context.fillStyle = STAMINA_EMPTY_COLOUR;
  context.fillRect(5, 12, BAR_WIDTH, BAR_HEIGHT - 2);
  context.fillStyle = STAMINA_COLOUR;
  context.fillRect(
    5,
    12,
    Math.max(0, Math.round((player.currentStamina / player.maximumStamina) * BAR_WIDTH)),
    BAR_HEIGHT - 2
  );

  context.font = "8px monospace";
  context.fillStyle = LABEL_COLOUR;
  context.fillText(`${Math.max(0, Math.ceil(player.currentHealth))}`, BAR_WIDTH + 10, 10);

  context.fillStyle = HIGHLIGHT_COLOUR;
  context.fillText(`DEPTH ${floorNumber}`, BAR_WIDTH + 34, 10);

  context.fillStyle = LABEL_COLOUR;
  context.fillText(`blk ${sourceBlockNumber.toLocaleString("en-GB")}`, BAR_WIDTH + 34, 19);

  context.fillStyle = enemiesRemaining > 0 ? HEALTH_COLOUR : STAMINA_COLOUR;
  context.fillText(
    enemiesRemaining > 0 ? `${enemiesRemaining} LEFT` : "CLEAR",
    canvasWidth - 46,
    10
  );

  context.fillStyle = LABEL_COLOUR;
  context.fillText(player.weaponStyle.toUpperCase(), canvasWidth - 46, 19);

  context.fillStyle = roomPurpose === "boss" ? HEALTH_COLOUR : LABEL_COLOUR;
  context.fillText(`ROOM ${roomProgress}`, BAR_WIDTH + 90, 10);

  if (enemiesRemaining === 0) {
    context.fillStyle = HIGHLIGHT_COLOUR;
    context.fillText("EXITS OPEN", BAR_WIDTH + 90, 19);
  }

  const castReady = player.secondsUntilCastReady <= 0;
  context.fillStyle = castReady ? HIGHLIGHT_COLOUR : LABEL_COLOUR;
  context.fillText(
    castReady ? "NOVA READY" : `NOVA ${Math.ceil(player.secondsUntilCastReady)}s`,
    BAR_WIDTH + 160,
    10
  );

  if (player.secondsOfSharpenedWeapon > 0) {
    context.fillStyle = SHARPENED_COLOUR;
    context.fillText(
      `SHARP ${Math.ceil(player.secondsOfSharpenedWeapon)}s`,
      BAR_WIDTH + 160,
      19
    );
  }
}
