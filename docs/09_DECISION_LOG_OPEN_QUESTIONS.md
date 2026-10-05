# 09 — Decision Log dan Open Questions

**Versi:** 0.1 · 5 Okt 2026 · Bergantung pada: `00`–`08` · Dipakai oleh: semua dokumen

> Sumber kebenaran untuk keputusan desain dan pertanyaan terbuka. Aturan **NN-10**: setiap perubahan parameter default dan setiap penyimpangan implementasi dari `05` dicatat di sini. Dokumen ini ditulis dari isi `00`–`08`; entri berstatus **Diusulkan** belum disetujui tim.

---

## 1. Cara memakai

- **Status keputusan:** *Diterima* (sudah tertulis di dokumen v0.1), *Tentatif* (menunggu OQ), *Diusulkan* (muncul saat menyusun `06`–`08`; perlu persetujuan), *Digantikan*.
- Perubahan keputusan: jangan menghapus baris; ubah status menjadi *Digantikan* dan tambahkan baris baru yang merujuknya.
- Pertanyaan terbuka ditutup dengan menambahkan keputusan `D-xx` dan mengisi kolom "Status".

**Prefix tambahan yang dipakai `06`–`09`** (lengkapi konvensi `00`, bagian 6): `S` skenario demo (S1–S8), `SF-` temuan simulasi, `QA-` pertanyaan juri, `E-` uji ekonomi, `DS-` sumber data, `DT-` tugas data, `IC-` inkonsistensi antar dokumen.

## 2. Decision log

| ID | Tanggal | Keputusan | Alasan | Alternatif ditolak | Status | Dokumen |
|---|---|---|---|---|---|---|
| D-01 | 5 Okt 2026 | Arsitektur hybrid: rupiah dan penegakan hukum di dunia berizin; onchain = ledger + mesin waterfall + covenant | UU Mata Uang; PJP berizin (NN-01, DC-01, DC-02) | Semua onchain dengan stablecoin | Diterima | 03, 04 |
| D-02 | 5 Okt 2026 | Total take-rate dibatasi coverage check (margin operasional ≥ 2 × take-rate); default 20% | Spesifikasi awal (60%) rugi by design (NN-03) | Take-rate untuk mempercepat pelunasan | Diterima | 02, 05 |
| D-03 | 5 Okt 2026 | Covenant = payment floor + tangga eskalasi (cure → bond draw → step-in); bukan slashing otomatis karena omzet | Omzet tunai tak terlihat; hindari false positive (NN-04) | Revenue floor + slashing otomatis | Diterima (kalibrasi: OQ-09) | 02, 05 |
| D-04 | 5 Okt 2026 | Waterfall dua fase; investor dibayar sekuensial senior → junior; kelebihan tidak ditarik (tetap di tenant) | Sederhana dan dapat diverifikasi | Pro-rata antar tranche | Diterima | 02, 05 |
| D-05 | 5 Okt 2026 | Hanya Mode A diimplementasikan; Mode B = antarmuka (stub `LedgerPayoutAdapter`) | Waktu hackathon; arah regulasi jelas | Mode B penuh | Diterima | 04, 05 |
| D-06 | 5 Okt 2026 | Tenant retain tidak pernah onchain; di Mode A attestor menyetor hanya bagian non-tenant (`pull`) | DC-01 | Seluruh omzet melewati kontrak | Diterima | 04, 05 |
| D-07 | 5 Okt 2026 | Waktu: `block.timestamp` untuk fundraising dan build; `dayId` dari attestation untuk OPERATING dan seterusnya | Belum ada attestation sebelum OPERATING; demo dapat dipercepat | Satu jam untuk semua fase | Diterima | 04, 05 |
| D-08 | 5 Okt 2026 | Batas lompatan jam logis `MAX_GAP` = 60 hari (contoh di `05`) | Cegah attestor melompatkan jam ekstrem | Tanpa batas | Diterima (nilai final: tinjau) | 05 |
| D-09 | 5 Okt 2026 | Satu attestor per agreement, address terkunci setelah aktif | Mengurangi permukaan serangan; trust assumption diakui | Multi-attestor sejak MVP | Diterima | 04, 05 |
| D-10 | 5 Okt 2026 | `TrancheVault` ERC-4626 dengan akuntansi internal (pokok dulu), transfer share hanya allowlist, tanpa AMM/pool | Cegah inflasi share; DC-03, NN-05 | Share bebas transfer | Diterima | 05 |
| D-11 | 5 Okt 2026 | Nama field `fundraiseDeadline` (bukan `minRaiseDeadline`) | `05` menyatakan berlaku | — | Diterima | 04, 05 |
| D-12 | 5 Okt 2026 | Masuk BUILDING hanya bila **kedua vault terisi penuh** dan bond tersetor sebelum `fundraiseDeadline` | Sesuai `05`, bagian 4.1 | Min raise parsial (OQ-03) | Tentatif | 04, 05 |
| D-13 | 5 Okt 2026 | `maxExcusedDays` berlaku total sepanjang kontrak (penyederhanaan dari "per 12 bulan") | Lebih sederhana di kontrak | Jendela bergulir 12 bulan | Diterima | 02, 05 |
| D-14 | 5 Okt 2026 | Jika ada celah multi-bulan, uji bulanan hanya menguji bulan terakhir | Hindari loop tak terbatas | Uji semua bulan terlewat | Diterima | 05 |
| D-15 | 5 Okt 2026 | Tanpa proxy upgrade dan tanpa subgraph di MVP; frontend membaca event langsung | Kesederhanaan dan keamanan | Upgradeable proxy; subgraph | Diterima | 04, 05 |
| D-16 | 5 Okt 2026 | Chain default Sepolia; token `MockIDR` 6 desimal tanpa klaim stablecoin riil | Default hackathon Ethereum | Chain/token lain | Tentatif (OQ-01, OQ-02) | 04 |
| D-17 | 5 Okt 2026 | Simulator TypeScript sebagai modul bersama UI dan tes; wajib meniru `periodDays` kontrak | Paritas hasil | Simulator terpisah | Diterima | 02, 06 |
| D-18 | 5 Okt 2026 | Aturan narasi `01`, bagian 7 berlaku untuk semua slide, README, UI | NN-02 | — | Diterima | 01 |
| D-19 | 5 Okt 2026 | `pause()` hanya menolak `settle` dan deposit; tidak menahan penarikan dan tidak memberi admin akses dana | INV-10 | Pause menyeluruh | Diterima | 05 |
| D-20 | 5 Okt 2026 | Covenant, bond, dan milestone boleh digabung dalam `FitOutAgreement`; router boleh digabung bila waktu mepet, antarmuka publik dan event tetap | Waktu build | Modul terpisah (`CovenantModule`, `BondEscrow`, `MilestoneEscrow` pada diagram `04`) | Diterima | 04, 05 |
| D-21 | 5 Okt 2026 | **Usulan:** bila `claimPaidTotal ≥ totalClaim` setelah bond draw atau pembayaran apa pun, fase menjadi RESIDUAL **mendahului** STEP_IN walau `breachCount ≥ 2` | SF-02: STEP_IN terpicu padahal klaim lunas | Pertahankan aturan apa adanya | **Diusulkan** | 05 (5.6), 07 |
| D-22 | 5 Okt 2026 | Empat dashboard peran = Investor, Pemilik, Tenant, Kontraktor/Inspektur; attestor dan arbiter dioperasikan lewat Panel skenario | Selaras tabel aktor `04` | Dashboard terpisah untuk attestor/arbiter | Diusulkan | 04, 06 |
| D-23 | 5 Okt 2026 | Granularitas default demo: `periodDays` = 30 (satu transaksi per bulan logis); mode detail 1 hari hanya sebentar | Jumlah transaksi dan waktu demo | Settlement harian penuh | Diusulkan | 06, 07 |
| D-24 | 5 Okt 2026 | **Usulan:** `startDay` pada settlement pertama = `dayId − periodDays + 1` (awal periode) | Agar `d` dan `monthIndex` konsisten saat periode > 1 hari (IC-11) | `startDay = dayId` | **Diusulkan** | 05 (8.2) |
| D-25 | 5 Okt 2026 | Tidak ada field `nonce` pada Settlement; replay dicegah domain EIP-712 + `dayId` unik | `05`, bagian 8.1 | Menambah nonce | Diusulkan | 04, 05, 06 |

## 3. Parameter baseline dan log perubahan

### 3.1 Baseline v0.1 (sumber: `02`, bagian 2; `05`, bagian 3)

| Parameter | Nilai | Parameter | Nilai |
|---|---|---|---|
| Anggaran fit-out (B) | Rp150 jt | Take-rate investor (i) | 1.500 bps |
| Pokok senior / junior | Rp120 jt / Rp30 jt | Take-rate pemilik Fase A (l) | 500 bps |
| Multiple senior / junior | 12.500 / 14.000 bps | Royalti Fase B (r) / turnover Fase B | 200 / 500 bps |
| Klaim senior / junior / total | Rp150 jt / Rp42 jt / Rp192 jt | Tenor target / maksimum | 540 / 720 hari |
| Rasio floor (f) | 6.000 bps | Toleransi (ε) | 100 bps dari klaim |
| Masa cure | 7 hari logis | Jendela kesehatan (W) | 14 hari logis |
| Bond | Rp15 jt (10% B) | Maks excused | 30 hari (total) |
| `leaseEndDay` | ≥ `maxTenorDays` + 360 | `milestoneBps` | [3000, 4000, 3000] |
| `assumedCostRatioBps` | 6.000 | Coverage minimum | 20.000 (2,0×) |
| `MAX_GAP` | 60 hari logis | `healthFloorDaily` | `[ISI]` (OQ-08) |

### 3.2 Log perubahan (NN-10)

| Tanggal | Parameter | Dari | Ke | Alasan/data (rujuk `08`) | Keputusan | Dokumen diperbarui |
|---|---|---|---|---|---|---|
| — | — | — | — | Belum ada perubahan | — | — |

## 4. Inkonsistensi antar dokumen (IC)

| ID | Lokasi | Isi | Penyelesaian sementara | Status |
|---|---|---|---|---|
| IC-01 | `04` §6.2 vs `05` §4.1 | `04`: BUILDING bila "min raise" tercapai; `05`: kedua vault terisi penuh | Ikuti `05` (D-12); OQ-03 | Dibuka |
| IC-02 | `04` vs `05` §2 | `minRaiseDeadline` vs `fundraiseDeadline` | Ikuti `05` (D-11) | Diselesaikan |
| IC-03 | `05` §5.7 vs §12 | Ukuran ring buffer ≤ 32 vs ≤ 30 | Pakai konstanta 32; samakan §12 | Dibuka |
| IC-04 | `04` §8.2, §9 vs `05` §8.1 | `04` menyebut `nonce`; struct Settlement `05` tidak memilikinya | Ikuti `05`, hapus nonce (D-25) | Dibuka |
| IC-05 | `04` §6.2, §6.4 vs `05` §6 | `createAgreement`, `drawBond()` vs `initialize`, tarik bond internal pada `settle`/`evaluate` | Ikuti `05`; samakan istilah | Dibuka |
| IC-06 | `02` §7.1 vs `05` §5.4–5.6 | Stress test `02` berjalan 24 bulan tanpa step-in dini; covenant `05` memicu STEP_IN dini untuk tenant lambat | Tambahkan catatan di `02` 7.1; hasil di `07` bagian 4 (SF-01); OQ-09 | Dibuka |
| IC-07 | `02` §4 vs `05` §3 | `N_excused` per 12 bulan vs total sepanjang kontrak | Ikuti `05` (D-13) | Diselesaikan |
| IC-08 | `05` T-26 vs simulasi `07` | T-26 mengharapkan "lunas bulan 24 dengan bond ≈ 12,8 jt"; simulasi: lunas hari 780 dengan bond ≈ 5,33 jt (periode 30 hari) atau STEP_IN walau lunas (periode 1/7 hari) | Perbarui T-26; D-21; T-33, T-34 | Dibuka |
| IC-09 | `03` F-06 | Batas Rp10 miliar per 12 bulan berasal dari aturan lama; belum dicek untuk POJK 17/2025 | Jangan dikutip di slide sebelum verifikasi; OQ-13 | Dibuka |
| IC-10 | `04` §3 vs `05` §1 | Diagram menampilkan `CovenantModule`, `BondEscrow`, `MilestoneEscrow` terpisah; `05` mengizinkan penggabungan | D-20 | Diselesaikan |
| IC-11 | `05` §8.2 | "set `startDay` bila settlement pertama" tidak menentukan nilai saat `periodDays` > 1 | D-24 (diusulkan); OQ-10 | Dibuka |
| IC-12 | `04` §8.1, `05` §3 | `healthFloorDaily` masih `[ISI]` | Usulan awal di OQ-08 | Dibuka |

## 5. Open questions (OQ)

Kolom **Memblokir** menyebut pekerjaan yang tidak bisa difinalkan sebelum pertanyaan dijawab. Pemilik dan batas waktu diisi tim (`[ISI]`).

| ID | Pertanyaan | Konteks | Opsi | Default sementara | Memblokir | Status |
|---|---|---|---|---|---|---|
| OQ-01 | Apa syarat hackathon (chain wajib, track, bounty, format submisi, tanggal)? | `00` header; `04` §10 | Sepolia / chain lain sesuai syarat | Sepolia | Deploy, `06` §9 | Terbuka |
| OQ-02 | Token dan stack pendukung: tetap `MockIDR` + wagmi/viem + Next.js, atau ada syarat integrasi tertentu? | `04` §10 | Tetap / sesuai syarat | Tetap | Skrip deploy, frontend | Terbuka |
| OQ-03 | Syarat masuk BUILDING: kedua vault penuh, atau min raise parsial? | IC-01 | Penuh (default `05`) / min raise dengan ukuran proyek disesuaikan | Penuh (D-12) | `startBuild`, T-03 | Terbuka |
| OQ-04 | Siapa memegang peran attestor, arbiter, inspektur, dan relayer di demo (EOA tim, multisig)? | `04` bagian 2 | EOA terpisah per peran / satu EOA | EOA terpisah, kunci demo | Skrip seed, `06` §6 | Terbuka |
| OQ-05 | Klasifikasi hukum klaim berbasis omzet dengan floor: efek, pendanaan bersama, atau lainnya? | `03` F-07, tanya 1 | Opini konsultan | Testnet-only (DC-07) | Pilot, jalur J2/J3 | Terbuka (hukum) |
| OQ-06 | Apakah sewa dasar kecil dimodelkan selain turnover rent? | `02` §9.3 | Tidak (MVP) / parameter opsional | Tidak | Simulator, coverage | Terbuka |
| OQ-07 | Multiple tetap vs batas return berbasis waktu (APR akrual)? | `02` §9.3; R-08 | Tetap / berbasis waktu / hibrida | Tetap | Parameter, QA-08 | Terbuka |
| OQ-08 | Nilai `healthFloorDaily` untuk sinyal WARNING | IC-12 | Mis. 60% × omzet harian base (≈ Rp1,42 jt/hari; usulan awal, bukan data) / ditentukan setelah `08` | Usulan awal | FR-C10 | Terbuka |
| OQ-09 | Kebijakan eskalasi: apakah Floor dan aturan `breachCount ≥ 2` perlu dikalibrasi agar tenant lambat tidak di-step-in terlalu dini? | SF-01, R-25 | (a) pertahankan + D-21 + label di pitch; (b) grace period atau ramp Floor lebih lambat; (c) ε lebih besar; (d) STEP_IN hanya bila bond habis atau ≥ 3 breach; (e) modelkan re-tenanting | (a) | Parameter final, `07` §4 | Terbuka (prioritas tinggi) |
| OQ-10 | Definisi `startDay` bila settlement pertama berperiode > 1 hari | IC-11 | Awal periode / `dayId` | Awal periode (D-24) | T-09, T-10, T-11 | Terbuka |
| OQ-11 | Saat ABORTED_REFUND: dari vault mana milestone dibayar (pro-rata senior/junior atau junior dulu) dan bagaimana kerugian dana yang sudah dicairkan dibagi? | `05` §4.1, §7.1 | Pro-rata / junior dulu | Pro-rata (konfirmasi dengan `05`) | T-05, T-17 | Terbuka |
| OQ-12 | Bolehkah pemilik membeli share senior? | R-14; `05` edge 15 | Larang (landlord tidak di allowlist senior) / izinkan + pengungkapan | Larang | Allowlist, T-37 | Terbuka |
| OQ-13 | Batas penghimpunan dan jenis instrumen pada POJK 17/2025 (urun dana) | `03` F-06, IC-09 | Cek teks primer | Tidak dikutip | Jalur J3 | Terbuka (hukum) |
| OQ-14 | Eksekusi step-in jika tenant menolak (fidusia, hak atas interior, penggantian tenant) | `03` tanya 6–8; R-11 | Konsultan | Off-chain, tak dijanjikan | Recovery A-15 | Terbuka (hukum) |
| OQ-15 | Perpajakan (PPh sewa, bagi hasil, pajak daerah) | `03` tanya 11; R-22 | Konsultan pajak | Tidak dimodelkan | Pilot | Terbuka (hukum) |
| OQ-16 | Nama final proyek ("FitOut Vault" = working title), anggota tim, track, tanggal hackathon | `00` header | — | Working title | Slide, README | Terbuka |
| OQ-17 | Penyimpanan hash bukti onchain vs hak hapus data pribadi | `03` F-10; R-20 | Hash non-identitas saja / mekanisme lain | Hash saja, tanpa PII | Pilot | Terbuka (hukum) |

## 6. Tindak lanjut pada dokumen lain (usulan; belum diterapkan)

| Dokumen | Perubahan | Terkait |
|---|---|---|
| `05` §5.6 | Tambahkan aturan "lunas mendahului STEP_IN" | D-21, T-33 |
| `05` §8.2 | Tentukan nilai `startDay` pada settlement pertama | D-24 |
| `05` §5.7 / §12 | Samakan ukuran ring buffer | IC-03 |
| `05` §13.3 (T-26, T-27, T-30) | Ganti hasil harapan dengan angka `07` bagian 4 | IC-08 |
| `04` §6.2, §8.2, §9 | Samakan nama fungsi/field (`initialize`, `fundraiseDeadline`) dan hapus `nonce` | IC-02, IC-04, IC-05 |
| `02` §7.1 | Tambahkan catatan bahwa tabel berasumsi tanpa step-in dini | IC-06 |
| `00` §6 | Tambahkan prefix `S`, `SF-`, `QA-`, `E-`, `DS-`, `DT-`, `IC-` | bagian 1 |

## 7. Register placeholder `[ISI]`

| Dokumen | Item |
|---|---|
| `00` | Tim, track, tanggal hackathon |
| `05` | `healthFloorDaily` |
| `06` | Peran tim, ruko referensi, alamat dan hash deployment (bagian 9) |
| `08` | Pelaksana dan tanggal tugas data; luas dan lantai ruko referensi |
| `09` | Pemilik dan batas waktu setiap OQ |

## 8. Jadwal tinjauan
- **Sebelum jam 2 hackathon:** OQ-01, OQ-02, OQ-04, OQ-16.
- **Sebelum jam 10:** OQ-03, OQ-10, OQ-11; setujui atau tolak D-21, D-24, D-25.
- **Sebelum jam 36 (freeze):** OQ-09 (kebijakan eskalasi final), OQ-08, OQ-12.
- **Pascahackathon:** OQ-05, OQ-13 s.d. OQ-15, OQ-17 bersama konsultan hukum (`03`, bagian 6).
