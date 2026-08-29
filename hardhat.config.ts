import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
import type { HardhatUserConfig } from "hardhat/config";

dotenv.config();

const deployerPrivateKey = process.env.DEPLOYER_PRIVATE_KEY ?? "";

const configuration: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: { enabled: true, runs: 200 }
    }
  },
  networks: {
    creditcoinTestnet: {
      url: "https://rpc.cc3-testnet.creditcoin.network",
      accounts: deployerPrivateKey ? [deployerPrivateKey] : []
    }
  },
  paths: {
    sources: "contracts",
    scripts: "scripts",
    cache: "cache",
    artifacts: "artifacts"
  }
};

export default configuration;
