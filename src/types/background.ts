export interface DustMote {
  horizontalRatio: number;
  verticalRatio: number;
  fallSpeedPixelsPerSecond: number;
  sizeInPixels: number;
  opacity: number;
}

export interface BackgroundController {
  stop: () => void;
}
