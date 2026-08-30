export interface CanvasFitController {
  stop: () => void;
}

export function fitCanvasToViewport(
  canvas: HTMLCanvasElement,
  logicalWidth: number,
  logicalHeight: number
): CanvasFitController {
  function applyLargestWholeScale(): void {
    const widthScale = window.innerWidth / logicalWidth;
    const heightScale = window.innerHeight / logicalHeight;
    const wholeScale = Math.max(1, Math.floor(Math.min(widthScale, heightScale)));

    canvas.style.width = `${logicalWidth * wholeScale}px`;
    canvas.style.height = `${logicalHeight * wholeScale}px`;
  }

  applyLargestWholeScale();
  window.addEventListener("resize", applyLargestWholeScale);
  document.addEventListener("fullscreenchange", applyLargestWholeScale);

  return {
    stop(): void {
      window.removeEventListener("resize", applyLargestWholeScale);
      document.removeEventListener("fullscreenchange", applyLargestWholeScale);
    }
  };
}
