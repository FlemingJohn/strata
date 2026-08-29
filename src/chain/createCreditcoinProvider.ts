import { JsonRpcProvider } from "ethers";
import { resolveCreditcoinRpcUrl } from "./resolveServiceUrls";

let sharedProvider: JsonRpcProvider | null = null;

export function createCreditcoinProvider(): JsonRpcProvider {
  if (!sharedProvider) {
    sharedProvider = new JsonRpcProvider(resolveCreditcoinRpcUrl());
  }

  return sharedProvider;
}
