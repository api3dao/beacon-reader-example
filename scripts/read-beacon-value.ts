// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import hre from "hardhat";
// TODO: replace with @services/...
import deploymentJson from "../deployments/0.3.1/localhost.json";
import { readFileSync } from "fs";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // Read beaconId generated after running create-template script
  let beaconId = null;
  try {
    ({ beaconId } = JSON.parse(
      readFileSync("./beacons/convertToUSD.json").toString()
    ));
    if (!beaconId) throw new Error("beaconId not found");
  } catch (e) {
    console.log(`Error: ${e}. Please try first running create-template script`);
    return;
  }

  // Deploy BeaconReaderExample contract and set the RrpBeaconServer contract address
  const BeaconReaderExample = await hre.ethers.getContractFactory(
    "BeaconReaderExample"
  );
  const beaconReaderExample = await BeaconReaderExample.deploy(
    deploymentJson["RrpBeaconServer"]
  );
  await beaconReaderExample.deployed();
  console.log("BeaconReaderExample deployed to:", beaconReaderExample.address);

  // Whitelist BeaconReaderExample contract to read from RrpBeaconServer
  const rrpBeaconServerReaderWhitelister = await hre.ethers.getContractAt(
    "IRrpBeaconServerReaderWhitelister",
    deploymentJson["RrpBeaconServerReaderWhitelister"]
  );

  const tx =
    await rrpBeaconServerReaderWhitelister.setIndefiniteWhitelistStatus(
      beaconId,
      beaconReaderExample.address,
      true
    );
  await tx.wait();

  // Read the value from the contract
  console.log(
    "Beacon value: ",
    (await beaconReaderExample.readBeacon(beaconId)).toString()
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
