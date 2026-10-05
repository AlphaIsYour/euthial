# 06 — MVP Build Plan

**Versi:** 0.1 · 5 Okt 2026 · Bergantung pada: `00`, `02`, `04`, `05` · Dipakai oleh: `07`, `09`

> Prototipe testnet. Semua angka adalah asumsi berlabel (lihat `02`, bagian 10). Tim, track, dan tanggal hackathon masih `[ISI]`; rencana ini ditulis agar bisa dipotong sesuai ukuran tim (bagian 7.3) dan durasi (24 atau 48 jam).

---

## 1. Tujuan dan Definisi Selesai (DoD)

**Tujuan MVP:** demo end-to-end yang jujur: pendanaan → renovasi per milestone → settlement berkala → waterfall → skenario tenant curang → skenario default, dengan label "Testnet · mock token · mock attestor" di semua layar (NN-09, DC-07).

**Pitch harus mampu menjawab** (lihat `01`, bagian 8): (1) kenapa investor mau, (2) bagaimana kalau tenant curang, (3) kenapa onchain.

**DoD (semua wajib untuk dinyatakan "siap demo"):**

| # | Kriteria | Terkait |
|---|---|---|
| 1 | Skenario S1 (normal), S4 (kebocoran 30%), S6 (default dini) berjalan penuh di testnet dari state bersih dengan **satu perintah** | NFR-05 |
| 2 | Semua tes P0 di `05`, bagian 13 lulus (T-01 s.d. T-16, T-25, T-26/T-28, T-30) | 05 |
| 3 | INV-01, INV-02, INV-03, INV-06, INV-07, INV-10 lulus di fuzz/invariant harness | 05 |
| 4 | Dashboard menampilkan: fase, klaim senior/junior, waterfall per settlement, Floor vs dibayar, saldo bond, feed event | NFR-01 |
| 5 | Banner testnet/mock tampil permanen; tidak ada kata terlarang (`01`, bagian 7) | NN-02, NN-09 |
| 6 | Slide "Batasan yang kami akui" dan panel trust model tersedia | NN-08, `07` |
| 7 | Alamat kontrak dan hash deployment tercatat (bagian 9) | 05, bagian 14 |
| 8 | Video cadangan demo (≤ 3 menit) terekam | bagian 8.3 |

## 2. Scope P0 / P1 / P2

Prioritas mengikuti `05`, bagian 1. ID kebutuhan fungsional memakai prefix `FR-`.

### 2.1 Smart contract (`FR-C`)

| ID | Kebutuhan | Prioritas | Catatan |
|---|---|---|---|
| FR-C01 | `MockIDR` (ERC-20, 6 desimal, mint terbatas) | P0 | |
| FR-C02 | `TrancheVault` ×2 (ERC-4626, akuntansi internal, allowlist) | P0 | `05`, bagian 7 |
| FR-C03 | `WaterfallRouter`: `settle` + EIP-712, split Fase A/B | P0 | `05`, bagian 8 |
| FR-C04 | `FitOutAgreement`: state machine, bond, parameter immutable | P0 | boleh digabung dengan router |
| FR-C05 | Covenant: Floor, uji bulanan, cure, bond draw, STEP_IN | P0 | `05`, bagian 5.4–5.6 |
| FR-C06 | Likuidasi sederhana: `recordRecovery`, `finalizeLiquidation`, write-off | P0 | dibutuhkan skenario S6 |
| FR-C07 | Milestone 2-dari-3 + rilis ke kontraktor | P1 | jalur alternatif P0: rilis milestone oleh landlord+tenant saja |
| FR-C08 | Excused day (`markExcused`) | P1 | dibutuhkan S5 |
| FR-C09 | ORACLE_STALE + `escalateStale` | P1 | dibutuhkan S8 |
| FR-C10 | Sinyal kesehatan (WARNING) | P1 | |
| FR-C11 | Coverage check onchain | P1 | selalu ada di simulator |
| FR-C12 | `arbiterDecideMilestone`, `abortBuild`, `failFundraising` | P1 | |
| FR-C13 | Invariant/fuzz (T-21 s.d. T-24) | P1 | |
| FR-C14 | `PayoutAdapter` (stub Mode B), `AgreementFactory` | P2 | |
| FR-C15 | Verifikasi di block explorer | P2 | |

### 2.2 Attestor, script, simulator (`FR-A`, `FR-S`)

| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-A01 | Mock attestor: menandatangani Settlement EIP-712 | P0 |
| FR-A02 | Scenario runner dengan preset S1, S4, S6 | P0 |
| FR-A03 | Preset S2, S3, S5, S7, S8 | P1 |
| FR-A04 | Script `seed` + `reset` (satu perintah) | P0 |
| FR-A05 | `evidenceHash` dari berkas laporan simulasi | P1 |
| FR-S01 | Engine simulator TS (modul bersama UI dan tes) | P0 (versi ringkas) |
| FR-S02 | Halaman simulator: slider parameter, coverage check, sensitivitas | P1 |
| FR-S03 | Uji paritas simulator vs kontrak (granularitas `periodDays` sama) | P1 |

### 2.3 Frontend (`FR-F`)

| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-F01 | Koneksi wallet + pemilih peran (mode demo) | P0 |
| FR-F02 | Dashboard Investor | P0 |
| FR-F03 | Dashboard Pemilik ruko | P0 |
| FR-F04 | Dashboard Tenant | P0 |
| FR-F05 | Dashboard Kontraktor/Inspektur (milestone) | P1 |
| FR-F06 | Panel skenario (kontrol demo: attestor + arbiter) | P0 |
| FR-F07 | Visual waterfall per settlement | P0 |
| FR-F08 | Grafik Floor vs kumulatif dibayar + penanda CURE/BREACH | P0 |
| FR-F09 | Feed event (audit log) | P0 |
| FR-F10 | Banner testnet/mock permanen | P0 |
| FR-F11 | Panel parameter + label asumsi | P1 |
| FR-F12 | Panel trust model | P1 |
| FR-F13 | Halaman simulator | P1 |

### 2.4 Dokumen dan pitch (`FR-D`)

| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-D01 | README repo (disclaimer testnet, cara jalan, batasan) | P0 |
| FR-D02 | Slide pitch + slide "Batasan yang kami akui" (`07`) | P0 |
| FR-D03 | Video cadangan demo | P1 |
| FR-D04 | Catatan deployment (bagian 9) | P0 |

### 2.5 Di luar scope (NN-05, DC-03)
Pasar sekunder/AMM, Mode B nyata, integrasi PJP/stablecoin nyata, upgradeability, subgraph, multi-tenant pool, KYC nyata.

## 3. Struktur repo dan teknologi

Mengikuti `04`, bagian 10 (rekomendasi default; konfirmasi OQ-01/OQ-02 di `09`).

```
fitout-vault/
├─ contracts/            # Foundry: src/, test/, script/ (Deploy, Seed)
├─ packages/sim/         # Simulator TS murni (tanpa dependensi UI)
├─ apps/attestor/        # Mock attestor + scenario runner (Node/TS, viem)
├─ apps/web/             # Next.js + wagmi + viem
├─ scenarios/            # S1…S8 (JSON)
└─ docs/                 # 00–09
```

Perintah satu baris (nama usulan, NFR-05):
- `pnpm demo:reset` → deploy, mint, allowlist, seed (deposit, bond, startBuild, milestone) pada chain target.
- `pnpm demo:run <skenario>` → jalankan scenario runner.
- `pnpm test:all` → `forge test` + tes simulator.

## 4. Frontend

### 4.1 Prinsip
- Baca state dan event langsung dari kontrak (tanpa subgraph); respons baca < 2 detik (NFR-04).
- Banner permanen: **"Testnet · mock token · mock attestor · bukan penawaran investasi"** (DC-07, DC-08).
- Semua parameter tampil dengan label "asumsi; bukan data pasar" (NFR-06).
- Nama pihak fiktif; tanpa PII (DC-06).
- Mode demo: pemilih peran memakai akun testnet yang sudah di-seed (kunci hanya untuk testnet, jangan dipakai ulang di tempat lain).

### 4.2 Halaman dan isi

| Halaman | Isi utama | Aksi |
|---|---|---|
| **Investor** | Deposit senior, klaim senior (`seniorOutstandingClaim`), dibayar vs klaim, harga share, batas penarikan, status covenant | deposit (FUNDRAISING), withdraw |
| **Pemilik ruko** | Deposit junior, turnover rent diterima, klaim junior, posisi first-loss, approve milestone | deposit junior, approve milestone, panggil `evaluate` |
| **Tenant** | Bond, sisa klaim, Floor vs dibayar, status CURE + hitung mundur, tenant retain (estimasi, off-chain) | `depositBond`, `cureTopUp`, approve milestone |
| **Kontraktor/Inspektur** | Daftar milestone, bukti (hash), persetujuan 2-dari-3 | `submitMilestone`, `approveMilestone`, `rejectMilestone` |
| **Panel skenario** | Pilih preset, kecepatan, tombol maju, tombol "matikan attestor", tandai excused | menjalankan scenario runner; `markExcused`, `escalateStale`, `startLiquidation`, `recordRecovery` |
| **Simulator** | Parameter, coverage, grafik, sensitivitas | — |

Empat "peran" dashboard utama = Investor, Pemilik, Tenant, Kontraktor/Inspektur (keputusan D-22, `09`). Attestor dan arbiter dioperasikan lewat Panel skenario.

### 4.3 Komponen visual (P0)

| Komponen | Data | Sumber |
|---|---|---|
| Phase stepper | Fase agreement + sub-status covenant | `PhaseChanged`, status covenant |
| Waterfall per settlement | G → landlord / senior / junior / retained | `SettlementRecorded` |
| Progress klaim | seniorPaid/seniorClaim, juniorPaid/juniorClaim | `claimPaidTotal`, `seniorOutstandingClaim`, `juniorOutstandingClaim` |
| Grafik Floor vs dibayar | Floor(d) (dihitung di FE dengan rumus `05`, 5.4), kumulatif dibayar, penanda uji | `FloorTested`, `CureStarted`, `BreachRecorded` |
| Gauge bond | bondBalance, bondDrawn | `BondDeposited`, `BondDrawn` |
| Feed event | Semua event bagian 9 di `05` | log kontrak |
| Preview split | `previewSplit(G)` | fungsi baca router |

### 4.4 Kontrol waktu (jam logis)
Waktu kontrak = `dayId` dari attestation (04, bagian 7). Panel skenario memiliki: **Maju 1 periode**, **Maju sampai bulan N**, **Auto-play** (interval 2–5 detik). Granularitas default demo: `periodDays = 30` (1 transaksi per bulan logis); mode detail: `periodDays = 1` untuk beberapa hari saja.

## 5. Simulator (`packages/sim`)

Spesifikasi lengkap: `02`, bagian 11. Tambahan untuk MVP:

1. **Fungsi murni deterministik**; bilangan bulat; pembulatan floor sama dengan kontrak (NFR-03).
2. **Parameter granularitas `periodDays`** wajib ada: hasil covenant berbeda untuk periode 1, 7, dan 30 hari (lihat `07`, SF-03). Simulator harus meniru kontrak pada granularitas yang sama.
3. **Aturan covenant mengikuti `05`, bagian 5.4–5.6** (bukan hitungan kasar `02`, 7.1). Tambahkan opsi *re-tenanting* setelah STEP_IN (jeda dan fraksi omzet pengganti) sebagai parameter opsional; default: tidak ada (konservatif).
4. **Uji paritas (FR-S03):** keluaran simulator = keluaran kontrak pada skenario S1–S8 (toleransi 0 unit pada pembayaran per tranche).
5. **Peringatan UI:** label "asumsi; bukan data pasar" di semua grafik.

## 6. Mock attestor dan script skenario

> Bagian ini dirujuk oleh `05`, bagian 14, langkah 7.

### 6.1 Alur
1. Baca berkas skenario (`scenarios/Sx_*.json`).
2. Untuk setiap periode: hitung `G`, bentuk `Settlement`, hitung `evidenceHash`, tanda tangani EIP-712.
3. Panggil `router.settle(settlement, sig)` lewat relayer (siapa saja boleh memanggil).
4. Attestor harus: (a) memegang cukup `MockIDR` (≥ total take yang diperlukan + turnover rent; mint secukupnya), (b) sudah `approve` router.
5. Setelah tiap tx, baca event dan cetak ringkasan (fase, klaim, status covenant).

### 6.2 Struktur Settlement (EIP-712; lihat `05`, bagian 8.1)
```
Domain: name="FitOutRouter", version="1", chainId, verifyingContract=<router>
Type  : Settlement(uint32 dayId,uint8 periodDays,uint256 grossRecorded,uint32 txCount,bytes32 evidenceHash)
```
Replay dicegah oleh domain + `dayId` unik; **tidak ada field nonce** (lihat IC-04, `09`).

### 6.3 Skema berkas skenario (usulan)
```json
{
  "id": "S4_leak30",
  "baseDailyGrossIDR": 2370371,
  "periodDays": 30,
  "months": 24,
  "curve": [{ "fromDay": 1, "factor": 1.0 }],
  "leakage": 0.30,
  "seasonality": null,
  "events": [
    { "type": "excused", "startDay": 0, "endDay": 0 },
    { "type": "oracleOutageDays", "fromDay": 0, "toDay": 0 },
    { "type": "liquidation", "atEvent": "STEP_IN", "recoveryFractionOfPrincipal": 0.2 }
  ]
}
```
`G_token = round(baseDaily × periodDays × factor × (1 − leakage)) × 1e6`. `txCount` informatif.

### 6.4 Preset skenario

| ID | Nama | Parameter | Tes terkait (`05`) | Kegunaan demo |
|---|---|---|---|---|
| S1 | Normal | faktor 1,0 | T-25 | Waterfall dasar; senior lunas ≈ bulan 14, junior ≈ bulan 18 → RESIDUAL |
| S2 | Lambat 70% | faktor 0,7 | T-26 | Uji floor mendekati batas |
| S3 | Sangat lambat 50% | faktor 0,5 | T-27 | Eskalasi dini |
| S4 | Kebocoran 30% | leakage 0,30 (setara S2) | T-28 | **Tenant curang**: kerugian dibatasi |
| S5 | Musiman + excused | pengali 0,7–1,2; excused hari ekstrem | T-29 | Tidak ada CURE palsu |
| S6 | Default dini | omzet runtuh bulan 6; recovery 20% | T-30 | **STEP_IN**, write-off junior dulu |
| S7 | Pelunasan dipercepat | faktor 1,5 | T-31 | RESIDUAL lebih awal |
| S8 | Attestor mati | tanpa settlement ≥ 3 hari logis, lalu ≥ 14 hari | T-15 | ORACLE_STALE + eskalasi manual |

Hasil harapan numerik per skenario: `07`, bagian 4 (bergantung granularitas `periodDays`).

### 6.5 Kebiasaan jujur di demo
- Tampilkan bahwa attestor adalah **mock**; di produksi digantikan agen escrow/PJP berizin (`04`, bagian 5).
- Skenario "tenant curang" memakai **omzet tercatat yang lebih kecil** (kebocoran tunai tidak terlihat oleh kontrak); yang terlihat hanyalah pembayaran yang tertinggal dari Floor.

## 7. Rencana 48 jam

Peran generik (ganti dengan nama tim `[ISI]`): **SC** (kontrak dan tes), **FE** (frontend), **AT** (attestor + simulator + script), **PD** (dokumen, slide, demo).

### 7.1 Linimasa

| Jam | SC | FE | AT | PD |
|---|---|---|---|---|
| 0–2 | Scaffold Foundry; konfirmasi OQ-01/OQ-02 | Scaffold Next.js + wagmi | Scaffold monorepo, tipe `Settlement` | Kunci narasi (`01`, bagian 7), outline slide |
| 2–10 | `MockIDR`, `TrancheVault`, Agreement fase FUNDRAISING→BUILDING→OPERATING, `settle` + EIP-712 (T-01…T-09) | Layout, banner, role switcher, hook baca event | Signer EIP-712, seed script, engine simulator v1 | README awal, draf slide |
| **10** | **Checkpoint 1:** `settle` end-to-end di anvil lokal | | | |
| 10–20 | Covenant: Floor, uji bulanan, cure, bond draw, STEP_IN, likuidasi (T-10…T-16) | Dashboard Investor/Pemilik/Tenant, waterfall, progress klaim | Scenario runner S1, S4, S6 | Skrip demo, Q&A (`07`) |
| **20** | **Checkpoint 2:** S4 lengkap lulus di anvil | | | |
| 20–28 | Deploy testnet; perbaikan bug; T-25…T-30 | Grafik Floor vs dibayar, feed event, Panel skenario | `demo:reset` satu perintah; preset S2, S3, S7 | Catat alamat (bagian 9) |
| **28** | **Checkpoint 3:** UI live di testnet, S1/S4/S6 berjalan | | | |
| 28–36 | P1: milestone 2-dari-3, excused, stale; invariant/fuzz | Dashboard Kontraktor, simulator, panel trust | Preset S5, S8; uji paritas | Slide final, "Batasan yang kami akui" |
| **36** | **Feature freeze** (hanya bug fix setelah ini) | | | |
| 36–42 | Perbaikan bug, tes ulang | Polishing, empty/error state | `demo:reset` diuji 3× | Latihan pitch ×2; rekam video cadangan |
| 42–48 | Hanya hotfix; catat deployment final | Hanya hotfix | Siapkan snapshot state untuk demo | Latihan pitch ×2; checklist (bagian 10) |

### 7.2 Versi 24 jam
Hanya P0. Potong: milestone (rilis oleh landlord + tenant), Panel skenario disederhanakan (tombol S1/S4/S6), simulator hanya sebagai modul tes, tanpa dashboard Kontraktor. Checkpoint dimajukan setengahnya.

### 7.3 Menyesuaikan ukuran tim
- **1 orang:** SC → AT → FE minimal (satu halaman gabungan) → PD; demo sebagian besar via skrip + dashboard satu halaman.
- **2 orang:** (SC+AT) dan (FE+PD).
- **3–4 orang:** pemisahan penuh seperti tabel.

### 7.4 Cut-line (urutan pemotongan bila telat)
1. FR-C15, FR-C14, FR-F13 · 2. FR-F12, FR-F11 · 3. FR-C10, FR-C11 · 4. FR-C07/C12 (milestone disederhanakan) · 5. FR-C09 dan S8 · 6. FR-C13 (pertahankan T-21 s.d. T-22 saja).
**Tidak boleh dipotong:** FR-C05, FR-C06, banner testnet, slide batasan, video cadangan.

## 8. Skrip demo (≈ 7 menit)

### 8.1 Alur

| Waktu | Adegan | Apa yang ditunjukkan | Pesan kunci |
|---|---|---|---|
| 0:00–0:45 | Masalah | Cerita ruko tutup di Jember (nyatakan: pengamatan, belum data) | Deadlock modal, insentif, kepercayaan |
| 0:45–1:30 | Solusi dan posisi | Kalimat posisi (`01`, 5.1); banner testnet; diagram hybrid | Rupiah tetap via rel berizin; onchain = ledger + waterfall |
| 1:30–2:30 | Pendanaan dan renovasi | Investor deposit, pemilik junior, tenant bond, `startBuild`, milestone 2-dari-3 | Struktur tranche; first-loss pemilik |
| 2:30–4:00 | Operasi (S1) | Auto-play settlement bulanan; waterfall; progress klaim; senior lunas ≈ bulan 14 | Pembagian otomatis dan dapat diverifikasi; tenant retain ±80% |
| 4:00–5:30 | Tenant curang (S4) | Omzet tercatat turun 30%; grafik dibayar tertinggal dari Floor; CURE → bond draw | Kerugian **dibatasi**, bukan dihapus (hasil: `07`, SF-03) |
| 5:30–6:15 | Default (S6) | Omzet runtuh bulan 6 → STEP_IN → recovery 20% → write-off junior dulu | Siapa menanggung kerugian pertama |
| 6:15–7:00 | Batasan dan penutup | Slide "Batasan yang kami akui"; panel trust model | Attestor = trust assumption; regulasi belum divalidasi; data omzet belum ada |

### 8.2 Peta ke tiga pertanyaan juri
- **Kenapa investor mau?** Adegan 3–4 + harga risiko (`02`, 9.1) dan empat tuas.
- **Bagaimana kalau tenant curang?** Adegan S4 + payment floor + bond + mitigasi non-ekonomi (`02`, bagian 8).
- **Kenapa onchain?** Verifikasi waterfall tanpa memercayai buku operator + tranching otomatis; kejujuran bahwa attestor tetap titik kepercayaan (`04`, bagian 5).

### 8.3 Rencana cadangan
- RPC/faucet bermasalah → jalankan anvil lokal dengan skrip `demo:reset` yang sama.
- Wallet bermasalah → mode demo dengan akun ter-seed.
- Semua gagal → video cadangan + tangkapan layar tiap adegan.
- Pra-jalankan S1 sampai bulan ke-N di testnet sebelum naik panggung; demo live hanya beberapa transaksi terakhir.

## 9. Catatan deployment (isi setelah deploy; `05`, bagian 14)

| Item | Nilai |
|---|---|
| Chain / chainId | `[ISI]` (default Sepolia; konfirmasi OQ-01) |
| Tanggal deploy | `[ISI]` |
| Commit hash repo | `[ISI]` |
| `MockIDR` | `[ISI]` · tx `[ISI]` |
| `FitOutAgreement` | `[ISI]` · tx `[ISI]` |
| `WaterfallRouter` | `[ISI]` · tx `[ISI]` |
| `SeniorVault` / `JuniorVault` | `[ISI]` / `[ISI]` |
| Attestor / Arbiter / Admin | `[ISI]` / `[ISI]` / `[ISI]` |
| Hash parameter (`AgreementInitialized`) | `[ISI]` |
| Verifikasi explorer | `[ISI]` |

## 10. Checklist sebelum naik panggung

- [ ] `demo:reset` sukses 3× berturut-turut.
- [ ] Banner testnet tampil di semua halaman; tidak ada klaim imbal hasil dijamin (DC-08).
- [ ] Tidak ada kata terlarang di slide, README, UI (`01`, bagian 7).
- [ ] Slide "Batasan yang kami akui" ada (`07`, bagian 7).
- [ ] Data demo memakai nama fiktif; tanpa PII (DC-06).
- [ ] Hasil S1/S4/S6 di layar sesuai tabel `07`, bagian 4 (atau perbedaan dijelaskan).
- [ ] Video cadangan dan tangkapan layar siap.
- [ ] Alamat kontrak tercatat (bagian 9).
- [ ] Semua perubahan parameter default tercatat di `09` (NN-10).
