# 10 — Sprint 48H Execution Board & Ready-to-Copy GitHub Issues

**Versi:** 1.0 · 5 Oktober 2026 · Hackathon 48 Jam Ethereum Jakarta  
**Konteks:** Blueprint pembagian tugas 1 tim (3 orang), sistem desain utilitarian (anti AI-slop), dan paket GitHub Issues siap-pakai untuk dikerjakan bersama AI coding agent.

---

## BAGIAN I: PANDUAN DESAIN & DESIGN SYSTEM (ANTI AI-SLOP)

Mengikuti prompt desain dashboard utilitarian, tenang, dense, dan berstandar internal tool enterprise:

### 1.1 Filosofi Visual
- **Utilitarian & Dense:** Bukan landing page pemasaran. Tidak ada hero banner besar, tidak ada gradient ungu/biru mencolok, tidak ada efek glassmorphism tebal, dan tidak ada kartu bulat seperti mainan.
- **Radius Maksimal 8px:** Semua kartu, container widget, dan button menggunakan `border-radius: 8px` (maksimal). Pengecualian hanya untuk panel utama kiri-atas (`rounded-tl-[14px]`) dan badge kecil (`rounded-[6px]`).
- **Ikonografi:** 100% **Google Material Symbols** (Outlined/Sharp), ukuran 16px (inline/muted) atau 20px (nav).
- **Tipografi:**
  - UI Utama, Label, Heading: **Inter** (clean, neutral, readable).
  - Angka, Hash, Address, Metrik, Kbd: **JetBrains Mono** (monospace tajam).

### 1.2 Theme Tokens (CSS Variables)

```css
:root {
  /* DARK MODE (DEFAULT) */
  --app-bg: #0A0A0A;
  --sidebar-bg: #141414;
  --panel-bg: #0A0A0A;
  --panel-header-bg: #0A0A0A;
  --card-bg: #1A1A1A;
  --card-bg-soft: rgba(26, 26, 26, 0.85);
  --input-bg: rgba(255, 255, 255, 0.06);
  --text-main: #FFFFFF;
  --text-muted: #8A8A8A;
  --border-soft: rgba(207, 207, 207, 0.10);
  --border-hover: rgba(207, 207, 207, 0.18);
  --dot-color: rgba(207, 207, 207, 0.08);
  --hover-bg: rgba(255, 255, 255, 0.04);
  --active-bg: rgba(255, 255, 255, 0.08);
  
  /* STATUS & ACCENT (MINIMAL & MUTED) */
  --status-healthy: #10B981;
  --status-healthy-bg: rgba(16, 185, 129, 0.10);
  --status-warning: #F59E0B;
  --status-warning-bg: rgba(245, 158, 11, 0.10);
  --status-danger: #EF4444;
  --status-danger-bg: rgba(239, 68, 68, 0.10);
  --accent-senior: #3B82F6; /* Senior tranche blue */
  --accent-junior: #8B5CF6; /* Junior tranche purple-slate */
  --accent-landlord: #10B981; /* Landlord rent green */
}

[data-theme="light"] {
  --app-bg: #F4F4F5;
  --sidebar-bg: #EAEAEC;
  --panel-bg: #FAFAFA;
  --panel-header-bg: #EAEAEC;
  --card-bg: #FFFFFF;
  --card-bg-soft: rgba(255, 255, 255, 0.85);
  --input-bg: rgba(0, 0, 0, 0.04);
  --text-main: #171717;
  --text-muted: #71717A;
  --border-soft: rgba(23, 23, 23, 0.12);
  --border-hover: rgba(23, 23, 23, 0.22);
  --dot-color: rgba(23, 23, 23, 0.10);
  --hover-bg: rgba(0, 0, 0, 0.04);
  --active-bg: rgba(0, 0, 0, 0.06);
}
```

### 1.3 Layout Blueprint
- **Viewport:** `h-screen w-screen overflow-hidden flex`.
- **Sidebar:** Width 240px (collapsed 64px), background `var(--sidebar-bg)`, transition 500ms `cubic-bezier(0.22, 1, 0.36, 1)`.
- **Panel Utama:** `h-[calc(100vh-16px)] mt-4 border-l border-t border-[var(--border-soft)] rounded-tl-[14px] bg-[var(--panel-bg)] overflow-hidden relative flex-1`.
- **Dotted Grid Background:** `radial-gradient(circle at 1px 1px, var(--dot-color) 1px, transparent 0)` dengan ukuran `24px 24px`.
- **Sticky Sub-Header (48px):** Role switcher, wallet connector (testnet), breadcrumb, theme toggle, dan search modal trigger (`⌘K`).

---

## BAGIAN II: ALOKASI PERAN TIM (3 ORANG / 48 JAM)

| Role | Tanggung Jawab Utama | Toolchain | Output Kunci |
|---|---|---|---|
| **Dev 1: Smart Contract Lead** | Menulis, mengetes, dan mendeploy semua smart contract ke Ethereum Sepolia. Menjaga invariant & state machine. | Foundry (`forge`), Solidity ^0.8.24, OpenZeppelin v5 | `MockIDR.sol`, `TrancheVault.sol`, `FitOutAgreement.sol`, `WaterfallRouter.sol`, Script Deploy & Seed. |
| **Dev 2: Frontend & UI Lead** | Membangun web app Next.js sesuai layout utilitarian, integrasi Wagmi/Viem, 4 peran dashboard, dan diagram waterfall. | Next.js 14/15, Tailwind, Viem/Wagmi, Material Symbols | Web live di Vercel, Role Switcher, Visual Waterfall, Covenant Floor Chart, Banner Testnet. |
| **Dev 3: Integration, Attestor & Pitch Lead** | Membuat Mock Attestor (EIP-712 signer), scenario runner (S1, S4, S6), paritas simulator TS, slide deck pitch, & skrip demo juri. | Node.js, TypeScript, Viem, Markdown / Slides | Script `demo:reset` & `demo:run`, slide pitch (slide batasan), alur cerita demo 5-7 menit. |

---

## BAGIAN III: PAKET GITHUB ISSUES SIAP-COPY

Copy dan paste issue di bawah ini langsung ke menu **Issues** di GitHub repository kalian.

---

### [ISSUE #01] [DEV-1] Smart Contract: MockIDR & TrancheVault (ERC-4626)
- **Assignee:** Dev 1 (Smart Contract Lead)
- **Labels:** `smart-contract`, `p0`, `foundry`
- **Terkait Dokumen:** `05_SMART_CONTRACT_SPEC.md` (Bagian 1, 7, 10, 12)

#### 🎯 Goal:
Membuat token ERC-20 `MockIDR` (6 desimal) dan `TrancheVault` berbasis ERC-4626 dengan akuntansi internal terisolasi (`idleCash`, `principalOutstanding`) untuk tranche Senior dan Junior.

#### 📝 Spesifikasi Teknis:
1. **`MockIDR.sol`**:
   - ERC-20 standar, 6 desimal.
   - Fungsi `mint(address to, uint256 amount)` publik (khusus demo testnet).
2. **`TrancheVault.sol`**:
   - Mewarisi OpenZeppelin v5 `ERC4626`.
   - Gunakan akuntansi internal:
     - `idleCash`: kas token di vault.
     - `principalOutstanding`: pokok yang sedang dideploy di proyek.
     - `totalAssets() = idleCash + principalOutstanding`.
   - Fungsi `deploy(uint256 amount, address to)` (hanya boleh dipanggil oleh kontrak Agreement).
   - Fungsi `onRepayment(uint256 amount)`: memprioritaskan pemulihan pokok (`principalOutstanding -= min(amount, principalOutstanding)`), kelebihan baru diakui sebagai yield/profit share.
   - Fungsi `writeOffRemaining()`: untuk mencatat kerugian saat default.
   - Batasi transfer share: override `_update`, hanya izinkan transfer ke address yang ada di `allowlist[to]`.
   - Batasi penarikan: `maxWithdraw(owner)` dibatasi oleh kas yang tersedia (`idleCash`).

#### ✅ Acceptance Criteria (DoD):
- [ ] Unit test `T-02`, `T-17`, `T-18` di Foundry passing 100%.
- [ ] Invariant `INV-04` (harga share tidak turun kecuali write-off) & `INV-05` (donasi token tidak memanipulasi share) terbukti via fuzz test `T-24`.
- [ ] Gas efficient dan compile tanpa warning.

> **Prompt Siap-Copy untuk AI Agent Dev 1:**
> ```text
> Tolong buatkan dua smart contract Foundry Solidity ^0.8.24 di folder contracts/src/:
> 1. MockIDR.sol: ERC20 6 decimals dengan public mint untuk demo.
> 2. TrancheVault.sol: ERC4626 bertenor menggunakan OpenZeppelin v5.
> Penting: Jangan gunakan balanceOf token untuk totalAssets(), melainkan internal accounting (idleCash + principalOutstanding) untuk mencegah share inflation attack. Implementasikan allowlist pada _update(), fungsi deploy(amount, to), onRepayment(amount) yang memulihkan pokok duluan sebelum profit, writeOffRemaining(), serta maxWithdraw yang dibatasi ketersediaan idleCash. Buatkan juga test Foundry lengkap di test/TrancheVault.t.sol. Rujuk 05_SMART_CONTRACT_SPEC.md bagian 7.
> ```

---

### [ISSUE #02] [DEV-1] Smart Contract: WaterfallRouter & EIP-712 Settlement
- **Assignee:** Dev 1 (Smart Contract Lead)
- **Labels:** `smart-contract`, `p0`, `eip-712`
- **Terkait Dokumen:** `05_SMART_CONTRACT_SPEC.md` (Bagian 5.1, 5.2, 8)

#### 🎯 Goal:
Membuat kontrak `WaterfallRouter.sol` yang memvalidasi settlement harian via tanda tangan kriptografis EIP-712 dari Attestor, menghitung split Fase A (Amortisasi) dan Fase B (Residual), serta mendistribusikan token.

#### 📝 Spesifikasi Teknis:
1. **Struct Settlement (EIP-712):**
   ```solidity
   struct Settlement {
       uint32 dayId;
       uint8 periodDays;
       uint256 grossRecorded;
       uint32 txCount;
       bytes32 evidenceHash;
   }
   ```
2. **Fungsi `settle(Settlement calldata s, bytes calldata sig)`:**
   - Validasi signature ECDSA OpenZeppelin terhadap address `attestor`.
   - Validasi jam logis: `s.dayId - s.periodDays + 1 > lastDayId` dan `s.dayId <= lastDayId + 60` (MAX_GAP).
   - Hitung split Fase A:
     - `landlordAmt = G * 500 / 10000` (5%)
     - `investorAmt = G * 1500 / 10000` (15%)
     - Distribusi `investorAmt` sekuensial: Senior claim terpenuhi duluan, sisanya ke Junior claim.
     - Kelebihan omzet tidak ditarik (tetap di tenant).
   - Hitung split Fase B (Residual):
     - `landlordAmt = G * 500 / 10000` (5%)
     - `royalty = G * 200 / 10000` (2% ke Junior)
   - Tarik hanya `pull = landlordAmt + payInvestors` dari Attestor (SafeERC20).
   - Panggil hook ke Agreement untuk update covenant.
   - Emit event `SettlementRecorded`.

#### ✅ Acceptance Criteria (DoD):
- [ ] Unit test `T-06`, `T-07`, `T-08`, `T-09` passing.
- [ ] Invariant `INV-01` (total pull <= G), `INV-02` (saldo router kembali 0), `INV-03` (senior lunas sebelum junior menerima pembayaran).
- [ ] Menolak signature invalid, replay `dayId`, atau gap > 60 hari.

> **Prompt Siap-Copy untuk AI Agent Dev 1:**
> ```text
> Buatkan WaterfallRouter.sol di contracts/src/ menggunakan OpenZeppelin v5 (EIP712, ECDSA, SafeERC20, ReentrancyGuard).
> Kontrak harus menerima struct Settlement bertanda tangan EIP-712 dari authorized attestor. Implementasikan pembagian waterfall Fase A (5% landlord, 15% investor sekuensial senior lalu junior, sisa tidak ditarik) dan Fase B (5% landlord, 2% royalti junior). Pastikan ada fungsi previewSplit(uint256 G) dan event SettlementRecorded. Buatkan tes Foundry di test/WaterfallRouter.t.sol mencakup verifikasi signature, penolakan replay, dan urutan sekuensial senior->junior. Rujuk 05_SMART_CONTRACT_SPEC.md bagian 8.
> ```

---

### [ISSUE #03] [DEV-1] Smart Contract: FitOutAgreement & Covenant Escalation
- **Assignee:** Dev 1 (Smart Contract Lead)
- **Labels:** `smart-contract`, `p0`, `covenant`
- **Terkait Dokumen:** `05_SMART_CONTRACT_SPEC.md` (Bagian 3, 4, 5.4–5.6, 6) & Keputusan D-21

#### 🎯 Goal:
Membuat kontrak induk `FitOutAgreement.sol` yang mengelola parameter proyek, state machine, uang jaminan tenant (*bond*), rilis milestone kontraktor, dan tangga eskalasi covenant (*payment floor*).

#### 📝 Spesifikasi Teknis:
1. **State Machine Fase:**
   `DRAFT` → `FUNDRAISING` → `BUILDING` → `OPERATING` → `RESIDUAL` → `CLOSED` (serta cabang `STEP_IN`, `LIQUIDATING`, `FAILED_REFUND`, `ABORTED_REFUND`).
2. **Covenant & Payment Floor:**
   - Rumus `Floor(d)` berbasis hari logis efektif `d = (lastDayId - startDay + 1) - excusedDays`.
   - Uji bulanan tiap kelipatan 30 hari logis: `Shortfall = max(0, Floor(d) - CumulativeInvestorPaid)`.
   - Tangga eskalasi: Jika `Shortfall > tolerance` → status `CURE` (diberi waktu 7 hari logis).
   - Jika setelah 7 hari masih kurang: tarik `Bond` tenant.
   - Jika 2x breach berturut-turut atau bond habis dan masih kurang → `STEP_IN`.
   - **Terapkan Aturan D-21:** Jika penarikan bond berhasil melunasi total klaim (`claimPaidTotal >= totalClaim`), kontrak langsung masuk `RESIDUAL` dan **batalkan** `STEP_IN`.
3. **Escrow Bond & Milestone:**
   - Setor bond tenant 10% di fase `FUNDRAISING`.
   - Milestone renovasi 3 tahap (30%, 40%, 30%) dengan approval 2-dari-3 pihak (Landlord, Tenant, Inspektur).

#### ✅ Acceptance Criteria (DoD):
- [ ] Siklus hidup lengkap dari Fundraising sampai Operating & Residual berjalan mulus.
- [ ] Tes eskalasi `T-10` s.d. `T-16` dan `T-33` (Aturan D-21) passing.
- [ ] Invariant `INV-07` (transisi state valid), `INV-08` (konservasi bond), `INV-12` (Floor monoton).

> **Prompt Siap-Copy untuk AI Agent Dev 1:**
> ```text
> Buatkan FitOutAgreement.sol di contracts/src/ yang mengatur state machine lengkap dan modul covenant sesuai 05_SMART_CONTRACT_SPEC.md.
> Fitur wajib:
> 1. Fundraising & deposit bond tenant (10% budget).
> 2. Milestone renovasi 2-dari-3 approval untuk deploy dana dari TrancheVault ke kontraktor.
> 3. Kalkulator Floor(d) sesuai section 5.4 dan evaluasi bulanan shortfall.
> 4. Status covenant: HEALTHY, CURE, BREACHED, STEP_IN.
> 5. Terapkan aturan D-21: jika klaim total lunas saat bond draw, transisi ke RESIDUAL mendahului STEP_IN.
> Hubungkan kontrak ini dengan MockIDR, WaterfallRouter, SeniorVault, dan JuniorVault. Tulis tes integrasi komprehensif di test/FitOutAgreement.t.sol.
> ```

---

### [ISSUE #04] [DEV-2] Frontend: Shell Workspace, Layout Utilitarian & Design Tokens
- **Assignee:** Dev 2 (Frontend Lead)
- **Labels:** `frontend`, `p0`, `ui-system`
- **Terkait Dokumen:** `10_SPRINT_48H_EXECUTION_BOARD.md` (Bagian I)

#### 🎯 Goal:
Setup Next.js 14/15 App Router dengan Tailwind CSS, konfigurasi CSS Variables theme tokens, custom font Inter & JetBrains Mono, Google Material Symbols, collapsible sidebar, dan panel berlatar dotted background.

#### 📝 Spesifikasi Teknis:
1. **Setup Token CSS Variables:** Pasang token dark/light mode persis seperti Bagian 1.2 di `app/globals.css`.
2. **Ikonografi:** Install atau import Google Material Symbols (Outlined). Buat helper component `<MaterialIcon name="xyz" className="..." />`.
3. **Layout Viewport:**
   - Full height viewport `h-screen overflow-hidden flex`.
   - Sidebar kiri collapsible (240px normal, 64px collapsed) warna `#141414`.
   - Panel utama kanan: `mt-4 rounded-tl-[14px] bg-[#0A0A0A] border-l border-t border-[rgba(207,207,207,0.10)] overflow-hidden`.
   - Dotted pattern pada area konten scrollable: `radial-gradient(circle at 1px 1px, var(--dot-color) 1px, transparent 0)` size `24px 24px`.
4. **Header Panel (48px):**
   - Tombol toggle sidebar.
   - Search trigger button (dengan visual kbd `Ctrl+K`).
   - Network badge: "Ethereum Sepolia (Testnet)" dan Wallet Connector pill.
5. **Banner Permanen (Non-negotiable NN-09):**
   - Banner tipis di atas: `"Testnet Prototype · Mock Token & Mock Attestor · Bukan Penawaran Investasi Publik"`.

#### ✅ Acceptance Criteria (DoD):
- [ ] Shell layout responsive, tidak ada overflow horizontal liar.
- [ ] Sidebar collapse transition mulus dengan tooltip pada mode collapsed.
- [ ] Font Inter dan JetBrains Mono ter-render dengan benar.
- [ ] Radius kartu konsisten maksimal 8px (anti AI-slop).

> **Prompt Siap-Copy untuk AI Agent Dev 2:**
> ```text
> Setup frontend Next.js 14 App Router di folder apps/web menggunakan Tailwind CSS.
> Terapkan design system utilitarian internal tool:
> 1. Konfigurasi CSS variables tema dark (#0A0A0A) dan sidebar (#141414) di globals.css sesuai 10_SPRINT_48H_EXECUTION_BOARD.md Bagian I.
> 2. Buat layout utama flexbox h-screen overflow-hidden dengan sidebar collapsible (240px ke 64px) dan main panel kanan ber-border atas/kiri dengan top-left rounded 14px.
> 3. Buat komponen Icon helper menggunakan Google Material Symbols (Outlined).
> 4. Berikan background dotted halus pada main content area.
> 5. Buat header panel 48px dengan wallet connect button mockup dan search trigger.
> 6. Pasang banner permanen testnet disclaimer di bagian paling atas.
> Pastikan gaya rapi, utilitarian, dense, border tipis, dan kartu rounded maksimal 8px.
> ```

---

### [ISSUE #05] [DEV-2] Frontend: Visual Waterfall Component & Claim Progress
- **Assignee:** Dev 2 (Frontend Lead)
- **Labels:** `frontend`, `p0`, `data-viz`
- **Terkait Dokumen:** `02_ECONOMIC_MODEL.md` (Bagian 3) & `06_MVP_BUILD_PLAN.md` (Bagian 4.3)

#### 🎯 Goal:
Membangun komponen visualisasi pembagian omzet QRIS (*Waterfall Split Visualizer*) dan bar kemajuan pelunasan klaim Senior/Junior.

#### 📝 Spesifikasi Teknis:
1. **Interactive Waterfall Split Card:**
   - Menampilkan input omzet kotor `G` (contoh Rp2.370.370 / hari atau Rp71,1 jt / bulan).
   - Diagram aliran persentase:
     - 80% Tenant Retained (`#10B981` soft)
     - 15% Investor Take (`#3B82F6` soft) → dialirkan ke Senior Vault (sampai Rp150 jt) lalu Junior Vault (sampai Rp42 jt).
     - 5% Landlord Turnover Rent (`#8B5CF6` soft).
   - Animasi transisi angka yang clean dan ringkas saat slider omzet digeser.
2. **Claim Progress Cards (Tranche Health):**
   - Senior Tranche: Pokok Rp120 jt, Target Klaim Rp150 jt, Status Terbayar, Estimasi Selesai (Bulan ~14).
   - Junior Tranche: Pokok Rp30 jt, Target Klaim Rp42 jt, Status Terbayar (Mulai terbayar setelah Senior 100%).
   - Indikator First-Loss Protection: label penjelas bahwa Junior menanggung kerugian awal sebelum Senior tersentuh.

#### ✅ Acceptance Criteria (DoD):
- [ ] Komponen tampil rapi, padat, tipografi angka menggunakan JetBrains Mono.
- [ ] Nilai kalkulasi split sesuai dengan fungsi `previewSplit(G)` smart contract.
- [ ] Card bergaya clean (border `var(--border-soft)`, radius 8px, tanpa shadow berlebihan).

> **Prompt Siap-Copy untuk AI Agent Dev 2:**
> ```text
> Buat komponen React di apps/web/components/waterfall/:
> 1. WaterfallVisualizer.tsx: Menampilkan pecahan omzet kotor settlement harian (80% tenant, 15% investor, 5% landlord) dengan diagram bar proporsional horizontal yang clean dan angka berformat Rupiah/MockIDR.
> 2. TrancheClaimCards.tsx: Dua kartu berdampingan (Senior dan Junior) dengan progress bar tipis (h-2, rounded-full), progress angka dalam JetBrains Mono, target multiple (1.25x dan 1.40x), dan badge prioritas sekuensial.
> Styling: Card bg #1A1A1A, border rgba(207,207,207,0.10), rounded 8px, padding dense (p-4). Rujuk formula di 02_ECONOMIC_MODEL.md bagian 3.
> ```

---

### [ISSUE #06] [DEV-2] Frontend: 4-Role Dashboard Switcher (Investor, Landlord, Tenant, Inspector)
- **Assignee:** Dev 2 (Frontend Lead)
- **Labels:** `frontend`, `p0`, `roles`
- **Terkait Dokumen:** `06_MVP_BUILD_PLAN.md` (Bagian 4.2)

#### 🎯 Goal:
Membuat tampilan dashboard yang dapat berganti sudut pandang secara instan (*Role Switcher*) untuk 4 aktor: Investor, Pemilik Ruko (Landlord), Tenant (Penyewa), dan Kontraktor/Inspektur.

#### 📝 Spesifikasi Teknis:
1. **Dropdown / Tab Role Switcher di Top Bar:**
   - Memilih: `[Investor Senior]` | `[Pemilik Ruko]` | `[Tenant Kedai]` | `[Inspektur / Kontraktor]`.
2. **View: Investor Dashboard:**
   - Metrik utama: Modal Didepositkan, Share Balance, Total Imbal Hasil Diterima, Nilai Klaim Sisa.
   - Tombol Aksi: `Deposit Senior` (hanya aktif saat Fundraising) & `Withdraw Available Cash`.
3. **View: Pemilik Ruko Dashboard:**
   - Metrik: Modal Junior Disetor (Rp30 jt), Akumulasi Turnover Rent (5%), Status Sewa Ruko.
   - Aksi: `Approve Milestone Renovasi`.
4. **View: Tenant Dashboard:**
   - Metrik: Saldo Uang Jaminan (Bond: Rp15 jt), Status Kesehatan Pembayaran (HEALTHY/CURE), Estimasi Omzet Bersih yang Disimpan (80%).
   - Aksi: `Deposit Bond` & `Top-Up Cure (Bila ada shortfall)`.
5. **View: Kontraktor / Inspektur:**
   - Daftar 3 Milestone Renovasi (Partisi/Bongkar, Instalasi Elektrik/Plumbing, Finishing/Interior).
   - Status persetujuan (2-dari-3) + tombol `Submit Evidence Hash` & `Approve`.

#### ✅ Acceptance Criteria (DoD):
- [ ] Berganti role mengubah metrik dan tombol aksi yang relevan secara instan tanpa reload halaman.
- [ ] State form bersih, interaksi tombol ada loading/success state.

> **Prompt Siap-Copy untuk AI Agent Dev 2:**
> ```text
> Buat sistem Role-Based Dashboard di apps/web/app/dashboard/page.tsx:
> Sediakan role switcher (Investor, Landlord, Tenant, Contractor). Tampilkan metrik utilitarian spesifik per role sesuai spesifikasi di 06_MVP_BUILD_PLAN.md bagian 4.2.
> Gunakan styling utilitarian: grid cards dense (gap-3), font angka JetBrains Mono, Google Material Symbols untuk ikon aksi, border 1px soft, radius 8px. Sediakan mock data state agar saat wallet belum terkoneksi juri tetap bisa melihat visual dashboard yang berfungsi.
> ```

---

### [ISSUE #07] [DEV-3] Script & Simulator: EIP-712 Mock Attestor & Scenario Runner
- **Assignee:** Dev 3 (Integration & Pitch Lead)
- **Labels:** `scripts`, `attestor`, `p0`
- **Terkait Dokumen:** `04_SYSTEM_ARCHITECTURE.md` (Bagian 3) & `06_MVP_BUILD_PLAN.md` (Bagian 6)

#### 🎯 Goal:
Membuat script Node.js/TypeScript untuk mensimulasikan peran Agen Escrow / PJP berizin yang menandatangani data settlement omzet QRIS harian via EIP-712 dan mengirimkannya ke `WaterfallRouter`.

#### 📝 Spesifikasi Teknis:
1. **`apps/attestor/signer.ts`**:
   - Mendefinisikan EIP-712 Typed Data:
     `Domain: { name: "FitOutRouter", version: "1", chainId, verifyingContract }`
     `Types: { Settlement: [dayId, periodDays, grossRecorded, txCount, evidenceHash] }`
   - Fungsi `signSettlement(settlement, privateKey)`.
2. **Scenario Runner (`scenarios/`):**
   - **`S1_normal.json`**: Omzet stabil 100% (Rp2,37 jt/hari = Rp71,1 jt/bulan). Klaim Senior lunas bulan ~14, Junior lunas bulan ~18 → masuk RESIDUAL.
   - **`S4_leakage30.json`**: Tenant curang (kebocoran tunai 30%). Omzet tercatat turun ke 70%. Uji floor mendeteksi shortfall di bulan 22-25, menarik sebagian bond Rp5,3 jt, seluruh klaim lunas di bulan 26 tanpa tenant diusir.
   - **`S6_default.json`**: Omzet runtuh di bulan 6. Uji floor gagal berturut-turut, bond ditarik penuh, status berubah menjadi `STEP_IN` di bulan ~13, recovery 20% dicatat, kerugian diserap oleh Junior Tranche lebih dulu.
3. **Perintah Runner CLI:**
   - `pnpm demo:run --scenario=S1`
   - `pnpm demo:run --scenario=S4`
   - `pnpm demo:run --scenario=S6`

#### ✅ Acceptance Criteria (DoD):
- [ ] Script sukses mengirim transaksi `settle(...)` ke blockchain lokal (Anvil) atau Sepolia.
- [ ] Output console menampilkan tabel progres waterfall dan status covenant per settlement.

> **Prompt Siap-Copy untuk AI Agent Dev 3:**
> ```text
> Buat package TypeScript di apps/attestor/ menggunakan viem:
> 1. signer.ts: Modul penandatangan EIP-712 struct Settlement sesuai 05_SMART_CONTRACT_SPEC.md bagian 8.1.
> 2. runner.ts: Script yang membaca file skenario JSON di folder scenarios/ (S1_normal.json, S4_leakage30.json, S6_default.json), menghitung gross harian, menandatangani struct, dan memanggil fungsi settle() pada WaterfallRouter.
> Tampilkan log eksekusi yang rapi di terminal dengan status dayId, gross omzet, pembagian senior/junior, dan status covenant.
> ```

---

### [ISSUE #08] [DEV-3] Integration: Script Reset & Seed Satu Baris (`demo:reset`)
- **Assignee:** Dev 3 (Integration & Pitch Lead)
- **Labels:** `devops`, `p0`, `automation`
- **Terkait Dokumen:** `06_MVP_BUILD_PLAN.md` (Bagian 1, Kriteria 1 & NFR-05)

#### 🎯 Goal:
Membuat script otomatisasi satu perintah (`pnpm demo:reset`) yang mendeploy ulang seluruh smart contract, mendistribusikan saldo token demo, mendaftarkan allowlist, menyetor modal senior/junior, menyetor bond, memulai build, dan menyetujui milestone renovasi.

#### 📝 Spesifikasi Teknis:
1. **Script `contracts/script/DeployAndSeed.s.sol` (Foundry):**
   - Deploy `MockIDR`.
   - Deploy `FitOutAgreement`, `WaterfallRouter`, `SeniorVault`, `JuniorVault`.
   - Setup konfigurasi: pasang address router ke agreement & vault.
   - Mint saldo demo: Investor (Rp150 jt), Landlord (Rp50 jt), Tenant (Rp20 jt), Attestor (Rp1 Miliar untuk settlement pool).
   - Set allowlist investor & landlord.
   - Deposit Senior (Rp120 jt) + Junior (Rp30 jt) + Bond Tenant (Rp15 jt).
   - Panggil `startBuild()`.
   - Submit dan rilis 3 milestone kontraktor (dana renovasi Rp150 jt cair ke kontraktor).
   - Agreement resmi berpindah ke fase `OPERATING`.
2. **Output Config:**
   - Simpan alamat kontrak yang baru dideploy ke `apps/web/config/contracts.json` dan `apps/attestor/config/contracts.json`.

#### ✅ Acceptance Criteria (DoD):
- [ ] Menjalankan `pnpm demo:reset` berhasil 100% tanpa error dalam waktu < 30 detik di jaringan Anvil / Testnet.
- [ ] State akhir blockchain langsung berada di fase `OPERATING` siap menerima settlement omzet harian.

> **Prompt Siap-Copy untuk AI Agent Dev 3:**
> ```text
> Buat script deployment dan seeding otomatis menggunakan Foundry Script di contracts/script/DeployAndSeed.s.sol:
> Alur eksekusi:
> 1. Deploy MockIDR, WaterfallRouter, TrancheVault x2, FitOutAgreement.
> 2. Mint token demo ke 4 akun aktor.
> 3. Lakukan deposit Senior (120 jt), Junior (30 jt), dan Tenant Bond (15 jt).
> 4. Trigger startBuild(), lalu submit dan approve 3 milestone kontraktor agar status berpindah ke OPERATING.
> 5. Export JSON daftar alamat kontrak ke apps/web/contracts.json agar frontend otomatis terhubung.
> Tambahkan shortcut perintah di root package.json: "demo:reset".
> ```

---

### [ISSUE #09] [DEV-2 & DEV-3] Frontend: Scenario Controller Panel (Jury Control Deck)
- **Assignee:** Dev 2 (Frontend) & Dev 3 (Attestor)
- **Labels:** `frontend`, `demo`, `p0`
- **Terkait Dokumen:** `06_MVP_BUILD_PLAN.md` (Bagian 4.2, 4.4) & `07_RISK_STRESS_TEST_QA.md`

#### 🎯 Goal:
Membuat panel kontrol khusus juri di frontend untuk mendemonstrasikan skenario secara interaktif: tombol memajukan waktu, memilih preset (Normal, Curang 30%, Default), serta tombol simulasi darurat (*Matikan Attestor / Libur Force Majeure*).

#### 📝 Spesifikasi Teknis:
1. **Scenario Panel UI (`apps/web/components/scenario/`):**
   - Preset selector buttons: `[S1: Normal 100%]` | `[S4: Tenant Curang 30%]` | `[S6: Default Dini (Bulan 6)]`.
   - Control buttons:
     - `▶ Auto-Play (Per 30 Hari)`
     - `⏭ Maju 1 Bulan (+30 Hari Logis)`
     - `⏸ Pause`
   - Indikator Jam Logis: `Hari Logis Ke: d` | `Bulan Ke: M`.
2. **Event & Covenant Log Feed:**
   - Menampilkan feed event real-time: `SettlementRecorded`, `FloorTested`, `CureStarted`, `BondDrawn`, `PhaseSwitchedToResidual`.
   - Visual badge status: `HEALTHY (Hijau)` / `WARNING (Kuning)` / `CURE (Oranye)` / `STEP_IN (Merah)`.

#### ✅ Acceptance Criteria (DoD):
- [ ] Juri dapat melihat efek langsung saat tombol "Maju 1 Bulan" ditekan: angka waterfall bergerak, progress bertambah, dan event baru muncul di feed.
- [ ] Tombol S4 mendemonstrasikan penarikan bond tanpa tenant diusir.

> **Prompt Siap-Copy untuk AI Agent Dev 2:**
> ```text
> Buat komponen ScenarioControllerPanel.tsx di apps/web/components/scenario/:
> 1. Sediakan tombol preset skenario S1, S4, S6.
> 2. Sediakan kontrol navigasi waktu: Tombol "Maju 1 Periode (+30 Hari)" dan "Auto Play".
> 3. Tampilkan feed audit event log di bagian bawah yang membaca event kontrak atau simulasi lokal.
> Desain: Layout modular utilitarian, background #141414, border 1px rgba(207,207,207,0.10), radius 8px, font monospace untuk angka hari dan saldo. Rujuk skenario di 06_MVP_BUILD_PLAN.md bagian 6.4.
> ```

---

### [ISSUE #10] [DEV-2] Frontend: Covenant Floor vs Cumulative Paid Chart
- **Assignee:** Dev 2 (Frontend Lead)
- **Labels:** `frontend`, `charts`, `p1`
- **Terkait Dokumen:** `02_ECONOMIC_MODEL.md` (Bagian 4) & `06_MVP_BUILD_PLAN.md` (Bagian 4.3)

#### 🎯 Goal:
Membuat grafik garis interaktif yang membandingkan garis **Target Payment Floor Kumulatif** vs **Realisasi Pembayaran Investor Kumulatif** untuk menunjukkan secara visual kapan terjadi *shortfall*, masa *cure*, dan penarikan *bond*.

#### 📝 Spesifikasi Teknis:
1. **Data Garis:**
   - Garis Putus-putus (`#8A8A8A`): `Floor(d)` (Target minimum kumulatif yang naik linear dari 0 ke 60% di hari 540, lalu ke 100% di hari 720).
   - Garis Solid (`#3B82F6`): `CumulativeInvestorPaid` (Realisasi kumulatif).
2. **Titik Anotasi Interaktif:**
   - Titik Oranye: Event `CureStarted` (saat realisasi berada di bawah garis Floor).
   - Titik Merah: Event `BondDrawn` (saat bond ditarik untuk menutup selisih).
3. **Library:** Gunakan Chart.js, Recharts, atau SVG canvas kustom ringan (tanpa dependensi berat).

#### ✅ Acceptance Criteria (DoD):
- [ ] Grafik responsive, clean, background transparan menyatu dengan panel dark mode.
- [ ] Tooltip saat hover menampilkan Hari Logis, Target Floor, dan Realisasi Terbayar.

> **Prompt Siap-Copy untuk AI Agent Dev 2:**
> ```text
> Buat komponen grafik CovenantChart.tsx di apps/web/components/charts/ menggunakan Recharts atau Chart.js:
> Visualisasikan perbandingan kumulatif antara:
> 1. Target Floor(d) (garis abu-abu putus-putus)
> 2. Total Pembayaran Diterima Investor (garis biru solid)
> Tampilkan area shortfall saat kurva pembayaran berada di bawah garis target.
> Terapkan styling minimalis dark mode: background transparan, grid line sangat halus (rgba(207,207,207,0.05)), tooltip dark utilitarian dengan font JetBrains Mono. Rujuk rumus Floor di 05_SMART_CONTRACT_SPEC.md bagian 5.4.
> ```

---

### [ISSUE #11] [DEV-3] Pitch Deck & Presentation: Slide "Batasan yang Kami Akui" & Q&A Juri
- **Assignee:** Dev 3 (Integration & Pitch Lead)
- **Labels:** `pitch`, `presentation`, `p0`
- **Terkait Dokumen:** `01_PRODUCT_CONTEXT.md`, `07_RISK_STRESS_TEST_QA.md` (Bagian 6, 7)

#### 🎯 Goal:
Menyusun slide deck presentasi (7-10 slide) dan melatih penyampaian 3 pertanyaan kritis juri, termasuk slide kejujuran *"Batasan yang Kami Akui"* untuk memenangkan kepercayaan juri.

#### 📝 Struktur Slide Wajib:
1. **Slide 1:** Judul Proyek (*FitOut Vault*), Tagline: *"Verifiable Revenue-Based Financing for Commercial Ruko Fit-Outs"*.
2. **Slide 2:** Masalah Nyata di Lapangan (Deadlock Ruko Kosong di Jember: pemilik enggan capex, tenant kecil modal minim, pemodal tak bisa verifikasi).
3. **Slide 3:** Solusi Hybrid (Rupiah via QRIS berizin di dunia nyata; Onchain untuk Ledger Waterfall, Tranche Modal, & Covenant).
4. **Slide 4:** Struktur Modal Bertingkat (Senior 80% didanai investor, Junior 20% diisi pemilik ruko sebagai first-loss protection).
5. **Slide 5:** Mekanisme Covenant (Payment Floor & Bond Escrow untuk membatasi risiko kebocoran kas).
6. **Slide 6:** Live Demo Walkthrough (Alur Normal S1 → Tenant Curang S4 → Default Dini S6).
7. **Slide 7 (SLIDE KUNCI): "Batasan yang Kami Akui" (The Honesty Slide):**
   - Regulasi belum divalidasi (masih peta awal, butuh legal opinion formal).
   - Data omzet saat ini adalah asumsi terlabel, validasi sesungguhnya butuh pilot nyata.
   - Attestor adalah titik kepercayaan (di demo mock; produksi butuh PJP berizin / multi-attestor).
   - Kebocoran tunai *dibatasi* oleh bond, bukan *dihapus* 100%.
8. **Slide 8:** Roadmap Pasca Hackathon (Legal review → Pilot 1 Ruko di Jember bersama mitra PJP → Pooling multi-tenant).

#### ✅ Acceptance Criteria (DoD):
- [ ] Slide deck siap dalam format PDF/Canva/Slides.
- [ ] Rekaman video cadangan demo (maksimal 3 menit) tersimpan di local storage sebagai contingency plan jika internet venue bermasalah (NFR R-18).

---

### [ISSUE #12] [ALL] Final Polish, Deployment Vercel & Dry Run Latihan Demo
- **Assignee:** Seluruh Anggota Tim (Dev 1, Dev 2, Dev 3)
- **Labels:** `final`, `demo-day`, `p0`
- **Terkait Dokumen:** `06_MVP_BUILD_PLAN.md` (Bagian 10: Checklist Sebelum Naik Panggung)

#### 🎯 Goal:
Memastikan kontrak ter-deploy di Sepolia Testnet, web frontend live di Vercel, script reset berjalan mulus, dan melakukan simulasi presentasi 5-7 menit bersama tim.

#### ✅ Checklist Final (Wajib Centang Semua):
- [ ] Frontend sukses di-deploy ke Vercel tanpa build error.
- [ ] `pnpm demo:reset` sukses 3x berturut-turut di testnet bersih.
- [ ] Banner testnet tampil permanen di seluruh layar demo.
- [ ] Tidak ada kata-kata terlarang (*sekuritisasi*, *zero-capex*, *guaranteed return*, *tanpa polisi/pengadilan*).
- [ ] Video rekaman demo cadangan (2-3 menit) sudah ada di laptop presenter.
- [ ] Latihan tanya jawab Q&A juri (QA-01 s.d. QA-03) lancar di bawah 45 detik per jawaban.

---

## BAGIAN V: SPRINT LANJUTAN — DEV-1 CONTRACT HARDENING & PARALLEL WORK

---

### [ISSUE #13] [DEV-1] Smart Contract: Covenant State Machine Tests
- **Assignee:** Dev 1 (Smart Contract Lead)
- **Labels:** `smart-contract`, `covenant`, `p0`
- **Terkait Dokumen:** `05_SMART_CONTRACT_SPEC.md` (Bagian 5.3, 5.4, 9, 13)

#### 🎯 Goal:
Menguji jalur evaluasi covenant pada `FitOutAgreement.sol` (`onSettlement`, `_evaluateCovenant`, `_processCureExpiry`) saat ruko beroperasi di status `OPERATING`, mencakup status normal, window `CURE`, penarikan bond, hingga eskalasi ke `STEP_IN` dan `RESIDUAL`.

#### 📝 Spesifikasi Pengujian:
1. **Normal & Tolerance:**
   - Omzet di atas floor: status tetap `HEALTHY`.
   - Shortfall di bawah tolerance (misal 1% dari claim): status tetap `HEALTHY`, tidak memicu cure.
2. **Cure Window:**
   - Shortfall kumulatif melebihi tolerance: status bertransisi ke `CURE`, menetapkan `cureTarget` dan `cureDeadlineDay`.
   - Skenario Recovery: settlement tambahan dalam masa cure memenuhi target, status pulih menjadi `HEALTHY` (`CureResolved`).
3. **Cure Expiry & Bond Drawing:**
   - Masa cure habis tanpa pelunasan: bond ditarik (`BondDrawn`), status menjadi `BREACHED`.
   - Jika bond tidak cukup menutup shortfall: langsung bertransisi ke `STEP_IN`.
   - Jika breach terjadi 2 kali berturut-turut: langsung bertransisi ke `STEP_IN`.
4. **Transition to Residual:**
   - Jika `claimPaid >= totalClaim`: bertransisi ke `RESIDUAL`.
5. **Invariants:**
   - Fuzz test: `floor(d)` selalu monoton naik dan tidak pernah melebihi `totalClaim`.

#### ✅ Acceptance Criteria (DoD):
- [ ] File test baru `contracts/test/Covenant.t.sol` lolos 100% pada `forge test`.
- [ ] Mencakup event assertion untuk `CovenantEvaluated`, `CureStarted`, `CureResolved`, `BondDrawn`, dan `StepInTriggered`.
- [ ] Invariant covenant state transition terverifikasi.

> **Prompt Siap-Copy untuk AI Agent Dev 1:**
> ```text
> Buat file test baru contracts/test/Covenant.t.sol untuk menguji FitOutAgreement covenant engine secara mendalam:
> 1. Setup alur lengkap: DRAFT -> FUNDRAISING (deposit bond) -> BUILDING (approve milestones) -> OPERATING.
> 2. Test alur normal: settlement cukup menjaga status HEALTHY.
> 3. Test cure trigger: shortfall > tolerance mengubah status menjadi CURE dengan cureTarget dan cureDeadlineDay yang tepat.
> 4. Test cure resolution: pembayaran susulan mengembalikan status ke HEALTHY.
> 5. Test cure breach: cure expired menarik bond (BondDrawn) dan menguji transisi ke STEP_IN jika bond kurang atau breach count >= 2.
> 6. Test transisi RESIDUAL saat claimPaid >= totalClaim. Rujuk 05_SMART_CONTRACT_SPEC.md bagian 9.
> ```

---

### [ISSUE #14] [DEV-1] Smart Contract: Bond & Refund Lifecycle Tests
- **Assignee:** Dev 1 (Smart Contract Lead)
- **Labels:** `smart-contract`, `p0`, `foundry`
- **Terkait Dokumen:** `05_SMART_CONTRACT_SPEC.md` (Bagian 6, 13)

#### 🎯 Goal:
Membuat test suite komprehensif untuk siklus hidup dana jaminan (`bondAmount`) pada `FitOutAgreement.sol`, memastikan hak pengembalian dana tenant (`refundBond`) berfungsi aman dan invarian konservasi dana jaminan (`INV-08`) selalu terjaga.

#### 📝 Spesifikasi Pengujian:
1. **Refund Pasca-Gagal Fundraising (`FAILED_REFUND`):**
   - Tenant menyetor jaminan saat `FUNDRAISING`, deadline lewat tanpa start build -> call `failFundraising()`.
   - Tenant memanggil `refundBond()`: saldo token jaminan kembali 100% ke tenant.
2. **Refund Pasca-Batal Pembangunan (`ABORTED_REFUND`):**
   - Milestone pembangunan tidak selesai hingga build deadline -> call `abortBuild()`.
   - Tenant memanggil `refundBond()`: sisa jaminan kembali utuh ke tenant.
3. **Refund Pasca-Selesai Kontrak (`CLOSED`):**
   - Kontrak mencapai `RESIDUAL` lalu `close()`.
   - Tenant dapat menarik sisa bond yang belum pernah ditarik covenant.
4. **Access Control & Revert Protection:**
   - Bukan tenant memanggil `refundBond()` -> revert `Unauthorized`.
   - Memanggil `refundBond()` saat status masih `OPERATING` atau `BUILDING` -> revert `InvalidState`.
   - Memanggil `refundBond()` saat saldo 0 -> aman / no-op tanpa transfer revert.
5. **Invariant `INV-08`:**
   - Pastikan `bondBalance + bondDrawn + bondRefunded == bondDeposited` selalu `true` di setiap state.

#### ✅ Acceptance Criteria (DoD):
- [ ] File test `contracts/test/BondRefund.t.sol` dibuat dan passing 100%.
- [ ] Invariant `bondConservation()` teruji sebelum dan sesudah penarikan jaminan.
- [ ] Zero token leakage: token balance kontrak `FitOutAgreement` sesuai saldo internal.

> **Prompt Siap-Copy untuk AI Agent Dev 1:**
> ```text
> Buat file test baru contracts/test/BondRefund.t.sol yang berfokus menguji siklus hidup jaminan (escrow bond):
> 1. Test depositBond(): pastikan token ditarik dari tenant dan hanya bisa dideposit sekali.
> 2. Test refundBond() pada kondisi FAILED_REFUND, ABORTED_REFUND, dan CLOSED.
> 3. Negative test: revert Unauthorized jika caller bukan tenant, revert InvalidState jika dipanggil di status yang salah.
> 4. Invariant test INV-08: verifikasi bondConservation() selalu bernilai true pada setiap tahap. Rujuk 05_SMART_CONTRACT_SPEC.md bagian 6.
> ```

---

### [ISSUE #15] [DEV-1] Smart Contract: ExcusedDays & Liquidation Tests
- **Assignee:** Dev 1 (Smart Contract Lead)
- **Labels:** `smart-contract`, `p1`, `covenant`
- **Terkait Dokumen:** `05_SMART_CONTRACT_SPEC.md` (Bagian 5.5, 9, 13)

#### 🎯 Goal:
Menguji fungsi force majeure / hari bebas kewajiban (`markExcused`) oleh Arbiter dan jalur likuidasi akhir (`startLiquidation` -> `finalizeLiquidation`) saat terjadi default ruko di status `STEP_IN`.

#### 📝 Spesifikasi Pengujian:
1. **Fitur Excused Days (`markExcused`):**
   - Arbiter menandai rentang hari izin yang sah: `excusedDays` bertambah, `logicalDays()` berkurang proporsional.
   - Menguji bahwa floor tertunda atau lebih rendah saat ada excused days.
   - Negative test: non-Arbiter memanggil -> revert `Unauthorized`.
   - Boundary test: rentang hari melebihi batas `maxExcusedDays` -> revert `ExcusedDaysExceeded`.
   - Boundary test: `endDay > lastDayId + 7` atau `endDay < startDay` -> revert `InvalidExcusedRange`.
2. **Alur Likuidasi Penuh:**
   - State transition dari `STEP_IN` -> `LIQUIDATING` via `startLiquidation()`.
   - Arbiter memanggil `finalizeLiquidation()`: memicu `writeOffRemaining()` pada kedua vault (Senior dan Junior) dan bertransisi ke status `CLOSED`.
   - Negative test: non-Arbiter mencoba memanggil likuidasi -> revert `Unauthorized`.
   - Status non-STEP_IN mencoba likuidasi -> revert `InvalidState`.

#### ✅ Acceptance Criteria (DoD):
- [ ] File test `contracts/test/ExcusedDaysAndLiquidation.t.sol` lulus 100%.
- [ ] Verifikasi write-off pada `seniorVault` dan `juniorVault` terbukti menurunkan `principalOutstanding` menjadi 0.
- [ ] Batas maksimum `maxExcusedDays` tidak dapat ditembus.

> **Prompt Siap-Copy untuk AI Agent Dev 1:**
> ```text
> Buat file test contracts/test/ExcusedDaysAndLiquidation.t.sol:
> 1. Test markExcused(): uji efek penambahan hari dispensasi terhadap perhitungan logicalDays() dan floor(), verifikasi revert Unauthorized jika caller bukan arbiter, dan revert ExcusedDaysExceeded jika akumulasi melebihi batas.
> 2. Test likuidasi: dari state STEP_IN, arbiter menjalankan startLiquidation(), lalu finalizeLiquidation(). Pastikan ITrancheVault.writeOffRemaining() dipanggil pada senior & junior vault, dan status berakhir di CLOSED. Rujuk 05_SMART_CONTRACT_SPEC.md bagian 5.5 & 9.
> ```

---

### [ISSUE #16] [DEV-1] Smart Contract: Fix safeApprove Deprecation & Access Control Hardening
- **Assignee:** Dev 1 (Smart Contract Lead)
- **Labels:** `smart-contract`, `bug`, `p0`
- **Terkait Dokumen:** `05_SMART_CONTRACT_SPEC.md` (Bagian 6, 7, 8)

#### 🎯 Goal:
Memperbaiki bug penggunaan fungsi OpenZeppelin v5 yang deprecated (`safeApprove`), serta memperketat access control guard pada fungsi transisi state eksternal di `FitOutAgreement.sol`.

#### 📝 Spesifikasi Perbaikan:
1. **Perbaikan `safeApprove`:**
   - Pada `FitOutAgreement.sol` baris 141 (`asset.safeApprove(router, draw)`): ganti dengan `forceApprove(router, draw)` dari library OpenZeppelin `SafeERC20`.
   - Pada `WaterfallRouter.sol` baris 241-250 (`safeApprove(vault, ...)`): gunakan `forceApprove` atau optimasi direct transfer.
2. **Access Control Hardening di `FitOutAgreement.sol`:**
   - Evaluasi caller guard pada `startBuild()`: batasi hanya landlord atau tenant.
   - Evaluasi caller guard pada `abortBuild()`: batasi hanya landlord, tenant, atau arbiter.
   - Evaluasi caller guard pada `startOperating()`: batasi hanya landlord atau contractor setelah semua milestone selesai.
   - Evaluasi `failFundraising()`: batasi hanya landlord atau tenant.
3. **Negative Test Suite:**
   - Tambahkan test unauthorized access untuk setiap fungsi transisi state publik di `FitOutAgreement.t.sol`.

#### ✅ Acceptance Criteria (DoD):
- [ ] Tidak ada lagi pemanggilan `safeApprove` yang deprecated di seluruh codebase contracts.
- [ ] Semua fungsi transisi state memiliki pengecekan `msg.sender` yang eksplisit.
- [ ] Test revert `Unauthorized` untuk address acak lolos 100%.

> **Prompt Siap-Copy untuk AI Agent Dev 1:**
> ```text
> Lakukan refactoring & hardening pada contracts/src/FitOutAgreement.sol dan WaterfallRouter.sol:
> 1. Ganti pemanggilan asset.safeApprove() dengan forceApprove() sesuai standar OpenZeppelin v5.
> 2. Tambahkan explicit caller authorization check pada startBuild(), abortBuild(), startOperating(), dan failFundraising() agar tidak bisa dipanggil oleh sembarang alamat pihak ketiga.
> 3. Update FitOutAgreement.t.sol dengan test case negatif yang memverifikasi setiap fungsi di atas revert Unauthorized jika dipanggil oleh unauthorized caller.
> ```

---

### [ISSUE #17] [DEV-1] Smart Contract: Integration Smoke Test (DeployAndSeed)
- **Assignee:** Dev 1 (Smart Contract Lead)
- **Labels:** `smart-contract`, `devops`, `automation`, `p1`
- **Terkait Dokumen:** `06_MVP_BUILD_PLAN.md` (Bagian 3), `10_SPRINT_48H_EXECUTION_BOARD.md` (Issue #08)

#### 🎯 Goal:
Membuat integration smoke test berbasis Foundry untuk memastikan script `DeployAndSeed.s.sol` dapat dieksekusi end-to-end tanpa error, menghasilkan konfigurasi alamat yang valid, dan siap digunakan oleh Dev-2 (Frontend) & Dev-3 (Attestor).

#### 📝 Spesifikasi Pengujian:
1. **Eksekusi Script Deploy:**
   - Jalankan `DeployAndSeed.s.sol` dalam lingkungan test Foundry (`Integration.t.sol`).
2. **Verifikasi Output Deployment:**
   - Alamat `MockIDR`, `SeniorVault`, `JuniorVault`, `FitOutAgreement`, dan `WaterfallRouter` ter-cross link dengan benar (`router.agreement()`, `vault.router()`, `agreement.router()`).
   - Saldo mint awal dan allowlist terkonfigurasi.
   - Agreement berhasil masuk ke status `OPERATING` (milestone 0, 1, 2 diapprove dan dana dideploy).
   - Minimal 1 transaksi settlement perdana berhasil dieksekusi oleh attestor dan diverifikasi router.
3. **Automasi Tooling:**
   - Tambahkan target command di `contracts/foundry.toml` atau file helper script/Makefile untuk kemudahan verifikasi cepat (`forge test --match-contract IntegrationSmokeTest`).

#### ✅ Acceptance Criteria (DoD):
- [ ] File test `contracts/test/Integration.t.sol` lulus 100%.
- [ ] Script `DeployAndSeed.s.sol` terbukti idempotent dan siap deploy ke Anvil lokal atau Sepolia testnet.
- [ ] Environment variabel dan konfigurasi terdokumentasi jelas di `contracts/README.md`.

> **Prompt Siap-Copy untuk AI Agent Dev 1:**
> ```text
> Buat file test integrasi contracts/test/Integration.t.sol:
> Jalankan pipeline DeployAndSeed.s.sol dari awal hingga akhir di dalam test Foundry.
> Verifikasi bahwa seluruh kontrak terhubung sempurna (circular reference teratasi via setRouter), state agreement berada di OPERATING, settlement awal berhasil dijalankan, dan nilai klaim tercatat dengan presisi. Tambahkan dokumentasi petunjuk deploy lokal di contracts/README.md.
> ```

