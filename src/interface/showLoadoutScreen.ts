import type { EquippedRelic } from "../types/relic";
import { MAXIMUM_EQUIPPED_RELICS } from "../constants/playerSettings";
import {
  CRUSH_DAMAGE,
  CRUSH_DURATION_SECONDS,
  PIERCE_DAMAGE,
  PIERCE_DURATION_SECONDS,
  SLICE_DAMAGE,
  SLICE_DURATION_SECONDS
} from "../constants/playerSettings";
import { chooseWeaponStyle, findDeepestRelic } from "../game/chooseWeaponStyle";
import { STRATUM_SETTINGS } from "../constants/stratumSettings";

const WEAPON_DAMAGE = {
  slice: SLICE_DAMAGE,
  crush: CRUSH_DAMAGE,
  pierce: PIERCE_DAMAGE
};

const WEAPON_DURATION = {
  slice: SLICE_DURATION_SECONDS,
  crush: CRUSH_DURATION_SECONDS,
  pierce: PIERCE_DURATION_SECONDS
};

function findStratumColour(stratumNumber: number): string {
  const stratum = STRATUM_SETTINGS.find((entry) => entry.stratumNumber === stratumNumber);
  return stratum ? stratum.inkColour : "#9C8C7A";
}

export function showLoadoutScreen(container: HTMLElement, relics: EquippedRelic[]): void {
  container.replaceChildren();

  const chosenHashes = new Set<string>(
    relics.slice(0, MAXIMUM_EQUIPPED_RELICS).map((relic) => relic.sourceTransactionHash)
  );

  const panel = document.createElement("section");
  panel.className = "screen-panel";

  const label = document.createElement("p");
  label.className = "screen-label";
  label.textContent = "Equip three";

  const heading = document.createElement("h2");
  heading.className = "screen-heading";
  heading.textContent = `${chosenHashes.size} of ${MAXIMUM_EQUIPPED_RELICS} chosen`;

  const list = document.createElement("div");
  list.className = "column-stack";

  const weaponLine = document.createElement("p");
  weaponLine.className = "data-text";

  function describeWeapon(): void {
    const chosenRelics = relics.filter((relic) => chosenHashes.has(relic.sourceTransactionHash));
    const style = chooseWeaponStyle(chosenRelics);
    const deepest = findDeepestRelic(chosenRelics);
    const damage = WEAPON_DAMAGE[style];
    const duration = WEAPON_DURATION[style];
    const origin = deepest ? `block ${deepest.sourceBlockNumber.toLocaleString("en-GB")}` : "no relic";

    weaponLine.textContent = `weapon ${style} · ${damage} damage · ${duration}s · from ${origin}`;
  }

  function renderList(): void {
    list.replaceChildren();

    for (const relic of relics) {
      const isChosen = chosenHashes.has(relic.sourceTransactionHash);
      const row = document.createElement("button");
      row.type = "button";
      row.className = isChosen ? "loadout-row loadout-row-chosen" : "loadout-row";
      row.style.borderColor = isChosen ? findStratumColour(relic.stratumNumber) : "";

      const marker = document.createElement("span");
      marker.style.color = findStratumColour(relic.stratumNumber);
      marker.textContent = isChosen ? "◆" : "◇";

      const name = document.createElement("span");
      name.className = "loadout-row-name";
      name.textContent = relic.definition.displayName;

      const year = document.createElement("span");
      year.className = "loadout-row-year";
      year.textContent = String(relic.sourceYear);

      const effect = document.createElement("span");
      effect.className = "loadout-row-effect";
      effect.textContent = relic.definition.description;

      row.addEventListener("click", () => {
        if (isChosen) {
          chosenHashes.delete(relic.sourceTransactionHash);
        } else if (chosenHashes.size < MAXIMUM_EQUIPPED_RELICS) {
          chosenHashes.add(relic.sourceTransactionHash);
        }

        heading.textContent = `${chosenHashes.size} of ${MAXIMUM_EQUIPPED_RELICS} chosen`;
        renderList();
        describeWeapon();
      });

      row.append(marker, name, year, effect);
      list.append(row);
    }
  }

  renderList();
  describeWeapon();

  panel.append(label, heading, list, weaponLine);
  container.append(panel);
}
