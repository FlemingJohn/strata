export interface PlayerInput {
  horizontal: number;
  vertical: number;
  wantsToAttack: boolean;
  wantsToRoll: boolean;
}

export interface InputReader {
  read: () => PlayerInput;
  stopListening: () => void;
}
