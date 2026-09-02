import type { PlacedStation } from "../types/station";
import type { PlayerCharacter } from "../types/player";

export function useStation(player: PlayerCharacter, station: PlacedStation): string {
  const definition = station.definition;
  station.hasBeenUsed = true;

  if (definition.reward === "restoresHealth") {
    player.currentHealth = Math.min(
      player.maximumHealth,
      player.currentHealth + definition.rewardAmount
    );

    return `${definition.label} restores ${definition.rewardAmount} health`;
  }

  if (definition.reward === "restoresStamina") {
    player.currentStamina = player.maximumStamina;
    player.secondsUntilCastReady = 0;

    return `${definition.label} refills stamina and readies the nova`;
  }

  if (definition.reward === "sharpensWeapon") {
    player.secondsOfSharpenedWeapon = definition.rewardAmount;

    return `${definition.label} sharpens the blade for ${definition.rewardAmount} seconds`;
  }

  player.maximumHealth += definition.rewardAmount;
  player.currentHealth += definition.rewardAmount;

  return `${definition.label} raises maximum health by ${definition.rewardAmount}`;
}

export function countdownSharpenedWeapon(
  player: PlayerCharacter,
  secondsElapsed: number
): void {
  if (player.secondsOfSharpenedWeapon <= 0) {
    return;
  }

  player.secondsOfSharpenedWeapon = Math.max(0, player.secondsOfSharpenedWeapon - secondsElapsed);
}
