export function enterFullScreen(element: HTMLElement): void {
  if (document.fullscreenElement) {
    return;
  }

  const request = element.requestFullscreen?.bind(element);

  if (!request) {
    return;
  }

  void request().catch(() => undefined);
}

export function leaveFullScreen(): void {
  if (!document.fullscreenElement) {
    return;
  }

  void document.exitFullscreen?.().catch(() => undefined);
}
