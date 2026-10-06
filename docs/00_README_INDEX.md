# FitOut Vault — Paket Dokumen Konteks (working title)

**Status:** Draft v0.1 · 5 Oktober 2026
**Konteks:** Persiapan Ethereum Hackathon Jakarta · Pilot geografis: Jember, Jawa Timur
**Tim / track / tanggal hackathon:** `[ISI]` (belum diketahui saat dokumen ini ditulis)

> Paket ini adalah blueprint pengembangan. Semua angka ekonomi adalah **asumsi berlabel** (lihat `02_ECONOMIC_MODEL.md`, bagian Assumptions Register), bukan fakta pasar. Semua pernyataan regulasi adalah **peta awal**, bukan nasihat hukum (lihat `03_REGULATORY_LEGAL.md`).

---

## 1. Ringkasan satu halaman (boleh di-paste ke AI assistant sebagai konteks)

**Masalah.** Banyak ruko di kota seperti Jember kosong bertahun-tahun karena kondisi fisiknya buruk (tidak direnovasi) sementara harga sewa tetap tinggi. Calon tenant kecil tidak punya modal renovasi dan sulit mendapat kredit murah. Pemilik ruko enggan merenovasi sendiri tanpa kepastian tenant. Investor tidak punya cara yang transparan untuk ikut mendanai renovasi satu unit usaha kecil.

**Solusi.** Protokol pembiayaan renovasi (fit-out) komersial berbasis **revenue-based financing (RBF)** dengan tiga ide inti:
1. **Pendanaan bertingkat (senior/junior tranche).** Investor eksternal di tranche senior; pemilik ruko (yang paling diuntungkan dari aset yang direnovasi) di tranche junior sebagai penyerap kerugian pertama.
2. **Waterfall pembayaran yang dapat diverifikasi.** Sebagian kecil omzet QRIS (take-rate total sekitar 20%) dibagi otomatis ke investor dan pemilik ruko menurut aturan kontrak yang transparan, dihitung onchain.
3. **Covenant berbasis pembayaran minimum, bukan omzet.** Karena omzet tunai tidak terlihat, kontrak menjaga *payment floor* (jadwal pembayaran minimum) dengan tangga eskalasi: peringatan, masa perbaikan (cure), penarikan bond, lalu step-in.

**Arsitektur hybrid.** Rel pembayaran tetap **rupiah via QRIS dari PJP berizin** (escrow). Lapisan onchain berfungsi sebagai **ledger dan mesin waterfall yang bisa diverifikasi** semua pihak. Untuk hackathon, rel pembayaran **disimulasikan** dengan mock stablecoin dan mock attestor; ini harus dinyatakan jelas.

**Yang BUKAN proyek ini.** Bukan sekuritisasi (kecuali ada pooling + tranching formal dan SPV), bukan pengganti rupiah sebagai alat bayar, bukan pasar sekunder terbuka (di luar MVP), bukan "tanpa pengadilan/polisi", bukan "siap dipakai".

**MVP hackathon (24–48 jam).** Vault senior/junior (ERC-4626, bertenor), router waterfall, modul covenant + bond, mock attestor bertanda tangan, dashboard 4 peran, dan panel skenario (normal / tenant curang / default).

---

## 2. Peta dokumen

| # | File | Isi | Pembaca utama |
|---|---|---|---|
| 00 | `00_README_INDEX.md` | Ringkasan, peta dokumen, aturan tak boleh dilanggar, glosarium | Semua |
| 01 | `01_PRODUCT_CONTEXT.md` | Masalah, stakeholder, nilai tambah, positioning, aturan narasi | Produk, pitch |
| 02 | `02_ECONOMIC_MODEL.md` | Parameter, rumus, base case, stress test, pricing risiko, asumsi | Ekonomi, kontrak, simulator |
| 03 | `03_REGULATORY_LEGAL.md` | Temuan regulasi, batasan desain, jalur pilot, daftar tanya konsultan | Produk, hukum |
| 04 | `04_SYSTEM_ARCHITECTURE.md` | Lapisan, aktor, alur, model kepercayaan, model data, mode A/B | Semua teknis |
| 05 | `05_SMART_CONTRACT_SPEC.md` | State machine, fungsi, event, invariant, keamanan, rencana tes | Smart contract dev |
| 06 | `06_MVP_BUILD_PLAN.md` | Scope P0/P1/P2, frontend, simulator, rencana 48 jam, demo | Semua |
| 07 | `07_RISK_STRESS_TEST_QA.md` | Risk register, matriks tes skenario, Q&A juri, slide batasan | Semua, pitch |
| 08 | `08_DATA_VALIDATION_PLAN.md` | Cara mengumpulkan data publik tanpa relasi/wawancara | Riset |
| 09 | `09_DECISION_LOG_OPEN_QUESTIONS.md` | Keputusan desain (ADR ringkas) dan pertanyaan terbuka | Semua |
| 10 | `10_SPRINT_48H_EXECUTION_BOARD.md` | Rencana sprint 48 jam, token desain anti AI-slop, dan 12 GitHub issues siap-copy | Semua / Tim |
| 11 | `11_DEV2_ROLE_SEPARATION_ISSUES.md` | Arsitektur pemisahan portal 5 peran & spesifikasi Issue #20-#25 | Frontend, Fullstack |
| 12 | `12_PRODUCT_BRAINSTORMING_AND_FAQ.md` | Rangkuman brainstorming: alur kasir/QRIS, uang tunai, & opsi branding | Produk, Bisnis, Semua |
| 13 | `13_SECURITY_AND_ECONOMIC_MITIGATIONS.md` | Mitigasi keamanan & ekonomi: solusi 4 celah kritis (Bond, Step-In, Oracle, QR Bypass) | Keamanan, Kontrak, Tim |

**Urutan baca.**
- Smart contract dev: 00 → 04 → 02 (bagian formula) → 05 → 07 (matriks tes) → 06.
- Frontend dev: 00 → 04 → 06 → 05 (bagian event dan fungsi baca).
- Pitch/produk: 00 → 01 → 07 (Q&A dan slide batasan) → 03 → 06 (demo script).
- Riset/data: 00 → 08 → 02 (Assumptions Register).

---

## 3. Aturan tak boleh dilanggar (Non-negotiables)

| ID | Aturan | Alasan ringkas |
|---|---|---|
| NN-01 | Pembayaran pelanggan ke tenant tetap **rupiah via QRIS dari PJP berizin**. Onchain bukan alat bayar. | UU Mata Uang mewajibkan rupiah; kripto bukan alat bayar sah (lihat 03). |
| NN-02 | Jangan memakai kata "sekuritisasi", "siap dipakai", "tanpa pengadilan/polisi", "zero-capex". | Overclaim; mudah dibongkar juri dan regulator. |
| NN-03 | Total take-rate dibatasi oleh **coverage check** (margin tenant ≥ 2× take-rate). | Mencegah tenant rugi by design (lihat 02). |
| NN-04 | Covenant memakai **payment floor + tangga eskalasi**, bukan slashing otomatis karena omzet sepi. | Menghindari false positive terhadap tenant jujur (lihat 02, 05). |
| NN-05 | Pasar sekunder **di luar MVP**. Transfer share hanya antar address allowlist. | Risiko regulasi + waktu build + risiko bank-run (lihat 03, 05). |
| NN-06 | Semua angka ekonomi berlabel "asumsi, akan divalidasi di pilot". | Kejujuran data (lihat 02, 08). |
| NN-07 | Tidak ada PII onchain. Hanya hash bukti. | Pelindungan data pribadi (lihat 03, 04). |
| NN-08 | Semua fungsi privileged terdokumentasi di matriks akses (05) dan trust assumption diakui di pitch (07). | Transparansi terhadap risiko sentralisasi. |
| NN-09 | Demo menyatakan jelas: testnet, mock token, mock attestor. | Mencegah kesan produk produksi. |
| NN-10 | Setiap perubahan parameter default dicatat di `09_DECISION_LOG_OPEN_QUESTIONS.md`. | Konsistensi antar dokumen dan kode. |

---

## 4. Status validasi saat ini

| Area | Status | Catatan |
|---|---|---|
| Konsep dan struktur | Sudah dibedah (brainstorm + stress test) | Lihat 01, 02 |
| Regulasi Indonesia | Pencarian awal selesai (5 Okt 2026) | Belum ada opini hukum; lihat 03 |
| Data omzet nyata | **Tidak ada** | Pakai proxy data publik, lihat 08 |
| Data harga sewa/renovasi Jember | Belum dikumpulkan | Rencana di 08 |
| Pilihan chain/token/aturan hackathon | Belum diputuskan | Lihat 09 (OQ-01, OQ-02) |
| Implementasi | Belum dimulai | Lihat 06 |

---

## 5. Glosarium

| Istilah | Arti dalam proyek ini |
|---|---|
| **Fit-out** | Renovasi interior komersial agar ruang siap beroperasi (partisi, plafon, listrik, AC, perabot, mesin). |
| **RBF (Revenue-Based Financing)** | Pendanaan yang dibayar kembali dari persentase pendapatan sampai batas total tertentu (multiple). |
| **Take-rate** | Persentase omzet tercatat yang dialihkan ke pihak non-tenant (investor + pemilik). |
| **Recorded revenue** | Omzet yang tercatat lewat rel QRIS escrow. Omzet tunai di luar sistem **tidak** tercatat. |
| **Senior tranche** | Tranche pendanaan yang dibayar lebih dulu dan menanggung kerugian paling akhir. |
| **Junior tranche** | Tranche penyerap kerugian pertama; imbal hasil lebih tinggi. Diisi pemilik ruko. |
| **Waterfall** | Aturan urutan pembagian pembayaran antar pihak. |
| **Payment floor** | Jadwal pembayaran kumulatif minimum ke investor, dipakai untuk uji covenant. |
| **Covenant** | Syarat kinerja dalam kontrak; pelanggaran memicu eskalasi. |
| **Cure period** | Masa tenant memperbaiki kekurangan sebelum bond ditarik. |
| **Bond (staking bond)** | Uang jaminan tenant di escrow untuk menutup kekurangan pembayaran. |
| **Step-in** | Hak pihak pendana mengambil alih pengelolaan aset/ruang setelah wanprestasi. |
| **Attestor** | Pihak yang menandatangani laporan settlement harian (mock di hackathon, PJP/agen escrow di produksi). |
| **Logical day (dayId)** | Penanda hari dari attestation; dipakai sebagai jam logis kontrak sehingga demo bisa dipercepat. |
| **Mode A / Mode B** | A: dana onchain (mock stablecoin, demo). B: onchain hanya ledger entitlement, pembayaran rupiah oleh agen berizin (pilot). |
| **PJP** | Penyelenggara Jasa Pembayaran (berizin Bank Indonesia). |
| **SCF** | Securities Crowdfunding / layanan urun dana (diatur OJK). |
| **AKD** | Aset Keuangan Digital (istilah OJK; mencakup aset kripto dan AKD lainnya). |

---

## 6. Konvensi dokumen

- Bahasa: Indonesia; istilah teknis standar tetap dalam bahasa Inggris.
- Prefix ID: `A-` asumsi, `D-` keputusan, `OQ-` pertanyaan terbuka, `R-` risiko, `NN-` aturan tak boleh dilanggar, `FR-` kebutuhan fungsional, `INV-` invariant kontrak, `T-` tes, `F-` temuan regulasi, `DC-` batasan desain.
- Nilai uang contoh dalam Rupiah. Token onchain: `MockIDR` (6 desimal), tidak mengklaim integrasi stablecoin riil mana pun.
- Setiap dokumen mencantumkan versi di header; update versi saat ada perubahan substansial.
