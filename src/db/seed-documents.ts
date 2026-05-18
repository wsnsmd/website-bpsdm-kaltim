// src/db/seed-documents.ts
import { db, eq } from "./index";
import { documentCategories, documents } from "./schema";

const CATEGORIES = [
  {
    name: "Laporan Kinerja",
    slug: "laporan-kinerja",
    icon: "BarChart2",
    color: "#1d4ed8",
    sortOrder: 1,
  },
  {
    name: "Surat Keputusan",
    slug: "surat-keputusan",
    icon: "FileCheck",
    color: "#7e22ce",
    sortOrder: 2,
  },
  {
    name: "Peraturan",
    slug: "peraturan",
    icon: "Scale",
    color: "#b45309",
    sortOrder: 3,
  },
  {
    name: "Pedoman & Panduan",
    slug: "pedoman-panduan",
    icon: "BookOpen",
    color: "#0e7490",
    sortOrder: 4,
  },
  {
    name: "Formulir",
    slug: "formulir",
    icon: "ClipboardList",
    color: "#16a34a",
    sortOrder: 5,
  },
  {
    name: "Buku & Modul",
    slug: "buku-modul",
    icon: "Book",
    color: "#c2410c",
    sortOrder: 6,
  },
  {
    name: "Pengumuman",
    slug: "pengumuman",
    icon: "Megaphone",
    color: "#dc2626",
    sortOrder: 7,
  },
  {
    name: "Anggaran",
    slug: "anggaran",
    icon: "Wallet",
    color: "#059669",
    sortOrder: 8,
  },
];

const SAMPLE_DOCS = [
  {
    title: "Laporan Kinerja BPSDM Kaltim Tahun 2024",
    description:
      "Laporan akuntabilitas kinerja instansi pemerintah BPSDM Provinsi Kalimantan Timur tahun anggaran 2024.",
    categorySlug: "laporan-kinerja",
    externalUrl: "https://drive.google.com",
    fileType: "pdf",
    year: 2024,
    status: "published" as const,
  },
  {
    title: "Laporan Kinerja BPSDM Kaltim Tahun 2023",
    description:
      "Laporan akuntabilitas kinerja instansi pemerintah BPSDM Provinsi Kalimantan Timur tahun anggaran 2023.",
    categorySlug: "laporan-kinerja",
    externalUrl: "https://drive.google.com",
    fileType: "pdf",
    year: 2023,
    status: "published" as const,
  },
  {
    title: "Rencana Strategis BPSDM 2024-2028",
    description:
      "Dokumen perencanaan strategis BPSDM Kaltim untuk periode 2024-2028.",
    categorySlug: "pedoman-panduan",
    externalUrl: "https://drive.google.com",
    fileType: "pdf",
    year: 2024,
    status: "published" as const,
  },
  {
    title: "SOP Pelayanan Pengembangan Kompetensi",
    description:
      "Standar operasional prosedur pelayanan pengembangan kompetensi ASN di BPSDM Kaltim.",
    categorySlug: "pedoman-panduan",
    externalUrl: "https://drive.google.com",
    fileType: "pdf",
    year: 2024,
    status: "published" as const,
  },
  {
    title: "Formulir Pendaftaran Diklat",
    description:
      "Formulir pendaftaran untuk mengikuti program diklat dan pelatihan di BPSDM Kaltim.",
    categorySlug: "formulir",
    externalUrl: "https://drive.google.com",
    fileType: "docx",
    year: 2024,
    status: "published" as const,
  },
  {
    title: "Modul Pelatihan Kepemimpinan Administrator",
    description:
      "Modul pelatihan kepemimpinan untuk pejabat administrator di lingkungan pemerintah daerah.",
    categorySlug: "buku-modul",
    externalUrl: "https://drive.google.com",
    fileType: "pdf",
    year: 2024,
    status: "published" as const,
  },
];

async function seedDocuments() {
  console.log("📄 Seeding dokumen...");
  await db.delete(documents);
  await db.delete(documentCategories);

  await db
    .insert(documentCategories)
    .values(CATEGORIES.map((c) => ({ ...c, isActive: true })));
  console.log(`   ✓ ${CATEGORIES.length} kategori dibuat`);

  const cats = await db.select().from(documentCategories);
  const catMap = Object.fromEntries(cats.map((c) => [c.slug, c.id]));

  await db.insert(documents).values(
    SAMPLE_DOCS.map((d) => ({
      title: d.title,
      description: d.description,
      categoryId: catMap[d.categorySlug],
      externalUrl: d.externalUrl,
      fileType: d.fileType,
      year: d.year,
      status: d.status,
      downloadCount: 0,
    })),
  );
  console.log(`   ✓ ${SAMPLE_DOCS.length} dokumen dibuat`);
  console.log("\n✅ Selesai!");
  process.exit(0);
}

seedDocuments().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
