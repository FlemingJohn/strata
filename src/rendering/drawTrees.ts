import type { PlacedProp, PropSheets } from "../types/prop";

export function drawTrees(
  context: CanvasRenderingContext2D,
  trees: PlacedProp[],
  sheets: PropSheets
): void {
  for (const tree of trees) {
    const sheet = sheets[tree.sheetName];

    if (!sheet) {
      continue;
    }

    context.drawImage(
      sheet,
      tree.region.left,
      tree.region.top,
      tree.region.width,
      tree.region.height,
      Math.round(tree.horizontalPosition - tree.region.width / 2),
      Math.round(tree.verticalPosition - tree.region.height),
      tree.region.width,
      tree.region.height
    );
  }
}
