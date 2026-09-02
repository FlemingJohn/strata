export interface AnimatedPropDefinition {
  name: string;
  sheetPath: string;
  frameSize: number;
  frameCount: number;
  framesPerSecond: number;
}

export interface PlacedAnimatedProp {
  definition: AnimatedPropDefinition;
  horizontalPosition: number;
  verticalPosition: number;
}

export type AnimatedPropSheets = Record<string, HTMLImageElement>;
