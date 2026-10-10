import { Step } from "react-joyride";

export const DEMO_DASHBOARD_TOUR_STEPS: Step[] = [
  {
    target: "body",
    placement: "center",
    title: "Panduan Membaca Konsol Protokol Euthial",
    content:
      "Selamat datang di Mission Control Euthial. Dashboard ini menampilkan bagaimana arus kas kasir ruko komersial nyata dialirkan secara otomatis dan kriptografis ke investor, penyewa, serta pemilik properti. Mari pelajari cara membaca setiap bagian dengan mudah.",
  },
  {
    target: "#tour-time-machine",
    placement: "bottom",
    title: "Siklus Tenor 24 Bulan",
    content:
      "Bagian ini menunjukkan siklus pembiayaan ruko dari Bulan 1 hingga Bulan 24. Anda dapat mengklik 'Auto-Play (24 Bln)' atau memilih angka bulan untuk melihat bagaimana bagi hasil kasir mengalir dan melunasi modal investor seiring waktu.",
  },
  {
    target: "#tour-scenarios",
    placement: "bottom",
    title: "Kondisi Arus Kas & Stres Pasar",
    content:
      "Pilih kondisi ekonomi untuk mengamati ketahanan protokol: Kondisi Normal (penjualan kasir 100%), Volatilitas Kasir (penurunan omzet dengan aktivasi masa tenggang Cure), atau Stres Likuiditas (eksekusi deposit jaminan untuk melindungi modal investor).",
  },
  {
    target: "#tour-role-cards",
    placement: "top",
    title: "Dampak Arus Kas Lintas Peran",
    content:
      "Empat kartu ini merangkum posisi keuangan masing-masing pihak: Kas Bersih Penyewa Kedai (80%), Realisasi Imbal Hasil Investor Senior (Target 1.25x), Akumulasi Sewa Pemilik Ruko (5%), dan Pencairan Termin Fisik Kontraktor.",
  },
  {
    target: "#tour-waterfall",
    placement: "top",
    title: "Waterfall Distribution Engine (ERC-4626)",
    content:
      "Inilah inti inovasi Euthial. Setiap rupiah dari kasir dipisahkan secara terprogram: 80% kembali ke penyewa untuk operasional kedai, lalu porsi bagi hasil dialirkan pertama kali ke Investor Senior sampai lunas (1.25x cap), baru kemudian ke Investor Junior dan Pemilik Ruko.",
  },
  {
    target: "#tour-covenant",
    placement: "top",
    title: "Kesehatan Covenant & Batas Minimum",
    content:
      "Grafik ini membandingkan omzet riil kasir dengan batas aman (Floor). Jika omzet berada di atas Floor, status 'HEALTHY'. Jika omzet turun, sistem otomatis memicu perlindungan cadangan agar tidak terjadi gagal bayar.",
  },
  {
    target: "#tour-crypto-proof",
    placement: "top",
    title: "Verifikasi Kriptografis On-Chain (EAS & Merkle)",
    content:
      "Setiap angka dan transaksi kasir didukung oleh bukti kriptografi (Ethereum Attestation Service & Merkle Root) yang dapat diverifikasi di blockchain Sepolia, menjamin data tidak bisa dimanipulasi.",
  },
  {
    target: "#tour-fraud-scanner",
    placement: "top",
    title: "Deteksi Fraud & Triangulasi Utilitas",
    content:
      "Untuk mencegah kasir fiktif, smart contract memvalidasi omzet dengan data riil konsumsi listrik PLN dan scan QRIS. Jika ada ketidaksesuaian, sistem otomatis membunyikan sinyal anomali.",
  },
  {
    target: "#tour-step-in",
    placement: "top",
    title: "Hak Proteksi Fisik (Step-In Rights)",
    content:
      "Perlindungan hukum pamungkas: Jika penyewa meninggalkan ruko, pemilik ruko dan investor memiliki hak legal terikat kontrak untuk mengambil alih aset dan menyewakannya kembali sehingga modal investor tetap terlindungi.",
  },
];

export const INVESTOR_TOUR_STEPS: Step[] = [
  {
    target: "body",
    placement: "center",
    title: "Selamat Datang di Dashboard Investor",
    content:
      "Di sini Anda bisa mendanai renovasi ruko komersial nyata (RWA) dan menerima bagi hasil harian otomatis langsung dari mesin kasir QRIS.",
  },
  {
    target: "#tour-ruko-catalog",
    placement: "bottom",
    title: "Katalog Proyek Ruko Terverifikasi",
    content:
      "Contoh: Ruko Kemang Grand Square yang disewa oleh brand ternama (Kopi Fore). Proyek ini membutuhkan modal renovasi interior Rp 150 Juta.",
  },
  {
    target: "#tour-tranches",
    placement: "top",
    title: "Dual Tranche: Senior vs Junior",
    content:
      "Senior Tranche (Bunga 1.25x): Dibayar paling pertama tiap hari, risiko terendah. Junior Tranche (Bunga 1.40x): Menerima dividen lebih tinggi setelah Senior terpenuhi.",
  },
  {
    target: "#tour-roi-calculator",
    placement: "top",
    title: "Kalkulator Imbal Hasil (ROI)",
    content:
      "Geser slider untuk melihat estimasi pengembalian modal dan keuntungan bersih Anda secara transparan.",
  },
  {
    target: "#tour-deposit-action",
    placement: "top",
    title: "Simulasi Investasi 1-Klik",
    content:
      "Klik tombol ini untuk mencoba menaruh modal simulasi ke smart contract tanpa biaya nyata.",
  },
];

export const TENANT_TOUR_STEPS: Step[] = [
  {
    target: "body",
    placement: "center",
    title: "Dashboard Tenant / Pengisi Ruko",
    content:
      "Sebagai penyewa ruko (misal: Kopi Nusantara / Fore), Anda mendapatkan ruko yang sudah direnovasi rapi tanpa harus keluar modal tunai ratusan juta di muka.",
  },
  {
    target: "#tour-tenant-pos",
    placement: "bottom",
    title: "Integrasi Kasir QRIS Real-Time",
    content:
      "Setiap kali pelanggan membeli kopi via QRIS, transaksi tercatat otomatis melalui Oracle EIP-712 terverifikasi.",
  },
  {
    target: "#tour-revenue-split",
    placement: "top",
    title: "Perlindungan Kas: 85% Toko vs 15% Investor",
    content:
      "Smart contract hanya memotong 15% omzet untuk mencicil modal investor. Sisa 85% tetap utuh di rekening Anda untuk belanja bahan baku, bayar utilitas, dan gaji barista.",
  },
  {
    target: "#tour-covenant-status",
    placement: "bottom",
    title: "Pemenuhan Target (Covenant Floor)",
    content:
      "Pantau target penjualan bulanan. Jika omzet lesu, ada cadangan Deposit Bond yang melindungi bisnis Anda dari gagal bayar.",
  },
];

export const CONTRACTOR_TOUR_STEPS: Step[] = [
  {
    target: "body",
    placement: "center",
    title: "Portal Kontraktor & Escrow",
    content:
      "Uang renovasi Rp 150 Juta tidak dipegang perseorangan, melainkan dikunci di Smart Contract Escrow dan cair bertahap sesuai progres fisik.",
  },
  {
    target: "#tour-milestone-stages",
    placement: "top",
    title: "4 Tahapan Termin Konstruksi",
    content:
      "Tahap 0: Uang Muka DP 20%, Tahap 1: MEP 40%, Tahap 2: Interior 30%, dan Retensi 10% dengan garansi 30 hari.",
  },
  {
    target: "#tour-evidence-upload",
    placement: "top",
    title: "Bukti Foto Fisik & IPFS",
    content:
      "Kontraktor mengunggah foto progres fisik ke IPFS, inspektur independen memvalidasi ke lokasi, lalu dana termin otomatis dicairkan ke dompet kontraktor.",
  },
];
