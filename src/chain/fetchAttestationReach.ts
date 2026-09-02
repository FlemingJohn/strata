import { chainInfo } from "@gluwa/usc-sdk";
import type { AttestationReach } from "../types/attestationReach";
import { createCreditcoinProvider } from "./createCreditcoinProvider";
import { findEthereumChainKey } from "./findEthereumChainKey";

export async function fetchAttestationReach(): Promise<AttestationReach> {
  const provider = createCreditcoinProvider();
  const chainKey = await findEthereumChainKey(provider);
  const infoProvider = new chainInfo.PrecompileChainInfoProvider(provider);

  const [earliestAttestedBlock, latest] = await Promise.all([
    infoProvider.getAttestationGenesisHeight(chainKey),
    infoProvider.getLatestAttestedHeightAndHash(chainKey)
  ]);

  if (!latest.exists) {
    throw new Error("Creditcoin has not attested any Ethereum block yet");
  }

  return {
    earliestAttestedBlock: Number(earliestAttestedBlock),
    latestAttestedBlock: Number(latest.height),
    latestAttestedDigest: String(latest.hash)
  };
}
