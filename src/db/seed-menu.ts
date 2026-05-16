// src/db/seed-menu.ts
import { db, eq } from "./index";
import { menuGroups, menuItems } from "./schema";

async function seedMenu() {
  console.log("📋 Seeding menu header...");

  // Hapus menu header jika sudah ada
  const existing = await db
    .select()
    .from(menuGroups)
    .where(eq(menuGroups.location, "header"))
    .limit(1);

  if (existing[0]) {
    await db.delete(menuItems).where(eq(menuItems.menuGroupId, existing[0].id));
    await db.delete(menuGroups).where(eq(menuGroups.id, existing[0].id));
    console.log("   ✓ Menu lama dihapus");
  }

  // Buat group
  await db.insert(menuGroups).values({
    name: "Menu Header",
    slug: "header-menu",
    location: "header",
  });

  const [group] = await db
    .select()
    .from(menuGroups)
    .where(eq(menuGroups.location, "header"))
    .limit(1);

  // Insert menu items
  await db.insert(menuItems).values([
    // Level 1 — tanpa parent
    {
      menuGroupId: group.id,
      label: "Beranda",
      url: "/",
      sortOrder: 1,
      isActive: true,
      parentId: null,
    },
    {
      menuGroupId: group.id,
      label: "Profil",
      url: "/profil",
      sortOrder: 2,
      isActive: true,
      parentId: null,
    },
    {
      menuGroupId: group.id,
      label: "Program",
      url: "/program",
      sortOrder: 3,
      isActive: true,
      parentId: null,
    },
    {
      menuGroupId: group.id,
      label: "Publikasi",
      url: "/berita",
      sortOrder: 4,
      isActive: true,
      parentId: null,
    },
    {
      menuGroupId: group.id,
      label: "Kontak",
      url: "/kontak",
      sortOrder: 5,
      isActive: true,
      parentId: null,
    },
  ]);

  // Ambil ID menu level 1 untuk sub-menu
  const level1 = await db
    .select()
    .from(menuItems)
    .where(eq(menuItems.menuGroupId, group.id));

  const profil = level1.find((m) => m.label === "Profil");
  const program = level1.find((m) => m.label === "Program");
  const publikasi = level1.find((m) => m.label === "Publikasi");

  if (profil) {
    await db.insert(menuItems).values([
      {
        menuGroupId: group.id,
        parentId: profil.id,
        label: "Tentang BPSDM",
        url: "/profil",
        sortOrder: 1,
        isActive: true,
      },
      {
        menuGroupId: group.id,
        parentId: profil.id,
        label: "Sejarah",
        url: "/profil/sejarah",
        sortOrder: 2,
        isActive: true,
      },
      {
        menuGroupId: group.id,
        parentId: profil.id,
        label: "Visi & Misi",
        url: "/profil/visi-misi",
        sortOrder: 3,
        isActive: true,
      },
      {
        menuGroupId: group.id,
        parentId: profil.id,
        label: "Tugas & Fungsi",
        url: "/profil/tugas-fungsi",
        sortOrder: 4,
        isActive: true,
      },
      {
        menuGroupId: group.id,
        parentId: profil.id,
        label: "Struktur Organisasi",
        url: "/profil/struktur-organisasi",
        sortOrder: 5,
        isActive: true,
      },
      {
        menuGroupId: group.id,
        parentId: profil.id,
        label: "Kepala Badan",
        url: "/profil/kepala-badan",
        sortOrder: 6,
        isActive: true,
      },
      {
        menuGroupId: group.id,
        parentId: profil.id,
        label: "Widyaiswara",
        url: "/profil/widyaiswara",
        sortOrder: 7,
        isActive: true,
      },
    ]);
  }

  if (program) {
    await db.insert(menuItems).values([
      {
        menuGroupId: group.id,
        parentId: program.id,
        label: "Katalog Program",
        url: "/program",
        sortOrder: 1,
        isActive: true,
      },
      {
        menuGroupId: group.id,
        parentId: program.id,
        label: "Jadwal Pelatihan",
        url: "/program/jadwal",
        sortOrder: 2,
        isActive: true,
      },
    ]);
  }

  if (publikasi) {
    await db.insert(menuItems).values([
      {
        menuGroupId: group.id,
        parentId: publikasi.id,
        label: "Berita",
        url: "/berita",
        sortOrder: 1,
        isActive: true,
      },
      {
        menuGroupId: group.id,
        parentId: publikasi.id,
        label: "Artikel",
        url: "/berita?kategori=artikel",
        sortOrder: 2,
        isActive: true,
      },
      {
        menuGroupId: group.id,
        parentId: publikasi.id,
        label: "Pengumuman",
        url: "/pengumuman",
        sortOrder: 3,
        isActive: true,
      },
      {
        menuGroupId: group.id,
        parentId: publikasi.id,
        label: "Unduhan",
        url: "/unduhan",
        sortOrder: 4,
        isActive: true,
      },
    ]);
  }

  const total = await db
    .select()
    .from(menuItems)
    .where(eq(menuItems.menuGroupId, group.id));
  console.log(`   ✓ ${total.length} menu items dibuat`);
  console.log("\n✅ Selesai!");
  process.exit(0);
}

seedMenu().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
