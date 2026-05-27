// src/lib/queries/profil.ts
import { db, eq, and, asc, isNull, inArray, sql } from "@/db";
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

export async function getAllPimpinan() {
  return db
    .select()
    .from(staff)
    .where(inArray(staff.type, ["kepala_badan", "sekretaris", "kepala_bidang"]))
    .orderBy(
      // Urutan: kepala_badan dulu, lalu sekretaris, lalu kepala_bidang
      sql`FIELD(type, 'kepala_badan', 'sekretaris', 'kepala_bidang')`,
      asc(staff.sortOrder),
      asc(staff.name),
    );
}

// Tambahkan di src/lib/queries/profil.ts
export type UnitWithStaff = UnitItem & {
  headStaff: StaffItem | null;
  staffCount: number;
};

// src/lib/queries/profil.ts — ganti getAllUnitsWithStaff
export async function getAllUnitsWithStaff(): Promise<UnitWithStaff[]> {
  const allUnits = await getAllUnits();
  const allStaff = await getAllStaff();

  // Bangun map unit → children
  const childrenMap = new Map<number, number[]>();
  for (const u of allUnits) {
    if (u.parentId != null) {
      if (!childrenMap.has(u.parentId)) childrenMap.set(u.parentId, []);
      childrenMap.get(u.parentId)!.push(u.id);
    }
  }

  // Hitung semua descendant unit ids secara rekursif
  function getAllDescendantIds(unitId: number): number[] {
    const children = childrenMap.get(unitId) ?? [];
    return [unitId, ...children.flatMap((cid) => getAllDescendantIds(cid))];
  }

  return allUnits.map((unit) => {
    // Semua unit ids termasuk diri sendiri dan semua turunannya
    const allIds = getAllDescendantIds(unit.id);
    const unitStaff = allStaff.filter(
      (s) => s.unitId != null && allIds.includes(s.unitId),
    );

    // Kepala unit — staf langsung di unit ini saja
    const directStaff = allStaff.filter((s) => s.unitId === unit.id);
    const headStaff =
      directStaff.find((s) =>
        ["kepala_badan", "sekretaris", "kepala_bidang"].includes(s.type),
      ) ??
      directStaff[0] ??
      null;

    return {
      ...unit,
      headStaff,
      staffCount: unitStaff.length, // total termasuk bawahan
    };
  });
}
