import type { InputReader, PlayerInput } from "../types/input";
import {
  KEYS_ATTACKING,
  KEYS_CASTING,
  KEYS_LEAVING,
  KEYS_MOVING_DOWN,
  KEYS_MOVING_LEFT,
  KEYS_MOVING_RIGHT,
  KEYS_MOVING_UP,
  KEYS_ROLLING,
  KEYS_THE_BROWSER_MUST_NOT_HANDLE,
  KEYS_USING,
  MOUSE_BUTTON_ATTACK,
  MOUSE_BUTTON_CAST
} from "../constants/controlSettings";

const KEYS_TO_PREVENT = new Set(KEYS_THE_BROWSER_MUST_NOT_HANDLE);

export interface InputReaderSettings {
  canvas: HTMLCanvasElement;
  findScale: () => number;
  onLeaveRequested: () => void;
}

export function createInputReader(settings: InputReaderSettings): InputReader {
  const heldKeys = new Set<string>();
  const heldMouseButtons = new Set<number>();

  let pointerHorizontal: number | null = null;
  let pointerVertical: number | null = null;

  function handleKeyDown(event: KeyboardEvent): void {
    const key = event.key.toLowerCase();
    heldKeys.add(key);

    if (KEYS_TO_PREVENT.has(key)) {
      event.preventDefault();
    }

    if (KEYS_LEAVING.includes(key)) {
      settings.onLeaveRequested();
    }
  }

  function handleKeyUp(event: KeyboardEvent): void {
    heldKeys.delete(event.key.toLowerCase());
  }

  function handleMouseDown(event: MouseEvent): void {
    heldMouseButtons.add(event.button);
  }

  function handleMouseUp(event: MouseEvent): void {
    heldMouseButtons.delete(event.button);
  }

  function handleMouseMove(event: MouseEvent): void {
    const bounds = settings.canvas.getBoundingClientRect();
    const scale = settings.findScale();

    pointerHorizontal = (event.clientX - bounds.left) / scale;
    pointerVertical = (event.clientY - bounds.top) / scale;
  }

  function handleMouseLeave(): void {
    pointerHorizontal = null;
    pointerVertical = null;
    heldMouseButtons.clear();
  }

  function blockContextMenu(event: MouseEvent): void {
    event.preventDefault();
  }

  function anyKeyHeld(keys: string[]): boolean {
    return keys.some((key) => heldKeys.has(key));
  }

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
  settings.canvas.addEventListener("mousedown", handleMouseDown);
  window.addEventListener("mouseup", handleMouseUp);
  settings.canvas.addEventListener("mousemove", handleMouseMove);
  settings.canvas.addEventListener("mouseleave", handleMouseLeave);
  settings.canvas.addEventListener("contextmenu", blockContextMenu);

  return {
    read(): PlayerInput {
      return {
        horizontal:
          (anyKeyHeld(KEYS_MOVING_RIGHT) ? 1 : 0) - (anyKeyHeld(KEYS_MOVING_LEFT) ? 1 : 0),
        vertical:
          (anyKeyHeld(KEYS_MOVING_DOWN) ? 1 : 0) - (anyKeyHeld(KEYS_MOVING_UP) ? 1 : 0),
        wantsToAttack:
          anyKeyHeld(KEYS_ATTACKING) || heldMouseButtons.has(MOUSE_BUTTON_ATTACK),
        wantsToRoll: anyKeyHeld(KEYS_ROLLING),
        wantsToCast: anyKeyHeld(KEYS_CASTING) || heldMouseButtons.has(MOUSE_BUTTON_CAST),
        wantsToUseStation: anyKeyHeld(KEYS_USING),
        pointerHorizontal,
        pointerVertical
      };
    },

    stopListening(): void {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mouseup", handleMouseUp);
      settings.canvas.removeEventListener("mousedown", handleMouseDown);
      settings.canvas.removeEventListener("mousemove", handleMouseMove);
      settings.canvas.removeEventListener("mouseleave", handleMouseLeave);
      settings.canvas.removeEventListener("contextmenu", blockContextMenu);
      heldKeys.clear();
      heldMouseButtons.clear();
    }
  };
}
