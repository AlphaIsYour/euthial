# 🏢 Euthial Protocol
### Verifiable Revenue-Based Financing for Commercial Ruko Fit-Outs

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Network](https://img.shields.io/badge/Network-Ethereum%20Sepolia-blueviolet)](#)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-lightgrey)](https://soliditylang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black)](https://nextjs.org/)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success)](#)

---

## 📌 Executive Summary

**Euthial Protocol** is a decentralized, non-dilutive **Revenue-Based Financing (RBF)** protocol designed specifically for commercial real estate (*ruko* / shophouse) fit-outs and retail tenant expansion. 

Traditional SME financing requires rigid collateral, personal guarantees, and fixed monthly repayments regardless of business performance. Euthial transforms this paradigm by converting future merchant revenues into verifiable on-chain debt assets through **ERC-4626 dual-tranche yield vaults**, **cryptographic revenue attestations**, and an enforceable **legal step-in framework**.

---

## 🚨 The Problem

1. **High Fit-Out CAPEX Barrier**: Tenants and franchise operators require substantial upfront capital (IDR 150M – 1B+) for interior fit-outs, HVAC, and commercial equipment before generating a single dollar of sales.
2. **Inflexible Banking Instruments**: Traditional loans demand heavy real-estate collateral and rigid monthly debt service, driving cash-strapped businesses into bankruptcy during slow months.
3. **Underwriting & Information Asymmetry**: Institutional and Web3 investors lack transparent, tamper-proof mechanisms to monitor daily off-chain merchant turnover and verify repayment fidelity.
4. **Enforcement Disconnect**: Typical RWA protocols lack physical and legal recourse when borrowers default or misappropriate operational cash flow.

---

## 💡 The Euthial Solution

| Core Feature | Mechanism | Value Proposition |
| :--- | :--- | :--- |
| **Non-Dilutive RBF** | Revenue-share percentage (5% – 20% gross turnover) until predetermined cap is fulfilled. | Aligns tenant cash flows: pay more during peak seasons, pay less during slow periods. |
| **Milestone Escrow** | Tranche disbursements locked in smart contracts until independent inspection sign-off. | Eliminates contractor embezzlement and ensures physical build quality. |
| **Dual-Tranche Vaults** | Senior (ERC-4626 principal-protected) & Junior (risk-bearing high-APY yield buffer). | Accommodates both conservative institutional capital and risk-seeking retail yield seekers. |
| **Cryptographic Attestations** | TLSNotary / cryptographic signatures verifying QRIS & POS digital settlement reports. | Eliminates manual reporting fraud without requiring invasive on-site audits. |
| **Legal Step-In Rights** | Contractual step-in covenants triggered on covenant breaches or unexcused payment halts. | Enables protocol/landlord to legally repossess fit-out improvements and commercial tenancy. |

---

## 🏗️ Protocol Architecture

```text
               ┌──────────────────────────────────────────────┐
               │         Institutional & Retail Capital       │
               └──────────────┬────────────────┬──────────────┘
                              │                │
                       [Senior Tranche] [Junior Tranche]
                       (ERC-4626 Vault) (ERC-4626 Vault)
                              │                │
                              ▼                ▼
               ┌──────────────────────────────────────────────┐
               │            FitOutAgreement.sol               │
               │  (Milestone Escrow & State Machine Engine)   │
               └──────────────────────┬───────────────────────┘
                                      │
                             [Waterfall Router]
                                      │
      ┌───────────────────────┼───────────────────────┐
      ▼                       ▼                       ▼
[Senior Repayment]      [Junior Returns]      [Merchant Residual]
(Principal + 1.25x)     (Subordinated Yield)   (Excess Revenue)
```

### 1. Dual-Tranche Structured Debt (ERC-4626)
- **Senior Tranche (`SeniorVault.sol`)**:
  - Receives absolute waterfall priority.
  - Target Multiple: `1.20x - 1.25x` (equivalent to 15-18% annualized fixed return).
  - Protected by the Junior tranche first-loss absorption buffer.
- **Junior Tranche (`JuniorVault.sol`)**:
  - Subordinated to Senior recovery.
  - Target Multiple: `1.40x - 1.60x` + variable revenue upside.
  - Absorbs initial delays and operational volatility.

### 2. Milestone-Based Capital Deployment (`FitOutAgreement.sol`)
Capital is not handed out lump-sum. It is locked in an immutable state machine:
1. **Milestone 1 (Demolition & MEP)**: 30% released upon architect & contractor submission.
2. **Milestone 2 (Civil & Built-in Furniture)**: 40% released upon inspector cryptographic verification.
3. **Milestone 3 (Handover & Commercial Launch)**: 30% released upon final completion certificate.

### 3. Automated Revenue Waterfall (`WaterfallRouter.sol`)
Each day, attested merchant revenues are routed through the priority waterfall:
- **Bucket 1**: Protocol reserve & operational fee buffer.
- **Bucket 2**: Senior Vault recovery until Senior Claim is satisfied.
- **Bucket 3**: Junior Vault recovery until Junior Target is reached.
- **Bucket 4**: Residual excess funds return 100% to the tenant.

### 4. Legal Step-In & Physical Recovery
If daily turnover drops below agreed minimum debt covenants for 14 consecutive days without justifiable cause:
- A cryptographic **Grace Period Alert** is emitted on-chain.
- The protocol transitions into `STEP_IN` state.
- **Legal Step-In Card**: The protocol arbiters and landlord exercise pre-signed power of attorney to transfer tenancy rights, liquidate equipment, or assign fit-out collateral to a replacement operator to make investors whole.

---

## 🛠️ Technology Stack

- **Smart Contracts**: Solidity `0.8.24`, Foundry (Forge), Solmate / OpenZeppelin ERC-4626 & ERC-721.
- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS, Lucide Icons, RainbowKit, Wagmi, Viem.
- **Backend & Database**: Next.js Serverless Route Handlers, Prisma ORM, PostgreSQL (NeonDB Serverless Pooling).
- **Off-chain Ingestion**: Custom Attestor Service, WebSocket Indexer, TLSNotary proof verifier.
- **Monitoring & Quality**: Sentry Next.js SDK, Foundry LCOV test coverage instrumentation.

---

## 📊 Smart Contract Verification & Testing

The protocol smart contracts have been thoroughly verified through comprehensive integration and edge-case testing suites in Foundry:

| Test Suite | Focus Area | Result |
| :--- | :--- | :---: |
| `FullCycle.t.sol` | Fundraising -> Milestone Release -> Daily Waterfall -> Bond Refund | **100% PASS** |
| `StepIn.t.sol` | Default covenants, grace period triggers, recovery, and step-in rights | **100% PASS** |
| `WaterfallRouter.t.sol` | Senior priority execution, rounding precision, royalty accruals | **100% PASS** |
| `PropertyNFT.t.sol` | On-chain legal deed metadata, IPFS attachment immutability | **100% PASS** |

---

## 🌐 Deployed Addresses (Ethereum Sepolia)

| Contract | Address |
| :--- | :--- |
| **FitOutAgreement** | `0x71C95911E9A5D330f4D621842EC243EE1343292e` |
| **SeniorVault** | `0x94845333028B1204Fbe14E1278Fd4Adde46B22ce` |
| **JuniorVault** | `0x6b175474e89094c44da98b954eedeac495271d0f` |
| **EuthialIDR (Test Stable)** | `0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174` |
| **AgreementFactory** | `0x0165878A594ca255338adfa4d48449f69242Eb8F` |

---

## 🚀 Live Demo & Links

- **Live Application**: [euthial.vercel.app](https://euthial.vercel.app)
- **Source Code**: [github.com/AlphaIsYour/euthial](https://github.com/AlphaIsYour/euthial)
- **Documentation**: [docs.euthial.finance](https://euthial.vercel.app)
