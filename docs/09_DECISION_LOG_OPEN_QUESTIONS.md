# 09 — Decision Log & Open Questions

**Versi:** 0.1 · 5 Okt 2026 · Dokumen hidup: perbarui setiap ada keputusan atau penyimpangan dari 02/04/05.

---

## 1. Cara memakai

- Tambahkan baris baru; **jangan menghapus** keputusan lama. Ubah status menjadi `Diganti oleh D-xx`.
- Setiap perubahan parameter default (02 §2 / 05 §3) wajib dicatat di sini dan di kedua dokumen tersebut (NN-10).
- Pertanyaan terbuka (OQ) yang terjawab dipindahkan menjadi keputusan (D).

## 2. Log keputusan

| ID | Keputusan | Alasan | Alternatif yang ditolak | Status | Dampak |
|---|---|---|---|---|---|
| D-01 | Arsitektur hybrid: rel pembayaran rupiah berizin + ledger/waterfall onchain | UU Mata Uang: rupiah wajib; PJP tak memproses kripto (03 F-01..F-03) | Semua pembayaran QRIS dalam stablecoin ke smart contract | Aktif | 03, 04, 05 |
| D-02 | Covenant berbasis **payment floor kumulatif bulanan** + tangga eskalasi (cure → bond → step-in) | Omzet tunai tak terlihat; slashing karena omzet sepi menghukum tenant jujur | Revenue floor 3 hari + slashing otomatis | Aktif | 02 §4, 05 §5 |
| D-03 | Struktur senior/junior; pemilik ruko mengisi junior | Insentif selaras; first-loss; menjawab "kenapa investor mau" | Satu vault tunggal tanpa tranche | Aktif | 02 §9, 05 §7 |
| D-04 | Waterfall investor **sekuensial** (senior dulu, lalu junior) | Semantik kerugian paling jelas dan mudah diuji | Pro-rata dengan reserve | Aktif (bisa ditinjau untuk produksi) | 02 §3, 05 §5.1 |
| D-05 | Vault ERC-4626 dengan akuntansi internal, bertenor, penarikan terbatas kas, transfer allowlist | Piutang tak likuid; mitigasi inflasi share; kepatuhan | ERC-4626 murni redeem kapan saja; ERC-7540 asinkron penuh (opsi masa depan) | Aktif | 05 §7 |
| D-06 | Pasar sekunder dikeluarkan dari MVP | Risiko regulasi AKD, waktu build, risiko bank-run | AMM/liquidity pool | Aktif | 03 DC-03, 05 |
| D-07 | Waktu: `block.timestamp` untuk deadline fundraising/build; `dayId` dari atestasi untuk OPERATING dan seterusnya | Belum ada atestasi sebelum operasi; demo butuh jam yang bisa dipercepat | Semua pakai `block.timestamp`; semua pakai `dayId` | Aktif | 04 §7, 05 §2 |
| D-08 | Settlement boleh agregat (`periodDays` ≤ 31) dan ada `MAX_GAP` | Demo cepat (bulanan) dan mencegah lompatan jam logis | Hanya harian tanpa batas gap | Aktif | 05 §8 |
| D-09 | Address attestor terkunci per agreement | Mengurangi risiko penggantian sepihak | Admin dapat mengganti attestor | Aktif | 04 §5 |
| D-10 | Parameter agreement immutable setelah FUNDRAISING dimulai | Kepastian bagi pihak; mengurangi vektor penyalahgunaan admin | Parameter dapat diubah admin | Aktif | 05 §3, INV-15 |
| D-11 | Coverage check ≥ 2,0 sebagai gerbang originasi | Mencegah tenant rugi by design | Tanpa gerbang | Aktif (ambang dikalibrasi, OQ-12) | 02 §5, 05 §3 |
| D-12 | Total take-rate 20% (15% investor + 5% pemilik); tenant retain 80% | Konsisten dengan coverage 2,0 pada biaya 60% | 60% total (spesifikasi awal) | Aktif (asumsi) | 02 §2 |
| D-13 | Multiple tetap (1,25 senior / 1,40 junior) | Sederhana untuk MVP | Akrual APR berbasis waktu | Aktif; dikaji ulang (OQ-07) | 02 §9.3 |
| D-14 | Bond 10% dari anggaran | Menutup kebocoran ≈ 31% pada base | 2–3 bulan sewa (spesifikasi awal) | Aktif; keterjangkauan diuji (OQ-10) | 02 §8 |
| D-15 | Hanya Mode A diimplementasikan; Mode B sebagai antarmuka/stub | Waktu hackathon; arah regulasi tetap jelas | Implementasi Mode B penuh | Aktif | 04 §4 |
| D-16 | `MockIDR` (6 desimal), tidak mengklaim IDRX/stablecoin riil | Status stablecoin rupiah belum diverifikasi (03 F-08) | Integrasi token riil | Aktif | 04 §10 |
| D-17 | Aturan terminologi dan narasi wajib | Hindari overclaim yang dapat dibongkar juri/regulator | Narasi bebas | Aktif | 01 §7 |
| D-18 | Turnover rent pemilik dibayar **pari passu** (tidak disubordinasi) | Insentif pemilik; sederhana | Disubordinasi terhadap senior | Aktif (tinjau di OQ-16) | 02 §3 |
| D-19 | Admin tidak dapat menahan penarikan dana; pause hanya menolak settlement/deposit | Meminimalkan risiko custody oleh admin | Pause global | Aktif | 05 INV-10 |
| D-20 | Pengakuan repayment **pokok dulu** pada akuntansi vault | Konservatif; harga share naik setelah pokok pulih | Akrual bunga bertahap | Aktif | 05 §7.1 |
| D-21 | Royalti Fase B 2% ke tranche junior | Memberi upside bagi first-loss tanpa membebani senior | Royalti pro-rata atau tanpa royalti | Aktif (parameter) | 02 §3 |
| D-22 | Segmen awal: kedai/kafe kecil di ruko, Jember; pelanggan awal: pemilik ruko kosong | Cocok dengan masalah asal; QRIS relatif mudah dilacak | Food court, franchise | Aktif | 01 §6 |
| D-23 | Default tech: Solidity ^0.8.24, Foundry, OZ v5, Sepolia, Next.js + wagmi/viem | Standar ekosistem Ethereum | L2 tertentu | Sementara, menunggu OQ-01 | 04 §10 |
| D-24 | Payment floor naik dua tahap (60% di tenor target → 100% di tenor maksimum) | Menjaga insentif sambil memberi ruang ramp-up | Floor datar | Aktif (simulasi, OQ-15) | 02 §4 |
| D-25 | Masa sewa minimum 36 bulan (> tenor maksimum + 12 bulan) | Contoh awal (2 tahun) tidak menyisakan fase residual/step-in | Sewa 24 bulan | Aktif | 02 §2, 03 §5 |

## 3. Pertanyaan terbuka (Open Questions)

| ID | Pertanyaan | Mengapa penting | Siapa/cara menjawab | Blokir apa | Prioritas |
|---|---|---|---|---|---|
| OQ-01 | Aturan hackathon: tanggal, durasi, track, chain/L2 yang diwajibkan atau dinilai, syarat deploy, lisensi open-source, ukuran tim, kriteria juri | Menentukan chain, scope, dan penekanan pitch | Baca pengumuman resmi/panitia | 04 §10, 06 | **Tinggi (segera)** |
| OQ-02 | Chain final (Sepolia atau L2) dan token demo | Biaya gas, kecepatan demo | Setelah OQ-01 | 05 §14 | Tinggi |
| OQ-03 | Komposisi tim dan peran | Pembagian kerja di 06 §7 | Tim | 06 | Tinggi |
| OQ-04 | Perlu stub `LedgerPayoutAdapter` yang dapat dijalankan (bukan hanya antarmuka) untuk memperkuat narasi regulasi? | Nilai demo vs waktu | Tim setelah CP2 | 05 FR-17 | Sedang |
| OQ-05 | Jalur pilot yang dipilih (J2 privat tertutup atau J3 mitra SCF) | Struktur hukum dan dokumen | Konsultan hukum | 03 §4 | Sedang |
| OQ-06 | Apakah pemilik tetap meminta sewa dasar, dan bagaimana diperlakukan dalam model? | Realisme ekonomi pemilik dan tenant | Data publik (08) + diskusi | 02 | Sedang |
| OQ-07 | Multiple tetap atau batas return berbasis waktu (APR)? | Biaya efektif dan persepsi keadilan | Simulasi + data | 02, 05 | Sedang |
| OQ-08 | Siapa arbiter dan inspektur pada pilot? Kriteria independensi? | Governance dan R-09/R-10 | Konsultan + mitra | 04 | Sedang |
| OQ-09 | Bagaimana kontribusi in-kind pemilik dinilai dan dibuktikan untuk tranche junior? | Konversi in-kind → klaim | Hukum/akuntansi | 02, 05 | Sedang |
| OQ-10 | Apakah bond 10% terjangkau? Dapatkah uang jaminan sewa dialihkan sebagai bond? | R-07, klaim "low-capex" | Data publik + hukum sewa | 02 §8 | Tinggi |
| OQ-11 | Persyaratan asuransi aset renovasi dan siapa penerima manfaat | Mitigasi kebakaran/pencurian | Mitra/ahli | 03 §5 | Rendah |
| OQ-12 | Ambang coverage 2,0: sudah tepat? | Gerbang originasi | Kalibrasi dengan data (08) dan simulasi | 02 §5 | Sedang |
| OQ-13 | Metode cross-check kebocoran apa yang realistis di pilot (integrasi pemasok, mystery shopper)? | R-04 | Riset operasional | 02 §8 | Sedang |
| OQ-14 | KYC/APU-PPT investor dan tenant: siapa pelaksana dan pada tahap apa? | Kepatuhan | Konsultan | 03 | Sedang |
| OQ-15 | Rasio floor (60%) dan bentuk ramp dua tahap divalidasi lewat simulasi? | D-24 | Simulator | 02 §4 | Sedang |
| OQ-16 | Kebijakan konflik kepentingan pemilik (membeli senior, mengontrol approver) | R-09, R-14 | Tim + konsultan | 05 §11 | Sedang |
| OQ-17 | Kriteria hari excused (siapa menilai, bukti apa) | Mencegah penyalahgunaan | Tim + konsultan | 05 §5.8 | Rendah |
| OQ-18 | Nama dan branding proyek | Identitas pitch | Tim | 01 | Rendah |
| OQ-19 | Pada pilot: settlement harian atau agregat? | Biaya gas vs granularitas | Teknis + mitra | 05 §8 | Rendah |
| OQ-20 | Penyimpanan bukti (hash saja vs IPFS/penyimpanan terkontrol) | Auditabilitas vs privasi | Tim | 04 §8 | Rendah |
| OQ-21 | Apakah pemilik benar-benar mau menanggung junior dan menerima turnover rent (A-12/A-13)? | Kelayakan model | Validasi ringan (08 §8) / pilot | 02 | Tinggi (untuk pilot) |

## 4. Urutan penyelesaian yang disarankan (sebelum menulis kode)

1. **OQ-01, OQ-02, OQ-03** (informasi hackathon dan tim) — menentukan sisa rencana.
2. **Riset data publik (08)** — memperbarui nilai default di 02 (OQ-10, OQ-12, OQ-06).
3. **Kunci parameter v1** (02 §2, 05 §3) dan catat sebagai D-xx baru setelah data masuk.
4. **Kickoff build (06 §6)**.

## 5. Riwayat perubahan dokumen

| Versi | Tanggal | Perubahan | Oleh |
|---|---|---|---|
| 0.1 | 5 Okt 2026 | Draft awal paket dokumen 00–09 dari sesi brainstorming dan stress test | Asisten + tim `[ISI]` |
