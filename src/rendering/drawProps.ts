import type { PlacedProp, PropSheets } from "../types/prop";
import { PROP_OPACITY } from "../constants/propSettings";

export function drawProps(
  context: CanvasRenderingContext2D,
  props: PlacedProp[],
  sheets: PropSheets
): void {
  context.globalAlpha = PROP_OPACITY;

  for (const prop of props) {
    const sheet = sheets[prop.sheetName];

    if (!sheet) {
      continue;
    }

    context.drawImage(
      sheet,
      prop.region.left,
      prop.region.top,
      prop.region.width,
      prop.region.height,
      Math.round(prop.horizontalPosition - prop.region.width / 2),
      Math.round(prop.verticalPosition - prop.region.height),
      prop.region.width,
      prop.region.height
    );
  }

  context.globalAlpha = 1;
}
