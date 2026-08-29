import { chainInfo } from "@gluwa/usc-sdk";
import type { JsonRpcProvider } from "ethers";
import { ETHEREUM_MAINNET_CHAIN_ID } from "../constants/networkSettings";

export async function findEthereumChainKey(provider: JsonRpcProvider): Promise<number> {
  const infoProvider = new chainInfo.PrecompileChainInfoProvider(provider);
  const supportedChains = await infoProvider.getSupportedChains();
  const ethereumChain = supportedChains.find(
    (chain) => Number(chain.chainId) === ETHEREUM_MAINNET_CHAIN_ID
  );

  if (!ethereumChain) {
    throw new Error("Creditcoin does not currently support Ethereum mainnet");
  }

  return ethereumChain.chainKey;
}
