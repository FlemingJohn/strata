import type { ProvingAttempt, ProvingStatus } from "../types/proving";
import { DEMO_WALLET_TRANSACTIONS } from "../constants/demoTransactions";
import {
  BLOCK_PROVER_PRECOMPILE_ADDRESS,
  CHAIN_INFO_PRECOMPILE_ADDRESS,
  ETHERSCAN_TRANSACTION_URL
} from "../constants/networkSettings";
import { createCreditcoinProvider } from "../chain/createCreditcoinProvider";
import { findEthereumChainKey } from "../chain/findEthereumChainKey";
import { proveTransactions } from "../chain/proveTransactions";
import { createRelicsFromTransactions } from "../game/createRelicFromTransaction";
import { showRelicScreen } from "./showRelicScreen";

const STATUS_SYMBOLS: Record<ProvingStatus, string> = {
  waiting: "·",
  building: "◐",
  verifying: "◑",
  verified: "✓",
  failed: "✕"
};

const STATUS_CLASS_NAMES: Record<ProvingStatus, string> = {
  waiting: "proof-row-status-waiting",
  building: "proof-row-status-pending",
  verifying: "proof-row-status-pending",
  verified: "proof-row-status-verified",
  failed: "proof-row-status-failed"
};

const REVEAL_DELAY_MILLISECONDS = 900;

function shortenHash(fullHash: string): string {
  return `${fullHash.slice(0, 10)}…${fullHash.slice(-6)}`;
}

function describeAttempt(attempt: ProvingAttempt): string {
  if (attempt.status === "failed") {
    return attempt.failureReason ?? "failed";
  }

  if (attempt.status === "building") {
    return "building proof";
  }

  if (attempt.status === "verifying") {
    return "verifying on chain";
  }

  if (attempt.status === "verified") {
    const cachedLabel = attempt.wasCached ? " cached" : "";
    return `${attempt.continuityRootCount} roots${cachedLabel}`;
  }

  return "queued";
}

function createProofRow(attempt: ProvingAttempt): HTMLElement {
  const row = document.createElement("div");
  row.className = "proof-row";

  const status = document.createElement("span");
  status.className = STATUS_CLASS_NAMES[attempt.status];
  status.textContent = STATUS_SYMBOLS[attempt.status];

  const identity = document.createElement("a");
  identity.className = "proof-row-hash";
  identity.href = `${ETHERSCAN_TRANSACTION_URL}/${attempt.transactionHash}`;
  identity.target = "_blank";
  identity.rel = "noreferrer noopener";
  identity.textContent = `${shortenHash(attempt.transactionHash)}  ${attempt.year} ${attempt.eraName}`;

  const detail = document.createElement("span");
  detail.className = STATUS_CLASS_NAMES[attempt.status];
  detail.textContent =
    attempt.blockNumber === null
      ? describeAttempt(attempt)
      : `blk ${attempt.blockNumber.toLocaleString("en-GB")} · ${describeAttempt(attempt)}`;

  row.append(status, identity, detail);
  return row;
}

function countVerified(attempts: ProvingAttempt[]): number {
  return attempts.filter((attempt) => attempt.status === "verified").length;
}

export function showProvingScreen(container: HTMLElement): void {
  container.replaceChildren();

  const panel = document.createElement("section");
  panel.className = "screen-panel";

  const label = document.createElement("p");
  label.className = "screen-label";
  label.textContent = "Proving on Creditcoin";

  const heading = document.createElement("h2");
  heading.className = "screen-heading";
  heading.textContent = "Reading your history";

  const counter = document.createElement("p");
  counter.className = "data-text";
  counter.textContent = `0 of ${DEMO_WALLET_TRANSACTIONS.length} verified`;

  const rowContainer = document.createElement("div");
  rowContainer.className = "column-stack";

  const precompileNote = document.createElement("p");
  precompileNote.className = "data-text";
  precompileNote.textContent = `block prover ${BLOCK_PROVER_PRECOMPILE_ADDRESS.slice(0, 10)}… · chain info ${CHAIN_INFO_PRECOMPILE_ADDRESS.slice(0, 10)}…`;

  panel.append(label, heading, counter, rowContainer, precompileNote);
  container.append(panel);

  function renderAttempts(attempts: ProvingAttempt[]): void {
    rowContainer.replaceChildren(...attempts.map(createProofRow));
    counter.textContent = `${countVerified(attempts)} of ${attempts.length} verified`;
  }

  const provider = createCreditcoinProvider();

  findEthereumChainKey(provider)
    .then((chainKey) => {
      heading.textContent = `Proving against chain key ${chainKey}`;
      return proveTransactions(provider, chainKey, DEMO_WALLET_TRANSACTIONS, renderAttempts);
    })
    .then((attempts) => {
      const relics = createRelicsFromTransactions(attempts);
      heading.textContent = `${relics.length} relics recovered`;

      if (relics.length > 0) {
        window.setTimeout(() => showRelicScreen(container, relics), REVEAL_DELAY_MILLISECONDS);
      }
    })
    .catch((failure) => {
      heading.textContent = "Creditcoin could not be reached";
      counter.textContent = failure instanceof Error ? failure.message : String(failure);
    });
}
