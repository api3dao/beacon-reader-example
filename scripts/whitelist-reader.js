const fs = require("fs");
const hre = require("hardhat");
const { getServiceData, whitelistBeaconReader } = require("@api3/services");

async function main() {
  const network = hre.network.name;
  if (network === "localhost") {
    console.log(
      'MockRrpBeaconServer used on localhost does not require whitelisting, skip this step.'
    );
    return;
  }

  // Read BeaconReaderExample contract address from deployments files
  let beaconReaderExampleAddress = null;
  try {
    const parseResult = JSON.parse(
      fs.readFileSync(`./deployments/${network}/BeaconReaderExample.json`).toString()
    );
    beaconReaderExampleAddress = parseResult.address;
    if (!beaconReaderExampleAddress) throw new Error("BeaconReaderExample address not found");
  } catch (e) {
    console.log(`Error: ${e}. Please run the deploy script first.`);
    return;
  }
  const beaconReaderExample = await hre.ethers.getContractAt(
    "BeaconReaderExample",
    beaconReaderExampleAddress
  );

  const serviceData = getServiceData("Amberdata", "eth_usd", network);
  const beaconId = serviceData.beacon.beaconId;

  const result = await whitelistBeaconReader(
    beaconId,
    beaconReaderExampleAddress,
    network,
    hre.network.config.url,
    { mnemonic: hre.network.config.accounts.mnemonic }
  );
  if (result.indefiniteWhitelistStatus) {
    console.log(`Beacon reader ${beaconReaderExampleAddress} is whitelisted indefinitely for beacon with ID ${beaconId}`);
  } else {
    const userFriendlyDate = new Date(
      result.expirationTimestamp * 1000
    ).toLocaleString();
    console.log(`Beacon reader ${beaconReaderExampleAddress} whitelisted until ${userFriendlyDate} for beacon with ID ${beaconId}`);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
