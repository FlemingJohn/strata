export type TrackName = "title" | "combat" | "boss";

export type VoiceName = "bass" | "arpeggio" | "pulse";

export interface MusicVoice {
  name: VoiceName;
  waveform: OscillatorType;
  octaveOffset: number;
  noteSeconds: number;
  peakGain: number;
  usesNoise: boolean;
  degreePattern: number[];
}

export interface MusicTrack {
  name: TrackName;
  beatsPerMinute: number;
  stepsPerBeat: number;
  scaleSemitones: number[];
  rootMidiNumber: number;
  voices: MusicVoice[];
}

export interface MusicShape {
  rootMidiNumber: number;
  beatsPerMinute: number;
  scaleSemitones: number[];
}

export interface MusicEngine {
  playTrack: (trackName: TrackName, shape: MusicShape | null) => void;
  stopTrack: () => void;
  setMuted: (isMuted: boolean) => void;
}
