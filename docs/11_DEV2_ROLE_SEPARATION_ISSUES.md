# 11 — Dev 2: Paket Task Issues Pemisahan Portal per Role (Siap-Review)

**Assignee Utama:** Dev 2 (Frontend & UI Lead)  
**Tujuan Arsitektur:** Memisahkan satu halaman dasbor monolitik menjadi **4 Portal Stakeholder Terdedikasi + 1 Demo Arena Juri** dengan URL routing Next.js App Router, layout mandiri, dan hierarki informasi yang relevan tanpa kebisingan (*zero information noise*).

---

## 🗺️ Gambaran Struktur Routing Baru yang Diusulkan

```text
apps/web/app/
├── page.tsx                    # Landing Hub (Portal Selector: Pintu Masuk 5 Peran)
├── (portals)/
│   ├── tenant/page.tsx         # [ISSUE #12] Portal Khusus Penyewa Kedai (F&B Operator)
│   ├── investor/page.tsx       # [ISSUE #13] Portal Khusus Pemodal / Investor Senior
│   ├── landlord/page.tsx       # [ISSUE #14] Portal Khusus Pemilik Ruko (Aset & Sewa)
│   └── inspector/page.tsx      # [ISSUE #15] Portal Khusus Pengawas & Kontraktor Renovasi
└── demo/
    └── page.tsx                # [ISSUE #16] Jury Control Deck (Stress Test & Audit Live)
```

---

## 📋 DAFTAR TASK ISSUES DEV 2 (SIAP COPY / REVIEW GITHUB)

---

### [ISSUE #11] [DEV-2] Routing Architecture & Landing Hub Portal Selector (`/`)
- **Assignee:** Dev 2 (Frontend Lead)
- **Labels:** `frontend`, `p0`, `routing`, `architecture`
- **Terkait Dokumen:** `10_SPRINT_48H_EXECUTION_BOARD.md` & `06_MVP_BUILD_PLAN.md`

#### 🎯 Goal:
Merombak root page (`/`) menjadi **Landing Hub Portal Selector** yang elegan dan intuitif, serta menambahkan komponen pendukung navigasi cepat (*Floating Role Switcher*) untuk kemudahan demonstrasi juri.

#### 📝 Spesifikasi Teknis:
1. **Landing Hub Selector Card (`apps/web/app/page.tsx`):**
   - Menampilkan 5 kartu pilihan peran dengan identitas visual yang tajam:
     1. **Penyewa Kedai (Tenant):** Akses ke `/tenant` (Kelola omzet kasir, margin 80%, status jaminan).
     2. **Investor Senior:** Akses ke `/investor` (Portofolio modal, imbal hasil target 1.25x, kas vault).
     3. **Pemilik Ruko (Landlord):** Akses ke `/landlord` (Manajemen properti, turnover rent 5%, persetujuan termin).
     4. **Inspektur / Kontraktor:** Akses ke `/inspector` (Upload bukti fisik, rilis dana termin renovasi).
     5. **Arena Pengujian Juri (Demo Deck):** Akses ke `/demo` (Simulasi mesin waktu, stress-test S1/S4/S6).
2. **Komponen `FloatingRoleSwitcher.tsx`:**
   - Pill melayang di pojok kanan-bawah layar dengan tombol lompat instan antar peran saat berpindah portal tanpa harus kembali ke halaman beranda.
   - Dilengkapi opsi *hide/show* untuk kenyamanan tampilan.

#### ✅ Acceptance Criteria (DoD):
- [ ] Root route `/` menampilkan 5 kartu portal dengan deskripsi peran yang jelas.
- [ ] Pengguna dapat masuk ke masing-masing portal dengan 1 klik.
- [ ] Tersedia shortcut `FloatingRoleSwitcher` untuk demo juri tanpa merusak pemisahan rute.

---

### [ISSUE #12] [DEV-2] Dedicated Tenant Portal (`/tenant`)
- **Assignee:** Dev 2 (Frontend Lead)
- **Labels:** `frontend`, `p0`, `tenant-portal`
- **Terkait Dokumen:** `01_PRODUCT_CONTEXT.md` (§3) & `02_ECONOMIC_MODEL.md` (§8)

#### 🎯 Goal:
Membangun portal khusus untuk pengusaha kedai kopi / penyewa ruko yang berfokus pada kesehatan operasional, keamanan kas harian, dan deposit jaminan.

#### 📝 Spesifikasi Teknis:
1. **Hierarki Konten yang Ditampilkan:**
   - **Kas Operasional Toko (80%):** Angka estimasi kas bersih yang tersisa setelah potongan QRIS otomatis.
   - **Status Kepatuhan Omzet (Covenant Status):** Indikator badge `HEALTHY` (Hijau) atau `CURE` (Oranye).
   - **Saldo Uang Jaminan (Bond Balance):** Posisi saldo deposit Rp 15.000.000 beserta riwayat pemotongan bila ada shortfall.
   - **Indikator Margin Keamanan (Coverage Ratio):** Menampilkan rasio EBITDA margin $\ge 2.0\text{x}$ take-rate.
   - **Simulasi Kasir Harian:** Form mini untuk memasukkan omzet harian QRIS.
2. **Aksi Tenant:**
   - Tombol `[Top-Up Uang Jaminan]` untuk menambah deposit sewa.
   - Tombol `[Bayar Shortfall (Cure)]` yang hanya aktif jika terjadi kekurangan pembayaran sebelum jaminan ditarik.
3. **Penyaringan Konten (Zero-Clutter):**
   - Sembunyikan informasi share vault investor, pembagian junior, dan form bukti kontraktor.

#### ✅ Acceptance Criteria (DoD):
- [ ] URL `/tenant` berdiri mandiri sebagai portal operasional merchant.
- [ ] Angka kas ditahan 80% dan status jaminan tampil dominan.
- [ ] Form kasir dan aksi penambahan bond berfungsi responsif.

---

### [ISSUE #13] [DEV-2] Dedicated Investor Senior Portal (`/investor`)
- **Assignee:** Dev 2 (Frontend Lead)
- **Labels:** `frontend`, `p0`, `investor-portal`, `erc-4626`
- **Terkait Dokumen:** `05_SMART_CONTRACT_SPEC.md` (§1, §7)

#### 🎯 Goal:
Membangun portal khusus pemodal luar (Senior Tranche) untuk memantau performa investasi, keamanan modal, dan mencairkan imbal hasil.

#### 📝 Spesifikasi Teknis:
1. **Hierarki Konten yang Ditampilkan:**
   - **Ringkasan Posisi Portofolio:**
     - Pokok Investasi: Rp 120.000.000 (80% Capex).
     - Target Pengembalian: 1.25x Return Multiple (Klaim Cap Rp 150.000.000).
     - Realisasi Kumulatif Terbayar & Sisa Klaim Kontrak.
     - Saldo Share ERC-4626 dan Nilai Aset Bersih (NAV).
   - **Status Kas Tersedia di Vault (Idle Cash):** Kas riil settlement yang siap ditarik pemegang share.
   - **Bantalan Proteksi Risiko (First-Loss Indicator):** Penjelasan visual bahwa modal 20% milik Pemilik Ruko (Junior) menyerap kerugian awal sebelum modal Senior terdampak.
   - **Grafik Kumulatif Pembayaran vs Floor:** Garis realisasi pembayaran terhadap batas aman minimum.
2. **Aksi Investor:**
   - Tombol `[Withdraw Cash]` untuk menarik dana imbal hasil yang mengendap di vault.
   - Tombol `[Deposit Modal]` (dinonaktifkan jika tahap fundraising sudah selesai).

#### ✅ Acceptance Criteria (DoD):
- [ ] URL `/investor` berdiri mandiri sebagai portal investasi terkurasi.
- [ ] Terdapat visualisasi jelas mengenai prioritas pembayaran Senior (Prioritas #1).
- [ ] Tombol tarik dana (*withdraw*) menampilkan status kas vault secara akurat.

---

### [ISSUE #14] [DEV-2] Dedicated Landlord / Pemilik Ruko Portal (`/landlord`)
- **Assignee:** Dev 2 (Frontend Lead)
- **Labels:** `frontend`, `p0`, `landlord-portal`, `property`
- **Terkait Dokumen:** `01_PRODUCT_CONTEXT.md` (§3) & `06_MVP_BUILD_PLAN.md` (§4.2)

#### 🎯 Goal:
Membangun portal khusus pemilik aset fisik ruko untuk memantau pendapatan sewa bagi hasil (*Turnover Rent*), kepemilikan modal junior, dan pengawasan renovasi bangunan.

#### 📝 Spesifikasi Teknis:
1. **Hierarki Konten yang Ditampilkan:**
   - **Identitas Properti Fisik:** Detail ruko (Jl. Kalimantan, Jember), nama penyewa terverifikasi, sisa masa sewa (24 bulan).
   - **Pendapatan Sewa Variabel (*Turnover Rent* 5%):** Akumulasi pendapatan sewa yang terus mengalir dari setiap settlement QRIS kasir.
   - **Posisi Modal Junior Co-Investment (Rp 30jt):** Status target klaim 1.40x (Rp 42jt) yang mulai terbayar setelah tranche Senior lunas 100%.
   - **Pengawasan Progres Fisik Renovasi:** Ringkasan 3 tahap renovasi ruko dan status persetujuan termin.
2. **Aksi Pemilik Ruko:**
   - Tombol `[Setujui Rilis Termin Renovasi]` (memberikan tanda tangan persetujuan pemilik ruko untuk pencairan dana capex kontraktor).
   - Tombol `[Cairkan Akumulasi Turnover Rent]`.

#### ✅ Acceptance Criteria (DoD):
- [ ] URL `/landlord` berdiri mandiri sebagai portal pemilik aset properti.
- [ ] Menampilkan pendapatan sewa berkelanjutan 5% secara transparan.
- [ ] Memungkinkan pemilik ruko menyetujui rilis dana renovasi per termin.

---

### [ISSUE #15] [DEV-2] Dedicated Inspector & Contractor Portal (`/inspector`)
- **Assignee:** Dev 2 (Frontend Lead)
- **Labels:** `frontend`, `p0`, `inspection-portal`, `milestone`
- **Terkait Dokumen:** `05_SMART_CONTRACT_SPEC.md` (§6) & `06_MVP_BUILD_PLAN.md` (§4.2)

#### 🎯 Goal:
Membangun portal khusus pengawas independen dan kontraktor pelaksana untuk mengelola verifikasi fisik renovasi dan pelepasan dana capex bertahap.

#### 📝 Spesifikasi Teknis:
1. **Hierarki Konten yang Ditampilkan:**
   - **Papan Status 3 Termin Renovasi (Total Rp 150jt):**
     - *Termin 1 (Rp 45jt):* Pembongkaran & Struktur Partisi.
     - *Termin 2 (Rp 60jt):* Jalur Kelistrikan & Plumbing Bar Counter.
     - *Termin 3 (Rp 45jt):* Interior, Bar Counter, & Mesin Espresso.
   - **Status Tanda Tangan Konsensus (Multisig 2-of-3):** Menampilkan pihak mana saja yang sudah menandatangani (Inspektur, Pemilik Ruko, Tenant).
   - **Catatan Bukti Fisik (Evidence Hash):** Tampilan hash dokumentasi foto/laporan lapangan di IPFS / SHA-256.
2. **Aksi Pengawas:**
   - Form input `[Unggah Bukti / Masukkan Hash Foto Fisik]`.
   - Tombol `[Sign & Release Termin]` untuk menandatangani pelepasan dana dari escrow smart contract.

#### ✅ Acceptance Criteria (DoD):
- [ ] URL `/inspector` berdiri mandiri sebagai portal manajemen inspeksi fisik.
- [ ] Checklist termin jelas, transparan, dan tidak ada kebingungan dengan urusan omzet atau yield.
- [ ] Mendukung alur tanda tangan rilis dana bertahap.

---

### [ISSUE #16] [DEV-2] Dedicated Jury & Demo Mission Control Deck (`/demo`)
- **Assignee:** Dev 2 (Frontend Lead)
- **Labels:** `frontend`, `p0`, `jury-deck`, `simulation`
- **Terkait Dokumen:** `07_RISK_STRESS_TEST_QA.md` & `06_MVP_BUILD_PLAN.md` (§4.4)

#### 🎯 Goal:
Membangun ruang kontrol khusus juri hackathon untuk mendemonstrasikan keandalan protokol, menguji skenario stres ekstrem, dan memverifikasi log audit on-chain dalam waktu 5-7 menit.

#### 📝 Spesifikasi Teknis:
1. **Hierarki Konten yang Ditampilkan:**
   - **Panel Kendali Waktu Logis:**
     - Tombol `[Maju 1 Bulan (+30 Hari)]`
     - Tombol `[Auto-Play 24 Bulan]`
     - Tombol `[Reset Simulasi State]`
   - **Trigger Skenario Uji Stres (Presets):**
     - `S1: Operasional Normal (100% Target Omzet)`
     - `S4: Kebocoran Kas 30%` (Pembayaran di bawah Floor $\rightarrow$ Masa CURE $\rightarrow$ Penarikan Jaminan/Bond Draw otomatis)
     - `S6: Default Dini (Bulan ke-6)` (Tenant bangkrut $\rightarrow$ Jaminan habis $\rightarrow$ Step-In pengambilalihan ruko)
   - **Live Audit Event Feed Log:** Feed aktivitas on-chain real-time yang mencatat `SettlementRecorded`, `FloorTested`, `CureStarted`, `BondDrawn`, dan `StepInTriggered`.
   - **Grafik Interaktif Covenant Floor vs Realisasi Pembayaran.**

#### ✅ Acceptance Criteria (DoD):
- [ ] URL `/demo` menyediakan kendali penuh untuk pengujian juri.
- [ ] Skenario S1, S4, dan S6 dapat dieksekusi dengan hasil visual yang dapat dijelaskan secara runut.
- [ ] Event log real-time membuktikan transparansi protokol on-chain.
