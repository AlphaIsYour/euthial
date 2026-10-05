# 08 — Data Validation Plan

**Versi:** 0.1 · 5 Okt 2026 · Bergantung pada: `00`, `02`, `03` · Dipakai oleh: `02` (Assumptions Register), `07`, `09`

> Rencana mengumpulkan **data publik** untuk menguji asumsi di `02`, bagian 10, **tanpa wawancara dan tanpa relasi**. Nama sumber di bawah adalah **kandidat**; ketersediaan, isi, dan ketentuan penggunaan setiap sumber harus dibuka dan dibaca ulang oleh manusia sebelum dipakai. Tidak ada angka pasar di dokumen ini; semua angka tetap asumsi sampai ada data berlabel kualitas.

---

## 1. Tujuan dan prinsip

**Tujuan:** menurunkan ketidakpastian pada asumsi yang paling memengaruhi keputusan desain (anggaran fit-out, rasio biaya, omzet tercatat, harga sewa, recovery aset), dan menyatakan dengan jujur mana yang **tidak bisa** divalidasi tanpa pilot.

**Prinsip:**
1. **Tanpa wawancara/relasi.** Hanya data publik, observasi manual, dan literatur.
2. **Patuh ketentuan penggunaan** situs (lihat `03`, bagian 7). Tidak ada scraping otomatis yang dilarang; pengamatan manual dan pencatatan terbatas.
3. **Tanpa PII.** Jangan simpan nama, telepon, atau akun pribadi pemilik/penjual.
4. **Setiap angka berlabel:** sumber, tanggal akses, ukuran sampel, grade kualitas (bagian 7).
5. **Rentang, bukan titik.** Laporkan median, kuartil, dan rentang; model memakai skenario rendah/base/tinggi.
6. **Jujur soal batas.** Beberapa asumsi (porsi penjualan via QRIS, probabilitas gagal bayar tenant ini) tidak dapat dipastikan dari data publik.

## 2. Peta asumsi → data yang dibutuhkan

Prioritas: **P1** memengaruhi keputusan inti; **P2** memperbaiki akurasi; **P3** pelengkap.

| Asumsi | Isi | Data yang dibutuhkan | Metode | Dapat divalidasi publik? | Prioritas | Tugas |
|---|---|---|---|---|---|---|
| A-01 | Anggaran fit-out Rp150 jt | Rentang biaya fit-out ruko F&B skala kecil | RAB bottom-up dari harga satuan publik (bagian 4.2) | Sebagian (rentang) | P1 | DT-02 |
| A-02 | Rasio biaya 60% / 70% | Struktur biaya kedai/kafe kecil | Literatur, skripsi/jurnal, benchmark emiten (bagian 4.3) | Sebagian | P1 | DT-03 |
| A-03 | Omzet tercatat base 71,1 jt/bln | Estimasi omzet kedai sejenis | Proksi kunjungan × rata-rata belanja (bagian 4.4) | Hanya proksi kasar | P1 | DT-04 |
| A-04 | Porsi penjualan via QRIS | Adopsi QRIS di kedai kecil | Statistik BI + observasi stiker/QRIS pada sampel (bagian 4.5) | **Tidak** untuk porsi penjualan; hanya adopsi | P2 | DT-05 |
| A-05, A-06 | Take-rate 20%; multiple 1,25/1,40 | — (parameter desain) | Uji coverage dan harga risiko memakai data A-02, A-07 | Tidak perlu | — | DT-11 |
| A-07 | p gagal bayar 10–30% | Tingkat kegagalan usaha F&B | Literatur akademik/laporan (bagian 4.8) | Sebagian (definisi beragam) | P2 | DT-08 |
| A-08 | Bond 10% anggaran | Uang jaminan sewa yang lazim; daya bayar tenant | Listing sewa (kolom jaminan bila ada) + literatur | Sebagian | P2 | DT-01 |
| A-09 | Rasio floor 60% | — (parameter desain) | Simulasi (`06`, FR-S02) | Tidak perlu | — | DT-11 |
| A-10 | Masa sewa ≥ 36 bln | Lazimnya masa sewa ruko | Listing/artikel properti | Sebagian | P3 | DT-01 |
| A-11 | 1 bln = 30 hari | Konvensi | — | — | — | — |
| A-12 | Pemilik mau mengisi junior | Perilaku pemilik | **Tidak bisa** lewat data publik; proksi: lama ruko kosong (bagian 4.1) | Tidak | P1 | DT-01 |
| A-13 | Tenant mau take-rate 20% | Penerimaan tenant | **Tidak bisa** lewat data publik | Tidak | P1 | — (pilot) |
| A-14 | Target return investor 15% | Imbal alternatif lokal | Statistik suku bunga/yield publik (bagian 4.9) | Ya | P2 | DT-09 |
| A-15 | Recovery aset bergerak 20% | Harga bekas vs harga baru peralatan | Listing barang bekas (bagian 4.7) | Sebagian | P1 | DT-07 |
| A-16 | Faktor musiman 0,7–1,2 | Pola musiman kunjungan | Popular Times, minat pencarian, kalender, curah hujan (bagian 4.6) | Proksi kasar | P2 | DT-06 |

**Yang pasti butuh pilot:** A-03/A-04 (omzet tercatat nyata), A-12, A-13, perilaku kebocoran tunai.

## 3. Katalog sumber (kandidat)

| ID | Sumber | Dipakai untuk | Catatan |
|---|---|---|---|
| DS-01 | Portal properti populer (mis. Rumah123, 99.co, OLX) | Harga sewa ruko Jember, lama tayang | Harga tawar (asking price), bukan transaksi; pengamatan manual |
| DS-02 | Pengamatan lapangan virtual (peta/citra jalan) | Indikator ruko kosong, papan "disewakan/dikontrakkan" | Perhatikan tanggal citra |
| DS-03 | HSPK/standar harga satuan pemerintah daerah; pedoman AHSP Kementerian PUPR | Harga satuan pekerjaan fit-out | Cek ketersediaan edisi terbaru untuk Kab. Jember |
| DS-04 | Katalog toko bangunan dan e-commerce | Harga material, perabot, peralatan baru | Catat tanggal; harga berubah |
| DS-05 | Literatur akademik: Google Scholar, Garuda, repositori kampus lokal (mis. perguruan tinggi di Jember) | Struktur biaya, margin, kegagalan usaha UMKM F&B | Cek kualitas metode dan ukuran sampel |
| DS-06 | Laporan keuangan emiten ritel/F&B (bursa) | Batas atas/bawah struktur biaya skala besar | **Bukan** proksi UMKM; hanya pembanding arah |
| DS-07 | BPS (nasional dan Kab. Jember); statistik UMK/usaha mikro | Konteks ekonomi lokal, jumlah usaha, daya beli | Verifikasi tabel dan tahun |
| DS-08 | Bank Indonesia: statistik sistem pembayaran, informasi QRIS dan MDR | Adopsi QRIS, kebijakan MDR (F-09) | Data tingkat nasional/provinsi |
| DS-09 | Peta digital (ulasan, foto, jam ramai) | Proksi kunjungan, kapasitas kursi, menu | Hanya pengamatan manual; periksa ketentuan layanan |
| DS-10 | Layanan tren pencarian | Pola musiman minat | Indeks relatif, bukan volume |
| DS-11 | BMKG (data iklim) dan kalender nasional/akademik | Musim hujan, libur, Ramadan | Verifikasi tahun dan stasiun terdekat |
| DS-12 | Listing barang bekas (marketplace) | Harga bekas peralatan (mesin kopi, freezer, AC, etalase) | Harga tawar; sampel ≥ 10 per jenis |
| DS-13 | OJK/BI statistik perbankan dan suku bunga; DJPPR (SBN ritel); LPS (bunga penjaminan); portal KUR | Benchmark return dan biaya kredit alternatif | Catat tanggal data |
| DS-14 | Situs resmi pajak dan dinas pendapatan daerah | Daftar tanya pajak (R-22) | Hanya untuk konsultan; bukan perhitungan di MVP |

## 4. Protokol per topik

### 4.1 Harga sewa dan ruko kosong (A-08, A-10, A-12 proksi)
1. Sampel **≥ 30 listing** ruko disewakan di tiga kecamatan pusat kota (kemungkinan Kaliwates, Sumbersari, Patrang; verifikasi) plus 10 di luar pusat sebagai pembanding.
2. Catat kolom pada bagian 5.1. Hitung **harga sewa per m² per tahun**; laporkan median dan kuartil (buang pencilan ekstrem dengan aturan tertulis).
3. **Indikator kekosongan:** lama tayang listing (bila terlihat) dan proporsi listing dengan tampilan kondisi tidak terawat; ini proksi kasar untuk A-12, bukan bukti kesediaan pemilik.
4. Catat jaminan sewa dan masa sewa minimum bila tercantum (A-08, A-10).
5. Jangan menyimpan nama atau kontak penjual.

### 4.2 RAB fit-out (A-01)
1. Tetapkan **ruko referensi** (luas bangunan, jumlah lantai: `[ISI]`) dan **konsep** (kedai/kafe kecil).
2. Susun daftar pekerjaan: pembongkaran dan pembersihan, partisi, plafon, lantai, dinding/cat, kelistrikan, pencahayaan, plumbing/sanitasi, AC dan ventilasi, area dapur/bar, signage, furniture, peralatan.
3. Harga satuan dari DS-03/DS-04; tiga tingkat: **hemat / standar / premium**.
4. Pisahkan **barang bergerak** (peralatan, AC, freezer) dan **interior terpasang** (nilai recovery ≈ 0, `02`, 7.4) karena dibutuhkan untuk A-15.
5. Keluaran: total biaya rendah/base/tinggi, porsi barang bergerak, dan perbandingan dengan Rp150 jt.

### 4.3 Rasio biaya (A-02)
1. Kumpulkan ≥ 10 studi/laporan UMKM F&B (DS-05) yang memuat struktur biaya.
2. Seragamkan definisi sesuai `02`, bagian 5: **rasio biaya = bahan baku + tenaga kerja + utilitas + biaya operasional lain, tanpa sewa dasar dan pembiayaan.**
3. Catat metode studi (survei, studi kasus), ukuran sampel, jenis usaha, tahun.
4. Tambahkan pembanding emiten (DS-06) hanya sebagai arah, dengan catatan skala berbeda.
5. Keluaran: median dan rentang rasio biaya; uji batas **t maksimum = (1 − rasio biaya) / 2** (`07`, E-06).

### 4.4 Proksi omzet kedai (A-03)
Dalam hal ini data **bukan observasi omzet**; ini estimasi kasar untuk memeriksa kewajaran Rp71,1 jt/bln omzet **tercatat**.

1. Pilih **10–15 kedai/kafe** sejenis di Jember (rentang lokasi ramai dan sedang).
2. Per kedai catat: kapasitas kursi (foto/ulasan), jam buka, rata-rata harga menu (menu publik; harga layanan antar bisa lebih tinggi dari harga di tempat; tandai), pola jam ramai relatif (DS-09; indeks relatif terhadap puncak kedai itu sendiri, **bukan** jumlah absolut), dan pertumbuhan ulasan.
3. Estimasi kasar:
   `tx_harian ≈ kursi × tingkat_isi_rata_rata × putaran_per_hari + takeaway_harian`;  `omzet_harian ≈ tx_harian × rata_belanja`.
   Putaran, takeaway, dan porsi pengulas tidak teramati; gunakan **rentang lebar** dan tandai sebagai tebakan.
4. **Cek kewajaran terhadap base `02`:**

| Rata-rata belanja (ilustratif) | Transaksi QRIS/hari untuk Rp2,37 jt/hari |
|---|---|
| Rp20.000 | ≈ 118 |
| Rp30.000 | ≈ 79 |
| Rp40.000 | ≈ 59 |

   Omzet total = omzet tercatat ÷ porsi QRIS (q). Contoh: q = 40% / 60% / 80% → omzet total ≈ Rp178 jt / 119 jt / 89 jt per bulan. Pertanyaan: apakah angka itu masuk akal untuk kedai kecil di lokasi sasaran?
5. Keluaran: rentang omzet harian per kedai; posisi A-03 pada distribusi sampel (persentil); **grade C** pada hampir semua kasus.

### 4.5 Adopsi QRIS dan MDR (A-04, F-09)
1. Ambil statistik adopsi/pertumbuhan QRIS nasional dan, bila ada, per provinsi (DS-08).
2. Pada sampel kedai (4.4) catat **apakah menampilkan QRIS** (foto, ulasan, menu); hitung proporsi kedai yang menerima QRIS.
3. Verifikasi kebijakan MDR QRIS terkini ke sumber BI (F-09 masih sekunder).
4. **Batas:** porsi *penjualan* via QRIS (A-04) tidak teramati; di model gunakan rentang sensitivitas 30–80% sampai ada data pilot.

### 4.6 Musiman (A-16)
1. Indeks minat pencarian untuk kata kunci kedai/kopi, wilayah Jawa Timur, 3–5 tahun (DS-10).
2. Jam ramai relatif di kedai sampel pada hari kerja vs akhir pekan (DS-09).
3. Kalender: Ramadan, libur nasional, libur akademik; curah hujan bulanan (DS-11).
4. Keluaran: pengali musiman bulanan dengan rentang; bandingkan dengan 0,7–1,2.
5. Hipotesis (perlu diuji): lokasi dekat kampus dipengaruhi kalender akademik.

### 4.7 Harga bekas dan recovery (A-15)
1. Untuk tiap jenis peralatan utama (mesin kopi, grinder, freezer/kulkas, AC, etalase): sampel ≥ 10 listing bekas dan harga baru setara (DS-04, DS-12).
2. Hitung **rasio harga bekas/harga baru** menurut kondisi (1–2 tahun pakai) dan median.
3. `rec = Σ(nilai bekas barang bergerak) ÷ pokok total`. Interior terpasang = 0.
4. Catat bahwa harga tawar bukan harga terjual, dan biaya lelang/pembongkaran belum dikurangkan.

### 4.8 Kegagalan usaha (A-07)
1. Kumpulkan estimasi tingkat kegagalan/penutupan usaha F&B pada tahun ke-1 sampai ke-3 (DS-05, DS-07).
2. Catat **definisi** "gagal" tiap sumber (tutup vs gagal bayar); jangan menyamakan keduanya.
3. Keluaran: rentang p yang dapat dipertahankan; hubungkan ke `02`, 9.1 (m_min) dan sensitivitas.

### 4.9 Benchmark return dan biaya kredit (A-14)
1. Kumpulkan yield instrumen alternatif lokal (deposito/penjaminan, SBN ritel, bunga KUR, bunga kredit modal kerja; DS-13) dengan tanggal.
2. Susun tabel: imbal alternatif vs ekspektasi 15% vs biaya efektif tenant (≈ 43%/tahun senior pada base, `02`, bagian 6).
3. Pertanyaan yang dijawab: apakah ada selisih yang bisa dibenarkan oleh risiko, dan seberapa jauh tenant sasaran bisa mengakses alternatif yang lebih murah (R-08).

### 4.10 Daftar periksa pajak dan perizinan (R-22; untuk konsultan)
Kumpulkan referensi resmi (DS-14) untuk: pajak atas persewaan bangunan, pajak penghasilan UMKM, pajak daerah atas usaha makanan/minuman, perizinan usaha tenant (NIB, izin kuliner). **Tidak ada perhitungan pajak di MVP**; hasilnya hanya masuk daftar tanya `03`, bagian 6 (nomor 11 dan 14).

## 5. Skema dataset (CSV)

### 5.1 `sewa_ruko.csv`
`id, tanggal_akses, sumber(DS-xx), url_referensi, kecamatan, nama_jalan, luas_bangunan_m2, lantai, harga_sewa_per_tahun_idr, jaminan_idr, masa_sewa_min_bln, kondisi, lama_tayang_hari, catatan`

### 5.2 `rab_fitout.csv`
`item, kategori(bergerak|terpasang), satuan, volume, harga_satuan_rendah, harga_satuan_base, harga_satuan_tinggi, sumber, tanggal_akses`

### 5.3 `kedai_proksi.csv`
`id_kedai(anonim), kecamatan, kursi, jam_buka, rata_belanja_idr, menerima_qris(Y/N), indeks_ramai_siang, indeks_ramai_malam, ulasan_total, ulasan_6_bulan_terakhir, tanggal_akses`

### 5.4 `benchmark_biaya.csv`
`sumber, tahun, jenis_usaha, n_sampel, metode, bahan_baku_pct, tenaga_kerja_pct, utilitas_pct, lain_pct, rasio_biaya_pct, catatan_definisi`

### 5.5 `peralatan_bekas.csv`
`jenis, kondisi, umur_tahun, harga_bekas_idr, harga_baru_setara_idr, rasio, sumber, tanggal_akses`

### 5.6 `benchmark_return.csv`
`instrumen, imbal_pct, tanggal_data, sumber, catatan`

## 6. Etika, ketentuan penggunaan, privasi
- Baca ketentuan layanan dan `robots.txt` sebelum mengambil data dari suatu situs; bila ada larangan, gunakan pengamatan manual berjumlah kecil atau pilih sumber lain.
- Tidak ada akses ke data di balik login, tidak ada kredensial pihak lain.
- Tidak menyimpan PII (nama, telepon, akun pribadi); nama kedai diganti kode (`id_kedai`).
- Cantumkan sumber dan tanggal akses di setiap tabel; jangan menyalin teks atau gambar berhak cipta ke dokumen/slide.
- Hasil proksi tidak dipublikasikan sebagai "data pasar" (NN-06).

## 7. Grade kualitas dan aturan masuk model

| Grade | Definisi | Penggunaan di model |
|---|---|---|
| **A** | Sumber resmi/primer, atau ≥ 2 sumber independen yang konsisten | Nilai base; label "data publik" |
| **B** | Satu sumber kredibel, atau ≥ 20 observasi dengan metode jelas | Nilai base dengan rentang |
| **C** | Proksi kasar, sampel kecil, atau sumber sekunder | Hanya sebagai rentang sensitivitas; label "proksi" |
| **D** | Tebakan/tidak teramati | Tetap "asumsi"; wajib ada skenario sensitivitas |

**Aturan:** tidak ada angka grade C/D yang ditampilkan tanpa label grade; perubahan parameter default akibat data dicatat di `09` (NN-10).

## 8. Aturan keputusan (data → parameter)

| Asumsi | Kondisi data | Keputusan |
|---|---|---|
| A-01 | RAB base di luar ±30% dari Rp150 jt | Revisi anggaran B; skalakan P_s/P_j (80/20) dan bond (10%); catat di `09` |
| A-02 | Median rasio biaya > 60% | Turunkan take-rate ke t ≤ (1 − rasio)/2 atau tolak segmen; contoh: 65% → t ≤ 17,5% |
| A-03 | Omzet tercatat implisit (≈ 79 tx/hari pada belanja Rp30 rb) berada di atas persentil ke-75 kedai sampel | Turunkan R_base atau perpanjang tenor; jalankan ulang stress test `07` |
| A-04 | Tidak teramati | Pakai rentang 30–80%; ukur di pilot |
| A-07/A-15 | rec < 10% atau p di atas 20% | Naikkan m_min atau perbesar junior/bond; jalankan ulang `02`, 9.1 |
| A-08 | Jaminan sewa lazim lebih kecil dari bond | Bond bertahap atau ganti dengan jaminan sewa (R-07) |
| A-14 | Alternatif lokal yang aman memberi imbal mendekati 15% | Tinjau target return dan premi risiko (OQ-07) |
| A-16 | Amplitudo musiman terukur di luar 0,7–1,2 | Perbarui A-16 dan uji ulang S5 (`06`) |

## 9. Rencana kerja

| ID | Tugas | Perkiraan | Keluaran |
|---|---|---|---|
| DT-01 | Sewa dan indikator ruko kosong (4.1) | 2 jam | `sewa_ruko.csv` + ringkasan |
| DT-02 | RAB bottom-up (4.2) | 3 jam | `rab_fitout.csv` + rentang |
| DT-03 | Benchmark rasio biaya (4.3) | 3 jam | `benchmark_biaya.csv` |
| DT-04 | Proksi omzet (4.4) | 4 jam | `kedai_proksi.csv` + cek kewajaran |
| DT-05 | Adopsi QRIS dan MDR (4.5) | 1,5 jam | catatan + proporsi sampel |
| DT-06 | Musiman (4.6) | 1,5 jam | pengali bulanan dengan rentang |
| DT-07 | Harga bekas dan recovery (4.7) | 2 jam | `peralatan_bekas.csv` + `rec` |
| DT-08 | Kegagalan usaha (4.8) | 1,5 jam | rentang p |
| DT-09 | Benchmark return (4.9) | 1 jam | `benchmark_return.csv` |
| DT-10 | Daftar periksa pajak/perizinan (4.10) | 1 jam | lampiran untuk konsultan |
| DT-11 | Konsolidasi, kartu validasi, pembaruan `02` dan `09` | 2 jam | kartu validasi + log |

**Jalur cepat (≈ 8 jam, cukup untuk pitch):** DT-01, DT-02, DT-03, DT-05, lalu bagian dari DT-11.
**Jalur penuh (≈ 2 minggu paruh waktu):** semua DT, ditambah pengulangan sampel pada waktu berbeda. Pelaksana dan tanggal: `[ISI]`.

## 10. Keluaran dan pelaporan

**Kartu validasi asumsi** (satu per asumsi):

```
ID asumsi        : A-xx
Nilai di 02      : …
Temuan (rentang) : median … ; kuartil … ; n = …
Grade            : A/B/C/D
Sumber + tanggal : …
Keputusan        : tetap / revisi ke … / butuh pilot
Dicatat di 09    : D-xx (bila parameter berubah)
```

Setelah DT-11: perbarui kolom "Status" dan "Cara validasi" di `02`, bagian 10; jalankan ulang simulator dan matriks tes `07` bila parameter default berubah; catat di `09` (NN-10).

## 11. Keterbatasan yang diakui
- Harga listing adalah harga tawar; hasil transaksi biasanya berbeda.
- Proksi kunjungan tidak mengukur transaksi riil dan tidak mengukur porsi tunai.
- Literatur UMKM sering memakai sampel kecil dan definisi biaya berbeda.
- Kebocoran tunai dan kesediaan para pihak (A-12, A-13) tidak dapat diukur dari data publik.
- Validasi sesungguhnya dilakukan di pilot (`01`, bagian 9, fase 2).
