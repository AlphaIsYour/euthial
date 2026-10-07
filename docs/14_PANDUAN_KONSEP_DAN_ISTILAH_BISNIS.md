# 14 — Panduan Konsep, Istilah, dan Metode Bisnis Euthial

> **Tujuan Dokumen:** Panduan ramah pemula untuk memahami seluruh konsep bisnis, istilah finansial, dan mekanisme otomatis di balik platform **Euthial (Fit-Out Vault)** tanpa menggunakan bahasa teknis yang rumit.

---

## 1. Latar Belakang Masalah (Kenapa Platform Ini Dibuat?)

Bayangkan skenario nyata di perkotaan Indonesia:
- Banyak **ruko kosong** milik pemilik properti (*Landlord*) yang tidak menghasilkan uang.
- Banyak **pengusaha UMKM / tenant** yang punya produk bagus (misalnya kafe kopi, klinik kecantikan, restoran bakso) dan ingin menyewa ruko tersebut.
- **Masalah Terbesar:** Biaya renovasi interior ruko (lantai, plafon, dapur, meja-kursi, lampu, AC) sangat mahal, bisa mencapai **Rp 100 juta – Rp 200 juta**.
- Pengusaha tidak punya uang tunai sebanyak itu. Jika meminjam ke bank konvensional, bank selalu meminta **sertifikat tanah/rumah sebagai agunan**, dan mengenakan bunga cicilan bulanan yang kaku (omzet sepi atau ramai, cicilan bank tetap sama).
- **Solusi Euthial:** Platform pembiayaan renovasi ruko berbasis bagi hasil dari mesin kasir harian (*Revenue-Based Financing*) dengan jaminan berbasis sistem (*on-chain covenants*).

---

## 2. Studi Kasus Nyata: "Budi Membuka Kafe Kopi"

Untuk mempermudah pemahaman seluruh istilah di proyek ini, kita gunakan satu contoh kasus:

> **Tokoh:** Budi  
> **Usaha:** Kafe Kopi "Kopi Sahabat"  
> **Kebutuhan:** Renovasi ruko kosong senilai **Rp 150 Juta**  
> **Durasi Kontrak:** 24 Bulan (2 Tahun / 720 Hari)

---

## 3. Kamus Istilah Bisnis (Dari Bahasa Rumit ke Bahasa Manusia)

Berikut adalah arti dari seluruh istilah finansial yang digunakan di platform ini:

### 1. Fit-Out
* **Artinya:** Pekerjaan renovasi dan dekorasi interior ruko kosong agar siap dipakai jualan (pasang keramik, bar kopi, instalasi listrik, meja kursi).
* **Di proyek ini:** Uang investasi Rp 150 juta digunakan khusus untuk membiayai pekerjaan *fit-out* ini.

### 2. Revenue-Based Financing (RBF)
* **Artinya:** Metode pembiayaan bagi hasil berdasarkan omzet penjualan riil di mesin kasir (*POS System*).
* **Bedanya dengan Bank:** 
  * Bank: Menagih nominal cicilan tetap tiap bulan (misal Rp 10 juta flat, tidak peduli toko lagi sepi).
  * RBF: Memotong persentase dari omzet harian (misal 15% dari omzet kasir).
    * Jika hari ini kafe ramai (omzet Rp 10 juta) $\rightarrow$ setoran investor Rp 1,5 juta.
    * Jika hari ini kafe sepi (omzet Rp 1 juta) $\rightarrow$ setoran investor Rp 150 ribu.

### 3. Tranche Senior & Junior (Dua Kelas Investor)
Total modal renovasi Rp 150 juta tidak berasal dari satu orang saja, melainkan dibagi menjadi dua kelompok investor dengan profil risiko berbeda:

| Jenis Investor | Modal Disetor | Karakter & Keuntungan | Tingkat Keamanan |
|---|---|---|---|
| **Senior Tranche** | **Rp 120 Juta (80%)** | **Tipe Main Aman.** Keuntungan lebih pasti (target kelipatan 1.25x modal). Berhak mendapatkan pengembalian modal paling pertama sebelum orang lain. | 🛡️ Sangat Tinggi (Paling Dilindungi) |
| **Junior Tranche** | **Rp 30 Juta (20%)** | **Tipe Berani Risiko.** Mengalah di belakang Senior. Jika terjadi kerugian, modal mereka yang menanggung risiko terlebih dahulu. Namun, jika bisnis sukses besar, mereka mendapat bonus royalti terbesar di akhir (target kelipatan 1.40x modal). | ⚡ Moderat/Tinggi (High Risk, High Return) |

### 4. Waterfall (Model Pembagian Uang "Air Terjun")
* **Artinya:** Urutan antrean pembagian uang setoran harian dari kasir.
* Setiap kali uang setoran harian masuk, sistem membaginya secara bertingkat seperti air terjun:
  1. **Tingkat 1 (Atas):** Pemilik Ruko (*Landlord*) menerima **5%** sebagai uang sewa tempat.
  2. **Tingkat 2 (Tengah):** Masuk ke **Investor Senior** sampai seluruh modal Rp 120 juta + keuntungannya lunas 100%.
  3. **Tingkat 3 (Bawah):** Masuk ke **Investor Junior** sampai modal Rp 30 juta + keuntungannya lunas 100%.
  4. **Sisa Omzet (80% - 85%):** Tetap berada di rekening Budi (tenant) untuk biaya belanja bahan kopi, operasional, dan gaji karyawan.

### 5. Security Deposit / Bond (Uang Jaminan Tenant)
* Sebelum renovasi dimulai, Budi wajib menyetorkan uang jaminan sebesar **10% dari total anggaran (Rp 15 Juta)** ke dalam sistem.
* Uang ini bukan biaya hangus, melainkan **uang titipan jaminan**.
* Jika kafe Budi berjalan lancar selama 2 tahun hingga kontrak selesai, **uang Rp 15 juta ini akan dikembalikan utuh 100% ke Budi**.

### 6. Covenant & Floor (Batas Minimal Omzet Bulanan)
* Agar Budi tidak malas-malasan membuka toko atau sengaja menyembunyikan uang kasir, sistem membuat aturan batas minimal yang disebut **Floor Target**.
* **Contoh:** Dalam sebulan, setoran bagi hasil investor minimal harus mencapai **Rp 6,4 Juta**.
* Jika setoran Budi $\ge$ Rp 6,4 Juta $\rightarrow$ Statusnya **HEALTHY (Sehat)**.
* Jika setoran Budi $<$ Rp 6,4 Juta $\rightarrow$ Sistem membunyikan alarm peringatan!

### 7. Cure Period (Masa Tenggang 7 Hari)
* Jika pada akhir bulan omzet Budi kurang dari target (misalnya hanya terkumpul Rp 4 juta, kurang Rp 2,4 juta), sistem memberikan masa perbaikan selama **7 hari**.
* Budi diberi kesempatan menambah setoran secara manual (dari tabungan pribadi atau promo diskon) untuk menambal kekurangan tersebut.

### 8. Bond Draw (Pemotongan Uang Jaminan Otomatis)
* Jika masa tenggang 7 hari habis dan Budi tetap tidak menambal kekurangan Rp 2,4 juta tadi, smart contract akan bertindak otomatis:
* **Uang jaminan Rp 15 juta milik Budi akan dipotong otomatis** sebesar Rp 2,4 juta untuk menutup hak investor.
* Investor tetap menerima haknya tepat waktu, sedangkan sisa saldo jaminan Budi berkurang menjadi Rp 12,6 juta.

### 9. Step-In (Pengambilalihan Kafe Secara Paksa)
* Jika kafe Budi mengalami masalah berat dan ia gagal memenuhi target selama **2 bulan berturut-turut** atau uang jaminannya sudah habis:
* Sistem memicu status darurat **STEP_IN**.
* **Artinya:** Hak operasional kafe disita dari Budi oleh Pemilik Ruko / Manajemen platform. Ruko beserta seluruh perabot kafenya diambil alih untuk disewakan ke pengusaha baru atau dijual peralatannya (*likuidasi*), sehingga uang investor tidak hilang begitu saja.

### 10. Residual (Fase Lunas & Panen Keuntungan)
* Jika seluruh pinjaman modal investor (Senior Rp 150 juta klaim & Junior Rp 42 juta klaim) sudah lunas terbayar sebelum masa 2 tahun berakhir:
* Kontrak berpindah ke fase **RESIDUAL**.
* Di fase ini, beban bagi hasil Budi turun drastis: Budi tidak lagi mencicil pokok modal, melainkan hanya membayar royalti kecil sebesar **2%** kepada Investor Junior sebagai ucapan terima kasih telah mendanai di awal. Sisanya 98% menjadi keuntungan bersih milik Budi.

---

## 4. Alur Perjalanan Sistem dari Awal hingga Selesai

```text
1. FUNDRAISING (Penggalangan Dana)
   - Investor Senior setor Rp 120 Juta
   - Investor Junior setor Rp 30 Juta
   - Budi (Tenant) setor jaminan Rp 15 Juta
               ↓
2. BUILDING (Renovasi Ruko Bertahap)
   - Kontraktor merenovasi ruko dalam 3 tahapan (Milestone)
   - Tiap tahap diperiksa oleh Inspektur independen
   - Uang modal cair bertahap: Tahap 1 (30%) → Tahap 2 (40%) → Tahap 3 (30%)
               ↓
3. OPERATING (Kafe Buka & Operasional Harian)
   - Tiap hari kasir mengirim data omzet
   - Sistem membagi hasil via Waterfall otomatis (Landlord 5%, Investor 15%, Tenant 80%)
   - Setiap bulan dievaluasi apakah omzet memenuhi target Floor
               ↓
4. AKHIR KONTRAK (Penyelesaian)
   ├── Skenario Sukses: Semua klaim investor lunas → Uang jaminan Rp 15 Juta dikembalikan ke Budi.
   └── Skenario Gagal: Terjadi Step-In → Jaminan disita, aset ruko dilikuidasi untuk melindungi modal investor.
```

---

## 5. Bedah 3 Skenario Simulasi (`pnpm test:sim`)

Pengujian simulasi (`packages/sim`) yang kita jalankan sebelumnya adalah simulasi komputer untuk membuktikan bahwa aturan di atas benar-benar bekerja:

### Skenario 1: S1_normal (Kafe Laris 100%)
* **Kondisi:** Kafe ramai terus sepanjang 24 bulan sesuai target proyeksi.
* **Hasil Pengujian:**
  * Investor Senior balik modal + profit pada **Bulan ke-15**.
  * Investor Junior balik modal + profit pada **Bulan ke-18**.
  * Masuk ke fase **RESIDUAL** di Bulan ke-18.
  * Uang jaminan Budi tidak pernah disentuh (`Bond Drawn = Rp 0`).
  * **Kesimpulan:** Sistem berjalan sempurna pada kondisi bisnis normal.

### Skenario 2: S4_leakage30 (Kafe Agak Sepi / Kebocoran Omzet 30%)
* **Kondisi:** Omzet kasir turun 30% di bawah target rencana bisnis.
* **Hasil Pengujian:**
  * Terjadi kekurangan bagi hasil bulanan.
  * Sistem otomatis memotong jaminan Budi sebesar **Rp 5.333.283** (*Bond Drawn*).
  * Investor tetap menerima bagi hasil lancar tanpa gagal bayar.
  * Karena tertutup uang jaminan, kafe **tidak perlu disita (No Step-In)** dan tetap bisa melanjutkan bisnis sampai lunas di Bulan ke-25.
  * **Kesimpulan:** Fitur uang jaminan (*Bond*) terbukti efektif menyelamatkan investor tanpa harus membangkrutkan tenant.

### Skenario 3: S6_default (Kafe Bangkrut di Bulan ke-6)
* **Kondisi:** Tenant menyerah dan omzet anjlok total setelah bulan ke-6.
* **Hasil Pengujian:**
  * Sistem mendeteksi 2 kali pelanggaran berturut-turut (*2 Breaches*).
  * Sistem menyita seluruh sisa uang jaminan sebesar **Rp 15.000.000**.
  * Status agreement otomatis beralih menjadi **STEP_IN** pada hari ke-420.
  * **Kesimpulan:** Alarm darurat dan protokol sita ruko bekerja otomatis untuk menghentikan kerugian investor.

---

## 6. Ringkasan Tanya-Jawab Cepat (FAQ)

**Q: Mengapa tenant mau ikut sistem ini daripada pinjam bank?**  
*A: Karena tidak butuh jaminan sertifikat tanah/rumah, dan cicilan harian fleksibel mengikuti omzet riil (saat sepi, potongan setoran otomatis lebih kecil).*

**Q: Mengapa investor merasa aman mendanai renovasi ruko?**  
*A: Karena ada uang jaminan tunai 10% milik tenant yang siap dipotong otomatis jika omzet kurang, dan ada hak ambil alih fisik ruko (Step-In) jika tenant mangkir.*

**Q: Apa peran Smart Contract di sistem ini?**  
*A: Menjadi wasit digital yang netral dan otomatis: membagi uang kasir secara instan, mengevaluasi kesehatan omzet tiap bulan, memotong jaminan tanpa perlu proses pengadilan yang berbelit-belit, dan mengembalikan uang jaminan tenant saat kontrak selesai.*
