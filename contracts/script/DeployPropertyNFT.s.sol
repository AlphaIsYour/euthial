// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {PropertyNFT} from "../src/PropertyNFT.sol";

contract DeployPropertyNFT is Script {
    function run() public {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address admin = vm.addr(deployerKey);

        vm.startBroadcast(deployerKey);
        PropertyNFT nft = new PropertyNFT(admin);
        vm.stopBroadcast();

        // Log deployment info
        console.log("PropertyNFT deployed at:", address(nft));
        console.log("Admin:", admin);
    }
}

// Standard library (minimal imports for deployment)
abstract contract Script {
    function vm() internal pure returns (address) {
        revert("Override me");
    }
}

abstract contract console {
    function log(string memory, address) internal pure {}
}
