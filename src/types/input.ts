export interface PlayerInput {
  horizontal: number;
  vertical: number;
  wantsToAttack: boolean;
  wantsToRoll: boolean;
  wantsToCast: boolean;
  wantsToUseStation: boolean;
}

export interface InputReader {
  read: () => PlayerInput;
  stopListening: () => void;
}
