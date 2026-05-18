// src/db/seed-settings.ts
import { db, eq } from "./index";
import { settings } from "./schema";

const SETTINGS_DATA = [
  // ── Identitas Situs ──────────────────────────
  {
    key: "site_name",
    value: "BPSDM Provinsi Kalimantan Timur",
    type: "text",
    group: "identitas",
    label: "Nama Situs",
    isPublic: true,
  },
  {
    key: "site_tagline",
    value: "Badan Pengembangan Sumber Daya Manusia",
    type: "text",
    group: "identitas",
    label: "Tagline",
    isPublic: true,
  },
  {
    key: "site_description",
    value:
      "BPSDM Provinsi Kalimantan Timur adalah lembaga pemerintah daerah yang bertugas melaksanakan pengembangan sumber daya manusia aparatur di lingkungan Pemerintah Provinsi Kalimantan Timur.",
    type: "textarea",
    group: "identitas",
    label: "Deskripsi Situs",
    isPublic: true,
  },
  {
    key: "site_logo",
    value: "/images/logo-bpsdm.png",
    type: "image",
    group: "identitas",
    label: "Logo Situs",
    isPublic: true,
  },
  {
    key: "site_favicon",
    value: "/favicon.ico",
    type: "image",
    group: "identitas",
    label: "Favicon",
    isPublic: true,
  },
  {
    key: "site_keywords",
    value:
      "BPSDM, Kalimantan Timur, diklat, pelatihan, ASN, pengembangan kompetensi",
    type: "text",
    group: "identitas",
    label: "Keywords SEO",
    isPublic: true,
  },

  // ── Kontak ───────────────────────────────────
  {
    key: "contact_address",
    value:
      "Jl. H.A.M.M. Rifaddin No. III, Loa Janan Ilir, Kota Samarinda, Kalimantan Timur 75243",
    type: "textarea",
    group: "kontak",
    label: "Alamat",
    isPublic: true,
  },
  {
    key: "contact_phone",
    value: "(0541) 7272001",
    type: "text",
    group: "kontak",
    label: "Nomor Telepon",
    isPublic: true,
  },
  {
    key: "contact_fax",
    value: "(0541) 7272002",
    type: "text",
    group: "kontak",
    label: "Nomor Fax",
    isPublic: true,
  },
  {
    key: "contact_email",
    value: "bpsdm@kaltimprov.go.id",
    type: "text",
    group: "kontak",
    label: "Email",
    isPublic: true,
  },
  {
    key: "contact_whatsapp",
    value: "628115555555",
    type: "text",
    group: "kontak",
    label: "WhatsApp (format: 628xxx)",
    isPublic: true,
  },

  // ── Lokasi Maps ──────────────────────────────
  {
    key: "maps_latitude",
    value: "-0.5022",
    type: "text",
    group: "lokasi",
    label: "Latitude",
    isPublic: true,
  },
  {
    key: "maps_longitude",
    value: "117.1536",
    type: "text",
    group: "lokasi",
    label: "Longitude",
    isPublic: true,
  },
  {
    key: "maps_zoom",
    value: "17",
    type: "number",
    group: "lokasi",
    label: "Zoom Level (14-20)",
    isPublic: true,
  },
  {
    key: "maps_pitch",
    value: "60",
    type: "number",
    group: "lokasi",
    label: "Pitch/Kemiringan 3D (0-85)",
    isPublic: true,
  },
  {
    key: "mapbox_token",
    value: "",
    type: "text",
    group: "lokasi",
    label: "Mapbox Access Token",
    isPublic: false,
  },

  // ── Jam Operasional ───────────────────────────
  {
    key: "hours_weekday",
    value: "08.00 – 16.00 WITA",
    type: "text",
    group: "jam_operasional",
    label: "Jam Senin – Kamis",
    isPublic: true,
  },
  {
    key: "hours_friday",
    value: "08.00 – 11.00 WITA",
    type: "text",
    group: "jam_operasional",
    label: "Jam Jumat",
    isPublic: true,
  },
  {
    key: "hours_weekend",
    value: "Tutup",
    type: "text",
    group: "jam_operasional",
    label: "Jam Sabtu – Minggu",
    isPublic: true,
  },
  {
    key: "hours_note",
    value: "Khusus hari libur nasional, pelayanan menyesuaikan.",
    type: "text",
    group: "jam_operasional",
    label: "Catatan Jam Pelayanan",
    isPublic: true,
  },

  // ── Media Sosial ──────────────────────────────
  {
    key: "social_facebook",
    value: "https://facebook.com/bpsdmkaltim",
    type: "text",
    group: "sosial_media",
    label: "Facebook URL",
    isPublic: true,
  },
  {
    key: "social_instagram",
    value: "https://instagram.com/bpsdmkaltim",
    type: "text",
    group: "sosial_media",
    label: "Instagram URL",
    isPublic: true,
  },
  {
    key: "social_twitter",
    value: "https://twitter.com/bpsdmkaltim",
    type: "text",
    group: "sosial_media",
    label: "Twitter/X URL",
    isPublic: true,
  },
  {
    key: "social_youtube",
    value: "https://youtube.com/@bpsdmkaltim",
    type: "text",
    group: "sosial_media",
    label: "YouTube URL",
    isPublic: true,
  },
  {
    key: "social_tiktok",
    value: "",
    type: "text",
    group: "sosial_media",
    label: "TikTok URL",
    isPublic: true,
  },

  // ── Footer ────────────────────────────────────
  {
    key: "footer_copyright",
    value:
      "© 2025 Badan Pengembangan Sumber Daya Manusia Provinsi Kalimantan Timur. Hak cipta dilindungi.",
    type: "text",
    group: "footer",
    label: "Teks Copyright",
    isPublic: true,
  },
  {
    key: "footer_description",
    value:
      "Melayani pengembangan kompetensi aparatur sipil negara di Provinsi Kalimantan Timur dengan profesional dan berintegritas.",
    type: "textarea",
    group: "footer",
    label: "Deskripsi Footer",
    isPublic: true,
  },

  // ── KPI Beranda ──────────────────────────────
  {
    key: "kpi_peserta",
    value: "12.547",
    type: "text",
    group: "beranda",
    label: "KPI: Jumlah Peserta Diklat",
    isPublic: true,
  },
  {
    key: "kpi_kepuasan",
    value: "96,8",
    type: "text",
    group: "beranda",
    label: "KPI: Tingkat Kepuasan Peserta (%)",
    isPublic: true,
  },
  {
    key: "kpi_akreditasi",
    value: "10",
    type: "text",
    group: "beranda",
    label: "KPI: Pelatihan Terakreditasi",
    isPublic: true,
  },
  {
    key: "kpi_kegiatan",
    value: "603",
    type: "text",
    group: "beranda",
    label: "KPI: Kegiatan Pengembangan Kompetensi",
    isPublic: true,
  },
];

async function seedSettings() {
  console.log("⚙️  Seeding settings...");

  for (const setting of SETTINGS_DATA) {
    // Upsert — update jika ada, insert jika belum
    const existing = await db
      .select()
      .from(settings)
      .where(eq(settings.key, setting.key))
      .limit(1);

    if (existing[0]) {
      // Update label, type, group saja — jangan overwrite value yang mungkin sudah diubah user
      await db
        .update(settings)
        .set({
          label: setting.label,
          type: setting.type,
          group: setting.group,
          isPublic: setting.isPublic,
        })
        .where(eq(settings.key, setting.key));
    } else {
      await db.insert(settings).values(setting);
    }
  }

  console.log(`   ✓ ${SETTINGS_DATA.length} settings di-upsert`);
  console.log("\n✅ Selesai!");
  process.exit(0);
}

seedSettings().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
