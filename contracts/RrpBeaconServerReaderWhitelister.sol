// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@api3/airnode-protocol/contracts/rrp/requesters/interfaces/IRrpBeaconServer.sol";
import "./interfaces/IRrpBeaconServerReaderWhitelister.sol";

// TODO: move this contract to beacon-setup-guide repo

/// This contract must be deployed using the RrpBeaconServer manager or
/// it needs to be given the IndefiniteWhitelisterRoleOrIsManager role
contract RrpBeaconServerReaderWhitelister is IRrpBeaconServerReaderWhitelister {
    IRrpBeaconServer public immutable rrpBeaconServer;

    constructor(address _rrpBeaconServerAddress) {
        require(_rrpBeaconServerAddress != address(0), "Zero address");
        rrpBeaconServer = IRrpBeaconServer(_rrpBeaconServerAddress);
    }

    function setIndefiniteWhitelistStatus(
        bytes32 beaconId,
        address reader,
        bool status
    ) external override {
        rrpBeaconServer.setIndefiniteWhitelistStatus(beaconId, reader, status);
    }
}
