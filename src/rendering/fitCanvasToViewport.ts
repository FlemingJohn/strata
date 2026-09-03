export interface CanvasFitController {
  findScale: () => number;
  stop: () => void;
}

export function fitCanvasToViewport(
  canvas: HTMLCanvasElement,
  logicalWidth: number,
  logicalHeight: number
): CanvasFitController {
  let currentScale = 1;

  function applyLargestWholeScale(): void {
    const widthScale = window.innerWidth / logicalWidth;
    const heightScale = window.innerHeight / logicalHeight;
    currentScale = Math.max(1, Math.floor(Math.min(widthScale, heightScale)));

    canvas.style.width = `${logicalWidth * currentScale}px`;
    canvas.style.height = `${logicalHeight * currentScale}px`;
  }

  applyLargestWholeScale();
  window.addEventListener("resize", applyLargestWholeScale);
  document.addEventListener("fullscreenchange", applyLargestWholeScale);

  return {
    findScale(): number {
      return currentScale;
    },

    stop(): void {
      window.removeEventListener("resize", applyLargestWholeScale);
      document.removeEventListener("fullscreenchange", applyLargestWholeScale);
    }
  };
}
