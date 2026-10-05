# Frontend — Euthial Dashboard

> Next.js 14 App Router + Tailwind CSS + Wagmi/Viem

## Setup

```bash
# From the monorepo root:
pnpm install

# Scaffold Next.js (first time only):
cd apps/web
npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --use-pnpm --import-alias "@/*"

# Start dev server:
pnpm dev
```

## Design System

This app follows the utilitarian dashboard design system defined in
`docs/10_SPRINT_48H_EXECUTION_BOARD.md`, Section I.

Key constraints:
- Max border-radius: **8px** (cards, buttons, inputs).
- Icons: **Google Material Symbols** (Outlined).
- Fonts: **Inter** (UI) + **JetBrains Mono** (numbers, addresses, kbd).
- Default theme: **Dark mode** (`#0A0A0A` panel, `#141414` sidebar).
- Permanent testnet banner on every page (NN-09).

## Role-Based Dashboards

| Role | Primary View | Key Actions |
|---|---|---|
| Investor | Senior tranche deposit, claim progress, waterfall | Deposit, Withdraw |
| Landlord | Junior tranche, turnover rent, milestone approval | Approve Milestone |
| Tenant | Bond balance, covenant health, retention estimate | Deposit Bond, Cure Top-Up |
| Inspector | Milestone evidence, 2-of-3 approval status | Submit/Approve Milestone |

See GitHub Issues #04, #05, #06, #09, #10 for implementation tickets.
