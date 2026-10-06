# 11 — Dev 2: Paket Task Issues Pemisahan Portal per Role (Enhanced Anti-Slop Architecture)

**Assignee Utama:** Dev 2 (Frontend & UI Lead)  
**Tujuan Arsitektur:** Memisahkan satu halaman dasbor monolitik menjadi **4 Portal Stakeholder Terdedikasi + 1 Demo Arena Juri** dengan URL routing Next.js App Router, layout mandiri, dan integrasi **Single Source of Truth** reaktif (menghilangkan *disconnected dummy slop*).

> **Status Sinkronisasi Nomor Issue GitHub Repository:**  
> Terakhir tercatat di repository GitHub: Issue #17 (Dev-1 Smoke Test) serta PR #18 & #19.  
> Urutan nomor task issue baru untuk **Dev 2** disesuaikan melanjutkan nomor urut: **#20 s.d. #25**.

---

## 🏗️ Prinsip Arsitektur Data Anti-Dummy (Single Source of Truth)

Agar antarmuka tidak sekadar menjadi *mockup dummy lepas* yang terisolasi, seluruh portal (`/tenant`, `/investor`, `/landlord`, `/inspector`, `/demo`) **WAJIB terhubung ke satu lapisan state bersama (`ProtocolStateProvider`)**:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        ProtocolStateProvider                           │
│  Dual-Engine:                                                          │
│  1. @euthial/sim Engine (State Deterministik 24 Bulan & Skenario S1-S6)│
│  2. Viem Contract Client (Membaca State Smart Contract Sepolia/Anvil)  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Sinkronisasi State Reaktif
        ┌──────────────┬────────────┼─────────────┬─────────────┐
        ▼              ▼            ▼             ▼             ▼
   /tenant         /investor    /landlord     /inspector      /demo
 (Kas Toko 80%   (Senior 1.25x  (Sewa 5%      (2-of-3 Capex (Mission
 & Bond Saldo)   & Idle Cash)   & Junior 20%)  Milestones)   Control)
```

1. **Reaktif Lintas Halaman:** Jika juri di `/demo` memilih skenario `S4 (Cash Skimming 30%)` atau memajukan bulan ke Bulan 8, data di `/tenant` (shortfall covenant & penarikan bond) dan di `/investor` (realisasi yield) langsung berubah secara sinkron dan konsisten.
2. **Konsistensi Visual EnoTools:** Seluruh portal mewarisi `Shell.tsx`, palet CSS variables (`var(--app-bg)`, `var(--card-bg)`, `var(--text-main)`), utiliter dense, font Inter + JetBrains Mono, dan toggle Light/Dark Mode yang sudah disempurnakan.

---

## 🗺️ Gambaran Struktur Routing Baru yang Diusulkan

```text
apps/web/app/
├── layout.tsx                  # Root Layout (Fonts, CSS Variables, Theme Attribute)
├── page.tsx                    # Landing Hub (Portal Selector: Pintu Masuk 5 Peran)
├── (portals)/
│   ├── layout.tsx              # Shared Shell & Header Navigation Portal
│   ├── tenant/page.tsx         # [ISSUE #21] [DEV-2] Portal Khusus Penyewa Kedai (F&B Operator)
│   ├── investor/page.tsx       # [ISSUE #22] [DEV-2] Portal Khusus Pemodal / Investor Senior
│   ├── landlord/page.tsx       # [ISSUE #23] [DEV-2] Portal Khusus Pemilik Ruko (Aset & Sewa)
│   └── inspector/page.tsx      # [ISSUE #24] [DEV-2] Portal Khusus Pengawas & Kontraktor Renovasi
└── demo/
    └── page.tsx                # [ISSUE #25] [DEV-2] Jury Control Deck (Stress Test & Audit Live)
```

---

## 📋 DAFTAR TASK ISSUES DEV 2 (SIAP COPY KE GITHUB ISSUES)

---

### [ISSUE #20] [DEV-2] Routing Architecture, Shared State Layer, & Landing Hub (`/`)
- **Assignee:** Dev 2 (Frontend Lead)
- **Labels:** `frontend`, `p0`, `routing`, `state-architecture`, `anti-slop`
- **Terkait Dokumen:** `10_SPRINT_48H_EXECUTION_BOARD.md` & `06_MVP_BUILD_PLAN.md`

#### 🎯 Goal:
Membangun pondasi routing multi-portal, menyiapkan layer data bersama (`ProtocolStateProvider`) agar tidak terjadi duplikasi mock data statis, serta merombak root page (`/`) menjadi **Landing Hub Portal Selector** dan komponen `FloatingRoleSwitcher`.

#### 📝 Spesifikasi Teknis:
1. **Shared State Layer (`apps/web/context/ProtocolContext.tsx`):**
   - Menghubungkan engine matematika `@euthial/sim` dengan parameter skenario (S1, S4, S6).
   - Menyediakan state global reaktif:
     - `currentMonth`: Bulan aktif (1 s.d. 24).
     - `activeScenario`: S1 (Normal), S4 (Skimming 30%), atau S6 (Default M6).
     - `grossRevenue`, `tenantCash`, `seniorRepaid`, `juniorRepaid`, `landlordRent`, `bondBalance`, `covenantStatus`.
     - `milestones`: Status 3 termin renovasi fisik (Pending / Approved / Released).
   - Menyimpan state sementara di `localStorage` agar perpindahan URL antar rute tidak mereset progres simulasi.
2. **Landing Hub Selector Card (`apps/web/app/page.tsx`):**
   - Menampilkan 5 kartu navigasi peran dengan gaya utiliter EnoTools:
     1. **Penyewa Kedai (Tenant):** Akses `/tenant` (Kas harian 80%, status covenant, proteksi bond).
     2. **Investor Senior:** Akses `/investor` (Klaim modal 80%, return cap 1.25x, idle vault cash).
     3. **Pemilik Ruko (Landlord):** Akses `/landlord` (Turnover rent 5%, junior 20% first-loss, approval fisik).
     4. **Inspektur / Kontraktor:** Akses `/inspector` (Upload bukti fisik, multi-sig termin renovasi).
     5. **Arena Pengujian Juri (Demo Deck):** Akses `/demo` (Simulasi 24 bulan, stress test S1/S4/S6, event log).
3. **Komponen `FloatingRoleSwitcher.tsx`:**
   - Pill melayang di pojok kanan-bawah layar untuk beralih peran instan saat presentasi di hadapan juri.

#### ✅ Acceptance Criteria (DoD):
- [ ] Root route `/` menampilkan 5 kartu portal dengan desain terstandarisasi EnoTools.
- [ ] State simulasi tersentralisasi di `ProtocolContext`, bukan mock statis per komponen terisolasi.
- [ ] Berpindah rute mempertahankan data bulan dan skenario yang sedang diuji.
- [ ] Tombol pintas `FloatingRoleSwitcher` berfungsi mulus di semua halaman portal.

---

### [ISSUE #21] [DEV-2] Dedicated Tenant Portal (`/tenant`) — Operational Cashflow & Bond Safety
- **Assignee:** Dev 2 (Frontend Lead)
- **Labels:** `frontend`, `p0`, `tenant-portal`, `merchant-ops`
- **Terkait Dokumen:** `01_PRODUCT_CONTEXT.md` (§3) & `02_ECONOMIC_MODEL.md` (§8)

#### 🎯 Goal:
Membangun portal khusus pengusaha kedai kopi (*Kedai Kopi Melati*) yang berfokus pada kas operasional harian 80%, saldo uang jaminan escrow, dan sistem peringatan dini *covenant floor*.

#### 📝 Spesifikasi Teknis:
1. **Integrasi Data Riil dari `ProtocolContext`:**
   - **Kas Operasional Bersih (80%):** Dihitung otomatis dari `grossRevenue * 0.80`.
   - **Status Kepatuhan Omzet (Covenant Status):**
     - Badge `HEALTHY` (Hijau) jika kumulatif $\ge$ Payment Floor.
     - Badge `CURE PERIOD (7 HARI)` (Oranye) jika omzet di bawah floor pada skenario S4.
     - Badge `DEFAULT / BOND DRAWN` (Merah) jika masa cure lewat tanpa perbaikan.
   - **Saldo Uang Jaminan (Tenant Escrow Bond):** Nilai awal Rp 15.000.000 (10% capex) dikurangi akumulasi shortfall yang ditarik protokol.
   - **Rasio Coverage Kasir:** Menampilkan rasio EBITDA margin kedai terhadap kewajiban revenue split (target $\ge 2.0\text{x}$).
2. **Aksi Interaktif Tenant:**
   - Form input omzet harian kasir mini (memicu simulasi split 80:15:5).
   - Tombol `[Bayar Shortfall (Cure)]`: Mengurangi saldo shortfall sebelum bond dipotong otomatis.
   - Tombol `[Top-Up Deposit Jaminan]`.
3. **Zero-Clutter Policy:**
   - Bebas dari metrik share vault investor, pembagian return junior, dan kode solidity.

#### ✅ Acceptance Criteria (DoD):
- [ ] URL `/tenant` berdiri mandiri dengan data reaktif dari `ProtocolContext`.
- [ ] Nilai kas harian dan sisa deposit jaminan berubah dinamis saat skenario di `/demo` dimanipulasi.
- [ ] Tombol cure shortfall berfungsi dan memperbarui status covenant secara matematis.

---

### [ISSUE #22] [DEV-2] Dedicated Investor Senior Portal (`/investor`) — Tranche Tracking & Yield Claim
- **Assignee:** Dev 2 (Frontend Lead)
- **Labels:** `frontend`, `p0`, `investor-portal`, `erc-4626`, `yield`
- **Terkait Dokumen:** `05_SMART_CONTRACT_SPEC.md` (§1, §7)

#### 🎯 Goal:
Membangun portal khusus pemodal luar (Senior Tranche) untuk memantau pemulihan pokok investasi, pencapaian target klaim 1.25x cap, dan penarikan imbal hasil kas.

#### 📝 Spesifikasi Teknis:
1. **Integrasi Data Riil dari `ProtocolContext`:**
   - **Pokok Modal & Cap:** Pokok Rp 120.000.000 (80% capex), klaim cap Rp 150.000.000 (1.25x multiple).
   - **Kumulatif Pembayaran Diterima:** Nilai realisasi klaim yang dialokasikan dari 15% investor waterfall pool (Prioritas #1 mutlak).
   - **Sisa Hak Klaim Kontrak:** `Rp 150.000.000 - totalRepaidSenior`.
   - **Kas Siap Tarik di Vault (Idle Cash):** Saldo kas cair yang dialokasikan ke vault namun belum ditarik investor.
   - **Bantalan Proteksi Risiko (Junior First-Loss 20%):** Visualisasi bahwa modal junior Rp 30.000.000 milik Landlord menanggung risiko pertama jika terjadi kerugian.
2. **Aksi Interaktif Investor:**
   - Tombol `[Withdraw Cash]`: Menarik seluruh kas siap tarik ke wallet investor (memperbarui saldo kas vault ke 0 dan menambah wallet balance).
   - Tombol `[View On-Chain Vault Contract]`: Membuka explorer Sepolia / detail address `SeniorTrancheVault`.

#### ✅ Acceptance Criteria (DoD):
- [ ] URL `/investor` berdiri mandiri dengan data live dari `ProtocolContext`.
- [ ] Menampilkan transisi status: *Amortizing* $\rightarrow$ *Fully Repaid (1.25x)* secara jelas saat mencapai target.
- [ ] Tombol `Withdraw Cash` memperbarui kas vault dan mencatat riwayat transaksi.

---

### [ISSUE #23] [DEV-2] Dedicated Landlord Portal (`/landlord`) — Turnover Rent & Property Oversight
- **Assignee:** Dev 2 (Frontend Lead)
- **Labels:** `frontend`, `p0`, `landlord-portal`, `property`, `first-loss`
- **Terkait Dokumen:** `01_PRODUCT_CONTEXT.md` (§3) & `06_MVP_BUILD_PLAN.md` (§4.2)

#### 🎯 Goal:
Membangun portal khusus pemilik aset fisik ruko untuk memantau sewa bagi hasil (*Turnover Rent* 5%), kepemilikan modal junior (20%), dan pengawasan renovasi fisik bangunan.

#### 📝 Spesifikasi Teknis:
1. **Integrasi Data Riil dari `ProtocolContext`:**
   - **Identitas Aset Properti:** Ruko 2 Lantai, Jl. Kalimantan No. 12, Jember (Sewa 24 Bulan).
   - **Pendapatan Sewa Variabel (*Turnover Rent* 5%):** Akumulasi pendapatan sewa yang terpotong otomatis dari seluruh gross revenue QRIS tanpa menunggu tranche senior lunas.
   - **Posisi Modal Junior Co-Investment (Rp 30.000.000):**
     - Target imbal hasil: 1.40x Return Multiple (Klaim Cap Rp 42.000.000).
     - Status pembayaran: *Locked / In Buffer* selama Senior belum lunas $\rightarrow$ *Actively Repaying* setelah Senior mencapai 1.25x.
   - **Ringkasan Status 3 Termin Renovasi:** Menampilkan status persetujuan rilis capex renovasi ruko.
2. **Aksi Interaktif Pemilik Ruko:**
   - Tombol `[Setujui Rilis Termin Renovasi]`: Berfungsi sebagai tanda tangan co-signer #1 (Pemilik Ruko).
   - Tombol `[Cairkan Turnover Rent]`: Menarik akumulasi sewa 5% yang telah terkumpul.

#### ✅ Acceptance Criteria (DoD):
- [ ] URL `/landlord` berdiri mandiri dengan data sewa 5% yang terus bertambah seiring omzet.
- [ ] Status Tranche Junior dengan akurat mencerminkan aturan subordinasi (mulai dibayar HANYA setelah Senior selesai).
- [ ] Pemilik ruko dapat memberikan persetujuan termin renovasi.

---

### [ISSUE #24] [DEV-2] Dedicated Inspector Portal (`/inspector`) — 2-of-3 Multisig Milestone Escrow
- **Assignee:** Dev 2 (Frontend Lead)
- **Labels:** `frontend`, `p0`, `inspection-portal`, `milestone-escrow`, `multisig`
- **Terkait Dokumen:** `05_SMART_CONTRACT_SPEC.md` (§6) & `06_MVP_BUILD_PLAN.md` (§4.2)

#### 🎯 Goal:
Membangun portal khusus pengawas independen dan kontraktor pelaksana untuk verifikasi fisik renovasi ruko dan pelepasan dana capex bertahap menggunakan konsensus 2-of-3 multi-signature.

#### 📝 Spesifikasi Teknis:
1. **Papan Status 3 Termin Renovasi (Total Rp 150.000.000 Capex):**
   - **Termin 1 (Rp 45.000.000 / 30%):** Pembongkaran, partisi, perataan lantai.
   - **Termin 2 (Rp 60.000.000 / 40%):** Instalasi listrik daya tinggi, plumbing espresso, exhaust hood.
   - **Termin 3 (Rp 45.000.000 / 30%):** Furnitur barista counter, sign board, serah terima kunci.
2. **Logika Konsensus Multi-Sig (2-of-3 Threshold):**
   - Co-signer yang sah: (1) Inspektur Independen, (2) Pemilik Ruko, (3) Penyewa Kedai.
   - Dana termin HANYA dilepaskan ke kontraktor jika minimal 2 dari 3 pihak telah menyetujui.
3. **Aksi Pengawas Lapangan:**
   - Input `[Bukti Foto Fisik & Catatan Pengawasan]` (menghasilkan hash verifikasi dokumen).
   - Tombol `[Beri Persetujuan Inspektur (Sign Milestone)]`: Memenuhi kuorum tanda tangan dan mengubah status termin menjadi `RELEASED`.

#### ✅ Acceptance Criteria (DoD):
- [ ] URL `/inspector` memvisualisasikan papan 3 termin secara runut.
- [ ] Dana termin tidak dapat cair jika kuorum tanda tangan belum mencapai 2-of-3.
- [ ] Catatan bukti fisik terdokumentasi rapi dengan hash integritas.

---

### [ISSUE #25] [DEV-2] Dedicated Jury Mission Control Deck (`/demo`) — Time Machine & Stress-Testing
- **Assignee:** Dev 2 (Frontend Lead)
- **Labels:** `frontend`, `p0`, `jury-deck`, `stress-test`, `audit-log`
- **Terkait Dokumen:** `07_RISK_STRESS_TEST_QA.md` & `06_MVP_BUILD_PLAN.md` (§4.4)

#### 🎯 Goal:
Membangun arena pengujian juri hackathon untuk mendemonstrasikan keandalan protokol dalam simulasi 24 bulan, mengeksekusi skenario stres ekstrem (S1, S4, S6), dan mengamati respon otomatis kontrak secara real-time.

#### 📝 Spesifikasi Teknis:
1. **Panel Kendali Waktu Simulasi (Time Machine):**
   - Tombol `[Bulan Berikutnya (+30 Hari)]`: Melangkah 1 bulan dan menghitung ulang seluruh saldo protokol.
   - Tombol `[Auto-Play 24 Bulan]`: Animasi progres 24 bulan dengan kecepatan 1 detik per bulan.
   - Tombol `[Reset Simulasi State]`: Mengembalikan seluruh state ke Bulan 0.
2. **Presets Skenario Uji Stres Juri:**
   - **S1: Operasional Normal (100% Target Omzet)** $\rightarrow$ Senior lunas Bulan 14, Junior lunas Bulan 18, masuk fase Residual.
   - **S4: Kebocoran Kas 30% (Cash Skimming)** $\rightarrow$ Pembayaran jatuh di bawah Payment Floor $\rightarrow$ Masuk masa Cure 7 hari $\rightarrow$ Penarikan Uang Jaminan (Bond Draw) otomatis mencegah gagal bayar tanpa penggusuran.
   - **S6: Gagal Bayar Dini (Early Default Bulan ke-6)** $\rightarrow$ Omzet anjlok permanen $\rightarrow$ Uang jaminan terserap habis $\rightarrow$ Step-in clause pengambilalihan aset ruko.
3. **Live On-Chain Audit Event Log:**
   - Feed log aktivitas kriptografis yang mencatat event nyata: `SettlementRecorded`, `FloorShortfall`, `CureWindowOpened`, `BondDrawn`, `StepInEnacted`.
4. **Grafik Real-Time Covenant Floor vs Realisasi Pembayaran.**

#### ✅ Acceptance Criteria (DoD):
- [ ] URL `/demo` menjadi pusat komando simulasi juri yang responsif.
- [ ] Menjalankan skenario langsung mempengaruhi angka pada rute `/tenant`, `/investor`, dan `/landlord`.
- [ ] Audit log event membuktikan transparansi mekanika RBF tanpa data tiruan statis.
