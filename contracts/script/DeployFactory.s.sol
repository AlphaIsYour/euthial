// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {AgreementFactory} from "../src/AgreementFactory.sol";

/**
 * @title DeployFactory
 * @notice Deploys the AgreementFactory contract to manage atomic creation of deal suites.
 */
contract DeployFactory is Script {
    function run() external returns (AgreementFactory factory) {
        uint256 deployerPrivateKey = vm.envOr(
            "PRIVATE_KEY",
            uint256(0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80)
        );
        address deployer = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        console2.log("=== Deploying AgreementFactory ===");
        console2.log("Deployer:", deployer);

        factory = new AgreementFactory(deployer);
        console2.log("AgreementFactory deployed at:", address(factory));

        vm.stopBroadcast();
    }
}
