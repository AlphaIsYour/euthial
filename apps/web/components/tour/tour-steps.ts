import { Step } from "react-joyride";

export const INVESTOR_TOUR_STEPS: Step[] = [
  {
    target: "body",
    placement: "center",
    title: "👋 Selamat Datang di Dashboard Investor!",
    content:
      "Di sini Anda bisa mendanai renovasi ruko komersial nyata (RWA) dan menerima bagi hasil harian otomatis langsung dari mesin kasir QRIS.",
  },
  {
    target: "#tour-ruko-catalog",
    title: "🏢 Katalog Proyek Ruko Terverifikasi",
    content:
      "Contoh: Ruko Kemang Grand Square yang disewa oleh brand ternama (Kopi Fore). Proyek ini membutuhkan modal renovasi interior Rp 150 Juta.",
  },
  {
    target: "#tour-tranches",
    title: "⚖️ Dual Tranche: Senior vs Junior",
    content:
      "Senior Tranche (Bunga 1.25x): Dibayar paling pertama tiap hari, risiko terendah. Junior Tranche (Bunga 1.40x): Menerima dividen lebih tinggi setelah Senior terpenuhi.",
  },
  {
    target: "#tour-roi-calculator",
    title: "🧮 Kalkulator Imbal Hasil (ROI)",
    content:
      "Geser slider untuk melihat estimasi pengembalian modal dan keuntungan bersih Anda secara transparan.",
  },
  {
    target: "#tour-deposit-action",
    title: "🚀 Simulasi Investasi 1-Klik",
    content:
      "Klik tombol ini untuk mencoba menaruh modal simulasi ke smart contract tanpa biaya nyata!",
  },
];

export const TENANT_TOUR_STEPS: Step[] = [
  {
    target: "body",
    placement: "center",
    title: "☕ Dashboard Tenant / Pengisi Ruko",
    content:
      "Sebagai penyewa ruko (misal: Kopi Nusantara / Fore), Anda mendapatkan ruko yang sudah direnovasi cantik tanpa harus keluar modal tunai ratusan juta di muka.",
  },
  {
    target: "#tour-tenant-pos",
    title: "📱 Integrasi Kasir QRIS Real-Time",
    content:
      "Setiap kali pelanggan membeli kopi via QRIS, transaksi tercatat otomatis melalui Oracle EIP-712 terverifikasi.",
  },
  {
    target: "#tour-revenue-split",
    title: "🛡️ Perlindungan Kas: 85% Toko vs 15% Investor",
    content:
      "Smart contract HANYA memotong 15% omzet untuk mencicil modal investor. Sisa 85% tetap utuh di rekening Anda untuk belanja biji kopi, bayar listrik, dan gaji barista!",
  },
  {
    target: "#tour-covenant-status",
    title: "📈 Pemenuhan Target (Covenant Floor)",
    content:
      "Pantau target penjualan bulanan. Jika omzet sempat lesu, ada cadangan Deposit Bond 3 bulan yang melindungi bisnis Anda dari gagal bayar.",
  },
];

export const CONTRACTOR_TOUR_STEPS: Step[] = [
  {
    target: "body",
    placement: "center",
    title: "🔨 Portal Kontraktor & Escrow",
    content:
      "Uang renovasi Rp 150 Juta tidak dipegang perseorangan, melainkan dikunci di Smart Contract Escrow dan cair bertahap sesuai progres fisik.",
  },
  {
    target: "#tour-milestone-stages",
    title: "📋 4 Tahapan Termin Konstruksi",
    content:
      "Termin 0: Uang Muka DP 20% (belanja semen/besi) -> Termin 1: MEP 40% (kabel/pipa) -> Termin 2: Interior 30% -> Retensi 10% (garansi 30 hari).",
  },
  {
    target: "#tour-evidence-upload",
    title: "📸 Bukti Foto Fisik & IPFS",
    content:
      "Kontraktor mengunggah foto progres fisik ke IPFS -> Inspektur independen mengecek lokasi & menyetujui -> Dana termin otomatis cair ke dompet kontraktor.",
  },
];
