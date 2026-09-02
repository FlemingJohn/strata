let sharedAudioContext: AudioContext | null = null;

export function findAudioContext(): AudioContext | null {
  if (sharedAudioContext) {
    return sharedAudioContext;
  }

  const AudioContextConstructor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioContextConstructor) {
    return null;
  }

  sharedAudioContext = new AudioContextConstructor();
  return sharedAudioContext;
}

export function resumeAudioContext(): void {
  const context = findAudioContext();

  if (context && context.state === "suspended") {
    void context.resume();
  }
}
