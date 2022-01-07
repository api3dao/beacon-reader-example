# Beacon Reader Example

> A starter project for reading beacon values from a smart contract

This project is composed of the following steps:

1. Create a template that will save a beconId to a file under the `/beacons` directory
1. **TODO:NEEDS TO BE MOVED TO beacon-setup-guide repo** Deploy RrpBeaconServerReaderWhitelister
1. Deploy BeaconReaderExample contract and fetch the beacon value from the RrpBeaconServer contract by beaconId

**WARNING:** This project is supposed to use RRP contracts already deployed on a supported chain with a [RrpBeaconServerReaderWhitelister](beacon-starter/contracts/RrpBeaconServerReaderWhitelister.sol) contract deployed. This contract will be called by the [`read-beacon-value.ts`](beacon-starter/scripts/read-beacon-value.ts) script in order to whitelist the reader contract on the [RrpBeaconServer](https://github.com/api3dao/airnode/blob/master/packages/airnode-protocol/contracts/rrp/requesters/RrpBeaconServer.sol#L117) contract. Currenlty this is consuming a [test deployment file](beacon-starter/deployments/0.3.1/localhost.json) that will try to interact with locally deployed contracts. Once the services repo is ready this file should be removed and scripts must be updated to connect to those contracts instead.

## Setup

**WARNING** For now you need to start a local eth node and deploy the contracts listed in the `localhost.json` file. You also need to start a local Airnode. For convenience you could use the [@api3/airnode-operations](https://github.com/api3dao/airnode/blob/master/packages/airnode-operation) package commands.

1. Clone this repo
2. Run the following to install the dependencies

```sh
npm install
```

## Step 1: Create the convertToUSD template

This template will provide a `from:ETH` parameter that will be used to query the API for the USD value of 1 ETH. The `beaconId` will be derived using the templateId plus encoded paramereters and will be stored in the `beacons/convertToUSD.json` file.

```sh
hardhat run scripts/create-template.ts --network localhost
```

## Step 2: Deploy the RrpBeaconServerReaderWhitelister contract

This contract will be have the required role for granting the reader contract access to the `RrpBeaconServer.readBeacon()` function.

```sh
hardhat run scripts/deploy-rrpbeaconserverreaderwhitelister.ts --network localhost
```

## Step 3: Deploy the BeaconReaderExample contract and read the beacon value

This script will try to read the beaconId generated in the first step then before reading the USD price of 1 ETH and printing it to the console, the script will interact with the RrpBeaconServerReaderWhitelister contract to whitelist the BeaconReaderExample contract.

```sh
hardhat run scripts/read-beacon-value.ts --network localhost
```
