// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {FitOutAgreement} from "../../src/FitOutAgreement.sol";
import {WaterfallRouter} from "../../src/WaterfallRouter.sol";
import {TrancheVault} from "../../src/TrancheVault.sol";
import {MockIDR} from "../../src/MockIDR.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Constants} from "./Constants.sol";

contract Fixtures is Test, Constants {
    MockIDR public token;
    TrancheVault public seniorVault;
    TrancheVault public juniorVault;
    WaterfallRouter public router;
    FitOutAgreement public agreement;

    address public admin = address(this);
    address public landlord = makeAddr("landlord");
    address public tenant = makeAddr("tenant");
    address public contractor = makeAddr("contractor");
    address public inspector = makeAddr("inspector");
    address public arbiter = makeAddr("arbiter");
    address public attestor;
    address public alice = makeAddr("alice");
    address public bob = makeAddr("bob");

    uint256 public attestorPrivateKey = 0xA11CE;
    uint64 public fundraiseDeadline;
    uint64 public buildDeadline;

    function deployContracts() public {
        token = new MockIDR();
        attestor = vm.addr(attestorPrivateKey);
        fundraiseDeadline = uint64(block.timestamp + 30 days);
        buildDeadline = uint64(block.timestamp + 60 days);

        seniorVault = new TrancheVault(
            IERC20(address(token)),
            "Senior Tranche Vault",
            "sTRV",
            admin
        );
        juniorVault = new TrancheVault(
            IERC20(address(token)),
            "Junior Tranche Vault",
            "jTRV",
            admin
        );

        agreement = new FitOutAgreement(
            address(token), address(0), address(seniorVault), address(juniorVault),
            landlord, tenant, contractor, inspector, arbiter,
            BUDGET, SENIOR_PRINCIPAL, JUNIOR_PRINCIPAL, SENIOR_MULTIPLE_BPS, JUNIOR_MULTIPLE_BPS,
            TARGET_TENOR_DAYS, MAX_TENOR_DAYS, FLOOR_RATIO_BPS, TOLERANCE_BPS, CURE_DAYS, MAX_EXCUSED_DAYS,
            fundraiseDeadline, buildDeadline, 1000
        );

        router = new WaterfallRouter(
            address(agreement), address(seniorVault), address(juniorVault),
            landlord, attestor, address(token), SENIOR_CLAIM, JUNIOR_CLAIM
        );

        vm.prank(landlord);
        agreement.setRouter(address(router));

        seniorVault.setAgreement(address(agreement));
        juniorVault.setAgreement(address(agreement));
        seniorVault.setRouter(address(router));
        juniorVault.setRouter(address(router));
    }

    function mintTokens() public {
        token.mint(landlord, INITIAL_MINT);
        token.mint(tenant, INITIAL_MINT);
        token.mint(contractor, INITIAL_MINT);
        token.mint(alice, INITIAL_MINT);
        token.mint(bob, INITIAL_MINT);
        token.mint(attestor, INITIAL_MINT);
        token.mint(admin, INITIAL_MINT);
    }

    function setupAllowlists() public {
        seniorVault.setAllowlist(alice, true);
        seniorVault.setAllowlist(admin, true);
        juniorVault.setAllowlist(landlord, true);
        juniorVault.setAllowlist(bob, true);
    }

    function approveRouter() public {
        vm.prank(attestor);
        token.approve(address(router), type(uint256).max);
    }

    function completeFundraising(uint256 seniorAmount, uint256 juniorAmount) public {
        vm.startPrank(alice);
        token.approve(address(seniorVault), seniorAmount);
        seniorVault.deposit(seniorAmount, alice);
        vm.stopPrank();

        vm.startPrank(landlord);
        token.approve(address(juniorVault), juniorAmount);
        juniorVault.deposit(juniorAmount, landlord);
        vm.stopPrank();

        vm.startPrank(tenant);
        token.approve(address(agreement), BOND_AMOUNT);
        agreement.depositBond(BOND_AMOUNT);
        vm.stopPrank();
    }

    function deployCapital(uint256 seniorDeployAmount, uint256 juniorDeployAmount) public {
        vm.startPrank(address(agreement));
        seniorVault.deploy(seniorDeployAmount, contractor);
        juniorVault.deploy(juniorDeployAmount, contractor);
        vm.stopPrank();
    }

    function createSignedSettlement(
        uint32 dayId,
        uint32 periodDays,
        uint256 grossRecorded
    ) public view returns (WaterfallRouter.Settlement memory, bytes memory) {
        WaterfallRouter.Settlement memory s = WaterfallRouter.Settlement({
            dayId: dayId, periodDays: periodDays, grossRecorded: grossRecorded,
            txCount: 1, evidenceHash: bytes32(0)
        });

        bytes32 structHash = keccak256(abi.encode(
            router.getSettlementTypehash(), s.dayId, s.periodDays,
            s.grossRecorded, s.txCount, s.evidenceHash
        ));

        bytes32 digest = keccak256(abi.encodePacked(
            "\x19\x01", router.domainSeparator(), structHash
        ));

        (uint8 v, bytes32 r, bytes32 s_) = vm.sign(attestorPrivateKey, digest);
        bytes memory sig = abi.encodePacked(r, s_, v);
        return (s, sig);
    }
}
