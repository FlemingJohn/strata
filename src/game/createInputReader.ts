import type { InputReader, PlayerInput } from "../types/input";

const KEYS_MOVING_UP = ["arrowup", "w"];
const KEYS_MOVING_DOWN = ["arrowdown", "s"];
const KEYS_MOVING_LEFT = ["arrowleft", "a"];
const KEYS_MOVING_RIGHT = ["arrowright", "d"];
const KEYS_ATTACKING = ["j", " "];
const KEYS_ROLLING = ["k", "shift"];

const KEYS_TO_PREVENT = new Set([
  "arrowup",
  "arrowdown",
  "arrowleft",
  "arrowright",
  " "
]);

export function createInputReader(): InputReader {
  const heldKeys = new Set<string>();

  function handleKeyDown(event: KeyboardEvent): void {
    heldKeys.add(event.key.toLowerCase());

    if (KEYS_TO_PREVENT.has(event.key.toLowerCase())) {
      event.preventDefault();
    }
  }

  function handleKeyUp(event: KeyboardEvent): void {
    heldKeys.delete(event.key.toLowerCase());
  }

  function anyKeyHeld(keys: string[]): boolean {
    return keys.some((key) => heldKeys.has(key));
  }

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);

  return {
    read(): PlayerInput {
      return {
        horizontal:
          (anyKeyHeld(KEYS_MOVING_RIGHT) ? 1 : 0) - (anyKeyHeld(KEYS_MOVING_LEFT) ? 1 : 0),
        vertical:
          (anyKeyHeld(KEYS_MOVING_DOWN) ? 1 : 0) - (anyKeyHeld(KEYS_MOVING_UP) ? 1 : 0),
        wantsToAttack: anyKeyHeld(KEYS_ATTACKING),
        wantsToRoll: anyKeyHeld(KEYS_ROLLING)
      };
    },
    stopListening(): void {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      heldKeys.clear();
    }
  };
}
