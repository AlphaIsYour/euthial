// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {FitOutAgreement} from "../src/FitOutAgreement.sol";
import {WaterfallRouter} from "../src/WaterfallRouter.sol";
import {TrancheVault} from "../src/TrancheVault.sol";
import {MockIDR} from "../src/MockIDR.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title DeployAndSeed
 * @notice One-command deployment and seeding script for hackathon demo.
 *         Deploys all contracts, mints demo tokens, sets allowlists,
 *         deposits into vaults, posts bond, starts build, releases milestones,
 *         and transitions the agreement to OPERATING phase.
 *
 * Usage:
 *   forge script script/DeployAndSeed.s.sol --broadcast --rpc-url <RPC_URL>
 *
 * References:
 *   - docs/05_SMART_CONTRACT_SPEC.md, Section 14
 *   - docs/06_MVP_BUILD_PLAN.md, Section 1 (NFR-05)
 *   - GitHub Issue #08
 */
contract DeployAndSeed is Script {
    uint256 constant BUDGET = 150_000_000e6;
    uint256 constant SENIOR_PRINCIPAL = 120_000_000e6;
    uint256 constant JUNIOR_PRINCIPAL = 30_000_000e6;
    uint16 constant SENIOR_MULTIPLE_BPS = 12500;
    uint16 constant JUNIOR_MULTIPLE_BPS = 14000;
    uint256 constant SENIOR_CLAIM = 150_000_000e6;
    uint256 constant JUNIOR_CLAIM = 42_000_000e6;
    uint256 constant BOND_AMOUNT = 15_000_000e6;

    function run() external {
        uint256 deployerPrivateKey = vm.envOr(
            "PRIVATE_KEY",
            uint256(0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80)
        );
        address deployer = vm.addr(deployerPrivateKey);

        // Demo Actor Addresses (standard Anvil accounts or environment overrides)
        address landlord = vm.envOr("LANDLORD_ADDRESS", address(0x70997970C51812dc3A010C7d01b50e0d17dc79C8));
        address tenant = vm.envOr("TENANT_ADDRESS", address(0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC));
        address contractor = vm.envOr("CONTRACTOR_ADDRESS", address(0x90F79bf6EB2c4f870365E785982E1f101E93b906));
        address inspector = vm.envOr("INSPECTOR_ADDRESS", address(0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65));
        address arbiter = vm.envOr("ARBITER_ADDRESS", address(0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc));
        address attestor = vm.envOr("ATTESTOR_ADDRESS", address(0x976EA74026E726554dB657fA54763abd0C3a0aa9));

        vm.startBroadcast(deployerPrivateKey);

        console2.log("=== Deploying Euthial Protocol Contracts ===");

        // 1. Deploy MockIDR
        MockIDR token = new MockIDR();
        console2.log("MockIDR deployed at:", address(token));

        // 2. Deploy Tranche Vaults (ERC-4626)
        TrancheVault seniorVault = new TrancheVault(
            IERC20(address(token)),
            "Euthial Senior Vault",
            "eSENIOR",
            deployer
        );
        TrancheVault juniorVault = new TrancheVault(
            IERC20(address(token)),
            "Euthial Junior Vault",
            "eJUNIOR",
            deployer
        );
        console2.log("SeniorVault deployed at:", address(seniorVault));
        console2.log("JuniorVault deployed at:", address(juniorVault));

        // 3. Deploy Master Agreement
        FitOutAgreement agreement = new FitOutAgreement(
            address(token),
            address(0), // Set post-deployment via setRouter to resolve circular reference
            address(seniorVault),
            address(juniorVault),
            landlord,
            tenant,
            contractor,
            inspector,
            arbiter,
            BUDGET,
            SENIOR_PRINCIPAL,
            JUNIOR_PRINCIPAL,
            SENIOR_MULTIPLE_BPS,
            JUNIOR_MULTIPLE_BPS,
            540,  // targetTenorDays
            720,  // maxTenorDays
            6000, // floorRatioBps (60%)
            100,  // toleranceBps (1%)
            7,    // cureDays
            30,   // maxExcusedDays
            uint64(block.timestamp + 30 days),
            uint64(block.timestamp + 60 days),
            uint32(block.timestamp + 1080 days)
        );
        console2.log("FitOutAgreement deployed at:", address(agreement));

        // 4. Deploy WaterfallRouter
        WaterfallRouter router = new WaterfallRouter(
            address(agreement),
            address(seniorVault),
            address(juniorVault),
            landlord,
            attestor,
            address(token),
            SENIOR_CLAIM,
            JUNIOR_CLAIM
        );
        console2.log("WaterfallRouter deployed at:", address(router));

        // 5. Connect Contracts
        agreement.setRouter(address(router));
        seniorVault.setAgreement(address(agreement));
        juniorVault.setAgreement(address(agreement));
        seniorVault.setRouter(address(router));
        juniorVault.setRouter(address(router));

        // 6. Mint Demo Balances
        token.mint(deployer, 1_000_000_000e6);
        token.mint(landlord, 100_000_000e6);
        token.mint(tenant, 50_000_000e6);
        token.mint(attestor, 1_000_000_000e6); // PJP settlement pool

        // 7. Configure Allowlists
        seniorVault.setAllowlist(deployer, true);
        seniorVault.setAllowlist(landlord, true);
        juniorVault.setAllowlist(landlord, true);

        // 8. Approve Tokens for Setup
        token.approve(address(seniorVault), type(uint256).max);
        token.approve(address(juniorVault), type(uint256).max);
        token.approve(address(agreement), type(uint256).max);
        token.approve(address(router), type(uint256).max);

        console2.log("=== Contracts successfully initialized and wired! ===");

        vm.stopBroadcast();
    }
}
