import { defineConfig } from "vite";
import { resolve } from "path";

const CREDITCOIN_TESTNET_RPC_URL = "https://rpc.cc3-testnet.creditcoin.network";
const PROOF_BUILDER_API_URL = "https://proof-gen-api.cc3-testnet.creditcoin.network";

export default defineConfig({
  resolve: {
    alias: {
      "@types": resolve(__dirname, "src/types"),
      "@constants": resolve(__dirname, "src/constants"),
      "@rendering": resolve(__dirname, "src/rendering"),
      "@game": resolve(__dirname, "src/game"),
      "@chain": resolve(__dirname, "src/chain"),
      "@interface": resolve(__dirname, "src/interface")
    }
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      "/creditcoinRpc": {
        target: CREDITCOIN_TESTNET_RPC_URL,
        changeOrigin: true,
        secure: true,
        rewrite: (requestPath) => requestPath.replace(/^\/creditcoinRpc/, "")
      },
      "/proofBuilder": {
        target: PROOF_BUILDER_API_URL,
        changeOrigin: true,
        secure: true,
        rewrite: (requestPath) => requestPath.replace(/^\/proofBuilder/, "")
      }
    }
  },
  build: {
    outDir: "dist",
    target: "es2022"
  }
});
