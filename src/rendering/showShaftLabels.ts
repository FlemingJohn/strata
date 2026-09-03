import type { ShaftLabel } from "../types/shaftLabel";
import { RENDER_SCALE_DIVISOR } from "../constants/backgroundSettings";
import { TILE_SIZE } from "../constants/tilesetSettings";

export interface ShaftLabelLayer {
  update: (labels: ShaftLabel[], canvasWidth: number) => void;
  remove: () => void;
}

function createLabelRow(): HTMLElement {
  const row = document.createElement("div");
  row.className = "shaft-label-row";

  const year = document.createElement("span");
  year.className = "shaft-label-year";

  const name = document.createElement("span");
  name.className = "shaft-label-name";

  row.append(year, name);
  return row;
}

export function showShaftLabels(): ShaftLabelLayer {
  const layer = document.createElement("div");
  layer.className = "shaft-label-layer";
  layer.setAttribute("aria-hidden", "true");
  document.body.prepend(layer);

  const rows: HTMLElement[] = [];

  return {
    update(labels: ShaftLabel[], canvasWidth: number): void {
      while (rows.length < labels.length) {
        const row = createLabelRow();
        layer.append(row);
        rows.push(row);
      }

      rows.forEach((row, index) => {
        const label = labels[index];

        if (!label) {
          row.hidden = true;
          return;
        }

        row.hidden = false;
        row.style.top = `${Math.round(
          (label.verticalPosition + TILE_SIZE - 6) * RENDER_SCALE_DIVISOR
        )}px`;
        row.style.width = `${canvasWidth * RENDER_SCALE_DIVISOR}px`;
        row.style.color = label.inkColour;

        const [year, name] = row.children;
        year.textContent = String(label.year);
        name.textContent = label.stratumName;
      });
    },

    remove(): void {
      layer.remove();
      rows.length = 0;
    }
  };
}
