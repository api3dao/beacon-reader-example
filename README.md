# Beacon Reader Example

> An example project for reading beacon values from a smart contract

1. Tests that use a `MockRrpBeaconServer` contract to simulate reading a
   beacon.
2. A script to deploy the `BeaconReaderExample` contract to one of the supported
   networks. This script will use the address of the `RrpBeaconServer` contract
   deployed on the selected network. You can see the `deployments/` directory for
   the address of the deployed contract.
3. A script to whitelist `BeaconReaderExample` for it to be able to read a specific beacon.
4. A script to have `BeaconReaderExample` read the beacon.

## Instructions

_You are recommended to follow our [docs](https://docs.api3.org/beacon/v0.1/introduction/hackathon.html) instead._

Install the dependencies:

```sh
npm install
```

### Tests

Run the unit tests defined in the `test/` directory:

```sh
npm run test
```

### Network: `localhost`

Start a local Ethereum node on a separate terminal:

```sh
npm run eth-node
```

Deploy `MockRrpBeaconServer`, `BeaconReaderExample`, and mock-set a beacon value:

```sh
npm run deploy:localhost
```

You can skip the whitelisting step on `localhost`. 

Have `BeaconReaderExample` read the mocked beacon value and print it on the terminal:

```sh
npm run read-beacon:localhost
```

### Networks: `ropsten`, `rinkeby`, `goerli`, `polygon-mumbai`

Create a `credentials.json` file at the root of the repo, similar to `credentials.example.json`.
Fill in the blockchain provider URL (e.g., `https://rpc-mumbai.matic.today` for `polygon-mumbai`).
Fill in the mnemonic with one that belongs to a wallet that you have funded using a faucet.

Deploy `BeaconReaderExample` that is pointed to the pre-deployed `RrpBeaconServer`:

```sh
npm run deploy:polygon-mumbai
```

Whitelist the `BeaconReaderExample` you have deployed for the `eth_usd` beacon powered by Amberdata:

```sh
npm run whitelist-reader:polygon-mumbai
```

Have `BeaconReaderExample` read the beacon value and print it on the terminal:

```sh
npm run read-beacon:polygon-mumbai
```

You can replace `polygon-mumbai` with `ropsten`, `rinkeby` or `goerli` to work on one of these networks.

You can read beacons other than `eth_usd` by modifying `scripts/whitelist-reader.js` and `scripts/read-beacon.js`.
Refer to the [docs](https://docs.api3.org/beacon/v0.1/reference/beacon-ids.html) for a complete list.
