require('@nomiclabs/hardhat-waffle');
require('hardhat-deploy');

const fs = require('fs');
let credentials = require('./credentials.example.json');
if (fs.existsSync('./credentials.json')) {
  credentials = require('./credentials.json');
}

module.exports = {
  networks: {
    ropsten: {
      url: credentials.ropsten.providerUrl || '',
      accounts: { mnemonic: credentials.ropsten.mnemonic || '' },
    },
    rinkeby: {
      url: credentials.rinkeby.providerUrl || '',
      accounts: { mnemonic: credentials.rinkeby.mnemonic || '' },
    },
    goerli: {
      url: credentials.goerli.providerUrl || '',
      accounts: { mnemonic: credentials.goerli.mnemonic || '' },
    },
    'polygon-mumbai': {
      url: credentials['polygon-mumbai'].providerUrl || '',
      accounts: { mnemonic: credentials['polygon-mumbai'].mnemonic || '' },
    },
  },
  solidity: {
    version: '0.8.9',
  },
};
