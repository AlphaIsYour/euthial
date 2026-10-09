# 14. Euthial Remix IDE Workflow Documentation (#56)

Panduan resmi bagi pengembang dan auditor Euthial Protocol untuk prototyping, inspeksi cepat, dan interaksi manual dengan smart contracts menggunakan [Remix Ethereum IDE](https://remix.ethereum.org).

---

## 📋 1. Import Euthial Contracts ke Remix IDE

Terdapat 2 metode termudah untuk memuat kontrak Euthial ke dalam Remix:

### Metode A: GitHub Clone Direct (Rekomendasi)
1. Buka [https://remix.ethereum.org](https://remix.ethereum.org).
2. Pada panel **File Explorer**, klik ikon **Clone repository from GitHub**.
3. Masukkan URL repository:
   ```text
   https://github.com/AlphaIsYour/euthial
   ```
4. Kontrak akan otomatis dimuat di workspace `euthial/contracts/src/`.

### Metode B: Remixd (Local Synchronization)
Jika ingin mengedit file lokal langsung di Remix browser:
```bash
# Di terminal monorepo root
npx @remix-project/remixd -s ./contracts --remix-ide https://remix.ethereum.org
```
Lalu di Remix, pilih workspace: **- connect to localhost -**.

---

## ⚙️ 2. Konfigurasi Solidity Compiler

Agar kompilasi identik dengan environment Foundry dan menghindari error bytecode:

1. Buka tab **Solidity Compiler** (ikon Solidity di sidebar kiri).
2. **Compiler Version**: Pilih `0.8.24+commit.e11b9ed9`.
3. Klik **Advanced Configurations**:
   - **Language**: `Solidity`
   - **EVM Version**: `cancun` (atau `shanghai`)
   - **Enable optimization**: Centang `true`
   - **Optimization runs**: `200`
4. **Via-IR**: Centang `Enable via-ir` (atau tambahkan di Compiler JSON `viaIR: true`).
   > ⚠️ **Penting**: Kontrak seperti `TrancheVault.sol` dan `FitOutAgreement.sol` memerlukan `via_ir: true` untuk mencegah error `Stack too deep`.

---

## 🧪 3. Deploy & Testing di Remix VM (Lokal Cepat)

Untuk menguji alur logika dasar tanpa biaya gas:
1. Buka tab **Deploy & Run Transactions**.
2. **ENVIRONMENT**: Pilih `Remix VM (Cancun)`.
3. Remix menyediakan 10 akun dummy dengan masing-masing 100 ETH.
4. Pilih kontrak yang ingin di-deploy dari dropdown:
   - Contoh: `FitOutAgreementFactory`
   - Klik **Deploy**.
5. Di bagian **Deployed Contracts**, seluruh fungsi (`createDeal`, `agreementAddress`, dll) akan muncul dalam bentuk tombol interaktif (warna jingga untuk write, biru untuk read/view).

---

## 🌐 4. Deploy & Interaksi di Testnet Sepolia via MetaMask

Untuk berinteraksi dengan kontrak yang sudah live di testnet Sepolia:

1. Pastikan ekstensi MetaMask aktif dan terhubung ke jaringan **Ethereum Sepolia**.
2. Di tab **Deploy & Run Transactions**, ganti **ENVIRONMENT** menjadi:
   ```text
   Injected Provider - MetaMask
   ```
3. Remix akan meminta izin koneksi ke akun MetaMask Anda.
4. **Opsi A - Interaksi Kontrak Yang Sudah Ada**:
   - Paste alamat kontrak Sepolia (misal Router: `0xa513E6E4b8f2a923D98304ec87F64353C4D5C853`).
   - Klik **At Address**. Kontrak langsung bisa dipanggil manual.
5. **Opsi B - Deploy Kontrak Baru**:
   - Masukkan parameter constructor, klik **Deploy**, dan konfirmasi transaksi di pop-up MetaMask.

---

## 🔍 5. Verifikasi Kontrak di Etherscan dari Remix

Jika Anda men-deploy kontrak baru melalui Remix dan ingin memverifikasinya di Etherscan:

1. Buka **Plugin Manager** di Remix (ikon colokan listrik di kiri bawah).
2. Cari dan aktifkan plugin **ETHERSCAN - CONTRACT VERIFICATION**.
3. Buka tab plugin Etherscan di sidebar.
4. Masukkan **Etherscan API Key** Anda.
5. Masukkan alamat kontrak yang baru di-deploy di Sepolia.
6. Pilih file kontrak `.sol` yang sesuai.
7. Klik **Verify Contract**. Dalam hitungan detik, source code akan terverifikasi secara publik di `sepolia.etherscan.io`.

---

## ⚖️ 6. Decision Matrix: Kapan Pakai Remix vs Kapan Pakai Foundry?

| Kebutuhan / Skenario | Alat yang Tepat | Alasan |
|---|:---:|---|
| **CI/CD Automation & GitHub Actions** | **Foundry** | Eksekusi headless cepat, output TAP/JUnit, integrasi pipeline. |
| **Formal Invariant & Fuzzing (10,000 runs)** | **Foundry** | Dukungan native invariant testing, stateful fuzzing, cheatcodes `vm.warp/vm.prank`. |
| **Simulasi Keuangan Waterfall (Python/TS integration)** | **Foundry** | Performa eksekusi C++/Rust ultra cepat. |
| **Inspeksi Cepat / Auditor Sanity Check** | **Remix** | Tanpa instalasi toolchain, visual GUI tombol read/write instan. |
| **Interaksi Manual Parameter Khusus di Testnet** | **Remix** | Mudah klik tombol fungsi tanpa perlu menulis skrip CLI `cast send`. |
| **Debug Visual Opcode / Memory Step-by-Step** | **Remix** | Remix Debugger memiliki visualizer storage & stack per opcode yang sangat intuitif. |

---

## 🚀 Kesimpulan
- Gunakan **Foundry** sebagai toolchain utama rekayasa perangkat lunak (testing, invariant, script deployment otomatis).
- Gunakan **Remix IDE** sebagai pendamping visual untuk eksperimen cepat, debug transaksi individu, atau inspeksi manual bagi tim non-CLI.
