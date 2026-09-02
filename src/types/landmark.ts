import type { PropRegion } from "../constants/propSettings";

export interface LandmarkDefinition {
  name: string;
  sheetPath: string;
  regions: PropRegion[];
}

export interface PlacedLandmark {
  definition: LandmarkDefinition;
  region: PropRegion;
  horizontalPosition: number;
  verticalPosition: number;
}

export type LandmarkSheets = Record<string, HTMLImageElement>;
