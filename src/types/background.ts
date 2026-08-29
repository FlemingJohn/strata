export interface DustMote {
  horizontalRatio: number;
  verticalRatio: number;
  fallSpeedPixelsPerSecond: number;
  sizeInPixels: number;
  opacity: number;
}

export interface SedimentFleck {
  horizontalRatio: number;
  verticalRatio: number;
  sizeInPixels: number;
}

export interface BackgroundController {
  stop: () => void;
}
