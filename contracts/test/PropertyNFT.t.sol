// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {PropertyNFT} from "../src/PropertyNFT.sol";

contract PropertyNFTTest is Test {
    PropertyNFT public nft;
    address admin;
    address landlord;
    address agreement;
    address other;

    function setUp() public {
        admin = makeAddr("admin");
        landlord = makeAddr("landlord");
        agreement = makeAddr("agreement");
        other = makeAddr("other");
        nft = new PropertyNFT(admin);
    }

    function test_Deployment() public view {
        assertTrue(nft.hasRole(nft.DEFAULT_ADMIN_ROLE(), admin));
        assertTrue(nft.hasRole(nft.REGISTRAR_ROLE(), admin));
    }

    function test_RegisterProperty() public {
        vm.prank(admin);
        uint256 tokenId = nft.registerProperty(
            landlord,
            "Jl. Merdeka 123",
            keccak256("CERT1"),
            5_000_000 * 1e6,
            agreement,
            "ipfs://QmXx"
        );
        assertEq(tokenId, 1);
        assertEq(nft.ownerOf(tokenId), landlord);
    }

    function test_MetadataStorage() public {
        vm.prank(admin);
        uint256 tokenId = nft.registerProperty(
            landlord,
            "Jl. Merdeka 123",
            keccak256("CERT1"),
            5_000_000 * 1e6,
            agreement,
            "ipfs://QmXx"
        );
        PropertyNFT.PropertyMetadata memory m = nft.getPropertyMetadata(tokenId);
        assertEq(m.physicalAddress, "Jl. Merdeka 123");
        assertEq(m.fitOutAgreement, agreement);
        assertTrue(m.isActive);
    }

    function test_AgreementLink() public {
        vm.prank(admin);
        uint256 tokenId = nft.registerProperty(
            landlord,
            "Jl. Merdeka 123",
            keccak256("CERT1"),
            5_000_000 * 1e6,
            agreement,
            "ipfs://QmXx"
        );
        assertEq(nft.getTokenIdByAgreement(agreement), tokenId);
        assertEq(nft.getLinkedAgreement(tokenId), agreement);
    }

    function test_AuthorizationRequired() public {
        vm.prank(other);
        vm.expectRevert();
        nft.registerProperty(
            landlord,
            "Jl. Merdeka 123",
            keccak256("CERT1"),
            5_000_000 * 1e6,
            agreement,
            "ipfs://QmXx"
        );
    }

    function test_ValidateInputs() public {
        vm.prank(admin);
        vm.expectRevert(PropertyNFT.ZeroAddressLandlord.selector);
        nft.registerProperty(address(0), "Addr", keccak256("C"), 1, agreement, "URI");

        vm.prank(admin);
        vm.expectRevert(PropertyNFT.EmptyPhysicalAddress.selector);
        nft.registerProperty(landlord, "", keccak256("C"), 1, agreement, "URI");

        vm.prank(admin);
        vm.expectRevert(PropertyNFT.InvalidEstimatedValue.selector);
        nft.registerProperty(landlord, "Addr", keccak256("C"), 0, agreement, "URI");
    }

    function test_DuplicateAgreement() public {
        vm.prank(admin);
        nft.registerProperty(
            landlord,
            "Addr1",
            keccak256("CERT1"),
            1000,
            agreement,
            "ipfs://1"
        );
        vm.prank(admin);
        vm.expectRevert(PropertyNFT.AgreementAlreadyLinked.selector);
        nft.registerProperty(
            landlord,
            "Addr2",
            keccak256("CERT2"),
            1000,
            agreement,
            "ipfs://2"
        );
    }

    function test_StatusManagement() public {
        vm.prank(admin);
        uint256 tokenId = nft.registerProperty(
            landlord,
            "Addr",
            keccak256("C"),
            1000,
            agreement,
            "URI"
        );
        assertTrue(nft.isPropertyActive(tokenId));
        vm.prank(admin);
        nft.setPropertyStatus(tokenId, false);
        assertFalse(nft.isPropertyActive(tokenId));
    }

    function test_Transfer() public {
        vm.prank(admin);
        uint256 tokenId = nft.registerProperty(
            landlord,
            "Addr",
            keccak256("C"),
            1000,
            agreement,
            "URI"
        );
        address newOwner = makeAddr("newOwner");
        vm.prank(landlord);
        nft.transferFrom(landlord, newOwner, tokenId);
        assertEq(nft.ownerOf(tokenId), newOwner);
    }
}
