const MIDI_NUMBER_OF_CONCERT_A = 69;
const FREQUENCY_OF_CONCERT_A = 440;
const SEMITONES_PER_OCTAVE = 12;

export function findNoteFrequency(midiNumber: number): number {
  return (
    FREQUENCY_OF_CONCERT_A *
    Math.pow(2, (midiNumber - MIDI_NUMBER_OF_CONCERT_A) / SEMITONES_PER_OCTAVE)
  );
}

export function findMidiNumberForDegree(
  rootMidiNumber: number,
  scaleSemitones: number[],
  degree: number,
  octaveOffset: number
): number {
  const stepsInScale = scaleSemitones.length;
  const octavesAboveRoot = Math.floor(degree / stepsInScale);
  const degreeInScale = ((degree % stepsInScale) + stepsInScale) % stepsInScale;

  return (
    rootMidiNumber +
    scaleSemitones[degreeInScale] +
    (octavesAboveRoot + octaveOffset) * SEMITONES_PER_OCTAVE
  );
}
