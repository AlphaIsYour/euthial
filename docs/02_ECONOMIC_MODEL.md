# 02 — Economic Model

**Versi:** 0.1 · 5 Okt 2026 · Bergantung pada: `00`, `01` · Dipakai oleh: `05` (kontrak), `06` (simulator)

> **Semua angka di dokumen ini adalah asumsi ilustratif**, bukan data pasar. Registernya ada di bagian 10. Perhitungan IRR/APR adalah pendekatan kasar (cicilan bulanan rata, tanpa biaya lain) dan hanya untuk memberi gambaran orde besar.

---

## 1. Mengapa spesifikasi awal gagal secara ekonomi

Spesifikasi awal membagi **omzet kotor**: 40% investor + 20% pemilik + 40% tenant pada fase amortisasi.

Jika biaya operasional tenant (bahan baku, gaji, listrik, dll.) sekitar 60% omzet (A-02), tenant yang hanya memegang 40% mengalami **margin −20%** pada saat investor justru terbayar sesuai jadwal. Pada skenario biaya 70%, margin −30%. Artinya model **rugi by design** bagi tenant.

Kesimpulan desain: take-rate harus dibatasi oleh margin operasional tenant (coverage check), bukan oleh keinginan mempercepat pelunasan.

## 2. Parameter default (MVP)

| Parameter | Simbol | Default | Satuan/catatan |
|---|---|---|---|
| Anggaran fit-out | B | 150.000.000 | Rp (A-01) |
| Pokok senior | P_s | 120.000.000 | Rp (80% dari B) |
| Pokok junior | P_j | 30.000.000 | Rp (20% dari B), diisi pemilik ruko (A-12) |
| Multiple senior | m_s | 1,25 | × pokok (A-06) |
| Multiple junior | m_j | 1,40 | × pokok (A-06) |
| Take-rate investor | i | 1.500 bps (15%) | dari omzet tercatat |
| Take-rate pemilik (turnover rent) | l | 500 bps (5%) | dari omzet tercatat |
| Total take-rate Fase A | t = i + l | 2.000 bps (20%) | (A-05) |
| Royalti Fase B (ke junior) | r | 200 bps (2%) | hanya setelah semua klaim lunas |
| Turnover rent Fase B | l_B | 500 bps (5%) | berlanjut |
| Tenor target | T_t | 18 bulan | 1 bulan logis = 30 hari logis (A-11) |
| Tenor maksimum | T_max | 24 bulan | titik di mana floor = 100% klaim |
| Masa sewa minimum | T_lease | ≥ 36 bulan | harus > T_max + buffer ≥ 12 bulan (A-10) |
| Rasio floor pada tenor target | f | 60% | dari total klaim (A-09) |
| Bond tenant | Bond | 10% × B = 15.000.000 | Rp (A-08) |
| Toleransi shortfall | ε | 1% dari total klaim | menghindari pemicu karena selisih kecil |
| Masa cure | D_cure | 7 hari logis | |
| Jendela sinyal kesehatan | W | 14 hari logis | informatif saja |

**Klaim:**
- Klaim senior C_s = P_s × m_s = 150.000.000
- Klaim junior C_j = P_j × m_j = 42.000.000
- Total klaim C = C_s + C_j = **192.000.000**

## 3. Definisi waterfall (apa yang dihitung, dalam urutan)

Untuk setiap hari settlement dengan omzet tercatat **G** (Rupiah, dari attestation):

**Fase A (Amortisasi)** — berlaku selama C_s atau C_j belum lunas:
1. `Landlord_take = G × l`
2. `Investor_take = G × i`
3. `Tenant_retain = G − Landlord_take − Investor_take` (tetap pada tenant)
4. Distribusi `Investor_take` **sekuensial**: ke senior sampai C_s terpenuhi, sisanya ke junior sampai C_j terpenuhi.
5. Jika `Investor_take` melebihi sisa klaim total, **kelebihan dikembalikan ke tenant** dan sistem berpindah ke Fase B pada settlement berikutnya.

**Fase B (Residual)** — setelah C_s dan C_j lunas:
- `Landlord_take = G × l_B`
- `Royalty = G × r` → ke pemegang junior
- Sisanya ke tenant.

**Pembulatan:** semua pecahan memakai pembagian bilangan bulat (floor). Sisa pembulatan (dust) tetap pada tenant (mode B) atau dikembalikan ke tenant (mode A). Total yang didistribusikan tidak boleh melebihi G (INV-01, lihat 05).

**Catatan:** omzet tunai tidak tercatat, sehingga **tidak ikut G**. Itu inti masalah cash leakage (bagian 7).

## 4. Payment floor (pengganti revenue floor + slashing otomatis)

Revenue floor onchain hanya valid kalau data omzet dipercaya penuh; omzet tunai tidak terlihat. Karena itu covenant diletakkan pada **pembayaran**, bukan omzet.

**Jadwal pembayaran minimum kumulatif** `Floor(d)` untuk hari logis efektif `d` (setelah dikurangi hari yang dibebaskan/excused):

- Untuk `d ≤ T_t × 30`: `Floor(d) = C × f × d / (T_t × 30)`  (naik linear dari 0 ke 60% klaim)
- Untuk `T_t × 30 < d ≤ T_max × 30`: naik linear dari `C × f` ke `C` (100% klaim)
- Untuk `d > T_max × 30`: `Floor(d) = C`

**Uji bulanan** (setiap kelipatan 30 hari logis): `Shortfall = max(0, Floor(d) − CumulativeInvestorPaid)`. Jika `Shortfall > ε × C` → masuk tangga eskalasi:

| Langkah | Kondisi | Aksi |
|---|---|---|
| 0. Healthy | Shortfall ≤ ε × C | Tidak ada |
| 1. Cure | Shortfall > ε × C | Tenant diberi D_cure hari logis untuk setor top-up (masuk ke waterfall sebagai pembayaran investor) |
| 2. Bond draw | Masih kurang setelah cure | Tarik bond sebesar min(Shortfall, saldo bond), diteruskan lewat waterfall |
| 3. Step-in | Bond habis dan masih kurang, atau pelanggaran berturut-turut (≥ 2 uji) | Status STEP_IN: proses pengambilalihan aset (off-chain, lihat 03), pencatatan write-off |

**Sinyal kesehatan omzet (informatif, tidak memotong apa pun):** rata-rata bergulir omzet tercatat W hari logis. Jika turun di bawah ambang kesehatan yang disepakati → status WARNING dan event untuk dashboard. Ini membantu deteksi dini, tanpa menghukum tenant jujur.

**Hari yang dibebaskan (excused):** arbiter dapat menandai rentang hari (hujan lebat, libur nasional, Ramadan, force majeure) dengan bukti (hash). Hari excused dikurangi dari `d`. Batas: maksimum `N_excused` hari per 12 bulan (default 30) agar tidak disalahgunakan.

**Hari tanpa attestation:** dicatat sebagai *unknown* (bukan nol). Setelah 3 hari berturut-turut tanpa attestation → status ORACLE_STALE dan uji covenant dijeda. Lihat 05, bagian edge cases.

> **Konsekuensi jujur:** payment floor membuat produk mendekati **utang** dengan percepatan berbasis omzet. Ini mengurangi risiko investor dan menjawab data omzet yang tak terpercaya, tetapi dapat mempengaruhi klasifikasi regulasi (lihat 03, F-07).

## 5. Coverage check (gerbang originasi)

Sebelum kontrak dibuat, hitung:

```
margin_operasional  = 1 − rasio_biaya        (biaya bahan baku, gaji, utilitas; tanpa sewa dasar dan pembiayaan)
coverage            = margin_operasional / t
```

**Syarat lolos: `coverage ≥ 2,0`.**

| Skenario biaya | Margin operasional | t = 20% | Coverage | Hasil |
|---|---|---|---|---|
| Base (biaya 60%) | 40% | 20% | 2,0 | Lolos (batas) |
| Stress (biaya 70%) | 30% | 20% | 1,5 | **Tidak lolos**: kurangi take-rate atau tolak |
| Spesifikasi awal (t = 60%) | 40% | 60% | 0,67 | Gagal telak |

Tenant retain setelah take: base case 80% − 60% = **+20%** (sebelum gaji pemilik usaha, sewa dasar, pajak); Fase B: 93% − 60% = +33%. Pada stress (biaya 70%): +10%.

Di MVP, coverage check dijalankan di **simulator/front-end** dan sebagai `require` opsional saat pembuatan agreement (lihat 05).

## 6. Base case (ilustratif)

Dengan parameter default dan omzet tercatat konstan:

- Omzet tercatat yang dibutuhkan agar C lunas: `C / i = 192.000.000 / 0,15 = 1.280.000.000`.
- Untuk lunas dalam 18 bulan: **≈ 71.111.111 / bulan ≈ 2.370.370 / hari** (R_base, A-03).
- Pembayaran ke senior: 10.666.667/bulan → C_s lunas dalam **≈ 14,1 bulan**; junior menerima 4 bulan berikutnya.
- Turnover rent pemilik selama 18 bulan: `5% × 1.280.000.000 = 64.000.000`.
- Tenant retain Fase A: 80% omzet tercatat.
- **Biaya modal efektif senior** (pendekatan kasar): sekitar **43% per tahun** karena multiple 1,25× dilunasi dalam ~14 bulan. Modal ini **mahal** bagi tenant; produk harus menyasar tenant yang tak punya akses modal murah.

> Data yang dibutuhkan agar angka ini bermakna: harga sewa ruko, RAB renovasi, kisaran omzet kedai. Lihat `08_DATA_VALIDATION_PLAN.md`.

## 7. Stress test

### 7.1 Omzet tercatat lebih rendah dari base (T_max = 24 bulan)

Asumsi: tanpa step-in dan tanpa recovery aset (konservatif untuk investor, karena recovery menambah pembayaran). Bond 15 juta ditarik penuh bila perlu untuk menutup shortfall terhadap Floor pada bulan ke-24.

| Omzet vs base | Investor take 24 bln | Bond terpakai | Total ke investor | Senior (pokok 120) | Junior (pokok 30) |
|---|---|---|---|---|---|
| 100% | 192,0 jt (capped, lunas bln 18) | 0 | 192,0 | 150,0 (lunas) | 42,0 (lunas) |
| 70% | 179,2 jt | 12,8 | 192,0 | 150,0 (lunas) | 42,0 (lunas) |
| 50% | 128,0 jt | 15,0 | 143,0 | 143,0 (pokok aman, profit +23) | 0 (rugi −30, −100%) |
| 40% | 102,4 jt | 15,0 | 117,4 | 117,4 (rugi −2,6; −2,2%) | 0 (−100%) |
| 30% | 76,8 jt | 15,0 | 91,8 | 91,8 (rugi −28,2; −23,5%) | 0 (−100%) |

**Pembacaan:**
- Junior menyerap kerugian pertama; pokok senior aman sampai omzet jatuh ke sekitar 40–45% dari base (dengan bond).
- Tanpa bond/floor (revenue share murni), pada omzet 40% senior rugi 17,6 jt; dengan bond hanya 2,6 jt. Bond adalah penyerap kerugian yang efektif, tetapi dibayar tenant dan harus terjangkau (R-07).
- Pada praktiknya pelanggaran floor akan terdeteksi **jauh sebelum bulan 24** dan memicu step-in lebih awal; simulator harus memodelkan waktu terjadinya step-in.

### 7.2 Biaya tenant 70% (bukan 60%)
Coverage jatuh ke 1,5. Tenant retain hanya +10% pada omzet base. Risiko tenant gagal bayar meningkat; kontrak sebaiknya ditolak atau take-rate diturunkan (uji sensitivitas di simulator).

### 7.3 Musiman
Simulator harus memasukkan faktor musiman (A-16): contoh pengali 0,7–0,8 saat musim hujan atau Ramadan tertentu, dan 1,1–1,2 pada puncak. Hari ekstrem dapat ditandai excused (bagian 4). Tujuan: membuktikan bahwa uji berbasis **kumulatif bulanan** tidak menghukum fluktuasi harian normal.

### 7.4 Recovery aset
Parameter A-15: bagian dari pokok yang berupa barang bergerak (mesin, freezer, AC) dan nilai jualnya setelah penyusutan. Default stress: recovery 20% dari pokok. Interior terpasang dianggap **nol** recovery (menempel ke bangunan). Recovery masuk sebagai pembayaran pada tahap likuidasi (lihat 03, 05).

## 8. Leakage (kebocoran tunai): dibatasi, bukan dihapus

Misalkan omzet sebenarnya `R_true` dan fraksi yang dialihkan ke tunai `L`. Maka omzet tercatat = `(1 − L) × R_true`.

**Selisih pembayaran investor terhadap dunia tanpa kebocoran per bulan** = `L × i × R_true`.

**Bond minimum untuk menoleransi kebocoran L\*** (pada R_true = R_base, lunas penuh di T_max):

```
Bond(L*) = max(0, C − T_max × i × (1 − L*) × R_base)
```

| L* | Bond yang dibutuhkan |
|---|---|
| 20% | 0 |
| 30% | 12,8 juta |
| 40% | 38,4 juta |
| 50% | 64,0 juta |

Bond default 15 juta menoleransi kebocoran sampai **≈ 31%** pada R_base. Di atas itu kerugian jatuh ke junior lalu senior (tabel 7.1 memetakan omzet tercatat 70% = L 30%, dst.).

**Mitigasi non-ekonomi (lihat 04, 07):** QRIS khusus dengan rekening settlement escrow, cross-check pembelian bahan baku vs omzet, mystery shopper acak, promo QRIS untuk pelanggan, pemilik ruko hadir di lokasi (insentif aligned karena ia juga menerima turnover rent).

## 9. Menjawab "kenapa investor mau menanggung risiko tenant kecil?"

### 9.1 Harga risiko
Multiple minimum agar investor memperoleh ekspektasi return 15% (A-14):

```
m_min = (1,15 − p × rec) / (1 − p)        p = probabilitas gagal bayar, rec = recovery (fraksi pokok)
```

| p (gagal bayar) | rec | m_min | Perkiraan APR efektif (cicilan rata 18 bln) |
|---|---|---|---|
| 10% | 20% | ≈ 1,26× | ≈ 34% |
| 20% | 20% | ≈ 1,39× | ≈ 55% |
| 30% | 20% | ≈ 1,56× | ≈ 83% |

Implikasi: bila risiko dibiarkan tak terkelola, modal ini terlalu mahal bagi tenant. Karena itu produk memakai **empat tuas penurun risiko**, bukan sekadar menaikkan harga:

| Tuas | Mekanisme | Efek |
|---|---|---|
| 1. Tenant terbukti | Prioritaskan outlet ke-2 / riwayat QRIS ≥ 6 bulan | Menurunkan p |
| 2. Tranche junior | Pemilik ruko + bond tenant sebagai first-loss | Melindungi senior (tabel 7.1) |
| 3. Diversifikasi | Satu vault pool beberapa tenant (fase 3) | Menurunkan risiko idiosinkratik |
| 4. Payment floor | Pembayaran minimum, bukan hanya persen omzet | Menutup masalah data omzet tak terpercaya |

### 9.2 Posisi pemilik ruko
Pemilik menanggung first-loss karena ia memperoleh manfaat terbesar: aset kembali produktif, nilai aset naik, plus turnover rent. Ini menggantikan praktik umum Web2 (tenant improvement allowance / masa bebas sewa) dengan klaim junior yang jelas.

### 9.3 Catatan desain terbuka
- **Multiple tetap vs akrual APR:** multiple tetap membuat biaya efektif lebih tinggi jika dilunasi cepat. Alternatif: batas return berbasis waktu. Dicatat di `09` (OQ-07).
- **Sewa dasar:** MVP tidak memodelkan sewa dasar (hanya turnover rent). Dalam kenyataan pemilik mungkin tetap meminta sewa dasar kecil (OQ-06).

## 10. Assumptions Register

| ID | Asumsi | Nilai | Status | Cara validasi |
|---|---|---|---|---|
| A-01 | Anggaran fit-out per ruko | Rp150 jt | Belum divalidasi | RAB/kisaran Rp per m² dari kontraktor/artikel |
| A-02 | Rasio biaya operasional tenant | 60% base, 70% stress | Belum | Literatur margin F&B lokal, wawancara/ data publik |
| A-03 | Omzet tercatat base | 71,1 jt/bln (≈2,37 jt/hari) | **Turunan, bukan observasi** | Proxy: pengunjung × rata-rata belanja × porsi QRIS |
| A-04 | Porsi penjualan via QRIS | Tidak diketahui | Belum | Survei kecil/ data publik adopsi QRIS lokal |
| A-05 | Total take-rate | 20% | Parameter desain | Uji dengan coverage check |
| A-06 | Multiple senior/junior | 1,25 / 1,40 | Parameter desain | Bandingkan dengan harga risiko (9.1) |
| A-07 | Probabilitas gagal bayar dan recovery | p 10–30%, rec 20% | **Tebakan** | Literatur kegagalan usaha F&B; sensitivitas |
| A-08 | Bond | 10% anggaran | Parameter desain | Cek keterjangkauan tenant; opsi memakai uang jaminan sewa |
| A-09 | Rasio floor | 60% | Parameter desain | Simulasi |
| A-10 | Masa sewa | ≥ 36 bln | Syarat desain | Negosiasi perjanjian sewa |
| A-11 | Konversi waktu | 1 bln = 30 hari logis | Konvensi | Tidak perlu |
| A-12 | Pemilik mau mengisi junior 20% | Ya | **Belum divalidasi** | Wawancara pemilik (opsional) |
| A-13 | Tenant mau take-rate 20% | Ya | **Belum divalidasi** | Wawancara tenant (opsional) |
| A-14 | Target return investor | 15% ekspektasi | Asumsi | Bandingkan alternatif investasi lokal |
| A-15 | Recovery aset bergerak | 20% pokok | **Tebakan** | Harga bekas peralatan |
| A-16 | Faktor musiman | 0,7–1,2 | **Tebakan** | Pola kunjungan/ Google Maps popular times |

## 11. Spesifikasi simulator (dipakai tim frontend/riset)

**Input:** semua parameter bagian 2; rasio biaya; omzet base dan faktor kurva; musiman (array 12 bulan); L (kebocoran); parameter recovery; skenario default.

**Output per hari logis:** G, split (landlord, senior, junior, tenant retain), saldo klaim, cumulative paid, Floor(d), Shortfall, status covenant.

**Output agregat:** bulan lunas senior/junior, return dan IRR per pihak, loss per tranche, bulan step-in, bond terpakai, margin tenant, coverage.

**Preset skenario:** Normal (100%), Lambat (70%), Sangat lambat (40–50%), Kebocoran 30%, Musiman, Default (omzet runtuh bulan ke-N).

**Peringatan UI:** tampilkan label "asumsi; bukan data pasar" di semua grafik.
