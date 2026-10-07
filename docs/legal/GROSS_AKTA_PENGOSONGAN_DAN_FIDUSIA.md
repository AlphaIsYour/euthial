# INSTRUMEN HUKUM EKSEKUSI FISIK: GROSSE AKTA PENGOSONGAN & JAMINAN FIDUSIA ELEKTRONIK
**Euthial Protocol — Verifiable RBF for Commercial Ruko Fit-Outs**  
**Yurisdiksi: Republik Indonesia (Hukum Perdata & Perbankan)**  
**Referensi Terkait:** [Issue #32](https://github.com/AlphaIsYour/euthial/issues/32), `docs/13_SECURITY_AND_ECONOMIC_MITIGATIONS.md` (§2), `docs/03_REGULATORY_LEGAL.md`

---

## 1. Latar Belakang & Masalah Hukum Riil

Dalam pembiayaan renovasi komersial (RBF Fit-Out Ruko), salah satu risiko kegagalan terbesar di dunia nyata adalah **jebakan sengketa Pasal 167 KUHP (tudingan masuk pekarangan tertutup tanpa izin)** dan lambatnya proses hukum perdata biasa (gugatan wanprestasi) di Pengadilan Negeri yang dapat memakan waktu 1–3 tahun hingga berkekuatan hukum tetap (*inkracht*).

Jika penyewa mengalami gagal bayar (*default*) dan menolak mengosongkan ruko:
- Pemilik ruko atau investor tidak boleh melakukan pengusiran paksa sepihak (*eigenrichting* / main hakim sendiri).
- Ruko menjadi aset mangkrak (*dead asset*), kas dividen investor terhenti, dan ruko tidak dapat disewakan kembali ke operator lain.

**Solusi Euthial Protocol:**  
Mengikatkan smart contract on-chain `FitOutAgreement.sol` dengan dua instrumen hukum berkekuatan eksekutorial langsung di bawah hukum Republik Indonesia sejak Hari ke-0 penandatanganan akad fit-out:
1. **Grosse Akta Notariil Pengosongan Ruko** (*Parate Executie* via Pasal 224 HIR / Pasal 258 RBg).
2. **Sertifikat Jaminan Fidusia Elektronik Kemenkumham** atas aset peralatan fit-out bergerak (UU No. 42 Tahun 1999 tentang Jaminan Fidusia).

---

## 2. Klausul Baku Grosse Akta Pengosongan Notariil

Di hadapan Notaris rekanan di Kabupaten Jember, para pihak (Pemilik Ruko, Penyewa/Operator Kedai Kopi, dan Agen Escrow PT Euthial) menandatangani Akta Pengosongan Sukarela dengan irah-irah berkepala:

```text
"DEMI KEADILAN BERDASARKAN KETUHANAN YANG MAHA ESA"
(Salinan Grosse Akta Notaris memiliki kekuatan eksekutorial setara Putusan Pengadilan yang berkekuatan hukum tetap - Pasal 224 HIR / 258 RBg)
```

### Kutipan Klausul Perjanjian:
> **Pasal X: Kesepakatan Pengosongan Sukarela dan Kuasa Mutlak Eksekusi**
> 1. Apabila *Smart Contract* Protokol Euthial mencatat status **BREACHED** dan masa perbaikan (*Cure Period*) selama 7 (tujuh) hari kalender terlampaui tanpa adanya pelunasan defisit omzet, maka Perjanjian Sewa dan Fit-Out demi hukum beralih ke status **DEFAULT / STEP-IN**.
> 2. Pihak Kedua (Penyewa) dengan ini memberikan kuasa mutlak yang tidak dapat ditarik kembali (*onherroepelijk*) kepada Pihak Pertama (Pemilik Ruko) dan/atau Kuasa Hukum yang ditunjuk oleh PT Euthial untuk:
>    - Memasuki bangunan ruko tanpa memerlukan persetujuan tambahan dari Pihak Kedua;
>    - Mengganti seluruh sistem kunci fisik maupun kunci digital (*IoT Smart Door Lock*);
>    - Mengosongkan seluruh barang milik pribadi Pihak Kedua dan menitipkannya ke gudang penyimpanan atas biaya Pihak Kedua;
>    - Menyerahkan pengelolaan operasional ruko kepada Konsorsium Operator Pengganti (*Standby Replacement Operator*).
> 3. Pihak Kedua melepaskan haknya untuk menuntut secara pidana (termasuk Pasal 167 KUHP) maupun perdata atas tindakan pengosongan yang didasarkan pada Grosse Akta ini.

---

## 3. Pendaftaran Jaminan Fidusia Elektronik (Kemenkumham)

Aset-aset bergerak bernilai tinggi yang dibeli menggunakan dana fit-out (Capex Rp 150.000.000) didaftarkan melalui sistem Administrasi Hukum Umum (AHU) Online Kementerian Hukum dan HAM:

| No | Nama Aset Peralatan Fit-Out | Estimasi Nilai | Bukti Pembelian / Faktur | Status Fidusia |
|---|---|---|---|---|
| 1 | Mesin Espresso Komersial 2-Group (La Marzocco Linea Classic) | Rp 78.000.000 | Invoice PT Espresso Indo #INV-8821 | Terdaftar AHU-FID-2026-0812 |
| 2 | Grinder Komersial On-Demand (Mahlkönig EK43 + Mazzer) | Rp 26.000.000 | Invoice PT Espresso Indo #INV-8822 | Terdaftar AHU-FID-2026-0813 |
| 3 | Chiller & Undercounter Stainless Steel 180cm | Rp 16.500.000 | Invoice Kitchen Prima #KP-4019 | Terdaftar AHU-FID-2026-0814 |
| 4 | Genset Silent 15 kVA (Backup Listrik Operasional) | Rp 19.500.000 | Faktur Toko Listrik Jaya #TL-1120 | Terdaftar AHU-FID-2026-0815 |
| 5 | POS Terminal, Bar Table Modular & Instalasi ME | Rp 10.000.000 | Berita Acara Termin #2 & #3 | Hak Retensi Ruko |

Dengan Sertifikat Jaminan Fidusia:
- Kreditur (Investor Senior & Pemilik Ruko) memegang hak preferen (*droit de suite* / hak kebendaan mendahului kreditur lain).
- Jika terjadi default, peralatan fit-out dapat langsung dilelang atau dialihkan tanpa sengketa kepemilikan dengan kreditur pihak ketiga penyewa.

---

## 4. Jembatan IoT Hardware: Smart Door Lock Gateway

Untuk memastikan eksekusi tidak tertunda oleh penahanan kunci fisik:
1. Pintu utama ruko dipasangi sistem kunci pintar (*Zigbee / Tuya IoT Commercial Smart Lock*).
2. Sistem ini terhubung ke *Euthial Protocol Custody Gateway* via secure webhook:
   - **Status HEALTHY / CURE:** PIN aktif dikendalikan oleh manajer kedai kopi (Penyewa).
   - **Status STEP_IN (On-Chain Confirmed):**
     - Webhook otomatis mencabut (*revoke*) seluruh kredensial PIN penyewa pada pukul 23:59 WIB di hari ke-7 pasca-somasi.
     - Merotasi *Master PIN* baru dan mengirimkannya secara terenkripsi ke aplikasi Pemilik Ruko dan Operator Pengganti.
     - Menyimpan hash bukti rotasi kunci ke log audit blockchain.

---

## 5. Konsorsium Operator Pengganti Siaga (Standby Replacement Operator)

Protokol mempertahankan SLA pengambilalihan operasional maksimal **7 hari kerja**:
- PT Euthial menjalin MoU dengan konsorsium jaringan F&B lokal di Kabupaten Jember (misal: asosiasi roastery lokal dan coffee chain regional).
- Operator siaga telah menandatangani kesepakatan *plug-and-play*:
  - Mengambil alih tata letak dan peralatan fit-out yang sudah ada;
  - Mempertahankan karyawan barista lokal ruko jika memenuhi standar mutu;
  - Melanjutkan pembayaran bagi hasil QRIS (80% kasir / 15% investor senior / 5% sewa) tanpa perlu merombak ulang interior ruko.

Dengan sinergi **Grosse Akta + Sertifikat Fidusia + IoT Smart Lock + Standby Operator**, risiko default fisik terselesaikan secara terukur dan berkekuatan hukum penuh.
