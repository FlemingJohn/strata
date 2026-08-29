import { JsonRpcProvider } from "ethers";
import { blockProver, chainInfo, proofProvider } from "@gluwa/usc-sdk";

const CREDITCOIN_TESTNET_RPC_URL = "https://rpc.cc3-testnet.creditcoin.network";
const ETHEREUM_MAINNET_CHAIN_ID = 1;

const PROOF_BUILDER_URLS = [
  "https://proof-gen-api.cc3-testnet.creditcoin.network",
  "https://prover.cc3-testnet.creditcoin.network"
];

const DEFAULT_TRANSACTION_HASH =
  "0x5c504ed432cb51138bcf09aa5e8a410dd4a1e204ef84bfed1be16dfba1b22060";

function readRequestedTransactionHash(): string {
  const providedHash = process.argv[2];
  return providedHash && providedHash.startsWith("0x") ? providedHash : DEFAULT_TRANSACTION_HASH;
}

function decodeChainName(hexEncodedName: string): string {
  if (!hexEncodedName.startsWith("0x")) {
    return hexEncodedName;
  }

  const characters: string[] = [];

  for (let position = 2; position < hexEncodedName.length; position += 2) {
    characters.push(String.fromCharCode(parseInt(hexEncodedName.slice(position, position + 2), 16)));
  }

  return characters.join("");
}

async function findEthereumChainKey(
  infoProvider: chainInfo.PrecompileChainInfoProvider
): Promise<number> {
  const supportedChains = await infoProvider.getSupportedChains();
  const ethereumChain = supportedChains.find(
    (chain) => chain.chainId === ETHEREUM_MAINNET_CHAIN_ID
  );

  if (!ethereumChain) {
    throw new Error("Creditcoin does not currently support Ethereum mainnet");
  }

  console.log(
    `chain      chainKey ${ethereumChain.chainKey} is ${decodeChainName(ethereumChain.chainName)}`
  );
  return ethereumChain.chainKey;
}

async function buildProofFromAnyAvailableService(
  chainKey: number,
  transactionHash: string
): Promise<proofProvider.ProofResult> {
  let lastFailure = "";

  for (const builderUrl of PROOF_BUILDER_URLS) {
    try {
      const builder = new proofProvider.service.ProofBuilder(chainKey, builderUrl, 60000);
      const result = await builder.getProof(transactionHash);

      if (result.success) {
        console.log(`builder    ${builderUrl}`);
        return result;
      }

      lastFailure = `${builderUrl} responded without a proof`;
    } catch (failure) {
      lastFailure = `${builderUrl} ${failure instanceof Error ? failure.message : failure}`;
    }
  }

  throw new Error(`No proof builder produced a proof. Last failure: ${lastFailure}`);
}

async function run(): Promise<void> {
  const transactionHash = readRequestedTransactionHash();
  const creditcoinProvider = new JsonRpcProvider(CREDITCOIN_TESTNET_RPC_URL);
  const infoProvider = new chainInfo.PrecompileChainInfoProvider(creditcoinProvider);

  console.log(`target     ${transactionHash}`);

  const chainKey = await findEthereumChainKey(infoProvider);
  const proofResult = await buildProofFromAnyAvailableService(chainKey, transactionHash);
  const proof = proofResult.data!;

  const bounds = await infoProvider.getContinuityBounds(chainKey, proof.headerNumber);

  console.log(`block      ${proof.headerNumber}`);
  console.log(`attested   ${bounds.isAttested}`);
  console.log(`bounds     ${bounds.parentHeight} to ${bounds.childHeight}`);
  console.log(`merkle     ${proof.merkleProof.siblings.length} siblings`);
  console.log(`continuity ${proof.continuityProof.roots.length} roots`);
  console.log(`txBytes    ${proof.txBytes.length} characters`);
  console.log(`cached     ${proof.cached}`);

  const prover = new blockProver.PrecompileBlockProver(creditcoinProvider);
  const wasVerified = await prover.verifySingle(
    proof.chainKey,
    proof.headerNumber,
    proof.txBytes,
    proof.merkleProof,
    proof.continuityProof
  );

  console.log("");
  console.log(`VERIFIED   ${wasVerified}`);

  if (!wasVerified) {
    process.exitCode = 1;
  }
}

run().catch((failure) => {
  console.error("");
  console.error("FAILED");
  console.error(failure instanceof Error ? failure.message : failure);
  process.exitCode = 1;
});
