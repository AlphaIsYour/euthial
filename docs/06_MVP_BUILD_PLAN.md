# 06 — MVP Scope & Build Plan

**Versi:** 0.1 · 5 Okt 2026 · Bergantung pada: `02`, `04`, `05` · Dipakai oleh: semua peran teknis dan pitch

> Tanggal dan aturan resmi hackathon belum diketahui. Rencana ini memakai durasi **48 jam** sebagai kasus utama dan menyediakan aturan pemotongan scope untuk 24 jam (bagian 9). Isi `[ISI]` setelah informasi hackathon tersedia (OQ-01).

---

## 1. Tujuan MVP

Membuktikan tiga hal kepada juri dalam demo ≤ 5 menit:
1. **Mekanisme jalan:** pendanaan bertingkat → renovasi per milestone → settlement → waterfall → covenant.
2. **Pertahanan nyata:** skenario "tenant curang" dan "tenant default" menunjukkan siapa menanggung kerugian dan berapa, secara terukur.
3. **Kejujuran desain:** batasan, trust assumption, dan jalur regulasi dinyatakan terbuka.

## 2. Scope: P0 / P1 / P2

| ID | Fitur | Prioritas | Referensi |
|---|---|---|---|
| FR-01 | `MockIDR` + script mint demo | P0 | 05 §1 |
| FR-02 | Pembuatan agreement dengan parameter default dan validasi (termasuk coverage check) | P0 | 05 §3 |
| FR-03 | Deposit senior (allowlisted) dan junior (landlord); bond tenant | P0 | 05 §7, §6 |
| FR-04 | `startBuild` dan state machine fase | P0 | 05 §4 |
| FR-05 | Milestone: submit, approve 2-dari-3, rilis dana ke kontraktor | P1 (fallback P0: satu rilis dengan satu persetujuan) | 05 §6 |
| FR-06 | Settlement bertanda tangan (EIP-712) dan waterfall Fase A | P0 | 05 §5, §8 |
| FR-07 | Transisi ke Fase B (residual) | P1 | 05 §5.2 |
| FR-08 | Payment floor, uji bulanan, cure, bond draw | P0 | 05 §5.4–5.6 |
| FR-09 | Step-in, recovery, write-off (junior dulu) | P1 | 05 §5.9 |
| FR-10 | Sinyal kesehatan omzet (WARNING) | P1 | 05 §5.7 |
| FR-11 | Excused day oleh arbiter | P1 | 05 §5.8 |
| FR-12 | ORACLE_STALE | P2 | 05 §4.2 |
| FR-13 | Penarikan vault terbatas kas + transfer allowlist | P1 | 05 §7 |
| FR-14 | Mock attestor (script) yang menandatangani settlement | P0 | 04 §3 |
| FR-15 | Simulator ekonomi (modul TS) + panel skenario di UI | P0 | 02 §11 |
| FR-16 | Dashboard 4 peran + timeline event | P0 | bagian 4 |
| FR-17 | Factory multi-agreement, `LedgerPayoutAdapter` nyata, subgraph, IPFS | P2 | 04, 05 |
| FR-18 | Tes: unit + skenario T-25..T-28 minimal | P0 | 05 §13 |

**Di luar scope MVP (eksplisit):** pasar sekunder/AMM, integrasi QRIS/PJP nyata, KYC nyata, upgradeability, multi-tenant pooling, token IDRX riil, pembayaran rupiah nyata, mobile app.

## 3. Struktur repo yang disarankan

```
fitout-vault/
├─ contracts/                 # Foundry
│  ├─ src/ (MockIDR, TrancheVault, WaterfallRouter, FitOutAgreement, interfaces)
│  ├─ test/ (unit, fuzz, invariant, scenario)
│  └─ script/ (Deploy.s.sol, Seed.s.sol)
├─ packages/sim/              # modul simulator TS (dipakai UI dan tes)
├─ attestor/                  # script TS: tanda tangan EIP-712, kirim settlement
├─ apps/web/                  # Next.js + wagmi + viem
├─ docs/                      # paket dokumen ini (00–09)
└─ README.md                  # label testnet, cara menjalankan, tautan demo
```

## 4. Spesifikasi dashboard

**Banner permanen:** "Testnet · mock token · mock attestor · bukan penawaran investasi · angka adalah asumsi".

### 4.1 Komponen bersama
- **Header agreement:** fase, status covenant (badge), `lastDayId`, hari efektif `d`.
- **Panel parameter:** semua parameter (02 §2) dengan label asumsi.
- **Money flow (per settlement):** batang bertumpuk: pemilik, senior, junior, tenant retain; dengan tooltip hitungan.
- **Progress klaim:** senior dan junior (dibayar vs klaim); garis Floor vs total dibayar (grafik waktu).
- **Bond gauge:** saldo, ditarik, tersisa.
- **Timeline event:** `SettlementRecorded`, `FloorTested`, `CureStarted`, `BreachRecorded`, `StepInTriggered`, dll.

### 4.2 Tab per peran
| Tab | Isi khusus |
|---|---|
| Investor | Posisi share, harga share (NAV), kas yang bisa ditarik, klaim tersisa, estimasi pelunasan, kerugian (jika ada) |
| Pemilik ruko | Turnover rent diterima, posisi junior, milestone yang menunggu persetujuan |
| Tenant | Omzet tercatat, tenant retain (hasil hitung), bond, status covenant, tombol `cureTopUp`, coverage check |
| Kontraktor/Inspektur | Milestone, bukti (hash), persetujuan |

### 4.3 Panel skenario (admin demo)
Tombol: Seed deal · Danai & bangun (otomatis) · Jalankan Normal (N bulan) · Jalankan Lambat (70%) · Jalankan Kebocoran 30% · Tandai hari excused · Picu Default · Matikan attestor (stale) · Reset demo.

Setiap tombol menampilkan di layar **siapa menanggung apa** setelah skenario (tabel hasil ala 02 §7.1).

### 4.4 Simulator ekonomi (halaman terpisah)
Input parameter dan skenario (02 §11); output grafik dan tabel; label "asumsi; bukan data pasar".

## 5. Mock attestor dan runner skenario

- Script TS memegang kunci attestor demo, membentuk `Settlement{dayId, periodDays, G, txCount, evidenceHash}`, menandatangani EIP-712, dan memanggil `settle` (relayer = script).
- **Mode cepat untuk demo:** settlement agregat bulanan (`periodDays = 30`) sehingga 18–24 transaksi cukup untuk satu siklus penuh; mode harian tersedia untuk uji detail.
- Data skenario dihasilkan oleh `packages/sim` agar UI, tes, dan demo memakai angka yang sama.
- `evidenceHash` = hash dari file JSON laporan simulasi (disimpan di repo).
- **Cadangan demo:** jalankan seluruh skenario di chain lokal (Anvil) untuk latihan dan rekaman video cadangan; testnet publik untuk demo utama (R-17).

## 6. Rencana kerja 48 jam

| Jam | Fokus | Output / checkpoint |
|---|---|---|
| 0–3 | Kick-off: baca 00, 04, 05; kunci parameter; setup repo, Foundry, Next.js | **CP0:** repo jalan, tim sepakat atas parameter default |
| 3–12 | Kontrak P0: `MockIDR`, vault, router, agreement (fase, bond, settlement, floor, cure, bond draw) + tes T-01..T-13 | **CP1 (jam 12):** `forge test` hijau untuk alur normal + cure + bond |
| 6–14 | Paralel: `packages/sim` + attestor script | Simulator dan attestor selaras dengan 02 §7.1 |
| 12–24 | Kontrak P1 (milestone, Fase B, step-in, excused, penarikan vault) + tes T-14..T-20 | **CP2 (jam 24):** semua skenario T-25..T-28 lolos di Anvil |
| 12–30 | Frontend: header, money flow, progress klaim, tab peran, panel skenario | Dashboard membaca event dan state |
| 24–32 | Deploy Sepolia, integrasi, perbaikan bug; fuzz T-21..T-24 | **CP3 (jam 32):** demo end-to-end di testnet |
| 32–40 | Polish UI, banner dan label, halaman simulator, slide, naskah demo | Slide lengkap, README |
| 40–46 | Latihan demo 3×, rekaman video cadangan, perbaikan kecil | **CP4 (jam 46):** freeze kode |
| 46–48 | Buffer, submit, cek tautan | Submission |

**Aturan freeze:** setelah jam 40 tidak ada fitur baru; hanya perbaikan bug dan teks.

## 7. Pembagian peran (sesuaikan jumlah anggota)

| Peran | Tanggung jawab | Bila tim 3 orang |
|---|---|---|
| Kontrak | 05, tes, deploy | 1 orang |
| Frontend + integrasi | 06 §4, wagmi/viem | 1 orang |
| Simulator + attestor + data + pitch | 02 §11, 08, 07, slide | 1 orang (dibantu semua) |
| Produk/riset/dokumen | 01, 03, 08, 09, Q&A | digabung ke peran ke-3 |

## 8. Kriteria penerimaan (acceptance)

| Fitur | Given / When / Then |
|---|---|
| FR-02 | Given parameter dengan coverage < 2,0, When `initialize`, Then revert dengan pesan jelas |
| FR-03/04 | Given vault terisi dan bond tersetor sebelum deadline, When `startBuild`, Then fase BUILDING; Given deadline lewat dan belum penuh, When `failFundraising`, Then semua dapat menarik penuh |
| FR-06 | Given atestasi valid G = 2.370.370 (token), When `settle`, Then pemilik 5%, investor 15%, total pull ≤ G, saldo router kembali 0 |
| FR-06 | Given atestasi dengan penandatangan salah/replay/`dayId` mundur, When `settle`, Then revert |
| FR-08 | Given total dibayar < Floor lebih dari toleransi pada uji bulanan, When settlement masuk, Then status CURE dan event `CureStarted` |
| FR-08 | Given CURE dan cure habis, When `evaluate`, Then bond ditarik `min(kekurangan, bond)` dan masuk waterfall |
| FR-09 | Given step-in dan recovery X, When `finalizeLiquidation`, Then X dibayar senior→junior dan kerugian tercatat junior dulu |
| FR-13 | Given vault pada fase OPERATING, When investor `withdraw` melebihi kas, Then dibatasi `maxWithdraw` |
| FR-14 | Given script attestor, When dijalankan, Then settlement tertanda tangan diterima kontrak |
| FR-16 | Given settlement baru, When halaman dibuka, Then money flow, progress klaim, dan timeline ter-update < 2 detik |
| FR-18 | Given `forge test`, Then seluruh tes P0 lulus; T-25..T-28 mencocokkan angka 02 §7.1 (toleransi pembulatan) |

**Definition of Done (per fitur):** kode + tes lulus + event muncul + tampil di UI (jika relevan) + label asumsi/testnet benar + dicatat di 09 bila menyimpang dari spesifikasi.

## 9. Aturan pemotongan scope

| Situasi | Potong |
|---|---|
| Waktu 24 jam saja | Hilangkan P1 kecuali FR-05 versi sederhana; skip FR-07, FR-10..FR-13; step-in cukup status + event |
| Terlambat di CP1 | Gabung `FitOutAgreement` dan `WaterfallRouter`; skip excused day |
| Terlambat di CP2 | Skip Fase B dan step-in on-chain; tampilkan lewat simulator saja (dengan label) |
| Terlambat di CP3 | Demo di Anvil + video; testnet hanya bukti deploy |
| UI mepet | Satu halaman dengan tab; simulator sebagai grafik sederhana |

Prioritas inti yang **tidak boleh dipotong:** FR-06, FR-08, FR-14, FR-15, FR-16 (waterfall, floor/cure/bond, attestor, simulator, dashboard).

## 10. Naskah demo (≈5 menit)

| Menit | Isi | Layar |
|---|---|---|
| 0:00–0:45 | Cerita: ruko kosong Jember, jalan buntu pemilik–tenant–pemodal | Slide 1–2 |
| 0:45–1:15 | Solusi satu kalimat + arsitektur hybrid (rupiah rail, onchain ledger) | Slide 3–4 |
| 1:15–2:15 | Live: danai senior/junior → bond → milestone → build selesai | Dashboard, tab Investor/Pemilik |
| 2:15–3:15 | Live: settlement bulanan → money flow → klaim senior lunas → Fase B | Dashboard |
| 3:15–4:15 | **Skenario kebocoran 30%:** floor terlanggar → cure → bond ditarik → siapa menanggung berapa | Panel skenario + tabel hasil |
| 4:15–4:45 | **Skenario default:** step-in → recovery 20% → junior menyerap lebih dulu | Panel skenario |
| 4:45–5:00 | Batasan yang diakui + penutup | Slide batasan |

**Tutup dengan:** "Kami membatasi kerugian, bukan mengklaim menghapus kecurangan."

## 11. Kerangka slide (10–12)

1. Masalah: ruko kosong, jalan buntu (foto/ilustrasi, bukan klaim statistik tanpa data)
2. Mengapa Web2 belum menyelesaikan (kesenjangan modal, insentif, kepercayaan)
3. Solusi: RBF bertingkat dengan waterfall yang bisa diverifikasi
4. Arsitektur hybrid (rupiah rail + ledger onchain)
5. Struktur modal: senior/junior + bond + payment floor
6. Ekonomi: base case, coverage check, tabel stress (02 §6–7)
7. Demo live
8. Kebocoran tunai: dibatasi, bukan dihapus (02 §8)
9. Kenapa onchain dan apa yang tetap Web2
10. Regulasi: jalur dan batasan (03)
11. **Batasan yang kami akui** (07 §4)
12. Roadmap: validasi data → pilot → pooling

## 12. Pengujian dan latihan sebelum demo

- [ ] `forge test` hijau; fuzz berjalan ≥ 1000 run per tes.
- [ ] Skenario penuh dijalankan 3× berturut-turut di Anvil dan 1× di testnet.
- [ ] Saldo faucet testnet cukup; cadangan RPC kedua siap.
- [ ] Video cadangan ≤ 3 menit terekam.
- [ ] Setiap anggota dapat menjawab Q&A (07 §3) tanpa catatan.
- [ ] README memuat label testnet, instruksi menjalankan, tautan dokumen.
