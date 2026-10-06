# 07 — Risk Register, Stress Tests & Q&A

**Versi:** 0.1 · 5 Okt 2026 · Bergantung pada: `01`–`06`

Skala: **L** = Likelihood, **I** = Impact (R = rendah, S = sedang, T = tinggi). Kolom Owner diisi tim `[ISI]`.

---

## 1. Risk register

| ID | Risiko | L | I | Mitigasi | Referensi |
|---|---|---|---|---|---|
| R-01 | Klasifikasi regulasi: produk dianggap efek, pendanaan bersama, atau AKD tanpa izin | T | T | Testnet-only; DC-01..DC-09; mitra berizin; opini hukum sebelum pilot | 03 |
| R-02 | Narasi keliru "pembayaran QRIS dalam stablecoin" melanggar kewajiban rupiah | S | T | Aturan narasi; arsitektur hybrid; Mode A/B | 01 §7, 04 §4 |
| R-03 | Attestor/oracle dipalsukan atau mati | S | T | Address terkunci, event publik, ORACLE_STALE, rencana multi-attestor | 04 §5, §9 |
| R-04 | Kebocoran tunai melebihi toleransi bond | S | T | Payment floor, bond, cross-check off-chain, junior first-loss | 02 §8 |
| R-05 | Tenant insolven karena take-rate (coverage rendah) | S | T | Coverage check ≥ 2,0; sensitivitas biaya | 02 §5 |
| R-06 | Tidak ada permintaan investor karena modal terlalu mahal/risiko tinggi | S | T | Tuas penurun risiko (02 §9); target tenant terbukti; validasi di pilot | 02 §9 |
| R-07 | Bond tak terjangkau tenant mikro (bertentangan dengan "low-capex") | T | S | Pakai uang jaminan sewa sebagai bond; ukuran bond disesuaikan | 02 §10 (A-08) |
| R-08 | Recovery aset rendah (interior melekat; fidusia tidak ada) | T | S | Asumsi recovery rendah; pendaftaran jaminan; junior first-loss | 02 §7.4, 03 F-10 |
| R-09 | Konflik kepentingan pemilik (junior + approver milestone + penerima turnover rent) | S | S | Persetujuan 2-dari-3 dengan inspektur independen; arbiter; transparansi event | 05 §6 |
| R-10 | Kolusi kontraktor/inspektur (milestone palsu) | S | S | Hash bukti, inspektur independen, rilis bertahap | 05 §6 |
| R-11 | Bug logika kontrak | S | T | Invariant, fuzz, tes skenario, review silang tim; testnet-only | 05 §10–13 |
| R-12 | Manipulasi harga share ERC-4626 (donasi/inflasi) | R | S | Akuntansi internal, offset desimal, deposit hanya saat FUNDRAISING | 05 §7, §12 |
| R-13 | Manipulasi jam logis oleh attestor | S | S | `MAX_GAP`, monotonik, diakui sebagai trust assumption | 04 §7 |
| R-14 | Pemilik membeli share senior (konflik/ penyelarasan semu) | R | S | Allowlist; dicatat sebagai risiko; kebijakan pilot | 05 §11 |
| R-15 | Tidak ada data nyata → angka dianggap karangan | T | S | Label asumsi; data proxy publik; slide batasan | 08, 02 §10 |
| R-16 | Scope creep / waktu habis | T | T | P0/P1/P2, checkpoint, aturan freeze, aturan potong | 06 §6, §9 |
| R-17 | Demo gagal (RPC, gas, faucet, nonce) | S | T | Anvil + video cadangan; faucet dicek; RPC kedua | 06 §5, §12 |
| R-18 | Juri menilai "kenapa onchain" lemah | S | T | Narasi nilai tambah jujur (01 §5.4); Q&A di bawah | 01, 07 §3 |
| R-19 | Masalah hak pemilik atas ruko / masa sewa pendek | S | S | Verifikasi sertifikat; masa sewa ≥ 36 bulan | 02 (A-10), 03 §5 |
| R-20 | Kebocoran PII / pelanggaran privasi | R | S | Tidak ada PII onchain; data demo fiktif | 03 DC-06 |
| R-21 | False positive covenant saat musiman | S | S | Uji kumulatif bulanan; excused day; tes T-29 | 02 §4, §7.3 |
| R-22 | Kunci attestor/arbiter/admin bocor atau hilang | S | T | Multisig untuk arbiter/admin (produksi); kunci demo terpisah dan bukan kunci nyata | 04 §5 |
| R-23 | Kesalahpahaman: payment floor membuat produk berbentuk utang (klasifikasi, ekspektasi pasar) | T | S | Transparan di dokumen dan pitch; dibahas dengan konsultan (F-07) | 02 §4, 03 |
| R-24 | Ketergantungan pada mitra (PJP/escrow/SCF) yang belum ada | T | S | Pilot jalur J2 sebagai alternatif; tidak diklaim di hackathon | 03 §4 |

## 2. Matriks tes stres (ringkas; detail di 05 §13)

| Kelas | Skenario | Yang dibuktikan | Tes |
|---|---|---|---|
| Ekonomi | Omzet 100/70/50/40/30% dari base | Urutan penyerapan kerugian dan angka pada 02 §7.1 | T-25..T-27 |
| Kebocoran | L = 30% | Bond menutup; setara omzet 70% | T-28 |
| Musiman | Dip hujan/Ramadan + excused | Tidak ada CURE palsu | T-29 |
| Default | Runtuh bulan ke-N → step-in | Junior menyerap dulu; recovery masuk waterfall | T-30 |
| Percepatan | Omzet 150% | Transisi dini ke Fase B | T-31 |
| Oracle | Mati 3/14 hari | Jeda uji; eskalasi manual | T-15 |
| Keamanan | Replay, signature palsu, reentrancy, donasi vault | Semua ditolak/ tak berdampak | T-09, T-24 |
| Operasional | Fundraising kurang, build lewat deadline | Refund benar | T-03, T-05 |
| Governance | Admin mencoba menarik dana | Tidak mungkin (INV-10) | T-19, T-20 |

## 3. Q&A juri (jawaban singkat, jujur)

**1. Kenapa investor mau menanggung risiko tenant kecil?**
Karena risiko tidak dibiarkan polos: ada tranche junior (pemilik ruko + bond) sebagai penyerap kerugian pertama, payment floor, seleksi tenant terbukti, dan diversifikasi bila dipool. Tabel stres menunjukkan pokok senior aman sampai omzet jatuh ke sekitar 40% dari base (asumsi). Imbal hasil memang harus mencerminkan risiko; kami menghitungnya terbuka.

**2. Bagaimana kalau tenant terima tunai?**
Tidak bisa dihapus dari onchain, jadi kami membatasinya: omzet QRIS dari rekening escrow, payment floor pada **pembayaran** (bukan omzet), bond dihitung dari toleransi kebocoran (≈31% pada base), cross-check bahan baku, dan junior first-loss. Kami tidak mengklaim "terselesaikan".

**3. Apa bedanya dengan PJP/Midtrans/merchant cash advance?**
Rel pembayaran dan pemotongan settlement memang bisa dilakukan Web2; kami memakainya. Nilai tambah kami: waterfall tiga pihak yang bisa diverifikasi publik, tranching, dan distribusi otomatis tanpa percaya pada buku internal satu operator, serta modul terbuka untuk platform berizin.

**4. Apakah ini sekuritisasi?**
Bukan. Ini revenue-based financing vault dengan tranche. Sekuritisasi formal membutuhkan pooling aset, SPV, dan penerbitan surat berharga; itu bukan klaim kami.

**5. Bagaimana dengan regulasi Indonesia?**
Rupiah wajib untuk pembayaran dan kripto bukan alat bayar, jadi pembayaran tetap rupiah via PJP berizin. Token yang bisa diperdagangkan masuk radar OJK (POJK 27/2024 jo. 23/2025), jadi kami membatasi transfer ke allowlist dan tanpa pasar sekunder. Jalur investor publik lewat penyelenggara urun dana berizin. Ini peta awal; opini hukum belum ada dan itu kami nyatakan.

**6. Kenapa harus blockchain? Kenapa ERC-4626?**
Blockchain bukan untuk menangkap pembayaran atau menegakkan hukum; itu tetap Web2. Ia dipakai untuk waterfall dan covenant yang transparan bagi tiga pihak yang berkepentingan berbeda. ERC-4626 adalah standar vault untuk akuntansi share dan deposit; kami memodifikasinya (bertenor, penarikan terbatas kas, transfer allowlist) karena piutang tidak likuid.

**7. Siapa attestor? Bukankah itu sentralisasi?**
Ya, attestor adalah trust assumption yang diakui. Kepercayaan bergeser dari "satu pihak memegang buku" ke "agen berizin menandatangani fakta settlement yang publik dan dapat diaudit". Roadmap: multi-attestor dan audit.

**8. Bagaimana jika oracle mati?**
Setelah 3 hari logis tanpa settlement status ORACLE_STALE dan uji covenant dijeda; hari tanpa data dianggap unknown, bukan nol; setelah 14 hari arbiter dapat mengeskalasi.

**9. Slashing otomatis bukankah menghukum tenant jujur?**
Karena itu kami tidak menyalin ide slashing karena omzet sepi. Kami memakai payment floor kumulatif bulanan, cure period, excused day, baru bond draw dan step-in.

**10. Kalau tenant bangkrut, apa yang diperoleh investor?**
Bond, lalu recovery aset bergerak (asumsi 20% pokok; interior melekat diasumsikan nol), lalu kerugian dengan junior menyerap lebih dulu. Eksekusi memerlukan dokumen hukum (fidusia dan lainnya) yang di luar onchain.

**11. Bukankah modalnya terlalu mahal bagi tenant?**
Ya, itu temuan kami sendiri: multiple 1,25× sekitar 34–43% per tahun efektif. Karena itu target tenant adalah yang tak punya akses modal murah, dan multiple/akrual (OQ-07) masih dikalibrasi dengan data.

**12. Kenapa tenant mau?**
Mereka mendapat ruang siap pakai tanpa modal besar di muka dan tanpa jaminan pribadi (perlu divalidasi), dengan cicilan yang ikut omzet di atas lantai minimum. Kami jujur bahwa ini "low-capex", bukan "zero-capex" (bond).

**13. Pasar sekunder?**
Di luar MVP. Likuiditas hanya sebatas kas yang sudah dibayarkan; transfer hanya antar allowlist. Pasar sekunder adalah visi jangka panjang yang bergantung pada regulasi.

**14. Skalabilitas dan pooling?**
Pooling beberapa tenant dalam satu vault menurunkan risiko idiosinkratik (fase 3). Faktor pembatas utama adalah mitra berizin dan data, bukan teknologi.

**15. Dari mana angka-angka ini?**
Asumsi berlabel, dengan proxy data publik (08) dan stress test. Tidak ada data omzet nyata; validasi dilakukan di pilot.

**16. Kenapa pemilik ruko di junior?**
Dia paling diuntungkan dari aset yang direnovasi dan punya informasi terbaik soal lokasi; first-loss menyelaraskan insentifnya dan menggantikan praktik tenant improvement allowance di Web2 dengan klaim yang jelas.

## 4. Slide "Batasan yang kami akui" (isi final)

1. Prototipe testnet dengan mock token dan mock attestor; bukan produk produksi.
2. Regulasi: peta awal dari sumber publik; belum ada opini hukum; jalur pilot memerlukan mitra berizin.
3. Data: tidak ada data omzet nyata; semua angka asumsi berlabel (proxy data publik).
4. Oracle/attestor dan arbiter adalah trust assumption.
5. Kebocoran tunai dibatasi, tidak dihapus; efektivitas bergantung pada kualitas rel escrow dan cross-check.
6. Payment floor membuat produk dekat dengan utang; klasifikasi regulasi harus dikonfirmasi.
7. Modal mahal bagi tenant; target hanya tenant tanpa akses modal murah.
8. Pemulihan aset terbatas dan memerlukan jaminan hukum off-chain.
9. Pasar sekunder bukan bagian MVP.

## 5. Checklist red-team sebelum demo

- [ ] Coba settlement dengan tanda tangan orang lain, replay, dan `dayId` mundur → semua revert.
- [ ] Coba admin menarik dana (mode apa pun) → tidak ada jalur.
- [ ] Donasi token langsung ke vault → harga share tidak berubah.
- [ ] Skenario curang 30%: CURE → bond → angka sesuai tabel 02 §8 (toleransi pembulatan).
- [ ] Skenario default: junior menyerap lebih dulu; angka cocok dengan simulator.
- [ ] Parameter dengan coverage < 2,0 ditolak.
- [ ] Jalankan dari awal (Reset demo) dan ulangi tanpa error.
- [ ] Baca ulang slide dan README untuk kata terlarang (01 §7).
- [ ] Semua halaman bertuliskan testnet/mock.
- [ ] Anggota tim bisa menjelaskan trust assumption tanpa defensif.
