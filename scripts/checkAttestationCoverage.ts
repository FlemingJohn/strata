import { JsonRpcProvider } from "ethers";
import { chainInfo } from "@gluwa/usc-sdk";

const CREDITCOIN_TESTNET_RPC_URL = "https://rpc.cc3-testnet.creditcoin.network";

const BLOCKS_TO_PROBE = [
  { label: "Frontier 2015", blockNumber: 46147 },
  { label: "DAO fork 2016", blockNumber: 1920000 },
  { label: "Winter 2018", blockNumber: 5102443 },
  { label: "Boom 2021", blockNumber: 12965000 },
  { label: "Merge 2022", blockNumber: 15537394 },
  { label: "Recent 2024", blockNumber: 21000000 }
];

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

async function reportSupportedChains(
  provider: chainInfo.PrecompileChainInfoProvider
): Promise<void> {
  const supportedChains = await provider.getSupportedChains();

  console.log("SUPPORTED CHAINS");
  for (const chain of supportedChains) {
    console.log(
      `  chainKey ${chain.chainKey}  chainId ${chain.chainId}  ` +
        `${decodeChainName(chain.chainName)}  encoding ${chain.chainEncoding}`
    );
  }
  console.log("");
}

async function reportAttestationRange(
  provider: chainInfo.PrecompileChainInfoProvider,
  chainKey: number,
  chainName: string
): Promise<void> {
  const genesisHeight = await provider.getAttestationGenesisHeight(chainKey);
  const latest = await provider.getLatestAttestedHeightAndHash(chainKey);

  console.log(`ATTESTATION RANGE for chainKey ${chainKey} (${chainName})`);
  console.log(`  earliest attested block  ${genesisHeight}`);
  console.log(`  latest attested block    ${latest.exists ? latest.height : "none"}`);
  console.log(`  latest attested digest   ${latest.exists ? latest.hash : "none"}`);
  console.log(`  latest is attestation    ${latest.isAttestation}`);
  console.log("");
}

async function reportBlockReachability(
  provider: chainInfo.PrecompileChainInfoProvider,
  chainKey: number
): Promise<void> {
  console.log("CAN THESE BLOCKS BE PROVEN");

  for (const probe of BLOCKS_TO_PROBE) {
    try {
      const bounds = await provider.getContinuityBounds(chainKey, probe.blockNumber);
      const distanceBelow = probe.blockNumber - bounds.parentHeight;
      const distanceAbove = bounds.childHeight - probe.blockNumber;

      console.log(
        `  ${probe.label.padEnd(16)} block ${String(probe.blockNumber).padEnd(10)} ` +
          `attested ${String(bounds.isAttested).padEnd(6)} ` +
          `bounds ${bounds.parentHeight} to ${bounds.childHeight} ` +
          `spans ${distanceBelow + distanceAbove}`
      );
    } catch (failure) {
      const message = failure instanceof Error ? failure.message : String(failure);
      console.log(
        `  ${probe.label.padEnd(16)} block ${String(probe.blockNumber).padEnd(10)} ` +
          `FAILED  ${message.slice(0, 80)}`
      );
    }
  }
  console.log("");
}

async function run(): Promise<void> {
  const creditcoinProvider = new JsonRpcProvider(CREDITCOIN_TESTNET_RPC_URL);
  const network = await creditcoinProvider.getNetwork();
  const currentBlock = await creditcoinProvider.getBlockNumber();

  console.log("CREDITCOIN TESTNET");
  console.log(`  chainId ${network.chainId}  current block ${currentBlock}`);
  console.log("");

  const infoProvider = new chainInfo.PrecompileChainInfoProvider(creditcoinProvider);
  const supportedChains = await infoProvider.getSupportedChains();

  await reportSupportedChains(infoProvider);

  for (const chain of supportedChains) {
    await reportAttestationRange(infoProvider, chain.chainKey, decodeChainName(chain.chainName));
  }

  const ethereumChain =
    supportedChains.find((chain) => chain.chainId === 1) ?? supportedChains[0];

  if (ethereumChain) {
    console.log(`Probing historical reach using chainKey ${ethereumChain.chainKey}`);
    console.log("");
    await reportBlockReachability(infoProvider, ethereumChain.chainKey);
  }
}

run().catch((failure) => {
  console.error("PROBE FAILED");
  console.error(failure);
  process.exitCode = 1;
});
