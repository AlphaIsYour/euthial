# 11 — Dev-1 Hardening & Parallel Sprint Plan (Smart Contracts)

> **Konteks:** Blueprint penguatan smart contract untuk Dev-1 agar dapat bekerja mandiri tanpa memblokir atau menunggu Dev-2 dan Dev-3.  
> **Target Issues:** [#13](https://github.com/AlphaIsYour/euthial/issues/13), [#14](https://github.com/AlphaIsYour/euthial/issues/14), [#15](https://github.com/AlphaIsYour/euthial/issues/15), [#16](https://github.com/AlphaIsYour/euthial/issues/16), [#17](https://github.com/AlphaIsYour/euthial/issues/17)

---

## 1. Gap Analysis Summary

Setelah penelaahan mendalam terhadap seluruh smart contract di `contracts/src/` dan test suite di `contracts/test/`, berikut adalah pemetaan cakupan dan celah kritis:

| Komponen & Fitur | Severity | Status Saat Ini |
|---|---|---|
| Waterfall Split (Phase A/B, INV-01, INV-02, INV-03) | Critical | ✅ Done (T-06 s.d. T-09, Fuzz) |
| Vault Lifecycle (Deposit, Deploy, Repay, Write-off) | Critical | ✅ Done (T-02, T-17, T-18, T-24) |
| Signature Tamper & Replay Protection | Critical | ✅ Done (EIP-712 ECDSA check) |
| Edge Cases (Period days, Max gap, Monotonicity) | High | ✅ Done (T-09 variants) |
| Covenant Evaluation (`onSettlement`, CURE, STEP_IN) | **Critical** | ❌ **Missing** (Belum ada test covenant) |
| Bond Refund Lifecycle (`FAILED_REFUND`, `ABORTED_REFUND`) | **High** | ❌ **Missing** (Zero coverage pada `refundBond`) |
| `markExcused()` Boundary & Limit Validation | **High** | ❌ **Missing** (Belum ada test batas excused days) |
| Liquidation Path (`startLiquidation` -> `finalizeLiquidation`) | **High** | ❌ **Missing** (Zero coverage pada flow likuidasi) |
| `safeApprove` Deprecation di OpenZeppelin v5 | **Medium** | ❌ **Bug** (`FitOutAgreement.sol:141` & `WaterfallRouter.sol:241`) |
| Access Control Negative Tests (Caller Guards) | **Medium** | ❌ **Partial** (Beberapa fungsi transisi belum ber-guard) |
| `DeployAndSeed.s.sol` Integration Smoke Test | **Medium** | ❌ **Missing** (Script belum diuji otomatis) |

---

## 2. Rincian 5 Issue GitHub Baru

---

### [ISSUE #13] [DEV-1] Smart Contract: Covenant State Machine Tests
- **Link:** [GitHub Issue #13](https://github.com/AlphaIsYour/euthial/issues/13)
- **Assignee:** Dev 1 (Smart Contract Lead)
- **Labels:** `smart-contract`, `covenant`, `p0`
- **Prioritas:** 🔴 Critical | **Estimasi:** 1–2 Hari

#### Deskripsi:
Jalur pengujian paling kritikal. `_evaluateCovenant` dan `_processCureExpiry` adalah jaring pengaman finansial utama platform — mencakup deteksi shortfall terhadap target floor kumulatif, window remediasi (Cure), penarikan dana jaminan (Bond Draw), hingga eskalasi ke pengambilalihan operasional (Step-In).

#### Checklist Pengerjaan:
- [ ] `test_Covenant_HealthyBelowFloor` — Operasi berjalan dengan omzet memenuhi target floor.
- [ ] `test_Covenant_CureTriggered` — Terjadi shortfall > batas toleransi (1%), status bertransisi ke `CURE`.
- [ ] `test_Covenant_CureResolved` — Pembayaran susulan sebelum tenggat cure mengembalikan status ke `HEALTHY`.
- [ ] `test_Covenant_CureExpired_BondDraw` — Masa cure berakhir tanpa pelunasan, bond ditarik sebagian/seluruhnya.
- [ ] `test_Covenant_BreachCount2_StepIn` — Terjadi breach kedua berturut-turut, memicu eskalasi langsung ke `STEP_IN`.
- [ ] `test_Covenant_StepIn_BondInsufficient` — Saldo bond tidak mencukupi untuk menutup shortfall, memicu `STEP_IN`.
- [ ] `test_Covenant_TransitionToResidual` — Total klaim terbayar lunas selama cure, bertransisi ke `RESIDUAL`.
- [ ] `testFuzz_Covenant_FloorNeverExceedsTotalClaim` — Fuzz test nilai floor `floor(d)` selalu monotonik dan $\le totalClaim$.

**File Target:** `contracts/test/Covenant.t.sol`

---

### [ISSUE #14] [DEV-1] Smart Contract: Bond & Refund Lifecycle Tests
- **Link:** [GitHub Issue #14](https://github.com/AlphaIsYour/euthial/issues/14)
- **Assignee:** Dev 1 (Smart Contract Lead)
- **Labels:** `smart-contract`, `p0`, `foundry`
- **Prioritas:** 🟠 High | **Estimasi:** 0.5–1 Hari

#### Deskripsi:
Fungsi `refundBond()` belum memiliki unit test sama sekali. Ini adalah mekanisme proteksi utama tenant ruko — jika terjadi kendala penggalangan dana atau pembangunan, dana jaminan wajib dapat dikembalikan 100% tanpa risiko terkunci.

#### Checklist Pengerjaan:
- [ ] `test_RefundBond_AfterFailedFundraising` — Tenant menerima kembali jaminan saat fundraising kedaluwarsa (`FAILED_REFUND`).
- [ ] `test_RefundBond_AfterAbortedBuild` — Tenant menerima kembali jaminan saat konstruksi dihentikan (`ABORTED_REFUND`).
- [ ] `test_RefundBond_AfterClose` — Tenant menarik sisa jaminan setelah tenor selesai (`CLOSED`).
- [ ] `test_RefundBond_OnlyTenant` — Pemanggil selain tenant revert dengan `Unauthorized`.
- [ ] `test_RefundBond_ZeroBalance_NoOp` — Pemanggilan saat saldo 0 aman tanpa revert transfer.
- [ ] `test_INV08_BondConservation_AfterDraw` — Invarian konservasi jaminan tetap bernilai `true` setelah penarikan bond.
- [ ] `test_BondAlreadyDeposited_Revert` — Upaya double deposit bond revert `BondAlreadyDeposited`.

**File Target:** `contracts/test/BondRefund.t.sol`

---

### [ISSUE #15] [DEV-1] Smart Contract: ExcusedDays & Liquidation Tests
- **Link:** [GitHub Issue #15](https://github.com/AlphaIsYour/euthial/issues/15)
- **Assignee:** Dev 1 (Smart Contract Lead)
- **Labels:** `smart-contract`, `p1`, `covenant`
- **Prioritas:** 🟠 High | **Estimasi:** 0.5–1 Hari

#### Deskripsi:
Fitur force majeure / hari izin libur (`markExcused`) oleh Arbiter dan jalur likuidasi akhir (`startLiquidation` -> `finalizeLiquidation`) belum teruji. Pengujian ini penting agar lantai pembayaran (covenant floor) tidak dapat di-bypass melebihi batas toleransi.

#### Checklist Pengerjaan:
- [ ] `test_MarkExcused_ValidRange` — Arbiter menandai hari izin sah, `excusedDays` terakumulasi dan `logicalDays()` berkurang.
- [ ] `test_MarkExcused_OnlyArbiter` — Pihak non-Arbiter ditolak dengan revert `Unauthorized`.
- [ ] `test_MarkExcused_ExceedsMaxReverts` — Akumulasi melebihi `maxExcusedDays` revert `ExcusedDaysExceeded`.
- [ ] `test_MarkExcused_FutureRangeReverts` — Rentang hari melebihi batas `lastDayId + 7` revert `InvalidExcusedRange`.
- [ ] `test_Liquidation_ArbiterStartsLiquidation` — Transisi dari `STEP_IN` -> `LIQUIDATING`.
- [ ] `test_Liquidation_Finalize_WritesOff` — Eksekusi `finalizeLiquidation()` memicu penghapusan sisa pokok (`writeOffRemaining`) pada kedua tranche vault dan status menjadi `CLOSED`.
- [ ] `test_Liquidation_NonArbiterReverts` — Pihak selain Arbiter ditolak saat memicu likuidasi.

**File Target:** `contracts/test/ExcusedDaysAndLiquidation.t.sol`

---

### [ISSUE #16] [DEV-1] Smart Contract: Fix safeApprove Deprecation & Access Control Hardening
- **Link:** [GitHub Issue #16](https://github.com/AlphaIsYour/euthial/issues/16)
- **Assignee:** Dev 1 (Smart Contract Lead)
- **Labels:** `smart-contract`, `bug`, `p0`
- **Prioritas:** 🟡 Medium | **Estimasi:** 0.5 Hari

#### Deskripsi:
Perbaikan bug nyata pada implementasi: fungsi `safeApprove` telah didepresiasi / dihapus pada OpenZeppelin Contracts v5, dan beberapa fungsi transisi state eksternal belum dilengkapi pemeriksaan caller (`msg.sender`).

#### Checklist Pengerjaan:
- [ ] Ganti `safeApprove` dengan `forceApprove` di `FitOutAgreement.sol` (baris 141) dan `WaterfallRouter.sol` (baris 241, 243, 248, 250).
- [ ] Tambahkan caller guard pada `startBuild()`, `abortBuild()`, `startOperating()`, dan `failFundraising()`.
- [ ] Tambahkan test suite akses negatif pada `contracts/test/FitOutAgreement.t.sol` untuk memastikan seluruh fungsi memvalidasi hak akses.

**File Target:**
- `contracts/src/FitOutAgreement.sol`
- `contracts/src/WaterfallRouter.sol`
- `contracts/test/FitOutAgreement.t.sol`

---

### [ISSUE #17] [DEV-1] Smart Contract: Integration Smoke Test (DeployAndSeed)
- **Link:** [GitHub Issue #17](https://github.com/AlphaIsYour/euthial/issues/17)
- **Assignee:** Dev 1 (Smart Contract Lead)
- **Labels:** `smart-contract`, `devops`, `automation`, `p1`
- **Prioritas:** 🟡 Medium | **Estimasi:** 0.5–1 Hari

#### Deskripsi:
Script deployment `DeployAndSeed.s.sol` adalah pondasi bagi seluruh environment testing tim. Uji smoke otomatis berbasis Foundry memastikan bahwa script selalu dapat berjalan lancar tanpa macet karena referensi sirkular atau kesalahan urutan inisialisasi.

#### Checklist Pengerjaan:
- [ ] Buat file test `contracts/test/Integration.t.sol` yang mengeksekusi pipeline `DeployAndSeed.s.sol`.
- [ ] Validasi cross-linking antar address kontrak (`agreement.router()`, `vault.agreement()`, `vault.router()`).
- [ ] Validasi status agreement mencapai `OPERATING` dan settlement perdana berhasil dicatat oleh router.
- [ ] Tambahkan petunjuk deployment lokal satu baris di `contracts/README.md`.

**File Target:**
- `contracts/test/Integration.t.sol`
- `contracts/README.md`

---

## 3. Timeline Paralel Dev-1

```
Sprint Lanjutan (Independent Execution)
├── Hari 1: Issue #13 (Covenant State Machine Tests) — fokus logika finansial utama
├── Hari 2: Issue #14 (Bond & Refund Lifecycle) + Issue #15 (ExcusedDays & Liquidation)
└── Hari 3: Issue #16 (Bug Fix safeApprove & Hardening) + Issue #17 (Smoke Test DeployAndSeed)
```

Semua pekerjaan di atas **100% mandiri** dan dapat diselesaikan oleh Dev-1 tanpa harus menunggu progress dari Dev-2 (Frontend) maupun Dev-3 (Attestor & Integrasi).
