// src/db/seed.ts
import { db } from "./index";
import {
  categories,
  posts,
  programs,
  schedules,
  announcements,
  settings,
  userRoles,
  roles,
  users,
} from "./schema";

async function seed() {
  console.log("🌱 Memulai seeding database...");

  // ── 1. Categories ─────────────────────────
  console.log("📁 Membuat kategori...");

  const categoryData = [
    {
      name: "Berita Diklat",
      slug: "berita-diklat",
      type: "post" as const,
      color: "#1e7a40",
    },
    {
      name: "Berita Kab/Kota",
      slug: "berita-kabkota",
      type: "post" as const,
      color: "#c49a00",
    },
    {
      name: "Berita Umum",
      slug: "berita-umum",
      type: "post" as const,
      color: "#1a56a8",
    },
    {
      name: "Artikel",
      slug: "artikel",
      type: "post" as const,
      color: "#7e22ce",
    },
    {
      name: "Buletin",
      slug: "buletin",
      type: "post" as const,
      color: "#c2410c",
    },
  ];

  const insertedCategories = await db
    .insert(categories)
    .values(categoryData)
    .$returningId();

  console.log(`   ✓ ${insertedCategories.length} kategori dibuat`);

  // Map slug → id
  const catMap: Record<string, number> = {};
  categoryData.forEach((cat, i) => {
    catMap[cat.slug] = insertedCategories[i].id;
  });

  // ── 2. Posts ──────────────────────────────
  console.log("📰 Membuat posts...");

  const now = new Date();
  const daysAgo = (n: number) => new Date(now.getTime() - n * 86400000);

  const postData = [
    {
      title: "Musda X KORPRI Kaltim 2026 Digelar Secara Daring",
      slug: "musda-x-korpri-kaltim-2026",
      excerpt:
        "Samarinda — Dewan Pengurus KORPRI Provinsi Kalimantan Timur melaksanakan Musyawarah Daerah X KORPRI Tahun 2026 secara daring, memperkuat sinergi dan solidaritas ASN.",
      content:
        "<p>Samarinda — Dewan Pengurus KORPRI Provinsi Kalimantan Timur melaksanakan Musyawarah Daerah (Musda) X KORPRI Tahun 2026 secara daring pada Rabu, 29 April 2026.</p><p>Musyawarah Daerah yang digelar secara virtual ini dihadiri oleh lebih dari 200 peserta yang merupakan perwakilan KORPRI dari 10 kabupaten dan kota di Kalimantan Timur.</p>",
      status: "published" as const,
      categoryId: catMap["berita-umum"],
      authorName: "Humas BPSDM Kaltim",
      publishedAt: daysAgo(14),
      viewCount: 1247,
      readingTime: 4,
      isFeatured: true,
    },
    {
      title:
        "Bimtek JF Ahli Madya: Peran Strategis ASN dalam Penguatan Kebijakan Daerah",
      slug: "bimtek-jf-ahli-madya-peran-strategis-asn",
      excerpt:
        "Samarinda — Pengembangan kompetensi ASN menjadi faktor kunci dalam mewujudkan tata kelola pemerintahan yang profesional dan berorientasi kinerja.",
      content:
        "<p>Samarinda — Bimbingan Teknis Jabatan Fungsional Ahli Madya digelar selama tiga hari di Samarinda.</p>",
      status: "published" as const,
      categoryId: catMap["berita-diklat"],
      authorName: "Humas BPSDM Kaltim",
      publishedAt: daysAgo(21),
      viewCount: 842,
      readingTime: 3,
      isFeatured: false,
    },
    {
      title:
        "Uji Kompetensi Jabatan Administrator 2026, Perkuat Sistem Tata Kelola",
      slug: "uji-kompetensi-jabatan-administrator-2026",
      excerpt:
        "Samarinda — Pemerintah Provinsi Kalimantan Timur melalui BPSDM menyelenggarakan kegiatan Pra dan Uji Kompetensi.",
      content:
        "<p>Samarinda — Uji Kompetensi Jabatan Administrator 2026 diselenggarakan untuk memperkuat tata kelola pemerintahan.</p>",
      status: "published" as const,
      categoryId: catMap["berita-diklat"],
      authorName: "Humas BPSDM Kaltim",
      publishedAt: daysAgo(28),
      viewCount: 671,
      readingTime: 3,
      isFeatured: false,
    },
    {
      title: "Dinas ESDM dan BPSDM Ajak OPD Terapkan Manajemen Energi",
      slug: "dinas-esdm-bpsdm-manajemen-energi",
      excerpt:
        "Samarinda — Upaya mendorong efisiensi energi di lingkungan pemerintahan terus diperkuat.",
      content:
        "<p>Samarinda — Dinas Energi dan Sumber Daya Mineral (ESDM) bersama BPSDM Kaltim mengajak OPD menerapkan manajemen energi.</p>",
      status: "published" as const,
      categoryId: catMap["berita-kabkota"],
      authorName: "Humas BPSDM Kaltim",
      publishedAt: daysAgo(21),
      viewCount: 503,
      readingTime: 2,
      isFeatured: false,
    },
    {
      title: "BPSDM Kaltim Raih Terbaik III PUG di Parade Gender Provinsi 2026",
      slug: "bpsdm-kaltim-raih-terbaik-pug-parade-gender-2026",
      excerpt:
        "Samarinda — Mewakili Kepala BPSDM Kaltim, Sekretaris BPSDM Kaltim Rina Kushariyanti menghadiri Parade Gender Provinsi Kalimantan Timur 2026.",
      content:
        "<p>Samarinda — BPSDM Kaltim berhasil meraih penghargaan Terbaik III dalam Pengarusutamaan Gender (PUG).</p>",
      status: "published" as const,
      categoryId: catMap["berita-umum"],
      authorName: "Humas BPSDM Kaltim",
      publishedAt: daysAgo(14),
      viewCount: 388,
      readingTime: 2,
      isFeatured: false,
    },
    {
      title:
        "Hadiri Musrenbang RKPD Kaltim 2027, BPSDM Dukung Transformasi Ekonomi",
      slug: "musrenbang-rkpd-kaltim-2027-transformasi-ekonomi",
      excerpt:
        "Samarinda — Kepala BPSDM Kaltim Drs. Nina Dewi, M.AP turut menghadiri Musyawarah Rencana Pembangunan Daerah (Musrenbang) RKPD Kaltim 2027.",
      content:
        "<p>Samarinda — BPSDM Kaltim berkomitmen mendukung arah transformasi ekonomi daerah melalui pengembangan SDM.</p>",
      status: "published" as const,
      categoryId: catMap["berita-diklat"],
      authorName: "Humas BPSDM Kaltim",
      publishedAt: daysAgo(14),
      viewCount: 295,
      readingTime: 3,
      isFeatured: false,
    },
  ];

  await db.insert(posts).values(postData);
  console.log(`   ✓ ${postData.length} post dibuat`);

  // ── 3. Programs ───────────────────────────
  console.log("🎓 Membuat program diklat...");

  const programData = [
    {
      name: "Kompetensi Teknis",
      slug: "kompetensi-teknis",
      jenisKey: "Teknis",
      description:
        "Pendidikan dan pelatihan untuk mencapai persyaratan kompetensi teknis yang diperlukan untuk pelaksanaan tugas ASN sesuai bidang jabatan.",
      status: "active" as const,
      isHighlight: true,
      sortOrder: 1,
    },
    {
      name: "Kompetensi Fungsional",
      slug: "kompetensi-fungsional",
      jenisKey: "Fungsional",
      description:
        "Pelatihan untuk mencapai persyaratan kompetensi fungsional yang diperlukan untuk pelaksanaan tugas jabatan fungsional ASN.",
      status: "active" as const,
      isHighlight: true,
      sortOrder: 2,
    },
    {
      name: "Kompetensi Manajerial",
      slug: "kompetensi-manajerial",
      jenisKey: "Manajerial",
      description:
        "Pelatihan kepemimpinan dan manajerial bagi ASN yang menduduki atau akan menduduki jabatan struktural di lingkungan pemerintahan.",
      status: "active" as const,
      isHighlight: true,
      sortOrder: 3,
    },
    {
      name: "Kompetensi Sosiokultural",
      slug: "kompetensi-sosiokultural",
      jenisKey: "Sosiokultural",
      description:
        "Pelatihan untuk meningkatkan kemampuan ASN dalam memahami dan mengelola keberagaman sosial dan budaya dalam pelayanan publik.",
      status: "active" as const,
      isHighlight: true,
      sortOrder: 4,
    },
    {
      name: "Pemerintahan Dalam Negeri",
      slug: "pemerintahan-dalam-negeri",
      jenisKey: "Pemerintahan Dalam Negeri",
      description:
        "Pelatihan khusus bidang pemerintahan dalam negeri untuk meningkatkan kapasitas penyelenggaraan pemerintahan daerah.",
      status: "active" as const,
      isHighlight: true,
      sortOrder: 5,
    },
    {
      name: "Sertifikasi & Uji Kompetensi",
      slug: "sertifikasi-uji-kompetensi",
      jenisKey: "Sertifikasi",
      description:
        "Program sertifikasi dan uji kompetensi untuk mengukur dan membuktikan tingkat kompetensi ASN secara formal dan terstandar.",
      status: "active" as const,
      isHighlight: true,
      sortOrder: 6,
    },
    {
      name: "Orientasi",
      slug: "orientasi",
      jenisKey: "Orientasi",
      description:
        "Program orientasi bagi Pegawai Pemerintah dengan Perjanjian Kerja (PPPK) dan CPNS untuk mengenal lingkungan kerja pemerintahan.",
      status: "active" as const,
      isHighlight: false,
      sortOrder: 7,
    },
  ];

  const insertedPrograms = await db
    .insert(programs)
    .values(programData)
    .$returningId();

  console.log(`   ✓ ${insertedPrograms.length} program dibuat`);

  const progMap: Record<string, number> = {};
  programData.forEach((p, i) => {
    progMap[p.slug] = insertedPrograms[i].id;
  });

  // ── 4. Schedules ──────────────────────────
  console.log("📅 Membuat jadwal...");

  const future = (n: number) => new Date(now.getTime() + n * 86400000);

  const scheduleData = [
    {
      programId: progMap["orientasi-pppk"],
      batchName: "Angkatan 603 Kelas Kab.",
      startDate: future(7),
      endDate: future(11),
      mode: "online" as const,
      location: "Mansyapri, Samarinda",
      quota: 120,
      registeredCount: 78,
      status: "open" as const,
    },
    {
      programId: progMap["orientasi-pppk"],
      batchName: "Angkatan D04 Kelas Kab.",
      startDate: future(8),
      endDate: future(12),
      mode: "offline" as const,
      location: "Mansyapri, Samarinda",
      quota: 80,
      registeredCount: 49,
      status: "open" as const,
    },
    {
      programId: progMap["kompetensi-teknis"],
      batchName: "Pranata Komputer Angkatan I",
      startDate: future(3),
      endDate: future(5),
      mode: "online" as const,
      location: "Virtual / Zoom",
      quota: 50,
      registeredCount: 50,
      status: "full" as const,
    },
    {
      programId: progMap["kompetensi-manajerial"],
      batchName: "Diklatpim III Batch 2",
      startDate: future(22),
      endDate: future(99),
      mode: "blended" as const,
      location: "BPSDM Kaltim, Samarinda",
      quota: 40,
      registeredCount: 22,
      status: "open" as const,
    },
  ];

  await db.insert(schedules).values(scheduleData);
  console.log(`   ✓ ${scheduleData.length} jadwal dibuat`);

  // ── 5. Announcements ──────────────────────
  console.log("📢 Membuat pengumuman...");

  await db.insert(announcements).values([
    {
      title: "Orientasi PPPK Angkatan 603 — 18–22 Mei 2026",
      url: "/program/jadwal",
      type: "info" as const,
      showInTicker: true,
      showInBanner: false,
      priority: 1,
      startDate: now,
      isActive: true,
    },
    {
      title: "Orientasi PPPK Angkatan D04 — 19–23 Mei 2026",
      url: "/program/jadwal",
      type: "info" as const,
      showInTicker: true,
      showInBanner: false,
      priority: 2,
      startDate: now,
      isActive: true,
    },
    {
      title:
        "Diklat Kepemimpinan Tk. III Batch 2 masih dibuka — Daftar sekarang",
      url: "/program/daftar",
      type: "event" as const,
      showInTicker: true,
      showInBanner: false,
      priority: 3,
      startDate: now,
      isActive: true,
    },
  ]);

  console.log("   ✓ 3 pengumuman dibuat");

  // ── 6. Settings ───────────────────────────
  console.log("⚙️  Membuat settings...");

  await db.insert(settings).values([
    {
      key: "site_name",
      value: "BPSDM Provinsi Kalimantan Timur",
      type: "string",
      group: "general",
      isPublic: true,
    },
    {
      key: "site_tagline",
      value: "Membangun ASN yang Kompeten dan Berintegritas",
      type: "string",
      group: "general",
      isPublic: true,
    },
    {
      key: "site_email",
      value: "bpsdm@kaltimprov.go.id",
      type: "string",
      group: "contact",
      isPublic: true,
    },
    {
      key: "site_phone",
      value: "(0541) 7270201",
      type: "string",
      group: "contact",
      isPublic: true,
    },
    {
      key: "site_address",
      value: "Jl. H.A.M.M. Rifaddin No. 88, Samarinda, Kaltim 75243",
      type: "string",
      group: "contact",
      isPublic: true,
    },
    {
      key: "total_visitors",
      value: "1039756",
      type: "number",
      group: "stats",
      isPublic: true,
    },
  ]);

  console.log("   ✓ 6 settings dibuat");

  console.log("\n✅ Seeding selesai!");

  // ── 7. Admin user ─────────────────────────
  console.log("👤 Membuat admin user...");

  // Insert role admin
  const [adminRole] = await db
    .insert(roles)
    .values([
      { name: "Administrator", slug: "admin", description: "Full access" },
      { name: "Editor", slug: "editor", description: "Manage content" },
      { name: "Viewer", slug: "viewer", description: "Read only" },
    ])
    .$returningId();

  // Insert admin user
  const adminId = crypto.randomUUID();
  await db.insert(users).values({
    id: adminId,
    sub: "seed-admin-placeholder",
    username: "admin",
    name: "Administrator",
    givenName: "Administrator",
    familyName: "",
    email: "admin@bpsdm.kaltimprov.go.id",
    emailVerified: false,
    authentikGroups: JSON.stringify(["superadmin", "admin"]),
    role: "superadmin",
    status: "active",
  });

  // Assign role admin
  await db.insert(userRoles).values({
    userId: adminId,
    roleId: adminRole.id,
  });

  console.log("   ✓ Admin user dibuat");
  console.log("   Email: admin@bpsdm.kaltimprov.go.id");
  console.log("   (password dikosongkan — tambahkan manual)");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seeding gagal:", err);
  process.exit(1);
});
