# Euthial Smart Contracts

Smart contracts for Verifiable Revenue-Based Financing for Commercial Ruko Fit-Outs.

## Architecture

- **`FitOutAgreement.sol`**: State machine managing covenants, bond deposits/refunds, milestones, cure periods, and step-in triggers.
- **`WaterfallRouter.sol`**: EIP-712 settlement router executing waterfall revenue distributions (80% Senior, 15% Junior, 5% Landlord in Phase A; 5% Landlord, 2% Junior Royalty in Phase B).
- **`TrancheVault.sol`**: Dual ERC-4626 vault implementation for Senior and Junior tranches.
- **`MockIDR.sol`**: 6-decimal mock Rupiah stablecoin for local test environments.

## Testing & Compilation

### Requirements
- Foundry (`forge`, `anvil`, `cast`)

### One-line commands

Run contract unit and fuzz tests:
```bash
forge test
```

Run specific test suites:
```bash
forge test --match-contract CovenantTest
forge test --match-contract BondRefundTest
forge test --match-contract ExcusedDaysAndLiquidationTest
forge test --match-contract FitOutAgreementTest
forge test --match-contract IntegrationSmokeTest
```

### Local Deployment & Seeding

One-line local deployment script to Anvil:
```bash
forge script script/DeployAndSeed.s.sol --broadcast --rpc-url http://127.0.0.1:8545
```
