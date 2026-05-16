// src/db/seed-programs.ts
import { db } from "./index";
import { programs } from "./schema";

const PROGRAM_DATA = [
  {
    name: "Kompetensi Teknis",
    slug: "kompetensi-teknis",
    jenisKey: "Teknis",
    description:
      "Pendidikan dan pelatihan untuk mencapai persyaratan kompetensi teknis yang diperlukan untuk pelaksanaan tugas ASN sesuai bidang jabatan masing-masing.",
    icon: "Wrench",
    color: "#1d4ed8",
    status: "active" as const,
    isHighlight: true,
    sortOrder: 1,
    objectives: "Meningkatkan kompetensi teknis ASN sesuai bidang tugasnya",
    target: "ASN di lingkungan Pemerintah Provinsi Kalimantan Timur",
  },
  {
    name: "Kompetensi Fungsional",
    slug: "kompetensi-fungsional",
    jenisKey: "Fungsional",
    description:
      "Pelatihan untuk mencapai persyaratan kompetensi fungsional yang diperlukan untuk pelaksanaan tugas jabatan fungsional ASN.",
    icon: "Layers",
    color: "#16a34a",
    status: "active" as const,
    isHighlight: true,
    sortOrder: 2,
    objectives: "Meningkatkan kompetensi jabatan fungsional ASN",
    target: "ASN pemegang jabatan fungsional",
  },
  {
    name: "Kompetensi Manajerial",
    slug: "kompetensi-manajerial",
    jenisKey: "Manajerial",
    description:
      "Pelatihan kepemimpinan dan manajerial bagi ASN yang menduduki atau akan menduduki jabatan struktural di lingkungan pemerintahan.",
    icon: "Users",
    color: "#c2410c",
    status: "active" as const,
    isHighlight: true,
    sortOrder: 3,
    objectives: "Membangun kapasitas kepemimpinan dan manajerial ASN",
    target: "ASN yang menduduki jabatan struktural atau pimpinan",
  },
  {
    name: "Kompetensi Sosiokultural",
    slug: "kompetensi-sosiokultural",
    jenisKey: "Sosiokultural",
    description:
      "Pelatihan untuk meningkatkan kemampuan ASN dalam memahami dan mengelola keberagaman sosial dan budaya dalam pelayanan publik.",
    icon: "Globe",
    color: "#7e22ce",
    status: "active" as const,
    isHighlight: true,
    sortOrder: 4,
    objectives:
      "Meningkatkan kemampuan sosiokultural ASN dalam pelayanan publik",
    target: "Seluruh ASN di lingkungan Pemerintah Provinsi Kalimantan Timur",
  },
  {
    name: "Pemerintahan Dalam Negeri",
    slug: "pemerintahan-dalam-negeri",
    jenisKey: "Pemerintahan Dalam Negeri",
    description:
      "Pelatihan khusus bidang pemerintahan dalam negeri untuk meningkatkan kapasitas penyelenggaraan pemerintahan daerah.",
    icon: "Landmark",
    color: "#0e7490",
    status: "active" as const,
    isHighlight: true,
    sortOrder: 5,
    objectives: "Meningkatkan kapasitas penyelenggaraan pemerintahan daerah",
    target: "ASN bidang pemerintahan dan administrasi",
  },
  {
    name: "Sertifikasi & Uji Kompetensi",
    slug: "sertifikasi-uji-kompetensi",
    jenisKey: "Sertifikasi",
    description:
      "Program sertifikasi dan uji kompetensi untuk mengukur dan membuktikan tingkat kompetensi ASN secara formal dan terstandar.",
    icon: "BadgeCheck",
    color: "#b45309",
    status: "active" as const,
    isHighlight: true,
    sortOrder: 6,
    objectives: "Mengukur dan mensertifikasi kompetensi ASN secara formal",
    target: "ASN yang memerlukan sertifikasi kompetensi bidang tugas",
  },
];

async function seedPrograms() {
  console.log("🎓 Seeding program diklat...");
  await db.delete(programs);
  await db.insert(programs).values(PROGRAM_DATA);
  console.log(`   ✓ ${PROGRAM_DATA.length} program dibuat`);
  console.log("\n✅ Selesai!");
  process.exit(0);
}

seedPrograms().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
