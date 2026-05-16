// src/db/seed-profil.ts
import { db } from "./index";
import { pages, units, staff, menuGroups, menuItems } from "./schema";

async function seedProfil() {
  console.log("🌱 Seeding data profil organisasi...");

  // ── 1. Pages ──────────────────────────────
  console.log("📄 Membuat pages...");
  await db.delete(pages);

  await db.insert(pages).values([
    {
      title: "Profil BPSDM Kaltim",
      slug: "profil",
      template: "profil",
      status: "published" as const,
      sortOrder: 1,
      content: `<p>Badan Pengembangan Sumber Daya Manusia (BPSDM) Provinsi Kalimantan Timur adalah lembaga pemerintah daerah yang bertugas melaksanakan pengembangan sumber daya manusia aparatur di lingkungan Pemerintah Provinsi Kalimantan Timur.</p>
<p>BPSDM Kaltim berkomitmen untuk menjadi pusat unggulan pengembangan kompetensi aparatur sipil negara yang profesional, berintegritas, dan inovatif dalam mendukung pembangunan daerah Kalimantan Timur.</p>`,
      excerpt:
        "Badan Pengembangan Sumber Daya Manusia Provinsi Kalimantan Timur",
      showInNav: true,
    },
    {
      title: "Sejarah",
      slug: "profil/sejarah",
      template: "default",
      status: "published" as const,
      sortOrder: 2,
      content: `<p>Badan Pengembangan Sumber Daya Manusia (BPSDM) Provinsi Kalimantan Timur dibentuk berdasarkan Peraturan Daerah Provinsi Kalimantan Timur Nomor 9 Tahun 2016 tentang Pembentukan dan Susunan Perangkat Daerah.</p>
<p>Sebelumnya, fungsi pengembangan SDM aparatur dilaksanakan oleh Badan Pendidikan dan Pelatihan (Bandiklat) Provinsi Kalimantan Timur yang telah berdiri sejak tahun 1974.</p>
<h2>Tonggak Sejarah</h2>
<p><strong>1974</strong> — Berdirinya Pusat Pendidikan dan Latihan (Pusdiklat) Provinsi Kalimantan Timur.</p>
<p><strong>1984</strong> — Berganti nama menjadi Badan Pendidikan dan Pelatihan (Bandiklat).</p>
<p><strong>2016</strong> — Transformasi menjadi Badan Pengembangan Sumber Daya Manusia (BPSDM) sesuai PP No. 18 Tahun 2016.</p>`,
      showInNav: true,
    },
    {
      title: "Visi & Misi",
      slug: "profil/visi-misi",
      template: "visi-misi",
      status: "published" as const,
      sortOrder: 3,
      content: `<h2>Visi</h2>
<p>Terwujudnya Aparatur Sipil Negara yang Kompeten, Profesional, dan Berintegritas dalam Mendukung Kalimantan Timur Berdaulat.</p>
<h2>Misi</h2>
<ol>
<li>Meningkatkan kualitas dan kuantitas penyelenggaraan pengembangan kompetensi ASN.</li>
<li>Mengembangkan sistem manajemen pengembangan SDM aparatur yang efektif dan efisien.</li>
<li>Memperkuat kemitraan dengan lembaga pengembangan SDM nasional dan internasional.</li>
<li>Meningkatkan kapasitas kelembagaan BPSDM sebagai pusat unggulan pengembangan kompetensi.</li>
</ol>
<h2>Nilai-Nilai Organisasi</h2>
<p><strong>BerAKHLAK</strong> — Berorientasi Pelayanan, Akuntabel, Kompeten, Harmonis, Loyal, Adaptif, Kolaboratif.</p>`,
      showInNav: true,
    },
    {
      title: "Tugas & Fungsi",
      slug: "profil/tugas-fungsi",
      template: "default",
      status: "published" as const,
      sortOrder: 4,
      content: `<h2>Tugas Pokok</h2>
<p>BPSDM Provinsi Kalimantan Timur mempunyai tugas membantu Gubernur melaksanakan urusan pemerintahan di bidang pengembangan sumber daya manusia aparatur yang menjadi kewenangan daerah.</p>
<h2>Fungsi</h2>
<ol>
<li>Perumusan kebijakan di bidang pengembangan sumber daya manusia aparatur.</li>
<li>Pelaksanaan kebijakan di bidang pengembangan sumber daya manusia aparatur.</li>
<li>Pelaksanaan evaluasi dan pelaporan di bidang pengembangan sumber daya manusia aparatur.</li>
<li>Pelaksanaan administrasi badan sesuai dengan lingkup tugasnya.</li>
<li>Pelaksanaan fungsi lain yang diberikan oleh Gubernur.</li>
</ol>`,
      showInNav: true,
    },
    {
      title: "Sambutan Kepala Badan",
      slug: "profil/sambutan",
      template: "sambutan",
      status: "published" as const,
      sortOrder: 5,
      content: `<p>Assalamu'alaikum Warahmatullahi Wabarakatuh,</p>
<p>Puji syukur kita panjatkan ke hadirat Allah SWT atas segala rahmat dan karunia-Nya sehingga Badan Pengembangan Sumber Daya Manusia (BPSDM) Provinsi Kalimantan Timur dapat terus menjalankan tugasnya dalam pengembangan kompetensi aparatur sipil negara.</p>
<p>BPSDM Kaltim berkomitmen untuk terus berinovasi dalam penyelenggaraan pengembangan kompetensi yang berkualitas, relevan, dan berdampak nyata bagi peningkatan kinerja birokrasi di Kalimantan Timur.</p>
<p>Wassalamu'alaikum Warahmatullahi Wabarakatuh.</p>`,
      showInNav: true,
    },
  ]);
  console.log("   ✓ 5 pages dibuat");

  // ── 2. Units (Struktur Organisasi) ────────
  console.log("🏢 Membuat struktur organisasi...");
  await db.delete(units);

  const insertedUnits = await db
    .insert(units)
    .values([
      // Level 0 — Pimpinan
      {
        name: "Kepala Badan",
        shortName: "Kaban",
        level: 0,
        sortOrder: 1,
        parentId: null,
      },
      // Level 1 — Sekretariat
      {
        name: "Sekretariat",
        shortName: "Setban",
        level: 1,
        sortOrder: 2,
        parentId: null,
      },
      // Level 2 — Bidang
      {
        name: "Bidang Pengembangan Kompetensi Teknis dan Fungsional",
        shortName: "Bid. PKT-F",
        level: 2,
        sortOrder: 3,
        parentId: null,
      },
      {
        name: "Bidang Pengembangan Kompetensi Manajerial dan Sosial Kultural",
        shortName: "Bid. PKM-SK",
        level: 2,
        sortOrder: 4,
        parentId: null,
      },
      {
        name: "Bidang Pengembangan Kompetensi Pemerintahan",
        shortName: "Bid. PKP",
        level: 2,
        sortOrder: 5,
        parentId: null,
      },
      {
        name: "UPT Sertifikasi Kompetensi",
        shortName: "UPT Sertkom",
        level: 2,
        sortOrder: 6,
        parentId: null,
      },
      // Sub-bagian Sekretariat
      {
        name: "Sub Bagian Umum dan Kepegawaian",
        shortName: "Subbag Umum",
        level: 3,
        sortOrder: 7,
        parentId: null,
      },
      {
        name: "Sub Bagian Perencanaan dan Keuangan",
        shortName: "Subbag Renkeu",
        level: 3,
        sortOrder: 8,
        parentId: null,
      },
    ])
    .$returningId();

  // Update parentId setelah insert
  const unitIds = insertedUnits.map((u) => u.id);
  // Sekretariat → parent Kepala Badan
  await db
    .update(units)
    .set({ parentId: unitIds[0] })
    .where(db.query ? undefined : undefined);

  console.log("   ✓ Unit organisasi dibuat");

  // ── 3. Staff ──────────────────────────────
  console.log("👤 Membuat data pegawai...");
  await db.delete(staff);

  await db.insert(staff).values([
    {
      name: "Drs. Nina Dewi, M.AP",
      position: "Kepala Badan Pengembangan Sumber Daya Manusia",
      type: "kepala_badan" as const,
      unitId: unitIds[0],
      education: "S2 Administrasi Publik",
      sortOrder: 1,
      isActive: true,
    },
    {
      name: "Rina Kushariyanti, S.Sos, M.Si",
      position: "Sekretaris BPSDM",
      type: "sekretaris" as const,
      unitId: unitIds[1],
      education: "S2 Ilmu Sosial",
      sortOrder: 2,
      isActive: true,
    },
    {
      name: "Ahmad Fauzan, S.IP, M.Si",
      position: "Kepala Bidang PKT-F",
      type: "kepala_bidang" as const,
      unitId: unitIds[2],
      education: "S2 Ilmu Pemerintahan",
      sortOrder: 3,
      isActive: true,
    },
    {
      name: "Siti Rahmawati, S.Pd, M.Pd",
      position: "Kepala Bidang PKM-SK",
      type: "kepala_bidang" as const,
      unitId: unitIds[3],
      education: "S2 Pendidikan",
      sortOrder: 4,
      isActive: true,
    },
    {
      name: "Ir. Bambang Setiawan, M.T",
      position: "Kepala Bidang PKP",
      type: "kepala_bidang" as const,
      unitId: unitIds[4],
      education: "S2 Teknik",
      sortOrder: 5,
      isActive: true,
    },
    // Widyaiswara
    {
      name: "Dr. Hendra Wijaya, M.AP",
      position: "Widyaiswara Ahli Utama",
      type: "widyaiswara" as const,
      education: "S3 Administrasi Publik",
      sortOrder: 6,
      isActive: true,
    },
    {
      name: "Dra. Sri Mulyani, M.Si",
      position: "Widyaiswara Ahli Madya",
      type: "widyaiswara" as const,
      education: "S2 Ilmu Sosial",
      sortOrder: 7,
      isActive: true,
    },
    {
      name: "Agus Santoso, S.H, M.H",
      position: "Widyaiswara Ahli Muda",
      type: "widyaiswara" as const,
      education: "S2 Hukum",
      sortOrder: 8,
      isActive: true,
    },
  ]);
  console.log("   ✓ Data pegawai dibuat");

  // ── 4. Menu Groups ────────────────────────
  console.log("📋 Membuat menu...");
  await db.delete(menuItems);
  await db.delete(menuGroups);

  const [menuGroup] = await db
    .insert(menuGroups)
    .values({
      name: "Menu Profil",
      slug: "profil-menu",
      location: "profil",
    })
    .$returningId();

  await db.insert(menuItems).values([
    {
      menuGroupId: menuGroup.id,
      label: "Profil",
      url: "/profil",
      sortOrder: 1,
      isActive: true,
    },
    {
      menuGroupId: menuGroup.id,
      label: "Sejarah",
      url: "/profil/sejarah",
      sortOrder: 2,
      isActive: true,
    },
    {
      menuGroupId: menuGroup.id,
      label: "Visi & Misi",
      url: "/profil/visi-misi",
      sortOrder: 3,
      isActive: true,
    },
    {
      menuGroupId: menuGroup.id,
      label: "Tugas & Fungsi",
      url: "/profil/tugas-fungsi",
      sortOrder: 4,
      isActive: true,
    },
    {
      menuGroupId: menuGroup.id,
      label: "Sambutan Kepala",
      url: "/profil/sambutan",
      sortOrder: 5,
      isActive: true,
    },
    {
      menuGroupId: menuGroup.id,
      label: "Struktur Organisasi",
      url: "/profil/struktur-organisasi",
      sortOrder: 6,
      isActive: true,
    },
    {
      menuGroupId: menuGroup.id,
      label: "Kepala Badan",
      url: "/profil/kepala-badan",
      sortOrder: 7,
      isActive: true,
    },
    {
      menuGroupId: menuGroup.id,
      label: "Widyaiswara",
      url: "/profil/widyaiswara",
      sortOrder: 8,
      isActive: true,
    },
    {
      menuGroupId: menuGroup.id,
      label: "Bidang",
      url: "/profil/bidang",
      sortOrder: 9,
      isActive: true,
    },
    {
      menuGroupId: menuGroup.id,
      label: "Pegawai",
      url: "/profil/pegawai",
      sortOrder: 10,
      isActive: true,
    },
  ]);
  console.log("   ✓ Menu profil dibuat");

  console.log("\n✅ Seeding profil selesai!");
  process.exit(0);
}

seedProfil().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
