import type { PropRegion } from "../constants/propSettings";

export interface PlacedProp {
  sheetName: string;
  region: PropRegion;
  horizontalPosition: number;
  verticalPosition: number;
}

export type PropSheets = Record<string, HTMLImageElement>;
