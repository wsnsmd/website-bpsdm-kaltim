// src/lib/queries/settings.ts
import { db, eq } from "@/db";
import { settings } from "@/db/schema";

export type SettingItem = typeof settings.$inferSelect;

// Ambil semua settings sebagai key-value map
export async function getSettings(): Promise<Record<string, string>> {
  const rows = await db.select().from(settings);
  return Object.fromEntries(rows.map((r) => [r.key, r.value ?? ""]));
}

// Ambil settings publik saja
export async function getPublicSettings(): Promise<Record<string, string>> {
  const rows = await db
    .select()
    .from(settings)
    .where(eq(settings.isPublic, true));
  return Object.fromEntries(rows.map((r) => [r.key, r.value ?? ""]));
}

// Ambil satu setting
export async function getSetting(key: string): Promise<string> {
  const result = await db
    .select()
    .from(settings)
    .where(eq(settings.key, key))
    .limit(1);
  return result[0]?.value ?? "";
}

// Ambil settings per group
export async function getSettingsByGroup(): Promise<
  Record<string, SettingItem[]>
> {
  const rows = await db.select().from(settings).orderBy(settings.group);

  const grouped: Record<string, SettingItem[]> = {};
  for (const row of rows) {
    const g = row.group ?? "umum";
    if (!grouped[g]) grouped[g] = [];
    grouped[g].push(row);
  }
  return grouped;
}
