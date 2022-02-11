const { expect } = require("chai");
const { ethers } = require("hardhat");

let mockRrpBeaconServer, beaconReaderExample;

beforeEach(async () => {
  const mockRrpBeaconServerFactory = await ethers.getContractFactory(
    "MockRrpBeaconServer"
  );
  mockRrpBeaconServer = await mockRrpBeaconServerFactory.deploy();
  const beaconReaderExampleFactory = await ethers.getContractFactory(
    "BeaconReaderExample"
  );
  beaconReaderExample = await beaconReaderExampleFactory.deploy(
    mockRrpBeaconServer.address
  );
});

describe("readBeacon", function () {
  describe("BeaconReaderExample is whitelisted", function () {
    it("reads the beacon value", async function () {
      // Mock-set a value
      const beaconId = ethers.utils.hexlify(ethers.utils.randomBytes(32));
      const beaconValue = 123456;
      const beaconTimestamp = Math.floor(Date.now() / 1000);
      await mockRrpBeaconServer.setBeacon(beaconId, beaconValue, beaconTimestamp);

      // Read the value back
      const beacon = await beaconReaderExample.readBeacon(beaconId);
      expect(beacon.value).to.equal(beaconValue);
      expect(beacon.timestamp).to.equal(beaconTimestamp);
    });
  });
  describe("BeaconReaderExample is not whitelisted", function () {
    it("reverts", async function () {
      // Simulate not being whitelisted
      await mockRrpBeaconServer.setRevertBeaconReadsStatus(true);

      const beaconId = ethers.utils.hexlify(ethers.utils.randomBytes(32));
      await expect(beaconReaderExample.readBeacon(beaconId)).to.be.revertedWith("Caller not whitelisted");
    });
  });
});
