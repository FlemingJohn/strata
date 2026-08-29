import type { EquippedRelic } from "../types/relic";
import { ETHERSCAN_TRANSACTION_URL } from "../constants/networkSettings";
import { STRATUM_SETTINGS } from "../constants/stratumSettings";
import { createWeaponIconCanvas } from "../rendering/drawWeaponIcon";

function findStratumColour(stratumNumber: number): string {
  const stratum = STRATUM_SETTINGS.find((entry) => entry.stratumNumber === stratumNumber);
  return stratum ? stratum.inkColour : "#9C8C7A";
}

function buildTierStars(stratumNumber: number): string {
  return "★".repeat(stratumNumber) + "☆".repeat(STRATUM_SETTINGS.length - stratumNumber);
}

export function createRelicCard(relic: EquippedRelic): HTMLElement {
  const card = document.createElement("article");
  card.className = "relic-card";
  card.style.borderColor = findStratumColour(relic.stratumNumber);

  const name = document.createElement("h3");
  name.className = "relic-card-name";
  name.textContent = relic.definition.displayName;

  const description = document.createElement("p");
  description.className = "relic-card-description";
  description.textContent = relic.definition.description;

  const provenance = document.createElement("a");
  provenance.className = "relic-card-origin";
  provenance.href = `${ETHERSCAN_TRANSACTION_URL}/${relic.sourceTransactionHash}`;
  provenance.target = "_blank";
  provenance.rel = "noreferrer noopener";
  provenance.textContent = `blk ${relic.sourceBlockNumber.toLocaleString("en-GB")}`;

  const tier = document.createElement("span");
  tier.className = "relic-card-origin";
  tier.style.color = findStratumColour(relic.stratumNumber);
  tier.textContent = `${relic.sourceYear} ${buildTierStars(relic.stratumNumber)}`;

  card.append(
    createWeaponIconCanvas(relic.definition.weaponSpriteIndex),
    name,
    description,
    provenance,
    tier
  );

  return card;
}
