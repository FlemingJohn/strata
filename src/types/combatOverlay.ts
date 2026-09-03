export interface CombatHudState {
  currentHealth: number;
  maximumHealth: number;
  currentStamina: number;
  maximumStamina: number;
  floorNumber: number;
  sourceBlockNumber: number;
  enemiesRemaining: number;
  roomProgress: string;
  roomPurpose: string;
  weaponStyle: string;
  secondsUntilCastReady: number;
  secondsOfSharpenedWeapon: number;
}

export interface WorldPrompt {
  text: string;
  horizontalPosition: number;
  verticalPosition: number;
  isSpent: boolean;
}

export interface CombatOverlay {
  element: HTMLElement;
  updateHud: (state: CombatHudState) => void;
  showPrompt: (prompt: WorldPrompt) => void;
  hidePrompt: () => void;
}
