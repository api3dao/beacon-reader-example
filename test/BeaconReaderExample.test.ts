import { expect } from "chai";
import { ethers } from "hardhat";

describe("BeaconReaderExample", function () {
  it("Should return the beacon value", async function () {
    /**
     * **********************************************
     * Requirements for reading beacon value:
     * **********************************************
     * 1. RrpBeaconServer contract address
     * 2. TemplateId
     * 3. Template extra parameters
     * 4. Whitelist this contract to read the beacon
     */

    // Deploy BeaconReaderExample contract
    const BeaconReaderExample = await ethers.getContractFactory(
      "BeaconReaderExample"
    );
    const beaconReaderExample = await BeaconReaderExample.deploy(
      "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e"
    );
    await beaconReaderExample.deployed();

    // TODO: create a template like in operation package (add script too)
    const templateId =
      "0x50c604914d8ed35473149457a1a0912b785813b4e2e51bd2b75409ca25c50e1d";
    // TODO: encode parameters using abi encoder
    const parameters =
      "0x315300000000000000000000000000000000000000000000000000000000000066726f6d00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000034254430000000000000000000000000000000000000000000000000000000000";
    // Derive beaconId
    const beaconId = ethers.utils.keccak256(
      ethers.utils.solidityPack(["bytes32", "bytes"], [templateId, parameters])
    );
    // expect(beaconId).to.equal(
    //   "0x6cfe18fdad90338b9adb03c312c0b54f56545af2407cc5e21a3922d4c6170186"
    // );

    // TODO: instead of whitelisting directly by calling RrpBeaconServer contract
    // there will be a RrpBeaconServerReaderWhitelister specific that will whitelist
    // the reader and it will be specific to a test Airnode deployment (i.e. coingecko)
    const airnodeWallet = ethers.Wallet.fromMnemonic(
      "achieve climb couple wait accident symbol spy blouse reduce foil echo label"
    ).connect(ethers.provider);
    const rrpBeaconServer = await ethers.getContractAt(
      "IRrpBeaconServer",
      "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e"
    );
    // Whitelist beaconReaderExample.address with beacon manager (airnodeWallet in this case)
    const tx = await rrpBeaconServer
      .connect(airnodeWallet)
      .setIndefiniteWhitelistStatus(
        beaconId,
        beaconReaderExample.address,
        true
      );
    await tx.wait();

    // Read beacon value
    const value = await beaconReaderExample.readBeacon(beaconId);

    expect(value.toNumber()).to.equal(0);
  });
});

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
