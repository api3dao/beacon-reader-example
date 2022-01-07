// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

interface IRrpBeaconServerReaderWhitelister {
    function setIndefiniteWhitelistStatus(
        bytes32 beaconId,
        address reader,
        bool status
    ) external;
}
