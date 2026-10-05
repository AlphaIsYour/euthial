// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {console2} from "forge-std/console2.sol";
import {WaterfallRouter} from "../src/WaterfallRouter.sol";
import {TrancheVault} from "../src/TrancheVault.sol";
import {MockIDR} from "../src/MockIDR.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract WaterfallRouterTest is Test {
    MockIDR public token;
    TrancheVault public seniorVault;
    TrancheVault public juniorVault;
    WaterfallRouter public router;

    address public admin = address(this);
    address public agreement = makeAddr("agreement");
    address public landlord = makeAddr("landlord");
    address public attestor = makeAddr("attestor");
    address public alice = makeAddr("alice");
    address public bob = makeAddr("bob");

    uint256 constant SENIOR_PRINCIPAL = 120_000_000e6;
    uint256 constant JUNIOR_PRINCIPAL = 30_000_000e6;
    uint256 constant SENIOR_MULTIPLE_BPS = 12500;
    uint256 constant JUNIOR_MULTIPLE_BPS = 14000;
    
    uint256 public immutable SENIOR_CLAIM = (SENIOR_PRINCIPAL * SENIOR_MULTIPLE_BPS) / 10000;
    uint256 public immutable JUNIOR_CLAIM = (JUNIOR_PRINCIPAL * JUNIOR_MULTIPLE_BPS) / 10000;
    
    uint256 constant INITIAL_MINT = 1_000_000_000e6;
    uint256 attestorPrivateKey = 0xA11CE;

    function setUp() public {
        token = new MockIDR();
        seniorVault = new TrancheVault(IERC20(address(token)), "Senior Tranche Vault", "sTRV", admin);
        juniorVault = new TrancheVault(IERC20(address(token)), "Junior Tranche Vault", "jTRV", admin);
        
        seniorVault.setAgreement(agreement);
        juniorVault.setAgreement(agreement);
        
        attestor = vm.addr(attestorPrivateKey);
        
        router = new WaterfallRouter(
            agreement, address(seniorVault), address(juniorVault),
            landlord, attestor, address(token),
            SENIOR_CLAIM, JUNIOR_CLAIM
        );
        
        seniorVault.setRouter(address(router));
        juniorVault.setRouter(address(router));
        
        token.mint(alice, INITIAL_MINT);
        token.mint(bob, INITIAL_MINT);
        token.mint(attestor, INITIAL_MINT);
        token.mint(landlord, INITIAL_MINT);
        
        seniorVault.setAllowlist(alice, true);
        juniorVault.setAllowlist(bob, true);
        juniorVault.setAllowlist(landlord, true);
        
        vm.startPrank(alice);
        token.approve(address(seniorVault), SENIOR_PRINCIPAL);
        seniorVault.deposit(SENIOR_PRINCIPAL, alice);
        vm.stopPrank();
        
        vm.startPrank(bob);
        token.approve(address(juniorVault), JUNIOR_PRINCIPAL);
        juniorVault.deposit(JUNIOR_PRINCIPAL, bob);
        vm.stopPrank();
        
        vm.startPrank(agreement);
        seniorVault.deploy(SENIOR_PRINCIPAL, address(0xdead));
        juniorVault.deploy(JUNIOR_PRINCIPAL, address(0xdead));
        vm.stopPrank();
        
        vm.prank(attestor);
        token.approve(address(router), type(uint256).max);
    }

    function signSettlement(WaterfallRouter.Settlement memory s) internal view returns (bytes memory) {
        bytes32 structHash = keccak256(abi.encode(router.getSettlementTypehash(), s.dayId, s.periodDays, s.grossRecorded, s.txCount, s.evidenceHash));
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", router.domainSeparator(), structHash));
        (uint8 v, bytes32 r, bytes32 s_) = vm.sign(attestorPrivateKey, digest);
        return abi.encodePacked(r, s_, v);
    }

    function createSettlement(uint32 dayId, uint8 periodDays, uint256 grossRecorded) internal pure returns (WaterfallRouter.Settlement memory) {
        return WaterfallRouter.Settlement({dayId: dayId, periodDays: periodDays, grossRecorded: grossRecorded, txCount: 100, evidenceHash: keccak256(abi.encodePacked(dayId))});
    }

    function test_T06_PhaseA_NormalSettlement() public {
        uint256 G = 10_000_000e6;
        WaterfallRouter.Settlement memory s = createSettlement(1, 1, G);
        bytes memory sig = signSettlement(s);
        uint256 landlordBalBefore = token.balanceOf(landlord);
        router.settle(s, sig);
        uint256 expectedLandlord = (G * 500) / 10000;
        assertEq(token.balanceOf(landlord) - landlordBalBefore, expectedLandlord, "Landlord amount");
    }

    function test_T07_SequentialDistribution() public {
        for (uint32 day = 1; day <= 100; day++) {
            WaterfallRouter.Settlement memory s = createSettlement(day, 1, 10_000_000e6);
            router.settle(s, signSettlement(s));
        }
        assertEq(router.seniorPaid(), SENIOR_CLAIM, "Senior fully paid");
    }

    function test_T08_PhaseTransition() public {
        for (uint32 day = 1; day <= 128; day++) {
            router.settle(createSettlement(day, 1, 10_000_000e6), signSettlement(createSettlement(day, 1, 10_000_000e6)));
        }
        assertTrue(router.currentPhase() == WaterfallRouter.Phase.PhaseB, "Transitioned to Phase B");
    }

    function test_T09_InvalidSignature() public {
        WaterfallRouter.Settlement memory s = createSettlement(1, 1, 10_000_000e6);
        uint256 wrongKey = 0xBAD;
        bytes32 structHash = keccak256(abi.encode(router.getSettlementTypehash(), s.dayId, s.periodDays, s.grossRecorded, s.txCount, s.evidenceHash));
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", router.domainSeparator(), structHash));
        (uint8 v, bytes32 r, bytes32 s_) = vm.sign(wrongKey, digest);
        bytes memory badSig = abi.encodePacked(r, s_, v);
        vm.expectRevert(WaterfallRouter.InvalidSignature.selector);
        router.settle(s, badSig);
    }

    function test_T09_ReplayAttack() public {
        WaterfallRouter.Settlement memory s = createSettlement(1, 1, 10_000_000e6);
        bytes memory sig = signSettlement(s);
        router.settle(s, sig);
        vm.expectRevert(WaterfallRouter.SettlementAlreadyRecorded.selector);
        router.settle(s, sig);
    }

    function test_INV01_PhaseA() public {
        uint256 G = 10_000_000e6;
        WaterfallRouter.SplitResult memory split = router.previewSplit(G);
        uint256 totalPull = split.landlordAmt + split.toSenior + split.toJunior;
        assertLe(totalPull, G, "INV-01: pull <= G in Phase A");
    }

    function test_INV02_RouterBalanceUnchanged() public {
        uint256 routerBalBefore = token.balanceOf(address(router));
        WaterfallRouter.Settlement memory s = createSettlement(1, 1, 10_000_000e6);
        router.settle(s, signSettlement(s));
        assertEq(token.balanceOf(address(router)), routerBalBefore, "INV-02: Router balance unchanged");
    }

    function test_INV03_JuniorImpliesSeniorFull() public {
        for (uint32 day = 1; day <= 150; day++) {
            router.settle(createSettlement(day, 1, 10_000_000e6), signSettlement(createSettlement(day, 1, 10_000_000e6)));
            if (router.juniorPaid() > 0) {
                assertEq(router.seniorPaid(), SENIOR_CLAIM, "INV-03: Junior payment requires senior fully paid");
            }
        }
    }
}