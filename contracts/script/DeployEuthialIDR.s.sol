// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {EuthialIDR} from "../src/EuthialIDR.sol";

/**
 * @title DeployEuthialIDR
 * @notice Automated deployment script for EuthialIDR on Sepolia or local testnets.
 *
 * Usage:
 *   forge script script/DeployEuthialIDR.s.sol --broadcast --rpc-url <RPC_URL>
 */
contract DeployEuthialIDR is Script {
    function run() external returns (address) {
        uint256 deployerPrivateKey = vm.envOr(
            "PRIVATE_KEY",
            uint256(0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80)
        );
        address deployer = vm.addr(deployerPrivateKey);
        address admin = vm.envOr("ADMIN_ADDRESS", deployer);
        uint256 initialSupply = vm.envOr("INITIAL_SUPPLY", 100_000_000 * 1e6); // 100M IDR seed

        vm.startBroadcast(deployerPrivateKey);

        console2.log("=== Deploying EuthialIDR ===");
        console2.log("Deployer:", deployer);
        console2.log("Admin:", admin);
        console2.log("Initial Supply:", initialSupply);

        EuthialIDR token = new EuthialIDR(admin, initialSupply);
        console2.log("EuthialIDR deployed at:", address(token));
        console2.log("Decimals:", token.decimals());
        console2.log("Total Supply:", token.totalSupply());

        vm.stopBroadcast();

        return address(token);
    }
}
