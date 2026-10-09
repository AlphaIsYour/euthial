// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {PropertyNFT} from "../src/PropertyNFT.sol";

contract DeployPropertyNFT is Script {
    function run() public returns (PropertyNFT nft) {
        uint256 deployerKey = vm.envOr(
            "PRIVATE_KEY",
            uint256(0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80)
        );
        address admin = vm.addr(deployerKey);

        vm.startBroadcast(deployerKey);
        nft = new PropertyNFT(admin);
        vm.stopBroadcast();

        // Log deployment info
        console2.log("PropertyNFT deployed at:", address(nft));
        console2.log("Admin:", admin);
    }
}

