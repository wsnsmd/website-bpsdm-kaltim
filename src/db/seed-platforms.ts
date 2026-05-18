// src/db/seed-platforms.ts
import { db } from "./index";
import { platforms } from "./schema";

const PLATFORM_DATA = [
  // ── Unggulan (tampil di beranda) ──
  {
    name: "SIMPel",
    description: "Sistem Informasi Manajemen Pelatihan terintegrasi",
    url: "https://simpel.kaltimprov.go.id",
    icon: "ClipboardList",
    color: "#0e3d20",
    category: "unggulan",
    isHighlight: true,
    sortOrder: 1,
  },
  {
    name: "Learning Center",
    description: "Platform e-learning dengan ribuan materi",
    url: "https://learning.bpsdmkaltim.go.id",
    icon: "GraduationCap",
    color: "#0e3d20",
    category: "unggulan",
    isHighlight: true,
    sortOrder: 2,
  },
  {
    name: "Computer Based Test",
    description: "Ujian sertifikasi berbasis komputer",
    url: "https://cbt.bpsdmkaltim.go.id",
    icon: "MonitorCheck",
    color: "#0e3d20",
    category: "unggulan",
    isHighlight: true,
    sortOrder: 3,
  },
  {
    name: "e-Pustaka",
    description: "Perpustakaan digital & jurnal ilmiah",
    url: "https://epustaka.bpsdmkaltim.go.id",
    icon: "BookOpen",
    color: "#0e3d20",
    category: "unggulan",
    isHighlight: true,
    sortOrder: 4,
  },

  // ── Ekosistem Digital ──
  {
    name: "Database Inovasi",
    description: "Kumpulan inovasi daerah",
    url: "#",
    icon: "Database",
    color: "#0e3d20",
    category: "ekosistem",
    isHighlight: false,
    sortOrder: 5,
  },
  {
    name: "Survei & Evaluasi",
    description: "Pengukuran kepuasan layanan",
    url: "#",
    icon: "BarChart2",
    color: "#0e3d20",
    category: "ekosistem",
    isHighlight: false,
    sortOrder: 6,
  },
  {
    name: "Penyimpanan Awan",
    description: "Cloud storage untuk ASN",
    url: "#",
    icon: "Cloud",
    color: "#0e3d20",
    category: "ekosistem",
    isHighlight: false,
    sortOrder: 7,
  },
  {
    name: "Analisis Kebutuhan",
    description: "AKPK untuk kompetensi",
    url: "#",
    icon: "TrendingUp",
    color: "#0e3d20",
    category: "ekosistem",
    isHighlight: false,
    sortOrder: 8,
  },
  {
    name: "Sistem Monitoring",
    description: "Pantau perkembangan kompetensi",
    url: "#",
    icon: "Activity",
    color: "#0e3d20",
    category: "ekosistem",
    isHighlight: false,
    sortOrder: 9,
  },
  {
    name: "Nusantara Journal",
    description: "Jurnal inovasi Nusantara",
    url: "#",
    icon: "Newspaper",
    color: "#0e3d20",
    category: "ekosistem",
    isHighlight: false,
    sortOrder: 10,
  },
  {
    name: "Knowledge Management",
    description: "Sistem manajemen pengetahuan",
    url: "#",
    icon: "Brain",
    color: "#0e3d20",
    category: "ekosistem",
    isHighlight: false,
    sortOrder: 11,
  },
  {
    name: "PPID Pelaksana",
    description: "Portal informasi publik",
    url: "#",
    icon: "Globe",
    color: "#0e3d20",
    category: "ekosistem",
    isHighlight: false,
    sortOrder: 12,
  },
  {
    name: "Data Statistik",
    description: "Statistik SDM Kaltim",
    url: "#",
    icon: "PieChart",
    color: "#0e3d20",
    category: "ekosistem",
    isHighlight: false,
    sortOrder: 13,
  },
  {
    name: "Bantuan Online",
    description: "Helpdesk & support",
    url: "#",
    icon: "Headphones",
    color: "#0e3d20",
    category: "ekosistem",
    isHighlight: false,
    sortOrder: 14,
  },
  {
    name: "SP4N LAPOR!",
    description: "Sistem pengaduan online",
    url: "https://www.lapor.go.id",
    icon: "MessageSquareWarning",
    color: "#0e3d20",
    category: "ekosistem",
    isHighlight: false,
    sortOrder: 15,
  },
  {
    name: "Kalender Pelatihan",
    description: "Jadwal kegiatan BPSDM",
    url: "/program/jadwal",
    icon: "CalendarDays",
    color: "#0e3d20",
    category: "ekosistem",
    isHighlight: false,
    sortOrder: 16,
  },
];

async function seedPlatforms() {
  console.log("🖥️  Seeding platforms...");
  await db.delete(platforms);
  await db
    .insert(platforms)
    .values(PLATFORM_DATA.map((p) => ({ ...p, isActive: true })));
  console.log(`   ✓ ${PLATFORM_DATA.length} platform dibuat`);
  console.log("\n✅ Selesai!");
  process.exit(0);
}

seedPlatforms().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
