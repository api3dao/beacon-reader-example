// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@api3/airnode-protocol/contracts/rrp/requesters/interfaces/IRrpBeaconServer.sol";

contract BeaconReaderExample {
    IRrpBeaconServer public immutable rrpBeaconServer;

    constructor(address _rrpBeaconServerAddress) public {
        require(_rrpBeaconServerAddress != address(0), "Zero address");
        rrpBeaconServer = IRrpBeaconServer(_rrpBeaconServerAddress);
    }

    function readBeacon(bytes32 _beaconId) public view returns (int224) {
        (int224 value, uint32 timestamp) = rrpBeaconServer.readBeacon(
            _beaconId
        );
        return value;
    }
}
