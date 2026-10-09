// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {FitOutAgreement} from "../../src/FitOutAgreement.sol";
import {Fixtures} from "../utils/Fixtures.sol";

contract FuzzBondTest is Fixtures {
    function setUp() public {
        deployContracts();
        mintTokens();
        setupAllowlists();
    }

    function fuzz_BondDeposit_Conservation(uint256 amount) public {
        amount = bound(amount, 1e6, BOND_AMOUNT);
        
        vm.startPrank(tenant);
        token.approve(address(agreement), amount);
        agreement.depositBond(amount);
        vm.stopPrank();
        
        assertEq(agreement.bondDeposited(), amount);
        assertEq(agreement.bondBalance(), amount);
        assertEq(agreement.bondDrawn(), 0);
        assertEq(agreement.bondRefunded(), 0);
        assertTrue(agreement.bondConservation());
    }

    function fuzz_BondRefund_AfterClose(uint256 amount) public {
        amount = bound(amount, 1e6, BOND_AMOUNT);
        
        vm.startPrank(tenant);
        token.approve(address(agreement), amount);
        agreement.depositBond(amount);
        vm.stopPrank();
        
        uint256 balBefore = token.balanceOf(tenant);
        
        vm.startPrank(tenant);
        agreement.refundBond();
        vm.stopPrank();
        
        uint256 balAfter = token.balanceOf(tenant);
        assertEq(balAfter - balBefore, amount);
        assertEq(agreement.bondBalance(), 0);
    }

    function fuzz_ExcusedDaysLimit(uint16 rangeLength) public {
        rangeLength = uint16(bound(rangeLength, 1, 30));
        
        vm.prank(arbiter);
        agreement.markExcused(1, rangeLength, bytes32(0));
        
        assertEq(agreement.excusedDays(), rangeLength);
    }

    function fuzz_ExcusedDaysExceeded_Reverts(uint16 first, uint16 second) public {
        first = uint16(bound(first, 1, 20));
        second = uint16(bound(second, 1, 20));
        
        vm.prank(arbiter);
        agreement.markExcused(1, first, bytes32(0));
        
        if (first + second > 30) {
            vm.prank(arbiter);
            vm.expectRevert(FitOutAgreement.ExcusedDaysExceeded.selector);
            agreement.markExcused(first + 2, first + 1 + second, bytes32(0));
        }
    }
}
