import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";

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
      url: "https://eth-ropsten.gateway.pokt.network/v1/lb/61d5f1ff1a94ee003a8e070c",
      accounts: {
        mnemonic:
          "tube spin artefact salad slab lumber foot bitter wash reward vote cook",
      },
    },
  },
  mocha: {
    timeout: 100000,
  },
};

export default config;
