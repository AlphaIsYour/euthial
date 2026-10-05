# 05 — Smart Contract Specification

**Versi:** 0.1 · 5 Okt 2026 · Bergantung pada: `02` (rumus), `03` (batasan), `04` (arsitektur) · Dipakai oleh: `06`, `07`

> Spesifikasi ini adalah kontrak antara desain dan implementasi. Bila implementasi menyimpang, catat di `09_DECISION_LOG_OPEN_QUESTIONS.md`. Prioritas implementasi: **P0** wajib untuk demo, **P1** sangat disarankan, **P2** bila ada waktu. Semua kode adalah prototipe testnet.

---

## 1. Daftar kontrak dan prioritas

| Kontrak | Fungsi | Prioritas |
|---|---|---|
| `MockIDR` | ERC-20 6 desimal untuk demo; `mint` publik terbatas | P0 |
| `TrancheVault` (×2: senior, junior) | ERC-4626 bertenor; deposit saat fundraising; penarikan terbatas kas; transfer allowlist | P0 |
| `WaterfallRouter` | Verifikasi atestasi settlement, hitung split Fase A/B, bayar investor/pemilik, lacak klaim | P0 |
| `FitOutAgreement` | Parameter, state machine, bond, milestone, covenant (uji floor, cure, bond draw, step-in), excused day | P0 (milestone P1) |
| `PayoutAdapter` (`TokenPayoutAdapter`, `LedgerPayoutAdapter` stub) | Abstraksi pembayaran mode A/B | P2 (Mode A inline di P0) |
| `AgreementFactory` | Membuat satu set kontrak per ruko | P2 |

Boleh digabung (mis. covenant di dalam `FitOutAgreement`, router + agreement dalam satu kontrak) bila waktu mepet, asalkan antarmuka publik dan event tetap sama sehingga frontend tidak berubah.

## 2. Konvensi

- Solidity ^0.8.24; OpenZeppelin v5; Foundry.
- Semua persentase dalam **basis poin** (bps; 10.000 = 100%).
- Semua jumlah uang dalam satuan terkecil token (`MockIDR`, 6 desimal). Contoh: Rp150.000.000 = `150_000_000 * 1e6`.
- Pembagian bilangan bulat (floor). Tidak ada float.
- Waktu operasional memakai `dayId` (uint32) dari atestasi; fase sebelum OPERATING memakai `block.timestamp` (lihat 04, bagian 7 dan D-07).
- Satu `FitOutAgreement` = satu ruko = satu router = dua vault.
- Nama field: `fundraiseDeadline` (dokumen 04 menyebut `minRaiseDeadline`; yang berlaku di sini).

## 3. Parameter (struct `Params`, immutable setelah fase FUNDRAISING dimulai)

| Field | Tipe | Default | Validasi |
|---|---|---|---|
| `budget` | uint256 | 150_000_000e6 | = seniorPrincipal + juniorPrincipal |
| `seniorPrincipal` | uint256 | 120_000_000e6 | > 0 |
| `juniorPrincipal` | uint256 | 30_000_000e6 | > 0 |
| `seniorMultipleBps` | uint16 | 12500 | ≥ 10000 |
| `juniorMultipleBps` | uint16 | 14000 | ≥ seniorMultipleBps |
| `investorTakeBps` | uint16 | 1500 | > 0 |
| `landlordTakeBps` | uint16 | 500 | |
| `royaltyBps` | uint16 | 200 | Fase B, ke junior |
| `landlordTakeBpsPhaseB` | uint16 | 500 | |
| `assumedCostRatioBps` | uint16 | 6000 | untuk coverage check |
| `targetTenorDays` | uint32 | 540 | 18 × 30 |
| `maxTenorDays` | uint32 | 720 | ≥ targetTenorDays |
| `floorRatioBps` | uint16 | 6000 | ≤ 10000 |
| `toleranceBps` | uint16 | 100 | dari total klaim |
| `cureDays` | uint16 | 7 | ≥ 1 |
| `healthWindowDays` | uint8 | 14 | 1..30 |
| `healthFloorDaily` | uint256 | `[ISI]` | informatif saja |
| `maxExcusedDays` | uint16 | 30 | total sepanjang kontrak (penyederhanaan dari "per 12 bulan") |
| `bondAmount` | uint256 | 15_000_000e6 | ≥ 0 |
| `fundraiseDeadline` | uint64 | now + N | `block.timestamp` |
| `buildDeadline` | uint64 | | `block.timestamp` |
| `leaseEndDay` | uint32 | ≥ maxTenorDays + 360 | `dayId` relatif ke `startDay` |
| `milestoneBps[]` | uint16[] | [3000, 4000, 3000] | jumlah = 10000 |

**Coverage check on-chain (P1, diaktifkan default):**
`require( (10000 − assumedCostRatioBps) * 10000 / (investorTakeBps + landlordTakeBps) ≥ 20000 )`  
Base case: 4000 × 10000 / 2000 = 20000 → lolos tepat di batas.

Turunan:
- `seniorClaim = seniorPrincipal × seniorMultipleBps / 10000`
- `juniorClaim = juniorPrincipal × juniorMultipleBps / 10000`
- `totalClaim = seniorClaim + juniorClaim`

## 4. State machine

### 4.1 Fase

| Fase | Masuk dari | Syarat masuk | Fungsi yang diizinkan |
|---|---|---|---|
| `DRAFT` | — | (constructor) | `initialize` |
| `FUNDRAISING` | DRAFT | Parameter valid | deposit vault, `depositBond`, `withdraw` penuh (belum komit), `startBuild`, `failFundraising` |
| `BUILDING` | FUNDRAISING | Kedua vault terisi penuh **dan** bond tersetor sebelum `fundraiseDeadline` | `submitMilestone`, `approveMilestone`, `rejectMilestone`, `abortBuild` |
| `OPERATING` | BUILDING | Semua milestone dirilis | `settle`, `cureTopUp`, `evaluate`, `markExcused`, `escalateStale` |
| `RESIDUAL` | OPERATING | `totalClaim` lunas (router) | `settle` (Fase B), `markExcused`, `close` (setelah `leaseEndDay`) |
| `STEP_IN` | OPERATING | Eskalasi covenant atau manual arbiter | `startLiquidation`, `recordRecovery` |
| `LIQUIDATING` | STEP_IN | Dimulai arbiter | `recordRecovery`, `finalizeLiquidation` |
| `FAILED_REFUND` | FUNDRAISING | Lewat deadline dan syarat tak terpenuhi | `withdraw` penuh; `refundBond` |
| `ABORTED_REFUND` | BUILDING | Lewat `buildDeadline` dan milestone belum selesai | `withdraw` pro-rata dana yang belum dicairkan; `refundBond` |
| `CLOSED` | RESIDUAL / LIQUIDATING | `close` / `finalizeLiquidation` | `withdraw`, `refundBond` (sisa) |

`FAILED_REFUND`, `ABORTED_REFUND`, `CLOSED` adalah **terminal**. Tidak ada transisi di luar tabel (INV-07).

### 4.2 Status covenant (hanya saat OPERATING)

`HEALTHY` → `WARNING` (sinyal kesehatan, otomatis kembali) · `HEALTHY/WARNING` → `CURE` (uji bulanan gagal) · `CURE` → `HEALTHY` (kekurangan tertutup) atau → `BREACHED` (cure habis, bond ditarik) → `HEALTHY` (bila tertutup dan tidak berturut-turut) atau → `STEP_IN` (fase).  
`ORACLE_STALE` dapat menimpa status mana pun saat tak ada settlement ≥ 3 hari logis; uji covenant dijeda sampai settlement baru masuk.

## 5. Aturan perhitungan (normatif)

### 5.1 Settlement (Fase A)
Diberikan `G` (omzet tercatat):
```
landlordAmt = G * landlordTakeBps / 10000
investorAmt = G * investorTakeBps / 10000
needed      = (seniorClaim - seniorPaid) + (juniorClaim - juniorPaid)
payInvestors= min(investorAmt, needed)
toSenior    = min(payInvestors, seniorClaim - seniorPaid)
toJunior    = payInvestors - toSenior
pull        = landlordAmt + payInvestors
```
`pull` ditarik dari `attestor` (mode A). Kelebihan `investorAmt - payInvestors` **tidak ditarik** (tetap di tenant). Bila `needed` mencapai nol setelah settlement ini, fase berpindah ke RESIDUAL **mulai settlement berikutnya**.

### 5.2 Settlement (Fase B / RESIDUAL)
```
landlordAmt = G * landlordTakeBpsPhaseB / 10000
royalty     = G * royaltyBps / 10000      // ke junior vault
pull        = landlordAmt + royalty
```

### 5.3 Injeksi pembayaran investor (cure, bond draw, recovery)
`injectInvestorPayment(amount, source)` mendistribusikan **sekuensial** senior lalu junior; tidak ada bagian pemilik; memperbarui `seniorPaid` dan `juniorPaid`; jumlah yang melebihi sisa klaim ditolak/dikembalikan (untuk cure) atau dicatat sebagai kelebihan (tidak boleh terjadi pada bond draw karena dibatasi `min(shortfall, bond)`).

### 5.4 Floor
```
d  = (lastDayId - startDay + 1) - excusedDays          // hari efektif, ≥ 0
Tt = targetTenorDays;  Tm = maxTenorDays;  C = totalClaim;  f = floorRatioBps
if d <= Tt:      Floor = C * f * d / (Tt * 10000)
elif d <= Tm:    Floor = C*f/10000 + (C - C*f/10000) * (d - Tt) / (Tm - Tt)
else:            Floor = C
```
Floor monoton naik dan ≤ C (INV-12).

### 5.5 Uji bulanan
`monthIndex = d / 30`. Jika `monthIndex > lastTestedMonth` (dan status bukan ORACLE_STALE): 
- `shortfall = max(0, Floor(d) - claimPaidTotal)`, dengan `claimPaidTotal = seniorPaid + juniorPaid`.
- Jika `shortfall > totalClaim * toleranceBps / 10000` → status `CURE`; simpan `cureTarget = Floor(d)`, `cureDeadlineDay = lastDayId + cureDays`.
- Jika tidak → reset `breachCount = 0` (bila tidak sedang CURE).
- `lastTestedMonth = monthIndex` (celah multi-bulan hanya menguji yang terakhir).

### 5.6 Cure dan bond draw
- Selama CURE: tenant boleh `cureTopUp(amount)`. Jika `claimPaidTotal ≥ cureTarget − tol` → kembali HEALTHY.
- Pada settlement/`evaluate` dengan `lastDayId ≥ cureDeadlineDay` dan kekurangan masih ada: `draw = min(cureTarget − claimPaidTotal, bondBalance)`; tarik bond → `injectInvestorPayment(draw, BOND)`; `breachCount++`.
  - Jika sisa kekurangan > tol atau `breachCount ≥ 2` → fase `STEP_IN`.
  - Jika tidak → HEALTHY.

### 5.7 Sinyal kesehatan
Ring buffer entri `(grossRecorded, periodDays)` terbaru hingga mencakup minimal `healthWindowDays` hari **yang punya data**. Rata-rata harian = Σ grossRecorded / Σ periodDays. Jika < `healthFloorDaily` → `WARNING`, tanpa konsekuensi dana. Hari unknown tidak dihitung nol. Ukuran ring buffer tetap (≤ 32 entri).

### 5.8 Excused day
`markExcused(startDay, endDay, evidenceHash)` oleh arbiter. Syarat: `endDay ≥ startDay`, `endDay ≤ lastDayId + 7`, `excusedDays + (endDay − startDay + 1) ≤ maxExcusedDays`. Tidak mengubah uji yang sudah final.

### 5.9 Penutupan dan kerugian
- `recordRecovery(amount, evidenceHash)` oleh arbiter/agen setelah aset dilelang (mode A: token ditransfer masuk) → sekuensial senior → junior.
- `finalizeLiquidation()` → untuk setiap vault: `writeOffRemaining()` mencatat sisa pokok yang tidak terpulihkan sebagai kerugian (junior otomatis terkena lebih dulu karena menerima pembayaran terakhir). Sisa bond dikembalikan ke tenant setelah dikurangi penarikan; fase `CLOSED`.

## 6. Matriks akses fungsi

| Fungsi | Siapa | Fase | Catatan |
|---|---|---|---|
| `initialize(params, parties)` | Admin/Factory | DRAFT | Sekali; parameter dikunci |
| `deposit/mint` (vault) | Allowlisted address | FUNDRAISING | Dibatasi kapasitas tranche |
| `withdraw/redeem` (vault) | Pemegang share | Lihat 7.2 | Dibatasi kas |
| `depositBond()` | Tenant | FUNDRAISING | Tepat `bondAmount` |
| `startBuild()` | Siapa saja | FUNDRAISING | Jika syarat terpenuhi |
| `failFundraising()` | Siapa saja | FUNDRAISING | Setelah deadline |
| `submitMilestone(id, evidenceHash)` | Kontraktor | BUILDING | Urut |
| `approveMilestone(id)` | Landlord, tenant, inspector | BUILDING | 2 dari 3 → rilis |
| `rejectMilestone(id, reasonHash)` | Landlord, tenant, inspector | BUILDING | Reset persetujuan |
| `arbiterDecideMilestone(id, approve, reasonHash)` | Arbiter | BUILDING | Jika buntu setelah N hari |
| `abortBuild()` | Siapa saja | BUILDING | Setelah `buildDeadline` |
| `settle(Settlement, sig)` | Siapa saja (relayer) | OPERATING/RESIDUAL | Dana ditarik dari attestor |
| `cureTopUp(amount)` | Tenant (atau siapa saja atas nama tenant) | OPERATING (CURE) | Menarik token dari pemanggil |
| `evaluate()` | Siapa saja | OPERATING | Memicu uji/penutupan cure bila waktunya |
| `markExcused(...)` | Arbiter | OPERATING/RESIDUAL | Batas `maxExcusedDays` |
| `escalateStale()` | Arbiter | OPERATING | Hanya bila ORACLE_STALE ≥ 14 hari logis |
| `startLiquidation(evidenceHash)` | Arbiter | STEP_IN | |
| `recordRecovery(amount, evidenceHash)` | Arbiter/Attestor | STEP_IN/LIQUIDATING | Token masuk (mode A) |
| `finalizeLiquidation()` | Arbiter | LIQUIDATING | |
| `close()` | Siapa saja | RESIDUAL | Setelah `leaseEndDay` |
| `refundBond()` | Tenant | FAILED/ABORTED/CLOSED | Sisa bond |
| `setAllowlist(address, bool)` | Admin | Semua | Untuk transfer share dan deposit; emit event |
| `pause()/unpause()` | Admin | Semua | Hanya menolak `settle` dan deposit; tidak menahan penarikan (INV-10) |

**Tidak ada fungsi** yang mengizinkan admin menarik dana vault, bond, atau router (INV-10).

## 7. Spesifikasi `TrancheVault` (ERC-4626)

### 7.1 Akuntansi
Menggunakan akuntansi internal, bukan `balanceOf`, agar donasi token tidak memanipulasi harga share:
- `idleCash`: kas yang tersedia di vault.
- `principalOutstanding`: pokok yang sudah dicairkan dan belum dipulihkan/dihapus.
- `totalAssets() = idleCash + principalOutstanding`.
- Deposit: `idleCash += assets`.
- `deploy(amount, to)` (hanya agreement; saat milestone dirilis): `idleCash −= amount`, `principalOutstanding += amount`, transfer token ke kontraktor.
- `onRepayment(amount)` (hanya router): `idleCash += amount`; `p = min(amount, principalOutstanding)`; `principalOutstanding −= p` (pengakuan **pokok dulu**, sisanya keuntungan; harga share naik hanya setelah pokok pulih).
- `writeOffRemaining()` (hanya agreement saat `finalizeLiquidation` atau `abortBuild`): `principalOutstanding = 0`; harga share turun sesuai.

Harga share awal 1,0 (offset desimal virtual `_decimalsOffset()` > 0 untuk mitigasi serangan inflasi; lihat bagian 10).

### 7.2 Batas penarikan (`maxWithdraw`/`maxRedeem`)

| Fase agreement | Penarikan |
|---|---|
| FUNDRAISING | Penuh (belum komit) |
| BUILDING | Pro-rata `max(0, idleCash − reservedForBuild)`; praktis 0 |
| OPERATING/RESIDUAL | Pro-rata bagian dari `idleCash` (kas hasil pembayaran) |
| FAILED_REFUND | Penuh |
| ABORTED_REFUND | Pro-rata `idleCash` |
| STEP_IN/LIQUIDATING | Pro-rata `idleCash` (recovery yang sudah masuk) |
| CLOSED | Pro-rata `idleCash` sampai habis |

`maxWithdraw(owner) = idleCash_available × balanceOf(owner) / totalSupply`, dibatasi nilai share milik owner. Ini bukan pasar sekunder; ini likuiditas **terbatas pada kas yang benar-benar sudah dibayarkan** (NN-05).

### 7.3 Transfer share
Override `_update`: transfer antar akun hanya jika `allowlist[to]` (mint/burn dikecualikan). Tidak ada AMM, tidak ada pool (DC-03).

### 7.4 Deposit
`maxDeposit = principalTarget − totalAssets()` selama FUNDRAISING; 0 di fase lain. Hanya address allowlisted. Junior vault: hanya `landlord` (atau allowlist junior) — P1.

## 8. Spesifikasi `WaterfallRouter`

### 8.1 Struktur atestasi (EIP-712)
```solidity
struct Settlement {
    uint32  dayId;           // hari terakhir yang dicakup
    uint8   periodDays;      // jumlah hari yang dicakup (1..31); default 1 (harian)
    uint256 grossRecorded;   // total omzet tercatat selama periode (satuan token)
    uint32  txCount;         // opsional, informatif
    bytes32 evidenceHash;    // hash laporan settlement PJP/agen
}
// Periode mencakup hari [dayId - periodDays + 1, dayId]. Hari di antara
// lastDayId dan awal periode dianggap "unknown". Periode tidak boleh tumpang tindih.
// Domain: name="FitOutRouter", version="1", chainId, verifyingContract=address(router)
```

### 8.2 Aturan `settle(Settlement s, bytes sig)`
1. Fase harus OPERATING atau RESIDUAL; tidak paused.
2. Verifikasi tanda tangan = `attestor` (ECDSA dari OpenZeppelin; tolak signature malleable).
3. `1 ≤ s.periodDays ≤ 31`; awal periode `s.dayId − s.periodDays + 1 > lastDayId` (monoton, tanpa tumpang tindih); dan `s.dayId ≤ lastDayId + MAX_GAP` (mis. 60) untuk mencegah lompatan jam logis ekstrem (D-08). Satu settlement per `dayId` akhir periode.
4. Hitung split (5.1 atau 5.2) berdasarkan fase.
5. Tarik `pull` dari `attestor` (SafeERC20, `transferFrom`) ke router; lalu distribusikan: `seniorVault.onRepayment`, `juniorVault.onRepayment`, transfer ke `landlord`. **Checks-Effects-Interactions** + `ReentrancyGuard`.
6. Perbarui `seniorPaid`, `juniorPaid`, `lastDayId`, ring buffer kesehatan; set `startDay` bila settlement pertama.
7. Panggil hook agreement: perbarui covenant (uji bulanan, cure, stale).
8. Emit event. Bila `G == 0`: catat hari, tanpa transfer.
9. Revert total bila ada langkah gagal (tidak ada split parsial).

### 8.3 Fungsi baca
`seniorOutstandingClaim()`, `juniorOutstandingClaim()`, `claimPaidTotal()`, `currentPhaseAB()`, `lastDayId()`, `settlementOf(dayId)`, `previewSplit(G)` (untuk UI dan simulator).

## 9. Event (kontrak antarmuka ke frontend dan audit)

| Event | Parameter utama |
|---|---|
| `AgreementInitialized` | params hash, parties |
| `Deposited` (vault) | tranche, investor, assets, shares |
| `BondDeposited` / `BondDrawn` / `BondRefunded` | jumlah, saldo |
| `PhaseChanged` | dari, ke, penyebab |
| `MilestoneSubmitted` / `MilestoneApproved` / `MilestoneRejected` / `MilestoneReleased` | id, evidenceHash, jumlah, approver |
| `SettlementRecorded` | dayId, G, landlordAmt, toSenior, toJunior, retainedOrExcess, evidenceHash |
| `PhaseSwitchedToResidual` | dayId |
| `HealthWarning` / `HealthRecovered` | dayId, rata-rata |
| `FloorTested` | monthIndex, d, Floor, claimPaidTotal, shortfall |
| `CureStarted` / `CureTopUp` / `CureSatisfied` | target, deadlineDay, jumlah |
| `BreachRecorded` | breachCount, bondDrawn, sisa kekurangan |
| `StepInTriggered` | alasan, dayId |
| `ExcusedMarked` | startDay, endDay, evidenceHash, total excused |
| `OracleStale` / `OracleRecovered` | dayId |
| `RecoveryRecorded` | amount, evidenceHash |
| `LossRecognized` | tranche, writeOff |
| `Withdrawn` (vault) | tranche, owner, assets, shares |
| `AllowlistUpdated` | address, status |
| `Paused` / `Unpaused` | |

## 10. Invariant

| ID | Invariant |
|---|---|
| INV-01 | Untuk setiap settlement: `landlordAmt + toSenior + toJunior (+ royalty) = pull ≤ G`. |
| INV-02 | Setelah `settle`, saldo token router = saldo sebelumnya (tidak ada sisa). |
| INV-03 | `seniorPaid ≤ seniorClaim`; `juniorPaid ≤ juniorClaim`; `juniorPaid > 0 ⇒ seniorPaid = seniorClaim`. |
| INV-04 | Harga share vault tidak turun kecuali karena `writeOffRemaining`. |
| INV-05 | `idleCash ≤ token.balanceOf(vault)` (donasi hanya menambah selisih, tidak memengaruhi harga). |
| INV-06 | `dayId` naik monoton; maksimal satu settlement per `dayId`. |
| INV-07 | Transisi fase hanya sesuai tabel 4.1; fase terminal absorbing. |
| INV-08 | `bondBalance + bondDrawn + bondRefunded = bondDeposited`. |
| INV-09 | Setiap milestone dirilis paling banyak sekali; total rilis ≤ `budget`. |
| INV-10 | Tidak ada jalur bagi admin untuk memindahkan dana vault/bond/router. |
| INV-11 | `excusedDays ≤ maxExcusedDays`. |
| INV-12 | `Floor(d)` non-decreasing dalam `d` dan ≤ `totalClaim`. |
| INV-13 | Pada fase refund, total penarikan ≤ total setoran (pro-rata dari sisa). |
| INV-14 | Transfer share hanya ke address allowlist. |
| INV-15 | Parameter tidak berubah setelah FUNDRAISING dimulai. |

## 11. Kasus tepi (wajib ditangani dan dites)

1. **Hari transisi A→B:** kelebihan `investorAmt` tidak ditarik; settlement berikutnya memakai Fase B.
2. **`G = 0`:** dicatat, tanpa transfer; tidak memicu uji ganda.
3. **`G` sangat kecil:** hasil floor 0 untuk satu pihak; tidak revert.
4. **Celah `dayId`:** hari tak ada data = unknown; uji bulanan hanya untuk bulan terakhir yang terlewati.
5. **Settlement lama/duplikat:** revert (`dayId ≤ lastDayId`).
6. **Lompatan `dayId` ekstrem:** revert (`> MAX_GAP`).
7. **Allowance attestor kurang:** revert total.
8. **Cure top-up berlebih:** hanya sebesar kekurangan yang diterima; sisanya dikembalikan.
9. **Bond kurang:** `draw = min(...)`; bila sisa > tolerance → STEP_IN.
10. **Step-in saat vault masih punya kas:** investor tetap dapat menarik bagian kas pro-rata.
11. **Rounding dust:** tidak boleh membuat `seniorPaid > seniorClaim`.
12. **Milestone buntu:** arbiter memutuskan setelah batas hari tertentu (parameter `milestoneArbiterDelay`, default 7 hari).
13. **Fundraising kurang atau bond belum disetor:** `failFundraising` membuka penarikan penuh.
14. **Pause saat CURE:** jam logis tidak maju; cure tidak kedaluwarsa karena `dayId` tidak maju.
15. **Pemilik membeli share senior (konflik kepentingan):** diizinkan hanya lewat allowlist; dicatat sebagai risiko (R-14).

## 12. Keamanan

| Area | Kontrol |
|---|---|
| Reentrancy | `ReentrancyGuard` + CEI pada `settle`, `cureTopUp`, `drawBond`, milestone rilis, withdraw |
| Serangan inflasi share ERC-4626 | Akuntansi internal (`idleCash`), `_decimalsOffset()`, deposit hanya saat FUNDRAISING di harga 1,0 |
| Replay atestasi | EIP-712 domain (chainId + kontrak), `dayId` unik |
| Malleability tanda tangan | ECDSA OpenZeppelin |
| Akses | `AccessControl`/modifier sederhana; matriks di bagian 6; event untuk setiap tindakan privileged |
| Token tidak standar | Hanya `MockIDR`; token fee-on-transfer/rebasing tidak didukung (dokumentasikan) |
| DoS lewat loop | Tanpa loop tak terbatas; ring buffer ukuran tetap (≤ 30) |
| Overflow | Solidity 0.8 checked math; hati-hati urutan perkalian sebelum pembagian |
| Front-running | Tidak ada nilai MEV material (settlement ditandatangani; cure top-up bernilai tetap) |
| Admin | Tidak ada custody; pause hanya menolak settlement/deposit |
| Atestor dikompromikan | Diakui sebagai trust assumption (04, bagian 5); address attestor dikunci per agreement |
| Upgradeability | Tidak ada proxy di MVP (immutable) |

## 13. Rencana tes (Foundry)

### 13.1 Unit test
| ID | Tes |
|---|---|
| T-01 | Validasi parameter (bps, principal, coverage) gagal/lulus sesuai batas |
| T-02 | Deposit/withdraw vault saat FUNDRAISING; kapasitas tranche |
| T-03 | `startBuild` hanya bila vault penuh + bond; `failFundraising` setelah deadline → refund penuh |
| T-04 | Milestone: submit, 2-dari-3 approval, rilis tepat sekali, reject, arbiter |
| T-05 | `abortBuild` → refund pro-rata dana belum dicairkan |
| T-06 | Settlement Fase A: split sesuai 5.1 pada beberapa nilai G |
| T-07 | Urutan sekuensial senior→junior; INV-03 |
| T-08 | Transisi A→B dan Fase B (royalti ke junior) |
| T-09 | Signature: valid, salah penandatangan, replay, `dayId` mundur, gap berlebih |
| T-10 | Floor: nilai pada titik batas (Tt, Tm, setelah Tm), monotonik |
| T-11 | Uji bulanan: lulus, gagal → CURE |
| T-12 | Cure top-up menutup kekurangan → HEALTHY |
| T-13 | Cure habis → bond draw → HEALTHY / → STEP_IN (bond kurang, atau 2 pelanggaran) |
| T-14 | Excused day: batas, efek ke `d`, tidak mengubah uji final |
| T-15 | ORACLE_STALE: 3 hari tanpa data → dijeda; pulih saat settlement; `escalateStale` setelah 14 hari |
| T-16 | STEP_IN → recovery → `finalizeLiquidation` → write-off junior dulu |
| T-17 | Vault: harga share setelah repayment (pokok dulu) dan write-off |
| T-18 | Vault: batas penarikan per fase; transfer allowlist |
| T-19 | Akses: setiap fungsi privileged menolak pihak tak berwenang |
| T-20 | Pause: settlement ditolak, penarikan tetap jalan |

### 13.2 Fuzz dan invariant
| ID | Tes |
|---|---|
| T-21 | Fuzz `G` dan urutan hari: INV-01, INV-02, INV-03 |
| T-22 | Fuzz parameter valid: Floor monotonik (INV-12), tak melebihi klaim |
| T-23 | Invariant harness: urutan aksi acak (settle, cure, evaluate, excused, withdraw) menjaga INV-04, INV-05, INV-08 |
| T-24 | Fuzz donasi token langsung ke vault: harga share tidak berubah (INV-05) |

### 13.3 Skenario terintegrasi (cocok dengan `02`, bagian 7)
| ID | Skenario | Hasil yang diharapkan |
|---|---|---|
| T-25 | Normal 100% omzet | C_s lunas ≈ bulan 14, C_j ≈ bulan 18, lalu RESIDUAL |
| T-26 | Omzet 70% | Lunas penuh pada bulan 24 dengan bond ≈ 12,8 jt |
| T-27 | Omzet 50% | Senior 143 jt, junior 0 (tanpa recovery) |
| T-28 | Kebocoran 30% setara omzet 70% | Identik T-26 |
| T-29 | Musiman dengan excused day | Tidak ada CURE palsu |
| T-30 | Default dini → STEP_IN → recovery 20% → write-off | Junior menyerap lebih dulu |
| T-31 | Pelunasan dipercepat (omzet 150%) | Masuk RESIDUAL lebih awal |
| T-32 | Satu hari omzet nol berturut-turut singkat | Tidak memicu apa pun |

Cakupan target: seluruh fungsi publik; seluruh INV; semua kasus tepi bagian 11.

## 14. Konfigurasi dan deployment (testnet)

1. Deploy `MockIDR`; mint saldo demo ke investor, landlord, tenant, attestor.
2. Deploy `FitOutAgreement` (atau factory) + dua `TrancheVault` + `WaterfallRouter`; hubungkan alamat.
3. Set allowlist (investor demo, landlord, tenant).
4. `initialize(params, parties)`; verifikasi parameter on-chain sama dengan `02`.
5. Attestor menyetujui (approve) router untuk `MockIDR`.
6. Jalankan script seed: deposit senior/junior, setor bond, `startBuild`, rilis milestone.
7. Script skenario mengirim atestasi harian (lihat `06`, bagian 6).
8. Verifikasi kontrak di block explorer testnet (opsional, P1).
9. Catat alamat dan hash deployment di `06` atau README repo.
