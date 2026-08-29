import {
  CREDITCOIN_RPC_PROXY_PATH,
  CREDITCOIN_TESTNET_RPC_URL,
  PROOF_BUILDER_API_URL,
  PROOF_BUILDER_PROXY_PATH
} from "../constants/networkSettings";

export function resolveCreditcoinRpcUrl(): string {
  if (import.meta.env.DEV) {
    return `${window.location.origin}${CREDITCOIN_RPC_PROXY_PATH}`;
  }

  return CREDITCOIN_TESTNET_RPC_URL;
}

export function resolveProofBuilderUrl(): string {
  if (import.meta.env.DEV) {
    return `${window.location.origin}${PROOF_BUILDER_PROXY_PATH}`;
  }

  return PROOF_BUILDER_API_URL;
}
