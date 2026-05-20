// src/db/seed-ppid.ts
import { db } from "./index";
import { ppidInformasi, ppidPejabat } from "./schema";

const INFORMASI = [
  // Berkala
  {
    judul: "Laporan Kinerja BPSDM Kaltim Tahun 2024",
    deskripsi:
      "Laporan akuntabilitas kinerja instansi pemerintah BPSDM Kaltim tahun 2024.",
    tipe: "berkala" as const,
    externalUrl: "https://drive.google.com",
    fileType: "pdf",
    tahun: 2024,
    sortOrder: 1,
  },
  {
    judul: "Rencana Strategis BPSDM 2024-2028",
    deskripsi: "Dokumen perencanaan strategis BPSDM Kaltim periode 2024-2028.",
    tipe: "berkala" as const,
    externalUrl: "https://drive.google.com",
    fileType: "pdf",
    tahun: 2024,
    sortOrder: 2,
  },
  {
    judul: "Laporan Realisasi Anggaran 2024",
    deskripsi: "Laporan realisasi anggaran BPSDM Kaltim tahun 2024.",
    tipe: "berkala" as const,
    externalUrl: "https://drive.google.com",
    fileType: "pdf",
    tahun: 2024,
    sortOrder: 3,
  },
  // Serta Merta
  {
    judul: "Pengumuman Jadwal Diklat Darurat",
    deskripsi:
      "Informasi yang wajib disampaikan segera karena berkaitan kepentingan publik.",
    tipe: "serta_merta" as const,
    externalUrl: "https://drive.google.com",
    fileType: "pdf",
    tahun: 2024,
    sortOrder: 1,
  },
  // Setiap Saat
  {
    judul: "SOP Pelayanan Pengembangan Kompetensi",
    deskripsi: "Standar operasional prosedur pelayanan BPSDM Kaltim.",
    tipe: "setiap_saat" as const,
    externalUrl: "https://drive.google.com",
    fileType: "pdf",
    tahun: 2024,
    sortOrder: 1,
  },
  {
    judul: "Daftar Informasi Publik (DIP)",
    deskripsi: "Daftar seluruh informasi publik yang dimiliki BPSDM Kaltim.",
    tipe: "setiap_saat" as const,
    externalUrl: "https://drive.google.com",
    fileType: "pdf",
    tahun: 2024,
    sortOrder: 2,
  },
  {
    judul: "Profil BPSDM Kaltim",
    deskripsi: "Informasi umum tentang BPSDM Provinsi Kalimantan Timur.",
    tipe: "setiap_saat" as const,
    externalUrl: "https://drive.google.com",
    fileType: "pdf",
    tahun: 2024,
    sortOrder: 3,
  },
];

const PEJABAT = [
  {
    nama: "Drs. Ahmad Fauzan, M.Si",
    jabatan: "PPID Utama BPSDM Kaltim",
    tipe: "utama" as const,
    sortOrder: 1,
    isActive: true,
  },
  {
    nama: "Sari Dewi, S.Sos",
    jabatan: "PPID Pembantu Bidang Teknis",
    tipe: "pembantu" as const,
    sortOrder: 2,
    isActive: true,
  },
  {
    nama: "Budi Santoso, S.H",
    jabatan: "PPID Pembantu Bidang Administrasi",
    tipe: "pembantu" as const,
    sortOrder: 3,
    isActive: true,
  },
];

async function seedPpid() {
  console.log("🔐 Seeding PPID...");
  await db.delete(ppidInformasi);
  await db.delete(ppidPejabat);

  await db
    .insert(ppidInformasi)
    .values(INFORMASI.map((i) => ({ ...i, status: "published" as const })));
  console.log(`   ✓ ${INFORMASI.length} informasi publik`);

  await db.insert(ppidPejabat).values(PEJABAT);
  console.log(`   ✓ ${PEJABAT.length} pejabat PPID`);

  console.log("\n✅ Selesai!");
  process.exit(0);
}

seedPpid().catch((e) => {
  console.error(e);
  process.exit(1);
});
