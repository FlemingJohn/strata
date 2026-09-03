import type { EquippedRelic } from "../types/relic";
import { createRelicCard } from "./createRelicCard";
import { findSoundEngine } from "../audio/sharedSoundEngine";
import { createCursorMenu } from "./createCursorMenu";
import { showLoadoutScreen } from "./showLoadoutScreen";

export function showRelicScreen(container: HTMLElement, relics: EquippedRelic[]): void {
  container.replaceChildren();

  const panel = document.createElement("section");
  panel.className = "screen-panel";

  const label = document.createElement("p");
  label.className = "screen-label";
  label.textContent = "Dug out of your own history";

  const heading = document.createElement("h2");
  heading.className = "screen-heading";
  heading.textContent = `${relics.length} relics found`;

  const grid = document.createElement("div");
  grid.className = "relic-grid";
  grid.append(...relics.map(createRelicCard));
  findSoundEngine().play("relicFound");

  const menu = createCursorMenu([
    {
      label: "Choose three",
      onChoose: () => {
        menu.stopListening();
        showLoadoutScreen(container, relics);
      }
    }
  ]);

  panel.append(label, heading, grid, menu.element);
  container.append(panel);
}
