# 08 — Data Validation Plan (data publik, tanpa relasi)

**Versi:** 0.1 · 5 Okt 2026 · Bergantung pada: `02` (Assumptions Register), `03` · Hasil dipakai oleh: `02`, `06` (slide), `07`

> Tujuan: mengganti asumsi tebakan dengan **estimasi berbasis data publik** yang jujur dilabeli. Bukan membuktikan kebenaran pasar Jember secara statistik. Cukup memberi rentang (rendah/dasar/tinggi) yang masuk akal dan transparan.

---

## 1. Prinsip

1. **Rentang, bukan titik.** Setiap estimasi dilaporkan sebagai rendah / dasar / tinggi.
2. **Label sumber dan tanggal akses** untuk setiap data point.
3. **Manual, kecil, bersih.** Target 20–30 data point per kategori. Tidak perlu scraping otomatis; scraping dapat melanggar syarat penggunaan situs dan tidak diperlukan.
4. **Tidak ada data pribadi.** Catat jenis usaha, lokasi umum (kecamatan/jalan), harga; jangan catat nama atau kontak orang.
5. **Pisahkan fakta dan inferensi.** Kolom "fakta" (tertulis di sumber) terpisah dari "inferensi" (hasil hitung).
6. **Tampilkan sebagai "asumsi berbasis data publik, akan divalidasi di pilot"** di semua slide dan UI.

## 2. Kebutuhan data → asumsi yang divalidasi

| Kebutuhan | Menjawab asumsi | Output yang diharapkan | Prioritas |
|---|---|---|---|
| Harga sewa ruko di Jember (per tahun, per m²) | A-01 (konteks), bagian ekonomi pemilik | Median dan rentang harga sewa; sebaran per ukuran | Tinggi |
| Tanda ruko lama kosong (iklan lama/berulang, kondisi foto) | Narasi masalah (01) | Proporsi listing yang tampak lama kosong atau "perlu renovasi" (indikatif, bukan statistik) | Sedang |
| Biaya renovasi interior kafe/kedai per m² | A-01 | Rentang Rp/m²; estimasi budget untuk ukuran tipikal | Tinggi |
| Rasio biaya operasional kedai/kafe | A-02 | Rentang rasio biaya (bahan baku, tenaga kerja, utilitas) | Tinggi |
| Perkiraan omzet harian kedai kecil | A-03 | Rentang omzet harian/bulanan via model kapasitas | Tinggi |
| Porsi pembayaran non-tunai | A-04 | Rentang porsi QRIS/non-tunai (nasional/regional sebagai pembanding) | Sedang |
| Harga peralatan bekas (mesin espresso, freezer, AC) | A-15 | Rentang nilai jual bekas vs baru | Sedang |
| Musiman/pola kunjungan | A-16 | Faktor musiman kasar (hujan, Ramadan, libur) | Rendah |
| Daya beli lokal (UMK, pengeluaran) | Konteks | Gambaran tingkat harga wajar | Rendah |

## 3. Sumber dan metode per kategori

| Kategori | Sumber publik yang disarankan | Metode |
|---|---|---|
| Harga sewa ruko | Portal properti dan marketplace (mis. OLX, Rumah123, Facebook Marketplace/grup jual-sewa), situs agen properti lokal | Cari "sewa ruko Jember"; catat harga, ukuran/lantai, lokasi umum, kondisi (baru/bekas/perlu renovasi) dan tanggal iklan bila terlihat; hitung Rp/m²/tahun; ambil median |
| Tanda lama kosong | Iklan yang sama muncul berulang, deskripsi "bekas", foto kondisi | Catat indikator; laporkan sebagai indikatif |
| Biaya renovasi | Situs kontraktor/desainer interior yang mencantumkan harga per m², artikel RAB kafe/ruko, marketplace jasa | Kumpulkan rentang Rp/m²; kalikan ukuran tipikal (mis. 40–80 m²) untuk estimasi budget; bandingkan dengan A-01 (Rp150 jt) |
| Rasio biaya | Artikel bisnis, laporan industri F&B, panduan HPP kedai/kafe | Catat rentang HPP (COGS) dan biaya tenaga kerja; jumlahkan menjadi rasio biaya operasional; tandai sebagai benchmark umum, bukan lokal |
| Omzet (model kapasitas) | Google Maps (foto interior untuk jumlah kursi, jam buka, rentang harga), aplikasi pesan-antar (harga menu) | Lihat rumus bagian 4 |
| Porsi non-tunai | Statistik QRIS dari Bank Indonesia (nasional), artikel/studi adopsi QRIS UMKM | Pakai sebagai batas atas/pembanding; tandai bahwa data lokal tidak tersedia |
| Peralatan bekas | Marketplace (Tokopedia, Shopee, OLX) | Bandingkan harga baru vs bekas untuk 3–5 jenis alat; hitung rasio nilai jual bekas |
| Musiman | Google Maps "popular times" (jika tersedia), artikel pola konsumsi Ramadan/hujan | Faktor kasar 0,7–1,2 |
| Daya beli | BPS Jember, penetapan UMK setempat | Konteks ringkas |

> Catat bila sumber tak tersedia atau tak cukup. Ketiadaan data adalah temuan yang sah dan harus tampil di slide batasan.

## 4. Rumus proxy omzet (tanpa data nyata)

**Model kapasitas:**
```
omzet_harian = jumlah_kursi × putaran_per_hari × okupansi × rata_rata_belanja
```
- `jumlah_kursi`: dari foto interior kedai pembanding.
- `putaran_per_hari`: asumsi (mis. 2–6 tergantung jam ramai).
- `okupansi`: 0,3 / 0,5 / 0,7 (rendah/dasar/tinggi).
- `rata_rata_belanja`: dari harga menu tipikal (dibuat dari beberapa menu populer).

Tambahkan **penjualan bawa pulang/pesan-antar** sebagai persentase terpisah (asumsi).

**Hasil dilaporkan sebagai tiga skenario.** Bandingkan terhadap `R_base` (02 §6: ≈ 2,37 jt/hari tercatat). Bila model kapasitas untuk kedai kecil tipikal jauh di bawah angka itu, **ubah skenario target** (ukuran ruko, tenor, multiple) alih-alih memaksakan angka. Ini temuan penting: jika kedai kecil tipikal hanya menghasilkan sebagian dari R_base, maka parameter (02 §2) harus diturunkan atau target segmen diubah.

**Porsi tercatat:** `omzet_tercatat = omzet_harian × porsi_non_tunai_QRIS`. Gunakan rentang (mis. 40% / 60% / 80%); catat bahwa `L` (kebocoran) adalah komplemen ditambah penghindaran sengaja.

## 5. Template pengumpulan data (CSV)

Buat tiga berkas sederhana.

**`ruko_sewa.csv`**
`id, tanggal_akses, sumber, url_atau_ref, lokasi_umum, luas_m2, lantai, harga_sewa_per_tahun_rp, kondisi_tertulis, tanda_lama_kosong(ya/tidak/tak_jelas), catatan`

**`renovasi_biaya.csv`**
`id, tanggal_akses, sumber, url_atau_ref, jenis_pekerjaan, satuan, biaya_rp_per_m2_rendah, biaya_rp_per_m2_tinggi, catatan`

**`kedai_proxy.csv`**
`id, tanggal_akses, sumber, jenis_usaha, perkiraan_kursi, jam_buka, rentang_harga_menu, rata_belanja_estimasi, catatan`

Sertakan satu berkas `ringkasan.md` berisi tabel rendah/dasar/tinggi untuk A-01..A-04, A-15, A-16 dan tautan sumber.

## 6. Kontrol kualitas

- [ ] Setiap baris memiliki sumber dan tanggal akses.
- [ ] Tidak ada nama atau kontak orang.
- [ ] Outlier ditandai (jangan dibuang diam-diam).
- [ ] Median dan rentang dihitung dengan formula yang tercatat.
- [ ] Hasil dipakai untuk memperbarui `02` (nilai default atau rentang) dan dicatat di `09`.
- [ ] Batasan (jumlah sampel, sumber tidak lokal) dicantumkan.

## 7. Anggaran waktu

| Pekerjaan | Perkiraan |
|---|---|
| Harga sewa ruko (20–30 listing) | 1,5–2 jam |
| Biaya renovasi (10–15 acuan) | 1–1,5 jam |
| Rasio biaya + benchmark margin | 1 jam |
| Model kapasitas (5–8 kedai pembanding) | 1,5 jam |
| Peralatan bekas + musiman + daya beli | 1 jam |
| Ringkasan dan integrasi ke 02 | 1 jam |
| **Total** | **≈ 7–8 jam** (dapat dibagi tim, dikerjakan sebelum hari H) |

## 8. Opsional: validasi ringan lewat pesan (hanya bila ada peluang)

Tidak wajib. Bila tim menemukan satu atau dua pemilik kedai/ruko yang bersedia, cukup pesan singkat:

> "Halo, saya mahasiswa/tim yang sedang meneliti pembiayaan renovasi ruko di Jember untuk proyek kompetisi. Bolehkah saya bertanya 3 hal singkat secara anonim: perkiraan biaya renovasi, kisaran omzet bulanan, dan porsi pembayaran non-tunai? Tidak ada penawaran produk."

Hasil (jika ada) dicatat sebagai data tambahan berlabel "informal, n kecil".

## 9. Cara memakai hasil

- **Slide validasi:** satu slide "Asumsi berbasis data publik" berisi rentang + sumber + batasan.
- **Simulator:** nilai default dan rentang slider diambil dari ringkasan.
- **Keputusan desain:** jika coverage check gagal pada data realistis, turunkan take-rate atau ubah segmen dan catat di `09`.
- **Pilot:** daftar data nyata yang diminta saat pilot (omzet QRIS harian, biaya, pembelian bahan baku).
