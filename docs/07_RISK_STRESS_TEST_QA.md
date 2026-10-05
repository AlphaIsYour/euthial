# 07 — Risk, Stress Test, dan Q&A

**Versi:** 0.1 · 5 Okt 2026 · Bergantung pada: `01`, `02`, `03`, `04`, `05`, `06` · Dipakai oleh: `06`, `09`

> Semua angka adalah asumsi ilustratif (lihat `02`, bagian 10). Hasil simulasi di bagian 4 dihitung dengan skrip harian yang mengikuti aturan `05`, bagian 5; angka itu **indikatif** dan harus direproduksi oleh simulator TS (`06`, FR-S01) lalu dibandingkan dengan kontrak (T-35). Bukan nasihat hukum atau keuangan.

---

## 1. Cara memakai dokumen ini

- **Risk register (bagian 2)** dipelihara tim; tinjau saat ada keputusan baru di `09`.
- **Temuan simulasi (bagian 4)** menggantikan pembacaan kasar `02`, bagian 7.1 bila keduanya berbeda; perbedaan dicatat sebagai IC-06 dan IC-08 di `09`.
- **Matriks tes (bagian 5)** melengkapi `05`, bagian 13 (T-25…T-32 diberi hasil harapan numerik; T-33+ baru).
- **Q&A dan slide batasan (bagian 6–7)** untuk pitch; jawaban harus konsisten dengan aturan narasi `01`, bagian 7.

Skala risiko: **K** = kemungkinan (1 rendah, 2 sedang, 3 tinggi), **D** = dampak (1–3), **Skor = K × D**. Skor ≥ 9 kritis; 6 tinggi; 4 sedang; ≤ 3 rendah.

## 2. Risk register

| ID | Kategori | Risiko | K | D | Skor | Mitigasi | Pemilik | Ref |
|---|---|---|---|---|---|---|---|---|
| R-01 | Regulasi | Klaim berbasis omzet + payment floor diklasifikasikan sebagai efek atau pendanaan bersama (bukan sekadar bagi hasil) | 3 | 3 | **9** | Posisi infrastruktur; testnet-only (DC-07); opini hukum; jalur J2/J3 | Produk/Hukum | 03 F-07, DC-04 |
| R-02 | Regulasi | Vault share dianggap AKD/diperdagangkan tanpa izin | 2 | 3 | 6 | Allowlist, tanpa AMM, tanpa pasar sekunder (DC-03, NN-05) | SC/Hukum | 03 F-05 |
| R-03 | Regulasi | Dianggap penyelenggara pembayaran atau kustodian | 2 | 3 | 6 | Rupiah via PJP berizin; Mode B untuk pilot; admin tanpa jalur dana (INV-10) | Produk/Hukum | 03 DC-01/02 |
| R-04 | Kepercayaan | Attestor dikompromikan atau berkolusi (memalsukan/menahan omzet) | 2 | 3 | 6 | Satu address terkunci; event publik; produksi: agen berizin, audit, multi-attestor | SC/Produk | 04 bagian 5 |
| R-05 | Ekonomi | Kebocoran tunai melebihi toleransi bond (L > ≈ 31% pada R_base) | 3 | 2 | 6 | Payment floor, bond, QRIS escrow, cross-check bahan baku, mystery shopper | Produk | 02 bagian 8 |
| R-06 | Data | Omzet dan margin aktual jauh dari asumsi (A-02, A-03, A-04 belum divalidasi) | 3 | 3 | **9** | Rencana data `08`; coverage check; label asumsi; validasi pilot | Riset | 02 bagian 10 |
| R-07 | Ekonomi | Bond (10% anggaran = Rp15 jt) tidak terjangkau tenant | 2 | 2 | 4 | Memakai uang jaminan sewa; bond bertahap; uji keterjangkauan | Produk/Riset | 02 bagian 2, A-08 |
| R-08 | Ekonomi | Biaya modal efektif tinggi (≈ 43%/tahun untuk senior pada base) dianggap memberatkan | 3 | 2 | 6 | Sasaran tenant tanpa akses modal murah; transparansi; opsi batas return berbasis waktu (OQ-07) | Produk | 02 bagian 6, 9.3 |
| R-09 | Pasar | Pemilik ruko tidak mau mengisi junior 20% (A-12) | 2 | 3 | 6 | Validasi pemilik; opsi junior eksternal dengan multiple lebih tinggi | Produk | 02 A-12 |
| R-10 | Pasar | Tenant menolak take-rate 20% atau menghindari rel QRIS (A-13) | 2 | 2 | 4 | Coverage check; promo QRIS; transparansi | Produk | 02 A-13 |
| R-11 | Hukum/Ekonomi | Step-in sulit ditegakkan; recovery aset rendah (fidusia, interior terpasang nol) | 3 | 3 | **9** | Dokumen hukum (`03`, bagian 5); jangan bergantung pada recovery; modelkan re-tenanting (OQ-09) | Hukum/Riset | 02 7.4, A-15 |
| R-12 | Tata kelola | Arbiter menyalahgunakan excused day atau keputusan sengketa | 1 | 2 | 2 | `maxExcusedDays`; event publik; multisig; hash alasan | SC | 05 bagian 5.8 |
| R-13 | Teknis | Bug kontrak (pembulatan waterfall, akuntansi vault, kasus tepi covenant) | 2 | 3 | 6 | Invariant dan fuzz (T-21…T-24); tes kasus tepi; audit sebelum produksi | SC | 05 bagian 10–13 |
| R-14 | Tata kelola | Konflik kepentingan: pemilik memegang junior sekaligus membeli share senior atau memengaruhi milestone | 2 | 2 | 4 | Allowlist; event; pengungkapan; keputusan OQ-12 | Produk/SC | 05 edge case 15 |
| R-15 | Teknis | Serangan inflasi share ERC-4626/donasi token | 1 | 2 | 2 | Akuntansi internal; `_decimalsOffset`; deposit hanya saat FUNDRAISING | SC | 05 bagian 12 |
| R-16 | Operasional | ORACLE_STALE berkepanjangan menunda eskalasi | 2 | 2 | 4 | `escalateStale` setelah 14 hari logis; SLA attestor (produksi) | SC/Produk | 04 bagian 9 |
| R-17 | Kepercayaan | Attestor memanipulasi jam logis (mempercepat/memperlambat) | 2 | 2 | 4 | `MAX_GAP` 60 hari (D-08); event publik; diakui sebagai trust assumption | SC | 05 bagian 8.2 |
| R-18 | Demo | Demo gagal (RPC, faucet, wallet, waktu) | 2 | 3 | 6 | Rencana cadangan `06`, bagian 8.3; pra-jalankan state | PD/AT | 06 |
| R-19 | Narasi | Overclaim (kata terlarang) di slide/README/UI | 2 | 3 | 6 | Aturan `01`, bagian 7; checklist `06`, bagian 10 | PD | NN-02 |
| R-20 | Privasi | PII bocor atau hash onchain bertentangan dengan hak hapus | 1 | 2 | 2 | Tanpa PII onchain (DC-06); hash saja; konsultasi PDP | Hukum | 03 F-10 |
| R-21 | Jadwal | Scope creep hackathon | 3 | 2 | 6 | Cut-line `06`, bagian 7.4; feature freeze jam 36 | Lead | 06 |
| R-22 | Pajak | PPh sewa/bagi hasil dan pajak daerah tidak dimodelkan | 2 | 2 | 4 | Daftar tanya konsultan; OQ-15 | Hukum | 03 pertanyaan 11 |
| R-23 | Hukum | Pemilik menjual/menghentikan sewa; hak tenant atas lokasi tidak terlindungi | 2 | 3 | 6 | Masa sewa ≥ 36 bulan, notaril; klausul penggantian tenant; `leaseEndDay` | Hukum | 03 bagian 5 |
| R-24 | Operasional | Kontraktor dan inspektur berkolusi; kualitas renovasi buruk | 2 | 2 | 4 | 2-dari-3 pihak; inspektur independen; hash bukti; arbiter | Produk | 04 bagian 5 |
| R-25 | Desain | False positive covenant pada tenant jujur (Floor terlalu ketat; lihat SF-01) | 3 | 2 | 6 | Excused day; uji kumulatif; kalibrasi parameter (OQ-09); sinyal WARNING informatif | SC/Riset | 02 bagian 4 |

### 2.1 Risiko teratas (skor ≥ 9)
R-01 (klasifikasi regulasi), R-06 (data omzet/margin belum ada), R-11 (penegakan step-in dan recovery). Ketiganya **harus** muncul di slide batasan (bagian 7).

## 3. Cara membaca hasil stress test (ringkas)
- `02`, bagian 7.1 mengasumsikan kontrak berjalan 24 bulan tanpa step-in dini. Aturan covenant di `05` memicu eskalasi lebih awal untuk tenant yang lambat sejak awal. Keduanya valid sebagai **dua kebijakan berbeda**; bagian 4 menunjukkan konsekuensi kebijakan `05`.
- Semua hasil di bawah memakai: tenant tidak top-up sukarela; tanpa excused day; tanpa re-tenanting; recovery 20% × (P_s + P_j) = Rp30 jt masuk sekali setelah STEP_IN (A-15).

## 4. Temuan simulasi dan hasil harapan

> Bagian ini dirujuk oleh `06` (bagian 5, 6.4, 8.1).

### 4.1 Temuan

| ID | Temuan | Implikasi |
|---|---|---|
| **SF-01** | Floor naik linear dari 0 dengan kemiringan setara **60% dari laju pembayaran base**. Tenant dengan omzet tercatat di bawah ≈ 60% base mulai tertinggal sejak bulan pertama dan terkena CURE di bulan 1–3, lalu STEP_IN pada bulan ke-2 sampai ke-5 (bukan bulan ke-24). Pada saat itu pokok senior baru terbayar sebagian kecil. | Pernyataan "pokok senior aman sampai omzet ≈ 40–45% base" (`02`, 7.1) **tidak berlaku** bila covenant `05` dipakai tanpa re-tenanting. Perlu keputusan kebijakan (OQ-09) dan label di pitch. |
| **SF-02** | Aturan `breachCount ≥ 2 → STEP_IN` memicu STEP_IN walau klaim **sudah lunas** lewat bond draw terakhir (terjadi pada omzet 70%, granularitas 1 dan 7 hari). | Usulan D-21: pelunasan klaim mendahului STEP_IN (→ RESIDUAL). Tes T-33. |
| **SF-03** | Hasil bergantung pada **granularitas `periodDays`**: dengan periode 30 hari, shortfall kecil lebih sering tertutup sendiri oleh settlement berikutnya sebelum bond ditarik, dan tanggal STEP_IN bergeser. | Simulator dan skrip demo harus memakai `periodDays` yang sama dengan kontrak. Tabel 4.2 memuat periode 1 dan 30 hari; periode 7 hari mirip periode 1 hari. |
| **SF-04** | Karena `cureTarget` tetap pada hari uji, pembayaran reguler selama masa cure dapat menutup shortfall kecil tanpa top-up (CURE → HEALTHY otomatis). Bond baru tersentuh bila kekurangan > toleransi setelah `D_cure`. | Perilaku sesuai niat desain (menghindari hukuman pada tenant jujur); tampilkan di UI sebagai "CURE terpenuhi oleh pembayaran reguler". |
| **SF-05** | Recovery 20% (Rp30 jt) hanya menutup sebagian kerugian; junior hampir selalu nol pada STEP_IN dini. Re-tenanting (pengganti tenant tetap membayar) belum dimodelkan sehingga hasil tabel bersifat **konservatif**. | Tambahkan parameter re-tenanting di simulator (`06`, bagian 5). |

### 4.2 Hasil per skenario (Rp juta; pokok senior 120, junior 30; klaim 150 dan 42)

**A. Granularitas harian (`periodDays = 1`)**

| Skenario | CURE pertama (hari) | Hasil | Dibayar ke investor (senior/junior) | Bond terpakai | Setelah recovery 20% | Senior vs pokok | Junior vs pokok |
|---|---|---|---|---|---|---|---|
| S1 Normal 100% | — | Lunas ≈ hari 540 → RESIDUAL | 150,0 / 42,0 | 0 | — | +30,0 (+25%) | +12,0 (+40%) |
| S2/S4 70% (kebocoran 30%) | 660 (menutup sendiri) | Klaim lunas 192,0 via bond; **STEP_IN terpicu hari 727 (lihat SF-02)** | 150,0 / 42,0 | 11,06 | — | +30,0 | +12,0 |
| S3 50% | 60 | STEP_IN hari 157 | 32,0 / 0 | 4,09 | 62,0 / 0 | −58,0 (−48,3%) | −30,0 (−100%) |
| 40% | 30 | STEP_IN hari 97 | 19,2 / 0 | 5,40 | 49,2 / 0 | −70,8 (−59,0%) | −100% |
| 30% | 30 | STEP_IN hari 67 | 12,8 / 0 | 5,65 | 42,8 / 0 | −77,2 (−64,3%) | −100% |
| S6 Default (omzet nol sejak bulan 6) | 330 | STEP_IN hari 367 | 76,8 / 0 | 12,80 | 106,8 / 0 | −13,2 (−11,0%) | −100% |
| S5 Musiman (pengali 0,7–1,2, rata-rata 1,0) | — | Lunas ≈ hari 555; tidak ada CURE | 150,0 / 42,0 | 0 | — | +30,0 | +12,0 |
| S7 150% | — | Lunas ≈ hari 360 → RESIDUAL | 150,0 / 42,0 | 0 | — | +30,0 | +12,0 |
| T-32 Satu hari omzet nol | — | Tidak ada efek (lunas ≈ hari 540) | 150,0 / 42,0 | 0 | — | +30,0 | +12,0 |

**B. Granularitas 30 hari (`periodDays = 30`, mode cepat demo)**

| Skenario | Hasil | Dibayar ke investor (senior/junior) | Bond terpakai | Setelah recovery 20% | Senior vs pokok |
|---|---|---|---|---|---|
| S1 Normal | Lunas hari 540 → RESIDUAL | 150,0 / 42,0 | 0 | — | +30,0 |
| S2/S4 70% | Lunas hari 780 (setelah T_max), **tanpa STEP_IN** | 150,0 / 42,0 | 5,33 | — | +30,0 |
| S3 50% | STEP_IN hari 300 | 57,6 / 0 | 4,27 | 87,6 / 0 | −32,4 (−27,0%) |
| 40% | STEP_IN hari 150 | 25,6 / 0 | 4,27 | 55,6 / 0 | −64,4 (−53,7%) |
| 30% | STEP_IN hari 120 | 19,2 / 0 | 6,40 | 49,2 / 0 | −70,8 (−59,0%) |
| S6 Default | STEP_IN hari 390 | 76,8 / 0 | 12,80 | 106,8 / 0 | −13,2 (−11,0%) |

**Catatan pembacaan:**
- Kolom "Dibayar" sudah mencakup tarikan bond. "Setelah recovery" menambahkan Rp30 jt ke senior (senior dibayar lebih dulu).
- Untuk demo S4 pada periode 30 hari, narasi yang konsisten dengan kontrak: CURE muncul ≈ bulan 22–25, bond ditarik ≈ Rp5,3 jt, klaim lunas setelah T_max, tenant **tidak** kehilangan lokasi. Bila D-21 disetujui, hasil periode 1 dan 7 hari juga menjadi "lunas → RESIDUAL".
- Bandingkan dengan `02`, 7.1 (50% omzet: senior 143,0): perbedaan berasal dari kebijakan step-in dini (SF-01), bukan dari kesalahan hitung.

## 5. Matriks tes skenario

### 5.1 Skenario terintegrasi (melengkapi `05`, bagian 13.3)

| ID | Skenario | Input | Hasil harapan | Sumber |
|---|---|---|---|---|
| T-25 | Normal | S1, `periodDays` 30 | Senior lunas bulan ≈ 14,1 (settlement ke-15); junior lunas ≈ bulan 18; RESIDUAL; turnover rent ≈ Rp64 jt | 02 bagian 6 |
| T-26 | Lambat 70% | S2, periode 30 | Lunas hari 780; bond ≈ 5,33; tanpa STEP_IN (periode 1 hari: lihat T-33) | Simulasi 4.2 |
| T-27 | Sangat lambat 50% | S3, periode 30 | STEP_IN hari 300; senior 57,6 (87,6 dengan recovery); junior 0 | Simulasi 4.2 |
| T-28 | Kebocoran 30% | S4 (setara T-26) | Identik T-26 | 02 bagian 8 |
| T-29 | Musiman + excused | S5 | Tidak ada CURE palsu; lunas ≈ hari 555 (harian) | Simulasi 4.2 |
| T-30 | Default dini | S6, recovery 20% | STEP_IN hari 390 (periode 30); senior 106,8; junior 0; write-off junior | Simulasi 4.2 |
| T-31 | Dipercepat 150% | S7 | RESIDUAL ≈ bulan 12 | Simulasi 4.2 |
| T-32 | Satu hari nol | G = 0 sehari | Tidak memicu apa pun | 05 edge 2 |

### 5.2 Tes tambahan (diusulkan; T-33+)

| ID | Tes | Hasil harapan |
|---|---|---|
| T-33 | Klaim lunas lewat bond draw saat `breachCount = 2` (omzet 70%, periode 1 hari) | RESIDUAL, bukan STEP_IN (bergantung D-21) |
| T-34 | Granularitas: skenario sama dijalankan dengan `periodDays` 1, 7, 30 | Hasil sesuai simulator pada tiap granularitas; perbedaan terdokumentasi |
| T-35 | Paritas simulator TS vs kontrak untuk S1–S8 | Selisih pembayaran per tranche = 0 unit |
| T-36 | Allowance attestor kurang | `settle` revert total; tidak ada split parsial |
| T-37 | Pemilik membeli share senior via allowlist | Diizinkan; `AllowlistUpdated` dan `Deposited` tercatat (R-14) |
| T-38 | Celah `dayId` (hari tanpa data) | Tidak dihitung nol; uji bulanan hanya bulan terakhir |
| T-39 | `G = 0` berulang selama ≥ 3 hari | Tercatat sebagai data (bukan ORACLE_STALE); covenant berjalan normal |
| T-40 | Pembulatan: total pembayaran tidak melewati klaim | `seniorPaid ≤ seniorClaim` selalu (INV-03) |

### 5.3 Uji ekonomi pada simulator (tanpa kontrak)

| ID | Uji | Hasil harapan |
|---|---|---|
| E-01 | Coverage base (biaya 60%, t = 20%) | 2,0 → lolos tepat di batas |
| E-02 | Coverage stress (biaya 70%, t = 20%) | 1,5 → ditolak |
| E-03 | Spesifikasi awal (t = 60%, biaya 60%) | 0,67 → ditolak |
| E-04 | Bond minimum untuk L\* = 20 / 30 / 40 / 50% | 0 / 12,8 / 38,4 / 64,0 jt |
| E-05 | m_min untuk p = 10 / 20 / 30%, rec = 20% | ≈ 1,26× / 1,39× / 1,56× |
| E-06 | Pergeseran batas coverage: t maksimum = (1 − rasio biaya) / 2 | biaya 55% → 22,5%; 60% → 20%; 65% → 17,5%; 70% → 15% |

## 6. Q&A juri

Gaya jawaban: jujur, ringkas, tanpa klaim berlebihan. Angka = asumsi.

| ID | Pertanyaan | Jawaban singkat |
|---|---|---|
| QA-01 | Kenapa investor mau menanggung risiko tenant kecil? | Risiko dihargai lewat multiple (senior 1,25×) dan dikurangi empat tuas: tenant terbukti, tranche junior pemilik + bond sebagai first-loss, diversifikasi (fase 3), dan payment floor. Pada asumsi gagal bayar 10–30%, multiple minimum ≈ 1,26–1,56×. Imbal hasil menanggung risiko dan tidak dijamin; angka akan divalidasi di pilot. |
| QA-02 | Bagaimana kalau tenant curang (omzet tunai)? | Kebocoran tidak bisa dihapus; **dibatasi**. Kontrak tidak melihat tunai, jadi covenant memakai payment floor: pembayaran yang tertinggal memicu cure, bond draw, lalu step-in. Bond Rp15 jt menoleransi kebocoran sampai ≈ 31% pada base. Mitigasi lain: QRIS escrow khusus, cross-check bahan baku, mystery shopper, pemilik hadir di lokasi. |
| QA-03 | Kenapa onchain? Bukankah cukup spreadsheet atau platform biasa? | Nilai tambahnya verifikasi bersama: pemilik, tenant, dan investor dapat memeriksa waterfall dan status covenant tanpa memercayai buku satu operator, dan tranching/distribusi berjalan otomatis tanpa rekonsiliasi manual. Kami tidak mengklaim menghapus kepercayaan: attestor tetap titik kepercayaan. |
| QA-04 | Apakah ini efek atau sekuritisasi? | Kami tidak mengklaim sekuritisasi dan bukan penerbit efek. Klasifikasi hukum klaim berbasis omzet dengan floor belum divalidasi (cenderung mendekati pendanaan/utang). Karena itu: hanya testnet, posisi sebagai infrastruktur untuk pelaku berizin, dan opini hukum sebelum pilot. |
| QA-05 | Apakah ini melanggar kewajiban rupiah? | Tidak dirancang demikian: pelanggan membayar rupiah via QRIS dari PJP berizin. Onchain bukan alat bayar; di pilot hanya ledger entitlement (Mode B). Di demo memakai `MockIDR` dan menyatakannya jelas. |
| QA-06 | Siapa attestor, dan apa yang terjadi kalau ia berbohong atau mati? | Di demo: mock. Produksi: agen escrow/PJP berizin. Berbohong atau menahan data adalah risiko nyata (R-04); mitigasinya satu address terkunci, semua attestation publik, dan di produksi audit + multi-attestor. Jika mati ≥ 3 hari logis → ORACLE_STALE dan uji dijeda; setelah 14 hari arbiter dapat mengeskalasi. |
| QA-07 | Kenapa ada payment floor, bukan revenue share murni? | Omzet tunai tidak terlihat, sehingga persentase omzet saja tidak melindungi investor. Floor bergeser ke pembayaran. Konsekuensi jujur: produk mendekati utang dengan percepatan berbasis omzet (F-07). |
| QA-08 | Bukankah biayanya mahal (≈ 43%/tahun)? | Ya, pada base case senior biaya efektif kasar ≈ 43%/tahun. Produk menyasar tenant yang tidak punya akses modal murah; alternatif batas return berbasis waktu sedang dikaji (OQ-07). |
| QA-09 | Bagaimana dengan musim sepi (hujan, Ramadan)? | Uji dilakukan kumulatif bulanan, bukan harian; arbiter dapat menandai excused day (maks 30 hari) dengan bukti; sinyal kesehatan hanya informatif. Simulasi musiman tidak menghasilkan CURE palsu. |
| QA-10 | Apa yang terjadi saat default? | STEP_IN: proses off-chain (fidusia, pengambilalihan, lelang aset bergerak) → recovery tercatat → write-off, junior menyerap lebih dulu. Hasil simulasi menunjukkan pada default atau kelambatan dini senior bisa rugi besar (bagian 4); pengganti tenant belum dimodelkan. |
| QA-11 | Kenapa pemilik ruko di tranche junior? | Ia paling diuntungkan (aset produktif kembali, nilai naik, turnover rent) dan menggantikan praktik tenant improvement allowance. Kesediaan pemilik (A-12) belum divalidasi. |
| QA-12 | Apakah ada data omzet nyata? | Belum. Memakai proksi data publik (`08`) dan menandai semua angka sebagai asumsi; data nyata dari pilot QRIS escrow. |
| QA-13 | Kenapa tidak memakai stablecoin rupiah? | Status stablecoin rupiah belum kami verifikasi (F-08), dan pembayaran pelanggan harus rupiah. Demo memakai mock token tanpa klaim integrasi. |
| QA-14 | Apakah investor bisa keluar kapan saja? | Tidak. Likuiditas terbatas pada kas yang sudah dibayarkan; transfer share hanya antar address allowlist; tidak ada pasar sekunder atau AMM. |
| QA-15 | Bagaimana privasi? | Tidak ada PII onchain; hanya address dan hash bukti; KYC off-chain oleh mitra. Hak hapus untuk hash masih pertanyaan hukum. |
| QA-16 | Apa bedanya dengan urun dana atau merchant cash advance? | Rel pembayarannya sama, bukan hal unik. Yang kami tambahkan: waterfall tiga pihak yang dapat diverifikasi publik dan tranching otomatis. Kami bisa menjadi lapisan infrastruktur bagi platform berizin. |
| QA-17 | Bisakah admin membawa lari dana? | Tidak ada fungsi admin untuk memindahkan dana vault, bond, atau router (INV-10); pause hanya menunda settlement/deposit dan tidak menahan penarikan; tidak ada proxy upgrade di MVP. |
| QA-18 | Apakah kontrak sudah diaudit? | Belum. Ini prototipe testnet dengan tes invariant/fuzz; audit pihak ketiga dibutuhkan sebelum pilot. |
| QA-19 | Apa risiko terbesar? | Regulasi (R-01), data omzet/margin yang belum ada (R-06), dan penegakan serta recovery saat step-in (R-11). |
| QA-20 | Kenapa Jember? | Berawal dari pengamatan lapangan ruko kosong; ini belum data, dan validasinya dijelaskan di `08`. |
| QA-21 | Apa langkah setelah hackathon? | Validasi data publik, opini hukum, pilih jalur (J2/J3), lalu pilot satu ruko dengan mitra berizin (`01`, bagian 9). |

## 7. Slide "Batasan yang kami akui" (draf isi)

**Judul:** Batasan yang kami akui

1. **Regulasi belum divalidasi.** Peta awal, bukan opini hukum; klasifikasi klaim (efek/pendanaan) belum ditentukan; hanya testnet.
2. **Data omzet belum ada.** Semua angka adalah asumsi; proksi data publik; validasi di pilot.
3. **Attestor adalah titik kepercayaan.** Di demo mock; produksi memerlukan agen berizin, audit, multi-attestor.
4. **Kebocoran tunai dibatasi, bukan dihapus.** Bond menoleransi hingga ≈ 31% pada base.
5. **Pada default atau kelambatan dini, investor bisa rugi signifikan.** Recovery 20% adalah tebakan; pengganti tenant belum dimodelkan.
6. **Biaya modal tinggi** bagi tenant; hanya cocok untuk yang tanpa akses modal murah.
7. **Bukan produk jadi.** Prototipe testnet; belum diaudit; tanpa pasar sekunder; Mode B baru berupa antarmuka.

## 8. Checklist pra-pitch

- [ ] Slide batasan memuat poin 1–7 (minimal 1–3 sesuai `03`, bagian 7).
- [ ] Jawaban QA-01, QA-02, QA-03 dilatih ≤ 45 detik masing-masing.
- [ ] Tidak ada kata terlarang; "sekuritisasi" hanya muncul untuk menyangkal.
- [ ] Hasil demo S1/S4/S6 cocok dengan bagian 4 pada `periodDays` yang dipakai.
- [ ] Angka ke juri selalu disebut sebagai asumsi.
