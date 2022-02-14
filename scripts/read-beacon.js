const fs = require("fs");
const hre = require("hardhat");
const { getServiceData } = require("@api3/services");

async function main() {
  const network = hre.network.name;

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

  let beaconId;
  if (network === "localhost") {
    // Use the beacon ID mocked in the deployment script
    beaconId = "0x1234567890123456789012345678901234567890123456789012345678901234";
  } else {
    const serviceData = getServiceData("Amberdata", "ETH/USD", network);
    beaconId = serviceData.beacon.beaconId;
  }

  try {
    // Read the beacon and print out the raw response
    const response = await beaconReaderExample.readBeacon(beaconId);
    console.log("Raw beacon response:");
    console.log(response);
    console.log();

    //  There are two values returned:
    //  1. value - the value of the beacon
    //  2. timestamp - unix timestamp that dates the value
    const value = response.value.toString();
    const timestamp = response.timestamp.toNumber();
    const userFriendlyDate = new Date(timestamp * 1000).toLocaleString();
    console.log(`Beacon value: ${value}, timestamp: ${userFriendlyDate}.`);
  } catch (e) {
    console.error(e);
    console.log('Did you whitelist your beacon reader contract?');
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
