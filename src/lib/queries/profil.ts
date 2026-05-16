// src/lib/queries/profil.ts
import { db, eq, and, asc, isNull } from "@/db";
import { pages, units, staff, menuGroups, menuItems } from "@/db/schema";

// ── Pages ─────────────────────────────────────
export async function getPageBySlug(slug: string) {
  const result = await db
    .select()
    .from(pages)
    .where(and(eq(pages.slug, slug), eq(pages.status, "published")))
    .limit(1);
  return result[0] ?? null;
}

export async function getAllPages() {
  return await db
    .select()
    .from(pages)
    .where(eq(pages.status, "published"))
    .orderBy(asc(pages.sortOrder));
}

// ── Units (Struktur Organisasi) ───────────────
export type UnitItem = typeof units.$inferSelect;

export async function getAllUnits(): Promise<UnitItem[]> {
  return await db
    .select()
    .from(units)
    .where(eq(units.isActive, true))
    .orderBy(asc(units.level), asc(units.sortOrder));
}

// ── Staff ─────────────────────────────────────
export type StaffItem = typeof staff.$inferSelect;

export async function getStaffByType(
  type:
    | "kepala_badan"
    | "sekretaris"
    | "kepala_bidang"
    | "widyaiswara"
    | "pegawai",
): Promise<StaffItem[]> {
  return await db
    .select()
    .from(staff)
    .where(and(eq(staff.type, type), eq(staff.isActive, true)))
    .orderBy(asc(staff.sortOrder));
}

export async function getAllStaff(): Promise<StaffItem[]> {
  return await db
    .select()
    .from(staff)
    .where(eq(staff.isActive, true))
    .orderBy(asc(staff.sortOrder));
}

// ── Menu ──────────────────────────────────────
export type MenuItemWithChildren = typeof menuItems.$inferSelect & {
  children: (typeof menuItems.$inferSelect)[];
};

export async function getMenuByLocation(location: string) {
  const group = await db
    .select()
    .from(menuGroups)
    .where(eq(menuGroups.location, location))
    .limit(1);

  if (!group[0]) return [];

  const items = await db
    .select()
    .from(menuItems)
    .where(
      and(eq(menuItems.menuGroupId, group[0].id), eq(menuItems.isActive, true)),
    )
    .orderBy(asc(menuItems.sortOrder));

  // Build tree
  const roots = items.filter((i) => !i.parentId);
  return roots.map((root) => ({
    ...root,
    children: items.filter((i) => i.parentId === root.id),
  }));
}

// Tambahkan di src/lib/queries/profil.ts

export type MenuItemFull = typeof menuItems.$inferSelect & {
  children: (typeof menuItems.$inferSelect)[];
};

export async function getHeaderMenu(): Promise<MenuItemFull[]> {
  // Ambil group header
  const group = await db
    .select()
    .from(menuGroups)
    .where(eq(menuGroups.location, "header"))
    .limit(1);

  if (!group[0]) return [];

  // Ambil semua items
  const items = await db
    .select()
    .from(menuItems)
    .where(
      and(eq(menuItems.menuGroupId, group[0].id), eq(menuItems.isActive, true)),
    )
    .orderBy(asc(menuItems.sortOrder));

  // Build tree 2 level
  const roots = items.filter((i) => !i.parentId);
  return roots.map((root) => ({
    ...root,
    children: items
      .filter((i) => i.parentId === root.id)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
  }));
}
