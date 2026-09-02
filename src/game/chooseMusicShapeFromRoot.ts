import type { MusicShape } from "../types/music";
import {
  BEATS_PER_MINUTE_SPREAD,
  HIGHEST_ROOT_MIDI_NUMBER,
  LOWEST_ROOT_MIDI_NUMBER,
  SELECTABLE_SCALES
} from "../constants/musicSettings";
import { createSeededRandomFromHash } from "./createSeededRandomFromHash";

export function chooseMusicShapeFromRoot(
  transactionMerkleRoot: string,
  baseBeatsPerMinute: number
): MusicShape {
  const nextRandomNumber = createSeededRandomFromHash(`${transactionMerkleRoot}:music`);

  const rootSpread = HIGHEST_ROOT_MIDI_NUMBER - LOWEST_ROOT_MIDI_NUMBER;
  const rootMidiNumber =
    LOWEST_ROOT_MIDI_NUMBER + Math.floor(nextRandomNumber() * (rootSpread + 1));

  const scaleSemitones =
    SELECTABLE_SCALES[Math.floor(nextRandomNumber() * SELECTABLE_SCALES.length)];

  const tempoShift = (nextRandomNumber() * 2 - 1) * BEATS_PER_MINUTE_SPREAD;
  const beatsPerMinute = Math.round(baseBeatsPerMinute * (1 + tempoShift));

  return { rootMidiNumber, beatsPerMinute, scaleSemitones };
}
