import "@nomiclabs/hardhat-ethers";
import { HardhatUserConfig, task } from "hardhat/config";
import dotenv from "dotenv";

dotenv.config();

const { PROVIDER_URL, MNEMONIC } = process.env;

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    ropsten: {
      url: PROVIDER_URL,
      accounts: {
        mnemonic: MNEMONIC,
      },
    },
  },
  mocha: {
    timeout: 60000,
  },
};

export default config;