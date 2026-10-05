# 03 — Regulatory & Legal Context

**Versi:** 0.1 · Diverifikasi lewat pencarian web pada **5 Okt 2026** · Bergantung pada: `00`, `01`, `02`

> **Bukan nasihat hukum.** Dokumen ini adalah peta awal untuk dibawa ke konsultan hukum yang paham OJK, Bank Indonesia, dan pasar modal. Aturan di area ini berubah cepat; setiap temuan harus diverifikasi ulang terhadap teks primer sebelum dipakai dalam keputusan nyata. Tingkat keyakinan ditandai per temuan.

---

## 1. Temuan (Findings)

Tingkat keyakinan: **T** = tinggi (sumber resmi/primer ditemukan), **S** = sedang (sumber sekunder kredibel), **R** = rendah / pengetahuan umum belum diverifikasi.

| ID | Temuan | Keyakinan | Sumber | Implikasi desain |
|---|---|---|---|---|
| F-01 | Rupiah wajib dipakai untuk setiap transaksi pembayaran dan transaksi keuangan lain di wilayah Indonesia (UU No. 7/2011 tentang Mata Uang, Pasal 21 ayat 1). Bank Indonesia menegaskan virtual currency tidak diakui sebagai alat pembayaran sah. | T | Siaran pers BI; artikel jurnal | **DC-01**: pembayaran pelanggan harus rupiah |
| F-02 | Peraturan BI No. 18/40/PBI/2016 melarang penyelenggara jasa sistem pembayaran memproses transaksi memakai virtual currency (menurut sumber sekunder; baca teks primer). | S | Jurnal Rechtsvinding BPHN | PJP tidak akan mau memproses pembayaran stablecoin ke merchant |
| F-03 | Penyelenggara QRIS dan lembaga switching harus mendapat persetujuan Bank Indonesia; merchant cukup membuka rekening di satu PJP QRIS berizin. | T | Halaman QRIS BI | Rel pembayaran wajib via PJP berizin: **DC-02** |
| F-04 | Pengaturan dan pengawasan aset kripto/aset keuangan digital beralih dari Bappebti ke OJK (PP 49/2024; POJK 27/2024 berlaku sejak 10 Jan 2025). | T | Situs OJK; ulasan hukum | OJK adalah otoritas relevan untuk token |
| F-05 | POJK 23/2025 (diterbitkan 4 Des 2025) mengubah POJK 27/2024: Aset Keuangan Digital terdiri atas Aset Kripto dan AKD lainnya; kriteria mencakup aset yang diterbitkan, disimpan, ditransfer, dan/atau diperdagangkan dengan teknologi buku besar terdistribusi atau mengacu pada AKD yang mendasari; penyelenggara dilarang memperdagangkan AKD di luar daftar yang ditetapkan Bursa. | T | Siaran pers OJK SP 210/2025 | **Inferensi (perlu konfirmasi):** vault share yang dapat dijual bebas di liquidity pool publik berisiko masuk lingkup AKD dan butuh penyelenggara berizin: **DC-03** |
| F-06 | POJK 17/2025 tentang penawaran efek melalui layanan urun dana (SCF) menggantikan POJK 57/2020; instrumen yang dapat ditawarkan UMKM meliputi saham, obligasi, dan sukuk. Aturan lama membatasi penghimpunan dana per penerbit Rp10 miliar per 12 bulan (cek apakah angka ini berlaku di POJK 17/2025). | T/S | Situs OJK; artikel hukum | Jalur legal investor publik sudah ada: **DC-04** |
| F-07 | Dengan payment floor dan klaim bernilai tetap, produk mendekati **utang/pendanaan** ketimbang bagi hasil murni. | R (inferensi) | Analisis internal | Klasifikasi bisa bergeser ke pendanaan bersama berbasis TI (LPBBTI/P2P lending) atau efek (obligasi/sukuk). Wajib dikonfirmasi konsultan |
| F-08 | Klaim bahwa stablecoin asing dilarang untuk pembayaran domestik dan penerbit stablecoin lokal wajib cadangan teraudit hanya ditemukan di sumber sekunder berkualitas rendah. Status stablecoin rupiah (mis. IDRX) **belum diverifikasi**. | R | Blog sekunder | Jangan klaim integrasi stablecoin riil; pakai mock token |
| F-09 | Sejak 1 Des 2024 ada kebijakan pembebasan MDR QRIS hingga Rp500.000 per transaksi untuk usaha mikro (menurut sumber sekunder). | S | Blog GoPay | Mengurangi alasan tenant menghindari QRIS selain bagi hasil; verifikasi ke BI |
| F-10 | Topik lain yang relevan tetapi **belum diverifikasi** dalam pencarian: jaminan fidusia (UU No. 42/1999), pelindungan data pribadi (UU No. 27/2022), APU-PPT/KYC, UU ITE (kontrak elektronik, tanda tangan elektronik), hukum sewa-menyewa dan hak atas tanah/bangunan, perpajakan (PPh sewa dan bagi hasil, pajak daerah). | R | Pengetahuan umum | Masuk daftar tanya konsultan (bagian 5) |

## 2. Batasan desain turunan (Design Constraints)

| ID | Batasan | Dampak ke dokumen lain |
|---|---|---|
| DC-01 | Pembayaran pelanggan ke tenant **selalu rupiah via QRIS dari PJP berizin**. Bagian omzet milik tenant (tenant retain) **tidak pernah** masuk onchain. | 04 (Mode A/B), 05 |
| DC-02 | Pilot nyata memakai **Mode B**: onchain hanya ledger entitlement; uang rupiah dipegang dan dibayarkan agen escrow/PJP berizin. Mode A (dana onchain, mock token) hanya untuk demo testnet. | 04, 05 |
| DC-03 | Share tidak bebas ditransfer: **allowlist**; tidak ada AMM/liquidity pool; tidak ada klaim pasar sekunder di MVP. | 05, 06 |
| DC-04 | Tidak ada penawaran publik oleh kami. Pilot: investor terbatas yang dikenal, atau melalui penyelenggara urun dana/pendanaan bersama berizin sebagai mitra. | 01, 06 |
| DC-05 | Aturan terminologi: lihat `01_PRODUCT_CONTEXT.md` bagian 7. Jangan klaim sekuritisasi, siap dipakai, tanpa pengadilan. | 01, 06, 07 |
| DC-06 | Tidak ada data pribadi onchain; KYC dilakukan off-chain oleh agen/mitra; onchain hanya address dan hash bukti. | 04, 05 |
| DC-07 | Hanya testnet sampai ada opini hukum tertulis. Semua UI memuat label testnet/mock. | 06 |
| DC-08 | Tidak ada klaim imbal hasil dijamin; ada pengungkapan risiko di UI dan dokumen investor. | 06, 07 |
| DC-09 | Perancangan peran penerbit: hipotesis (perlu konsultan) bahwa tenant (UMKM) bertindak sebagai penerbit instrumen berbasis bagi hasil melalui penyelenggara berizin, sementara FitOut Vault menyediakan ledger dan waterfall. | 01, 09 |

## 3. Posisi hukum yang diusulkan

> "Kami adalah penyedia infrastruktur (ledger dan mesin waterfall) untuk platform dan pelaku berizin, bukan penerbit efek, bukan penyelenggara pembayaran, dan bukan bursa aset digital."

Mengapa penting: tiga peran terlarang tanpa izin adalah (1) menawarkan investasi ke publik, (2) memproses pembayaran, (3) menyelenggarakan perdagangan aset. Desain MVP menghindari ketiganya (DC-01, DC-03, DC-04).

## 4. Jalur pilot (pilihan, belum diputuskan)

| Jalur | Deskripsi | Kelebihan | Kekurangan | Rekomendasi |
|---|---|---|---|---|
| J1. Testnet-only | Prototipe + simulasi, tanpa uang nyata | Aman, cepat | Tidak membuktikan pasar | **Wajib untuk hackathon** |
| J2. Pilot privat tertutup | Satu ruko, pemilik + beberapa investor kenalan, kontrak biasa + escrow rekening bank | Data nyata, biaya rendah | Tetap perlu opini hukum soal klasifikasi | Kandidat fase 2 |
| J3. Mitra SCF/pendanaan bersama | Penyelenggara berizin sebagai front investor; kami infrastruktur | Legal jelas, akses investor | Bergantung pada mitra dan kesesuaian instrumen | Kandidat fase 2 |
| J4. Regulatory sandbox OJK | Mengajukan ke sandbox inovasi teknologi sektor keuangan | Dialog dengan regulator | Proses panjang, persyaratan | Jangka menengah |

## 5. Dokumen hukum yang diperlukan (untuk pilot)

1. Perjanjian sewa (idealnya notaril), masa sewa ≥ 36 bulan, klausul step-in dan penggantian tenant.
2. Perjanjian pembiayaan tiga pihak (pemilik–tenant–pendana) yang menyalin parameter ekonomi (lihat 02) dan tangga eskalasi.
3. Perjanjian escrow dan pemberian kuasa atas rekening settlement QRIS.
4. Perjanjian jaminan atas barang bergerak (mis. fidusia) beserta pendaftarannya.
5. Perjanjian kontraktor dan berita acara milestone.
6. Dokumen pengungkapan risiko untuk investor.
7. Syarat dan ketentuan penggunaan, kebijakan privasi.
8. Dokumen asuransi (kebakaran, pencurian) atas aset renovasi, jika diwajibkan.
9. Verifikasi hak pemilik atas ruko (sertifikat, izin penggunaan).

## 6. Daftar pertanyaan untuk konsultan hukum

1. Apakah klaim pembayaran berbasis omzet yang dapat dipindahtangankan dikategorikan "efek"/kontrak investasi, instrumen pendanaan bersama, atau lainnya? Dampak payment floor (F-07)?
2. Jika tenant sebagai penerbit lewat SCF: instrumen apa (obligasi/sukuk) paling cocok, dan batas penghimpunan terkini berapa?
3. Apakah merekam entitlement di ledger onchain (mode B) sambil membayar rupiah lewat agen berizin berada di luar lingkup AKD? Dalam kondisi apa token ini dianggap AKD?
4. Apakah investor boleh menyetor dengan stablecoin dan menerima pembayaran dalam rupiah? Rute kepatuhan apa yang diperlukan?
5. Izin apa yang dibutuhkan agen escrow (bank, PJP) untuk menahan dan meneruskan sebagian settlement QRIS merchant?
6. Apakah mekanisme penarikan bond dan step-in sah secara perdata? Bagaimana eksekusinya bila tenant menolak?
7. Pendaftaran fidusia atas peralatan: prosedur, biaya, batas nilai.
8. Hak atas interior terpasang (accessio): bagaimana kedudukan investor terhadap pemilik bangunan?
9. KYC/APU-PPT untuk investor dan tenant: siapa yang wajib melakukan?
10. Perlindungan data pribadi: dasar pemrosesan, penyimpanan hash onchain, hak hapus.
11. Perpajakan: PPh atas sewa, turnover rent, bagi hasil/imbal investor; PPN/pajak daerah atas usaha tenant.
12. Apakah demo dan white-paper di hackathon perlu disclaimer khusus agar tidak dianggap penawaran investasi?
13. Aturan tarif/bunga efektif maksimum bila dianggap pendanaan bersama (cek relevansi terhadap multiple 1,25–1,40×).
14. Kewajiban perizinan usaha tenant (NIB, izin kuliner, pajak restoran daerah) dan relevansinya bagi eligibility.

## 7. Checklist kepatuhan untuk hackathon

- [ ] Semua halaman demo bertuliskan "Testnet · mock token · mock attestor".
- [ ] Tidak ada ajakan investasi atau klaim imbal hasil dijamin.
- [ ] Tidak ada kata terlarang (lihat 01, bagian 7) di slide dan README.
- [ ] Slide "Batasan yang kami akui" memuat: regulasi belum divalidasi, data omzet belum ada, oracle = trust assumption.
- [ ] Tidak ada PII nyata di data demo (gunakan nama fiktif).
- [ ] Tidak ada scraping yang melanggar syarat penggunaan situs (lihat 08).
- [ ] Sumber regulasi dikutip dengan tanggal akses.

## 8. Daftar sumber (diakses 5 Okt 2026)

- Bank Indonesia, siaran pers peringatan penggunaan virtual currency: https://www.bi.go.id/id/publikasi/ruang-media/news-release/Pages/sp_200418.aspx
- Bank Indonesia, halaman QRIS: https://www.bi.go.id/en/fungsi-utama/sistem-pembayaran/ritel/kanal-layanan/qris/default.aspx
- OJK, POJK 23/2025 perubahan POJK 27/2024 (halaman regulasi): https://ojk.go.id/id/regulasi/Pages/POJK-23-2025-Perubahan-POJK-27-Tahun-2024-tentang-Penyelenggaraan-Perdagangan-Aset-Keuangan-Digital-Termasuk-Aset-Kripto.aspx
- OJK, siaran pers 4 Des 2025 (SP 210): https://ojk.go.id/id/berita-dan-kegiatan/siaran-pers/Pages/POJK-23-Tahun-2025-Perubahan-POJK-27-Tahun-2024-Penyelenggaraan-Perdagangan-Aset-Keuangan-Digital-Termasuk-Aset-Kripto.aspx
- OJK, POJK 17/2025 urun dana: https://ojk.go.id/id/regulasi/Pages/POJK-17-Tahun-2025-Penawaran-Efek-Melalui-Layanan-Urun-Dana-Berbasis-Teknologi-Informasi.aspx
- Ulasan hukum peralihan rezim Bappebti → OJK (Leks Blawg): https://blog.lekslawyer.com/peralihan-rezim-menavigasi-pergeseran-otoritas-regulasi-kripto-di-indonesia/
- Jurnal Rechtsvinding BPHN, larangan penggunaan koin digital: https://rechtsvinding.bphn.go.id/articles/1051
- IABF Law Firm, ulasan SCF (aturan lama, batas Rp10 miliar): https://iab-net.com/securities-crowdfunding-sebagai-alternatif-pembiayaan-bagi-umkm-dan-start-up-company/
- GoPay, biaya QRIS dan kebijakan MDR (sekunder): https://gopay.co.id/blog/biaya-transaksi-qris-panduan-lengkap-untuk-merchant

**Status verifikasi ulang:** semua tautan dan klaim harus dibuka dan dibaca ulang oleh manusia sebelum hari hackathon dan sebelum pilot. Tandai tanggal verifikasi di bawah ini.

| Tanggal | Diverifikasi oleh | Catatan |
|---|---|---|
| 5 Okt 2026 | Pencarian web awal (asisten) | Belum ada verifikasi manusia atau hukum |
