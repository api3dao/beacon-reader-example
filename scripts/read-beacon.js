const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const network = hre.network.name;

  // Read BeaconReaderExample contract address deployed using deploy.js
  let beaconReaderExampleAddress = null;
  try {
    ({ beaconReaderExampleAddress } = JSON.parse(
      fs.readFileSync(`./deployments/${network}.json`).toString()
    ));
    if (!beaconReaderExampleAddress) throw new Error("beaconId not found");
  } catch (e) {
    console.log(`Error: ${e}. Please try first running deploy script`);
    return;
  }

  const beaconReaderExample = await hre.ethers.getContractAt(
    "BeaconReaderExample",
    beaconReaderExampleAddress
  );

  if (
    network.toLocaleLowerCase() === "hardhat" ||
    network.toLocaleLowerCase() === "localhost"
  ) {
    // Uses RrpBeaconServerMock contract so any value would work
    beaconId = ethers.utils.hexlify(ethers.utils.randomBytes(32));
  } else {
    // TODO: replace with path to services repo
    // Make sure to first whitelist BeaconReaderExample contract in RrpBeaconServer
    const deployments = require(`../services/data/beacons/0.3.1/${network}.json`);
    beaconId = deployments.beacons[0].beaconId;
  }

  console.log("Beacon value: ", await beaconReaderExample.readBeacon(beaconId));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
