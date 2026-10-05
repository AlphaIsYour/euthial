# Euthial (FitOut Vault)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Solidity: ^0.8.24](https://img.shields.io/badge/Solidity-%5E0.8.24-363636.svg?logo=solidity)](https://soliditylang.org/)
[![Framework: Foundry](https://img.shields.io/badge/Framework-Foundry-red.svg)](https://getfoundry.sh/)
[![Frontend: Next.js 16](https://img.shields.io/badge/Frontend-Next.js%2014-black.svg?logo=next.js)](https://nextjs.org/)
[![Architecture: Monorepo](https://img.shields.io/badge/Architecture-pnpm%20workspace-orange.svg)](https://pnpm.io/)
[![Testnet: Ethereum Sepolia](https://img.shields.io/badge/Network-Ethereum%20Sepolia-627EEA.svg?logo=ethereum)](https://sepolia.etherscan.io/)

> **Verifiable Revenue-Based Financing (RBF) protocol for commercial shop-house (*ruko*) fit-outs on regulated payment rails.**

---

## Executive Summary

In cities across Indonesia (such as our pilot context in Jember, East Java), numerous commercial shop-houses (*ruko*) sit abandoned and vacant for years. Landlords demand high rents but refuse to finance renovations upfront without guaranteed tenants; aspiring micro/SME tenants (cafes, food & beverage) lack capex and affordable bank credit; and potential investors have no transparent mechanism to co-fund renovations without blind trust in internal accounting books.

**Euthial** solves this three-sided deadlock through a dual-mode hybrid architecture:
1. **Regulated Payment Rails (Mode B):** Customer payments remain strictly in Indonesian Rupiah (IDR) via Bank Indonesia-licensed QRIS settlement accounts.
2. **Verifiable On-Chain Settlement (Mode A / Hybrid):** Smart contracts enforce dual-tranche capital structures (ERC-4626), automated waterfall distributions, and payment floor covenant protections verified cryptographically via EIP-712 settlement attestations.

---

## Key Mechanism Pillars

| Pillar | Description | Implementation |
|---|---|---|
| **Tranche Structure** | Senior tranche (80%, external investors) has payout priority; Junior tranche (20%, landlord) serves as first-loss protection and receives turnover rent (5%). | `TrancheVault.sol` (ERC-4626) |
| **Waterfall Distribution** | Phase A (Amortization): 80% retained by tenant, 15% to investors (senior then junior sequentially), 5% turnover rent to landlord. Phase B (Residual): 2% junior royalty + 5% turnover rent. | `WaterfallRouter.sol` |
| **Covenant & Bond** | Cumulative minimum payment floor replaces unreliable on-chain revenue oracles. Escalation ladder: Warning &rarr; Cure (7 logical days) &rarr; Bond Draw (10% deposit) &rarr; Step-In. | `FitOutAgreement.sol` |
| **Coverage Check** | Origination gate ensures tenant operational margin is at least 2.0x total take-rate (`coverage >= 2.0`), preventing negative operational margins. | Smart contract & Simulator |

---

## Monorepo Architecture

This project is organized as a unified monorepo powered by `pnpm`:

```text
euthial/
├── contracts/             # Foundry development suite (Solidity ^0.8.24)
│   ├── src/               # Core contracts: Agreement, Router, Vaults, MockIDR
│   ├── test/              # Unit, fuzz, invariant, and integration test suites
│   └── script/            # Deployment and one-command seed scripts
├── apps/
│   ├── web/               # Next.js 14 App Router, Tailwind CSS, Wagmi/Viem
│   └── attestor/          # Node.js / TypeScript EIP-712 Mock Attestor & Scenario Runner
├── packages/
│   └── sim/               # Pure TypeScript deterministic economic simulator engine
├── scenarios/             # Pre-configured test scenario definitions (S1 to S8)
├── docs/                  # Comprehensive 10-part specification and regulatory context
├── package.json           # Monorepo root scripts
└── pnpm-workspace.yaml    # Workspace definition
```

---

## Getting Started

### Prerequisites
- Node.js >= 18.18.0
- pnpm >= 8.0.0
- [Foundry](https://getfoundry.sh/) (`forge`, `cast`, `anvil`)

### Installation

```bash
# Clone the repository
git clone https://github.com/AlphaIsYour/euthial.git
cd euthial

# Install workspace dependencies
pnpm install
```

### Smart Contract Development (Foundry)

```bash
# Compile contracts
pnpm contracts:compile

# Run test suites (unit, fuzz, scenario)
pnpm test:contracts
```

### Local Demonstration Workflow

```bash
# 1. Start a local Ethereum node in a separate terminal
anvil

# 2. Reset and seed the protocol state to OPERATING phase
pnpm demo:reset

# 3. Run the automated scenario runner (e.g. S1 Normal or S4 30% Cash Leakage)
pnpm demo:run --scenario=S1

# 4. Start the frontend dashboard
pnpm dev
```

The web dashboard will be available at `http://localhost:3000`.

---

## Hackathon Demo Scenarios

| Scenario ID | Name | Core Dynamics Tested | Contract Outcome |
|---|---|---|---|
| **S1** | Normal Baseline | Recorded revenue at 100% target | Senior tranche repaid at month ~14, Junior tranche repaid at month ~18, transitions to `RESIDUAL`. |
| **S4** | Tenant 30% Cash Leakage | Recorded revenue falls to 70% | Payment floor triggers shortfall; bond drawn (~Rp5.3M); full payout achieved at month ~26 without eviction. |
| **S6** | Early Default | Revenue collapses at month 6 | Consecutive breaches trigger `STEP_IN`; 20% asset recovery executed; junior tranche absorbs first-loss. |

---

## Transparent System Boundaries

As documented in `docs/07_RISK_STRESS_TEST_QA.md`:
1. **Regulatory Status:** The legal mapping is an exploratory blueprint subject to formal Indonesian legal opinion (OJK POJK 23/2025 and Bank Indonesia currency laws).
2. **Data Proxies:** Financial numbers are labelled model assumptions to be validated in subsequent single-unit pilot phases.
3. **Trust Assumptions:** Settlement attestations rely on a designated escrow agent/attestor address, which is locked per agreement.
4. **Cash Leakage:** Physical cash leakage is mathematically bounded by the tenant bond and payment floor, not eliminated entirely.

---

## Documentation Index

Detailed architectural and regulatory specifications are maintained in [`docs/`](docs/):
- [`00_README_INDEX.md`](docs/00_README_INDEX.md) — Specification index and non-negotiables register.
- [`01_PRODUCT_CONTEXT.md`](docs/01_PRODUCT_CONTEXT.md) — Field problem analysis and positioning.
- [`02_ECONOMIC_MODEL.md`](docs/02_ECONOMIC_MODEL.md) — Mathematical formulas and stress testing.
- [`03_REGULATORY_LEGAL.md`](docs/03_REGULATORY_LEGAL.md) — Indonesian regulatory analysis and constraints.
- [`04_SYSTEM_ARCHITECTURE.md`](docs/04_SYSTEM_ARCHITECTURE.md) — Four-layer architecture and data models.
- [`05_SMART_CONTRACT_SPEC.md`](docs/05_SMART_CONTRACT_SPEC.md) — Solidity specification, state machine, and invariants.
- [`06_MVP_BUILD_PLAN.md`](docs/06_MVP_BUILD_PLAN.md) — 48-hour build plan and demonstration script.
- [`07_RISK_STRESS_TEST_QA.md`](docs/07_RISK_STRESS_TEST_QA.md) — Risk register and judge Q&A preparation.
- [`08_DATA_VALIDATION_PLAN.md`](docs/08_DATA_VALIDATION_PLAN.md) — Public data proxy validation protocol.
- [`09_DECISION_LOG_OPEN_QUESTIONS.md`](docs/09_DECISION_LOG_OPEN_QUESTIONS.md) — Architectural decision records (ADRs).
- [`10_SPRINT_48H_EXECUTION_BOARD.md`](docs/10_SPRINT_48H_EXECUTION_BOARD.md) — Design tokens, team allocation, and GitHub issue tickets.

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
