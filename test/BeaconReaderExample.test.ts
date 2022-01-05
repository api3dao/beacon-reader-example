import { expect } from "chai";
import { ethers } from "hardhat";

describe("BeaconReaderExample", function () {
  it("Should return the beacon value", async function () {
    const BeaconReaderExample = await ethers.getContractFactory(
      "BeaconReaderExample"
    );
    const beaconReaderExample = await BeaconReaderExample.deploy(
      "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e"
    );
    await beaconReaderExample.deployed();

    const templateId =
      "0x50c604914d8ed35473149457a1a0912b785813b4e2e51bd2b75409ca25c50e1d";
    const parameters =
      "0x315300000000000000000000000000000000000000000000000000000000000066726f6d00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000034254430000000000000000000000000000000000000000000000000000000000";
    const beaconId = ethers.utils.keccak256(
      ethers.utils.solidityPack(["bytes32", "bytes"], [templateId, parameters])
    );
    expect(beaconId).to.equal(
      "0x6cfe18fdad90338b9adb03c312c0b54f56545af2407cc5e21a3922d4c6170186"
    );

    // whitelist beaconReaderExample.address with beacon manager (airnode wallet in this case)
    const airnodeWallet = ethers.Wallet.fromMnemonic(
      "achieve climb couple wait accident symbol spy blouse reduce foil echo label"
    ).connect(ethers.provider);
    const rrpBeaconServer = await ethers.getContractAt(
      "IRrpBeaconServer",
      "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e"
    );
    const tx = await rrpBeaconServer
      .connect(airnodeWallet)
      .setIndefiniteWhitelistStatus(
        beaconId,
        beaconReaderExample.address,
        true
      );
    await tx.wait();

    const value = await beaconReaderExample.readBeacon(beaconId);

    expect(value.toNumber()).to.equal(0);
  });
});
