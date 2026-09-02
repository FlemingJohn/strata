import type { MusicTrack, MusicVoice, TrackName } from "../types/music";

export const MUSIC_VOLUME = 0.11;
export const MUSIC_FADE_SECONDS = 1.2;
export const SCHEDULER_INTERVAL_MILLISECONDS = 25;
export const SCHEDULE_AHEAD_SECONDS = 0.25;
export const STEPS_PER_BAR = 16;

export const NATURAL_MINOR_SEMITONES = [0, 2, 3, 5, 7, 8, 10];
export const HARMONIC_MINOR_SEMITONES = [0, 2, 3, 5, 7, 8, 11];
export const PHRYGIAN_SEMITONES = [0, 1, 3, 5, 7, 8, 10];
export const PENTATONIC_MINOR_SEMITONES = [0, 3, 5, 7, 10, 12, 14];

export const SELECTABLE_SCALES = [
  NATURAL_MINOR_SEMITONES,
  HARMONIC_MINOR_SEMITONES,
  PHRYGIAN_SEMITONES,
  PENTATONIC_MINOR_SEMITONES
];

export const LOWEST_ROOT_MIDI_NUMBER = 45;
export const HIGHEST_ROOT_MIDI_NUMBER = 56;

export const SLOWEST_BEATS_PER_MINUTE = 68;
export const FASTEST_BEATS_PER_MINUTE = 132;

const TITLE_BASS: MusicVoice = {
  name: "bass",
  waveform: "triangle",
  octaveOffset: -2,
  noteSeconds: 1.15,
  peakGain: 0.5,
  usesNoise: false,
  degreePattern: [0, -1, -1, -1, -1, -1, -1, -1, 5, -1, -1, -1, -1, -1, -1, -1]
};

const TITLE_ARPEGGIO: MusicVoice = {
  name: "arpeggio",
  waveform: "sine",
  octaveOffset: 1,
  noteSeconds: 0.42,
  peakGain: 0.2,
  usesNoise: false,
  degreePattern: [0, -1, 2, -1, 4, -1, 2, -1, 5, -1, 4, -1, 2, -1, 0, -1]
};

const COMBAT_BASS: MusicVoice = {
  name: "bass",
  waveform: "square",
  octaveOffset: -2,
  noteSeconds: 0.24,
  peakGain: 0.42,
  usesNoise: false,
  degreePattern: [0, -1, 0, -1, 5, -1, -1, -1, 3, -1, 3, -1, 4, -1, 4, -1]
};

const COMBAT_ARPEGGIO: MusicVoice = {
  name: "arpeggio",
  waveform: "square",
  octaveOffset: 1,
  noteSeconds: 0.13,
  peakGain: 0.13,
  usesNoise: false,
  degreePattern: [0, 4, 2, 4, 5, 4, 2, 4, 3, 2, 4, 2, 6, 4, 2, 0]
};

const COMBAT_PULSE: MusicVoice = {
  name: "pulse",
  waveform: "sine",
  octaveOffset: 0,
  noteSeconds: 0.06,
  peakGain: 0.22,
  usesNoise: true,
  degreePattern: [0, -1, -1, -1, 0, -1, -1, 0, 0, -1, -1, -1, 0, -1, 0, -1]
};

const BOSS_BASS: MusicVoice = {
  name: "bass",
  waveform: "sawtooth",
  octaveOffset: -2,
  noteSeconds: 0.2,
  peakGain: 0.46,
  usesNoise: false,
  degreePattern: [0, 0, -1, 0, 1, -1, 0, -1, 0, 0, -1, 0, 4, -1, 3, -1]
};

const BOSS_ARPEGGIO: MusicVoice = {
  name: "arpeggio",
  waveform: "sawtooth",
  octaveOffset: 0,
  noteSeconds: 0.11,
  peakGain: 0.12,
  usesNoise: false,
  degreePattern: [0, 1, 3, 1, 4, 3, 1, 0, 6, 4, 3, 1, 4, 3, 1, 0]
};

const BOSS_PULSE: MusicVoice = {
  name: "pulse",
  waveform: "sine",
  octaveOffset: 0,
  noteSeconds: 0.05,
  peakGain: 0.26,
  usesNoise: true,
  degreePattern: [0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, 0, 0, 0]
};

export const MUSIC_TRACKS: Record<TrackName, MusicTrack> = {
  title: {
    name: "title",
    beatsPerMinute: 74,
    stepsPerBeat: 4,
    scaleSemitones: NATURAL_MINOR_SEMITONES,
    rootMidiNumber: 45,
    voices: [TITLE_BASS, TITLE_ARPEGGIO]
  },
  combat: {
    name: "combat",
    beatsPerMinute: 102,
    stepsPerBeat: 4,
    scaleSemitones: NATURAL_MINOR_SEMITONES,
    rootMidiNumber: 45,
    voices: [COMBAT_BASS, COMBAT_ARPEGGIO, COMBAT_PULSE]
  },
  boss: {
    name: "boss",
    beatsPerMinute: 126,
    stepsPerBeat: 4,
    scaleSemitones: PHRYGIAN_SEMITONES,
    rootMidiNumber: 43,
    voices: [BOSS_BASS, BOSS_ARPEGGIO, BOSS_PULSE]
  }
};

export const BEATS_PER_MINUTE_SPREAD = 0.12;
export const PULSE_FILTER_FREQUENCY = 1800;
