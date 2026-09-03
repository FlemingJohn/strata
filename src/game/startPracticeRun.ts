import type { EquippedRelic, RelicName } from "../types/relic";
import type { DemoTransaction } from "../constants/demoTransactions";
import { DEMO_WALLET_TRANSACTIONS } from "../constants/demoTransactions";
import { DEMO_WALLET_ADDRESS } from "../constants/characterAppearance";
import {
  PRACTICE_RELIC_NAMES,
  PRACTICE_RUN_NOTICE
} from "../constants/practiceRunSettings";
import { RELIC_DEFINITIONS } from "../constants/relicDefinitions";
import { FIRST_DEPTH } from "../constants/runSettings";
import { createFloorDescription } from "./createFloorDescription";
import { findStratumForBlock } from "./findStratumForBlock";
import { generateDungeonFloor } from "./generateDungeonFloor";
import { chooseRelicForDepth } from "./chooseBlockForDepth";
import { showCombatScreen } from "../interface/showCombatScreen";

function buildPracticeRelic(
  transaction: DemoTransaction,
  relicName: RelicName
): EquippedRelic {
  const stratum = findStratumForBlock(transaction.expectedBlockNumber);

  return {
    definition: RELIC_DEFINITIONS[relicName],
    sourceTransactionHash: transaction.transactionHash,
    sourceBlockNumber: transaction.expectedBlockNumber,
    sourceMerkleRoot: transaction.transactionHash,
    sourceMerkleDepth: 8,
    sourceYear: transaction.year,
    stratumNumber: stratum.stratumNumber
  };
}

export function buildPracticeRelics(): EquippedRelic[] {
  return DEMO_WALLET_TRANSACTIONS.map((transaction, index) =>
    buildPracticeRelic(
      transaction,
      PRACTICE_RELIC_NAMES[index % PRACTICE_RELIC_NAMES.length]
    )
  );
}

export function startPracticeRun(container: HTMLElement): void {
  const provenRelics = buildPracticeRelics();
  const equippedRelics = provenRelics.slice(0, 3);
  const relicForFirstFloor = chooseRelicForDepth(provenRelics, FIRST_DEPTH);

  if (!relicForFirstFloor) {
    return;
  }

  const description = createFloorDescription(FIRST_DEPTH, {
    blockNumber: relicForFirstFloor.sourceBlockNumber,
    transactionMerkleRoot: relicForFirstFloor.sourceMerkleRoot,
    merkleSiblingCount: relicForFirstFloor.sourceMerkleDepth,
    continuityRootCount: 0
  });

  showCombatScreen(container, generateDungeonFloor(description), {
    openingNotice: PRACTICE_RUN_NOTICE,
    provenRelics,
    equippedRelics,
    depth: FIRST_DEPTH,
    roomsClearedSoFar: 0,
    killsSoFar: 0,
    carriedHealth: null,
    walletAddress: DEMO_WALLET_ADDRESS
  });
}
