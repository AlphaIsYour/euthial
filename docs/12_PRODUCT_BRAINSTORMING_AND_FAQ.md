# 12 — Rangkuman Brainstorming: Konsep Produk, Alur Kasir/QRIS, & Panduan Peran

**Versi:** 1.0 · 6 Oktober 2026  
**Tujuan Dokumen:** Menyimpan dokumentasi hasil diskusi mendalam tim mengenai batasan sistem, alur transaksi kasir nyata vs on-chain, penanganan uang tunai (*cash leakage*), arsitektur pemisahan portal per peran, dan opsi branding agar tidak hilang/tertimbun.

---

## 📌 1. Hakikat Produk & Posisi Sistem

### A. Elevator Pitch (1 Kalimat)
> **"Protokol Revenue-Based Financing (RBF) terverifikasi untuk renovasi (*fit-out*) ruko komersial mangkrak, menggunakan alokasi omzet otomatis QRIS dan struktur modal bertingkat on-chain."**

### B. Siapa Kita & Siapa yang BUKAN Kita
*   ✅ **KITA ADALAH:** Platform Protokol Bagi Hasil & Settlement Finansial (*Financial Settlement & Capital Tranche Engine*).
*   ❌ **KITA BUKAN:** Perangkat lunak kasir (*Point of Sale / POS* pencatat menu/stok F&B).
*   ❌ **KITA BUKAN:** Penerbit uang digital atau pengganti Rupiah (transaksi pelanggan tetap 100% Rupiah).
*   ❌ **KITA BUKAN:** Platform urun dana publik ilegal (prototipe testnet, investasi nyata melalui mitra berizin).

---

## ❓ 2. Tanya Jawab Kritis: Kasir, QRIS, & Uang Tunai (*The Big Questions*)

### Q1: Apakah penyewa ruko memakai aplikasi kasir buatan kita?
> **JAWABAN: TIDAK.**  
> Penyewa kedai/kafe bebas menggunakan mesin kasir (*POS*) apa pun yang mereka sukai (Moka POS, Majoo, Pawoon, atau QRIS statis biasa). Tim kita **tidak perlu dan tidak boleh** membuat software kasir karena itu adalah *scope creep*.  
> Bagi penyewa, web kita adalah **Merchant Partner Dashboard** (seperti GoBiz / GrabMerchant Portal) untuk melihat laporan bagi hasil, bukan aplikasi pencatat pesanan barista.

---

### Q2: Bagaimana ruko menerima pembayaran? Dari mana QRIS berasal?
> **JAWABAN:**  
> Setiap unit ruko yang didanai didaftarkan memiliki **1 rekening settlement escrow bersama** di bank/PJP berizin (seperti Bank Mandiri/BCA/Midtrans).  
> Stiker QRIS yang dipajang di kasir kedai diterbitkan oleh bank tersebut dan terhubung ke rekening penampung bersama ini. Begitu pembeli scan QRIS, uang Rupiah langsung masuk ke rekening bank secara otomatis.

---

### Q3: Apakah ruko boleh menerima uang tunai (Cash)?
> **JAWABAN: BISA DAN PASTI ADA.**  
> Pelanggan kedai di daerah (seperti Jember) tidak mungkin 100% dipaksa memakai QRIS. Pasti ada pelanggan yang membayar dengan uang tunai kertas.

---

### Q4: Jika boleh terima uang tunai, apakah kasir harus rekap manual di web kita?
> **JAWABAN: TIDAK. Sistem TIDAK BOLEH percaya pada ketikan rekap manual penyewa.**  
> Jika sistem bergantung pada ketikan manual kasir (*"Hari ini omzet saya Rp1 juta"*), kasir bisa berbohong (*moral hazard*) agar potongan bagi hasil kecil.  
> Sistem hanya memvalidasi mutasi riil yang tercatat di rekening bank/QRIS melalui tanda tangan digital (*EIP-712 attestation*).

---

### Q5: Jika kasir menyembunyikan uang tunai, bagaimana investor terlindungi?
> **JAWABAN: Menggunakan mekanisme "Payment Floor" (Target Setoran Minimum) & "Bond Escrow" (Uang Jaminan).**  
> 1. Smart contract mengunci batas pembayaran minimum kumulatif bulanan ($Floor(d)$), misal minimal Rp 10.666.665/bulan untuk investor.
> 2. Jika kasir curang menyimpan uang tunai dan mutasi rekening bank anjlok di bawah garis Floor:
>    * Terpicu status **`CURE`** (Peringatan 7 hari bagi penyewa untuk menyetor kekurangan).
>    * Jika tidak disetor, smart contract otomatis **menarik Uang Jaminan (Bond Rp 15.000.000)** milik penyewa yang sudah disita di awal kontrak.
> 3. Hasilnya: Investor tetap terbayar dari uang jaminan, dan penyewa yang curang akan merugi sendiri karena deposit jaminannya hangus.

---

## 🏛️ 3. Pemisahan Portal per Peran (*Separation of Concerns*)

Satu halaman monolitik untuk 5 peran adalah anti-pattern. Dipecah menjadi 5 halaman tersendiri:

```text
apps/web/app/
├── page.tsx            # [ISSUE #20] Landing Hub: Pintu masuk pemilih 5 peran
├── tenant/page.tsx     # [ISSUE #21] Portal Penyewa: Kas bersih 80%, status bond, simulasi kasir
├── investor/page.tsx   # [ISSUE #22] Portal Investor: Modal Rp120M, klaim 1.25x, withdraw cash
├── landlord/page.tsx   # [ISSUE #23] Portal Pemilik: Ruko Jember, turnover rent 5%, approve capex
├── inspector/page.tsx  # [ISSUE #24] Portal Inspektur: 3 termin renovasi fisik, bukti foto hash
└── demo/page.tsx       # [ISSUE #25] Arena Juri: Mesin waktu, stres S1/S4/S6, live audit log
```

### Matriks Kebutuhan Konten per Portal:

| Portal | Yang Wajib Tampil | Yang Dilarang Tampil (Noise) |
|---|---|---|
| **Penyewa Kedai (`/tenant`)** | Kas ditahan operasional (80%), status kepatuhan (`HEALTHY`/`CURE`), saldo jaminan (Bond Rp 15jt), tombol top-up jaminan. | Tombol deposit investor, detail kalkulasi ERC-4626 share, form tukang bangunan. |
| **Investor Senior (`/investor`)** | Pokok modal (Rp 120jt), klaim target 1.25x (Rp 150jt), kas likuid di vault (*idle cash*), tombol `Withdraw`, indikator *First-Loss*. | Struk nota kasir, operasional dapur kedai, manajemen termin renovasi. |
| **Pemilik Ruko (`/landlord`)** | Unit ruko Jember, akumulasi *Turnover Rent* (5% pasif terus-menerus), modal junior 1.40x, tombol persetujuan rilis dana renovasi. | Operasional harian tenant, detail share investor luar. |
| **Inspektur (`/inspector`)** | Papan 3 termin fisik (Partisi, MEP, Finishing), upload hash bukti foto (IPFS/SHA-256), tombol tanda tangan konsensus (*multisig 2-of-3*). | Grafik waterfall omzet kasir, portofolio modal investor. |
| **Dewan Juri (`/demo`)** | Navigasi waktu (+30 hari, auto-play), preset stres (S1 Normal, S4 Bocor 30%, S6 Default), feed log audit on-chain real-time. | - (Halaman ini memiliki kontrol penuh / *god-mode*). |

---

## 💡 4. Opsi Ide Nama & Branding (*Brand Exploration*)

| Kategori | Nama Kandidat | Filosofi & Kesan | Rekomendasi Tagline |
|---|---|---|---|
| **Lokal / Ramah Ruko** | **Rukoma** | Gabungan "Ruko" & "Komunal/Bersama". Hangat, merakyat, mudah diterima pemilik ruko tradisional. | *"Nyalakan Ruko Mangkrak, Hidupkan Usaha."* |
| **Lokal / Aksi Nyata** | **UbahRuang** | Menjelaskan aksi langsung merevitalisasi ruang kosong menjadi aset produktif. | *"Ubah Ruang Kosong Jadi Arus Kas Produktif."* |
| **Fintech / Web3 Global** | **FitVault** | Gabungan "Fit-Out" (renovasi) dan "Vault" (kubah modal ERC-4626). Ringkas, modern, berkelas internasional. | *"The Smarter Vault for Commercial Fit-Outs."* |
| **Fintech / Arus Kas** | **Turnover Protocol** | Bermain kata antara *Turnover* (omzet kasir) dan *Turn-around* (membalikkan aset mati jadi hidup). | *"Transforming Idle Spaces into Verified Revenue."* |
| **Akronim Cerdas** | **RUKO Protocol** | **R**evenue-backed **U**pgrades for **K**ey **O**perators. Bercita rasa lokal tapi berbobot teknis tinggi. | *"Revenue-Backed Upgrades for Commercial Operators."* |

---

## 🚀 5. Urutan Langkah Kerja Berikutnya (Dev 2)

1.  **Eksekusi Issue #20 (`/`):** Bangun Landing Hub Portal Selector dengan 5 kartu akses dan pasang `FloatingRoleSwitcher` untuk demo juri.
2.  **Eksekusi Issue #21 (`/tenant`):** Pindahkan modul kasir, omzet 80%, dan bond status ke halaman tersendiri.
3.  **Eksekusi Issue #22 (`/investor`):** Halaman khusus penarikan imbal hasil dan status proteksi *first-loss*.
4.  **Eksekusi Issue #23 (`/landlord`):** Halaman pemilik ruko untuk turnover rent 5% & approval renovasi.
5.  **Eksekusi Issue #24 (`/inspector`):** Halaman inspeksi 3 termin fisik dan upload bukti.
6.  **Eksekusi Issue #25 (`/demo`):** Ruang kendali simulasi juri.
