export interface PlayerInput {
  horizontal: number;
  vertical: number;
  wantsToAttack: boolean;
  wantsToRoll: boolean;
  wantsToCast: boolean;
  wantsToUseStation: boolean;
  pointerHorizontal: number | null;
  pointerVertical: number | null;
}

export interface InputReader {
  read: () => PlayerInput;
  stopListening: () => void;
}
