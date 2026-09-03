export const KEYS_MOVING_UP = ["w", "arrowup"];
export const KEYS_MOVING_DOWN = ["s", "arrowdown"];
export const KEYS_MOVING_LEFT = ["a", "arrowleft"];
export const KEYS_MOVING_RIGHT = ["d", "arrowright"];

export const KEYS_ATTACKING = ["j"];
export const KEYS_ROLLING = [" ", "shift"];
export const KEYS_CASTING = ["q"];
export const KEYS_USING = ["e", "f"];
export const KEYS_LEAVING = ["escape"];

export const MOUSE_BUTTON_ATTACK = 0;
export const MOUSE_BUTTON_CAST = 2;

export const KEYS_THE_BROWSER_MUST_NOT_HANDLE = [
  " ",
  "arrowup",
  "arrowdown",
  "arrowleft",
  "arrowright"
];

export interface ControlLine {
  keys: string;
  action: string;
}

export const CONTROL_LINES: ControlLine[] = [
  { keys: "W A S D", action: "move" },
  { keys: "Left click", action: "swing at where you point" },
  { keys: "Right click", action: "blast everything around you" },
  { keys: "Space", action: "dodge roll, you cannot be hurt mid roll" },
  { keys: "E", action: "use a fire or a forge you are standing at" },
  { keys: "M", action: "sound on and off" },
  { keys: "Esc", action: "leave the run" }
];

export const POINTER_DEAD_ZONE_PIXELS = 10;
