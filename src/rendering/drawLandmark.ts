import type { LandmarkSheets, PlacedLandmark } from "../types/landmark";
import { LANDMARK_OPACITY } from "../constants/landmarkSettings";

export function drawLandmark(
  context: CanvasRenderingContext2D,
  landmark: PlacedLandmark | null,
  sheets: LandmarkSheets
): void {
  if (!landmark) {
    return;
  }

  const sheet = sheets[landmark.definition.name];

  if (!sheet) {
    return;
  }

  context.globalAlpha = LANDMARK_OPACITY;
  context.drawImage(
    sheet,
    landmark.region.left,
    landmark.region.top,
    landmark.region.width,
    landmark.region.height,
    Math.round(landmark.horizontalPosition - landmark.region.width / 2),
    Math.round(landmark.verticalPosition - landmark.region.height),
    landmark.region.width,
    landmark.region.height
  );
  context.globalAlpha = 1;
}
