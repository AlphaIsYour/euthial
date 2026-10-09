// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title PropertyNFT
 * @notice ERC-721 NFT representing commercial property (ruko) assets in the Euthial protocol.
 *         Each registered property receives a unique token ID, on-chain metadata, and IPFS-based URI.
 *
 * @dev Key design decisions:
 *      - Role-based registration restricted to REGISTRAR_ROLE
 *      - PropertyMetadata stored on-chain for integrity and querying
 *      - Certificate hash (bytes32) stored for compliance verification
 *      - FitOutAgreement link established at registration (atomic)
 *      - Token ID auto-incremented to guarantee uniqueness
 *      - ERC721URIStorage used for flexible metadata URIs
 *
 * References:
 *   - Issue #49: PropertyNFT, ERC-721 Representasi Aset Ruko
 *   - Euthial Protocol: Revenue-based financing for commercial fit-outs
 */
contract PropertyNFT is ERC721, ERC721URIStorage, AccessControl {
    using Counters for Counters.Counter;

    struct PropertyMetadata {
        string physicalAddress;
        bytes32 certificateHash;
        uint256 estimatedValue;
        address fitOutAgreement;
        bool isActive;
    }

    bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");

    Counters.Counter private _tokenIdCounter;
    mapping(uint256 => PropertyMetadata) public properties;
    mapping(address => uint256) public agreementToTokenId;

    event PropertyRegistered(
        uint256 indexed tokenId,
        address indexed landlord,
        address indexed fitOutAgreement,
        string physicalAddress,
        uint256 estimatedValue
    );

    event PropertyStatusChanged(uint256 indexed tokenId, bool isActive);

    error ZeroAddressLandlord();
    error ZeroAddressAgreement();
    error EmptyPhysicalAddress();
    error EmptyCertificateHash();
    error InvalidEstimatedValue();
    error EmptyTokenURI();
    error AgreementAlreadyLinked();
    error TokenDoesNotExist();

    constructor(address admin) ERC721("Euthial Property NFT", "RUKO") {
        if (admin == address(0)) {
            revert ZeroAddressLandlord();
        }
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(REGISTRAR_ROLE, admin);
        _tokenIdCounter.increment();
    }

    function registerProperty(
        address landlord,
        string memory physicalAddr,
        bytes32 certHash,
        uint256 estValue,
        address fitOutAgreement,
        string memory tokenURI
    ) external onlyRole(REGISTRAR_ROLE) returns (uint256) {
        if (landlord == address(0)) revert ZeroAddressLandlord();
        if (fitOutAgreement == address(0)) revert ZeroAddressAgreement();
        if (bytes(physicalAddr).length == 0) revert EmptyPhysicalAddress();
        if (certHash == bytes32(0)) revert EmptyCertificateHash();
        if (estValue == 0) revert InvalidEstimatedValue();
        if (bytes(tokenURI).length == 0) revert EmptyTokenURI();
        if (agreementToTokenId[fitOutAgreement] != 0) {
            revert AgreementAlreadyLinked();
        }

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(landlord, tokenId);
        _setTokenURI(tokenId, tokenURI);

        properties[tokenId] = PropertyMetadata({
            physicalAddress: physicalAddr,
            certificateHash: certHash,
            estimatedValue: estValue,
            fitOutAgreement: fitOutAgreement,
            isActive: true
        });

        agreementToTokenId[fitOutAgreement] = tokenId;

        emit PropertyRegistered(tokenId, landlord, fitOutAgreement, physicalAddr, estValue);

        return tokenId;
    }

    function getPropertyMetadata(uint256 tokenId) external view returns (PropertyMetadata memory) {
        if (!_exists(tokenId)) revert TokenDoesNotExist();
        return properties[tokenId];
    }

    function getTokenIdByAgreement(address fitOutAgreement) external view returns (uint256) {
        return agreementToTokenId[fitOutAgreement];
    }

    function getLinkedAgreement(uint256 tokenId) external view returns (address) {
        if (!_exists(tokenId)) revert TokenDoesNotExist();
        return properties[tokenId].fitOutAgreement;
    }

    function isPropertyActive(uint256 tokenId) external view returns (bool) {
        if (!_exists(tokenId)) revert TokenDoesNotExist();
        return properties[tokenId].isActive;
    }

    function setPropertyStatus(uint256 tokenId, bool isActive) external onlyRole(REGISTRAR_ROLE) {
        if (!_exists(tokenId)) revert TokenDoesNotExist();
        properties[tokenId].isActive = isActive;
        emit PropertyStatusChanged(tokenId, isActive);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        if (!_exists(tokenId)) revert TokenDoesNotExist();
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
}

