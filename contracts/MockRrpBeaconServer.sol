// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

// A mock contract that you can use to simulate reading from an RrpBeaconServer
// contract
contract MockRrpBeaconServer {
    struct Beacon {
        int224 value;
        uint32 timestamp;
    }

    bool private revertBeaconReads = false;
    mapping(bytes32 => Beacon) private beacons;

    // A function to mock the value and the timestamp of a Beacon
    function setBeacon(
        bytes32 beaconId,
        int224 value,
        uint32 timestamp
    ) external {
        beacons[beaconId] = Beacon({value: value, timestamp: timestamp});
    }

    // A function to mock the whitelisting status of the reader
    function setRevertBeaconReadsStatus(bool _revertBeaconReads) external {
        revertBeaconReads = _revertBeaconReads;
    }

    // A function that imitates reading a Beacon
    function readBeacon(bytes32 beaconId)
        external
        view
        returns (int224 value, uint32 timestamp)
    {
        require(!revertBeaconReads, "Caller not whitelisted");
        Beacon storage beacon = beacons[beaconId];
        value = beacon.value;
        timestamp = beacon.timestamp;
    }
}
