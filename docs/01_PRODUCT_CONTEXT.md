# 01 — Product Context

**Versi:** 0.1 · 5 Okt 2026 · Bergantung pada: `00_README_INDEX.md`

---

## 1. Asal masalah

Ide ini lahir dari pengamatan lapangan di Jember: banyak ruko di dalam kota tutup bertahun-tahun. Pola yang diamati:

- Harga sewa yang diminta pemilik tinggi, padahal kondisi fisik buruk karena lama kosong dan tidak direnovasi.
- Calon tenant menawar atau mundur karena biaya renovasi tidak sebanding dengan harga sewa.
- Pemilik tidak mau berinvestasi renovasi tanpa kepastian ada penyewa.
- Hasilnya jalan buntu (deadlock): aset produktif menganggur, tenant tidak mendapat tempat, ekonomi lokal rugi.

Catatan kejujuran: ini baru pengamatan, belum data. Validasi dengan data publik dijelaskan di `08_DATA_VALIDATION_PLAN.md`.

## 2. Problem statement (rumusan formal)

> Untuk ruko kosong yang butuh renovasi, tidak ada mekanisme yang membuat pemilik, tenant, dan pemodal sama-sama yakin bahwa modal renovasi akan kembali dan risikonya terbagi adil.

Tiga hambatan yang harus dijawab bersamaan:
1. **Kesenjangan modal:** tenant kecil tidak punya modal renovasi dan akses kredit murahnya terbatas.
2. **Kesenjangan insentif:** pemilik menanggung biaya jika renovasi di awal, tenant menanggung risiko usaha, tidak ada yang menjamin pihak lain.
3. **Kesenjangan kepercayaan:** pemodal tidak bisa memverifikasi aliran uang tanpa mempercayai satu pihak.

## 3. Stakeholder dan Jobs-to-be-Done

| Pihak | Siapa | Yang dia inginkan | Yang dia takutkan | Apa yang kami tawarkan |
|---|---|---|---|---|
| **Pemilik ruko** | Pemilik properti mangkrak | Ruko terisi, nilai aset naik, pendapatan sewa | Biaya renovasi hangus, tenant kabur | Renovasi didanai bersama; ia di tranche junior (upside + pengaruh), plus turnover rent |
| **Tenant** | Operator kedai/kafe kecil | Tempat usaha siap pakai tanpa modal besar di muka | Beban bagi hasil terlalu berat, kehilangan lokasi | Take-rate dibatasi coverage check; cicilan ikut omzet; transparansi perhitungan |
| **Investor senior** | Investor lokal/individu terbatas (pilot) | Imbal hasil wajar dengan risiko terbatas | Kehilangan pokok, data dipalsukan | Tranche senior dibayar lebih dulu, bond, covenant, ledger yang bisa diverifikasi |
| **Kontraktor** | Pelaksana renovasi | Dibayar sesuai progres | Tidak dibayar | Pembayaran per milestone dari escrow vault |
| **Agen escrow / PJP** | Pihak berizin pemegang rekening settlement | Fee layanan, kepatuhan | Risiko regulasi | Pihak berizin tetap memegang uang rupiah (mode B) |
| **Operator protokol** | Tim kami | Protokol terpercaya | Tuduhan kustodian / penerbit efek ilegal | Posisi sebagai infrastruktur, bukan penerbit |

## 4. Gambaran solusi

Satu perjanjian tiga pihak ("FitOut Agreement") per ruko, dengan komponen:

1. **Pendanaan renovasi (vault bertingkat):** senior (investor) + junior (pemilik). Dana renovasi dicairkan ke kontraktor per milestone.
2. **Operasi dan pembayaran:** omzet QRIS tenant masuk rekening settlement escrow. Take-rate total ~20% diteruskan: sebagian ke investor, sebagian ke pemilik sebagai *turnover rent*. Sisanya (~80%) tetap pada tenant.
3. **Waterfall dua fase:** Fase Amortisasi sampai klaim investor lunas (batas multiple), lalu Fase Residual (royalti kecil + turnover rent).
4. **Covenant:** *payment floor* diuji berkala. Pelanggaran memicu tangga eskalasi (warning → cure → bond draw → step-in).
5. **Transparansi:** semua pihak dapat memverifikasi settlement, pembagian, dan status covenant onchain.

Detail ekonomi: `02`. Detail teknis: `04`, `05`.

## 5. Positioning

### 5.1 Kalimat posisi (gunakan konsisten)
> "FitOut Vault adalah lapisan settlement dan struktur modal yang dapat diverifikasi untuk pembiayaan renovasi ruko, di atas rel pembayaran berizin."

### 5.2 Apa kami
- Infrastruktur pembiayaan RBF bertingkat dengan waterfall yang transparan.
- Prototipe testnet dengan desain yang sadar regulasi.
- Modul yang kelak dapat dipakai platform berizin (SCF/pendanaan bersama).

### 5.3 Apa kami BUKAN
- Bukan penerbit efek dan bukan platform investasi publik.
- Bukan pengganti rupiah atau QRIS.
- Bukan sekuritisasi formal (tidak ada SPV/pooling lintas aset, kecuali nanti ada).
- Bukan solusi cash leakage yang "selesai"; kami **membatasi** kerugian akibatnya.
- Bukan pasar sekunder (di luar MVP).

### 5.4 Pembanding Web2 (jujur)

| Fungsi | Web2 yang sudah ada | Kontribusi FitOut Vault |
|---|---|---|
| Potong sebagian settlement QRIS otomatis | PJP/fintech (model merchant cash advance) | Tidak unik; kami memakai rel yang sama |
| Investor publik mendanai UMKM | Platform urun dana (SCF) berizin OJK | Bisa menjadi mitra/lapisan infrastruktur |
| Kredit modal/renovasi tenant | Bank, KUR, kredit lain | Menyasar tenant yang tak punya akses murah; tanpa jaminan pribadi (perlu divalidasi) |
| **Waterfall 3 pihak yang bisa diverifikasi publik tanpa percaya buku operator** | Umumnya buku internal platform | **Nilai tambah utama** |
| **Tranching dan distribusi otomatis tanpa rekonsiliasi manual** | Proses manual/spreadsheet | **Nilai tambah** |
| Penegakan hukum, KYC, penangkapan pembayaran | Wajib tetap Web2 | Tidak diklaim digantikan |

**Wedge:** pembiayaan fit-out melibatkan tiga pihak dengan kepentingan berbeda dan satu aset fisik. Di situ verifikasi bersama dan struktur tranche punya nilai.

## 6. Target segmen

- **Pelanggan pertama (sisi permintaan awal):** pemilik ruko kosong di Jember yang butuh renovasi (pain point nyata yang ada di cerita awal).
- **Tenant pertama:** operator kedai/kafe kecil di ruko. Alasan: dampak renovasi paling terlihat, omzet relatif mudah dilacak lewat QRIS.
- **Investor pilot:** terbatas (pemilik ruko sendiri atau investor lokal yang dikenal). Bukan penawaran publik.
- **Ditunda:** kios food court, gerai franchise, ritel non-F&B.

Kriteria tenant ideal (untuk fase pilot nyata, bukan hackathon):
- Sudah punya riwayat usaha (idealnya outlet ke-2) dan riwayat QRIS minimal 6 bulan.
- Lolos coverage check (lihat 02, bagian 5).
- Bersedia menaruh bond (idealnya memakai uang jaminan sewa yang memang akan diminta pemilik).

## 7. Aturan narasi (pitch dan dokumentasi)

| Hindari | Gunakan |
|---|---|
| "Sekuritisasi utang RWA" | "Revenue-based financing vault dengan tranche senior/junior" |
| "Siap dipakai", "production-ready" | "Prototipe testnet dengan desain sadar regulasi" |
| "Tanpa polisi atau pengadilan" | "Web2 untuk rel dan penegakan, onchain untuk transparansi settlement dan struktur modal" |
| "Zero-capex tenant" | "Low-capex tenant" (tenant tetap menaruh bond) |
| "Cash leakage terselesaikan" | "Kerugian akibat kebocoran dibatasi dan dapat dihitung" |
| "Pasar sekunder likuid" | "Roadmap: likuiditas terbatas, transfer allowlist" |
| "Pembayaran QRIS masuk smart contract dalam stablecoin" | "Pembayaran tetap rupiah via escrow; kontrak menghitung dan mencatat entitlement" |
| "Investor pasti untung" | "Imbal hasil menanggung risiko; angka adalah asumsi yang divalidasi di pilot" |

## 8. Kriteria sukses

**Hackathon**
- Demo end-to-end berjalan: pendanaan → renovasi milestone → settlement harian → waterfall → skenario curang/default.
- Pitch menjawab tiga pertanyaan juri: (1) kenapa investor mau, (2) bagaimana kalau tenant curang, (3) kenapa onchain.
- Slide "Batasan yang kami akui" ada dan jujur.

**Pilot (di luar hackathon, indikatif)**
- Satu ruko di Jember, satu tenant, investor terbatas, mitra berizin, opini hukum.
- Data omzet nyata dari penggunaan QRIS escrow.

**Produk (visi)**
- Modul infrastruktur yang dipakai platform berizin; pooling multi-tenant; likuiditas terbatas bila regulasi mengizinkan.

## 9. Roadmap tingkat tinggi

| Fase | Fokus | Output |
|---|---|---|
| 0. Hackathon | Prototipe testnet, simulator, dokumen | Demo + pitch + paket dokumen ini |
| 1. Validasi | Data publik → wawancara ringan → opini hukum | Parameter tervalidasi, jalur regulasi dipilih |
| 2. Pilot terbatas | 1 ruko, mitra PJP/escrow, investor terbatas, mode B | Data nyata, pelajaran operasional |
| 3. Pooling | Beberapa tenant dalam satu vault, diversifikasi | Produk lebih tahan risiko |
| 4. Likuiditas | Transfer terbatas/redemption asinkron, jika diizinkan regulasi | Opsi keluar bagi investor |
