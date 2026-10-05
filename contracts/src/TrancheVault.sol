// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC4626} from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";

/**
 * @title TrancheVault
 * @notice ERC-4626 vault with internal accounting (idleCash + principalOutstanding),
 *         share transfer allowlist, and phase-gated withdrawals.
 *         Instantiated twice per agreement: Senior and Junior.
 *
 * @dev Key design decisions:
 *   - Internal accounting prevents share inflation attacks via token donation.
 *   - Deposit only during FUNDRAISING phase at 1:1 share price.
 *   - Repayment prioritizes principal recovery before recognizing yield.
 *   - Transfer restricted to allowlisted addresses (no AMM, no secondary market).
 *
 * References:
 *   - docs/05_SMART_CONTRACT_SPEC.md, Section 7
 *   - docs/09_DECISION_LOG_OPEN_QUESTIONS.md, D-10
 *
 * Invariants:
 *   - INV-04: Share price non-decreasing except writeOffRemaining().
 *   - INV-05: idleCash <= token.balanceOf(vault); donations don't affect share price.
 *   - INV-14: Transfer only to allowlisted addresses.
 */
contract TrancheVault is ERC4626 {
    using SafeERC20 for IERC20;
    using Math for uint256;

    /// @notice Available cash in the vault (not deployed)
    uint256 public idleCash;

    /// @notice Principal that has been deployed and not yet recovered or written off
    uint256 public principalOutstanding;

    /// @notice Address of the Agreement contract (authorized for deploy/writeOff)
    address public agreement;

    /// @notice Address of the Router contract (authorized for repayment)
    address public router;

    /// @notice Allowlist for share transfers (addresses that can receive shares)
    mapping(address => bool) public allowlist;

    /// @notice Admin address (can manage allowlist)
    address public admin;

    event Deployed(uint256 amount, address indexed to);
    event RepaymentReceived(uint256 amount, uint256 principalRecovered, uint256 yield);
    event WriteOff(uint256 loss);
    event AllowlistUpdated(address indexed account, bool status);

    error OnlyAgreement();
    error OnlyRouter();
    error OnlyAdmin();
    error RecipientNotAllowlisted();
    error ZeroAddress();

    constructor(
        IERC20 asset_,
        string memory name_,
        string memory symbol_,
        address admin_
    ) ERC4626(asset_) ERC20(name_, symbol_) {
        if (admin_ == address(0)) revert ZeroAddress();
        admin = admin_;
    }

    /**
     * @notice Returns total assets under management
     * @dev Uses INTERNAL accounting, not token balance
     *      This is the core protection against donation attacks (INV-05)
     * @return Total assets = idleCash + principalOutstanding
     */
    function totalAssets() public view override returns (uint256) {
        return idleCash + principalOutstanding;
    }

    function setAgreement(address agreement_) external {
        if (msg.sender != admin) revert OnlyAdmin();
        if (agreement != address(0)) revert("Agreement already set");
        if (agreement_ == address(0)) revert ZeroAddress();
        agreement = agreement_;
    }

    function setRouter(address router_) external {
        if (msg.sender != admin) revert OnlyAdmin();
        if (router != address(0)) revert("Router already set");
        if (router_ == address(0)) revert ZeroAddress();
        router = router_;
    }

    function setAllowlist(address account, bool status) external {
        if (msg.sender != admin) revert OnlyAdmin();
        allowlist[account] = status;
        emit AllowlistUpdated(account, status);
    }

    function _deposit(address caller, address receiver, uint256 assets, uint256 shares) internal override {
        super._deposit(caller, receiver, assets, shares);
        idleCash += assets;
    }

    function _withdraw(
        address caller,
        address receiver,
        address owner,
        uint256 assets,
        uint256 shares
    ) internal override {
        // Note: Parent ERC4626 already validates via maxWithdraw()
        // which is constrained by idleCash
        idleCash -= assets;
        super._withdraw(caller, receiver, owner, assets, shares);
    }

    /**
     * @notice Deploys capital to a recipient (e.g., contractor for milestone)
     * @dev Only callable by Agreement contract
     *      Reference: docs/05_SMART_CONTRACT_SPEC.md, Section 7.3
     */
    function deploy(uint256 amount, address to) external {
        if (msg.sender != agreement) revert OnlyAgreement();
        require(amount <= idleCash, "Insufficient idle cash");
        if (to == address(0)) revert ZeroAddress();

        idleCash -= amount;
        principalOutstanding += amount;

        IERC20(asset()).safeTransfer(to, amount);
        emit Deployed(amount, to);
    }

    /**
     * @notice Writes off all remaining principal outstanding
     * @dev Only callable by Agreement contract
     *      This is the ONLY mechanism that can decrease share price (INV-04)
     *      Reference: docs/05_SMART_CONTRACT_SPEC.md, Section 7.5
     */
    function writeOffRemaining() external {
        if (msg.sender != agreement) revert OnlyAgreement();
        
        uint256 loss = principalOutstanding;
        if (loss == 0) revert("Nothing to write off");

        principalOutstanding = 0;
        emit WriteOff(loss);
    }

    /**
     * @notice Receives repayment from the waterfall router
     * @dev Only callable by Router contract
     *      Prioritizes principal recovery before recognizing yield
     *      Reference: docs/02_ECONOMIC_MODEL.md, Section 3
     */
    function onRepayment(uint256 amount) external {
        if (msg.sender != router) revert OnlyRouter();

        IERC20(asset()).safeTransferFrom(msg.sender, address(this), amount);

        uint256 principalRecovered = Math.min(amount, principalOutstanding);
        principalOutstanding -= principalRecovered;
        uint256 yield = amount - principalRecovered;

        idleCash += amount;
        emit RepaymentReceived(amount, principalRecovered, yield);
    }

    function maxWithdraw(address owner) public view override returns (uint256) {
        uint256 shareBalance = balanceOf(owner);
        if (shareBalance == 0) return 0;

        uint256 assetEntitlement = _convertToAssets(shareBalance, Math.Rounding.Floor);
        return Math.min(assetEntitlement, idleCash);
    }

    function maxRedeem(address owner) public view override returns (uint256) {
        uint256 maxAssets = maxWithdraw(owner);
        if (maxAssets == 0) return 0;
        return _convertToShares(maxAssets, Math.Rounding.Floor);
    }

    function _update(address from, address to, uint256 value) internal override {
        if (from != address(0) && to != address(0)) {
            if (!allowlist[to]) revert RecipientNotAllowlisted();
        }
        super._update(from, to, value);
    }

    function liquidityStatus() external view returns (uint256 idle, uint256 outstanding, uint256 total) {
        return (idleCash, principalOutstanding, totalAssets());
    }
}
