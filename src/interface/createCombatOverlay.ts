import type { CombatHudState, CombatOverlay, WorldPrompt } from "../types/combatOverlay";
import { createCombatHud } from "./createCombatHud";

export function createCombatOverlay(findScale: () => number): CombatOverlay {
  const element = document.createElement("div");
  element.className = "combat-overlay";

  const hud = createCombatHud();

  const prompt = document.createElement("div");
  prompt.className = "world-prompt";
  prompt.hidden = true;

  const promptKey = document.createElement("span");
  promptKey.className = "world-prompt-key";
  promptKey.textContent = "F";

  const promptText = document.createElement("span");
  promptText.className = "world-prompt-text";

  prompt.append(promptKey, promptText);
  element.append(hud.element, prompt);

  return {
    element,

    updateHud(state: CombatHudState): void {
      hud.update(state);
    },

    showPrompt(nextPrompt: WorldPrompt): void {
      const scale = findScale();
      prompt.hidden = false;
      prompt.style.left = `${Math.round(nextPrompt.horizontalPosition * scale)}px`;
      prompt.style.top = `${Math.round(nextPrompt.verticalPosition * scale)}px`;
      prompt.classList.toggle("world-prompt-spent", nextPrompt.isSpent);
      promptText.textContent = nextPrompt.text;
    },

    hidePrompt(): void {
      prompt.hidden = true;
    }
  };
}
