// src/lib/queries/ppid.ts
import { db, eq, and, desc, asc, sql, like, or } from "@/db";
import { ppidInformasi, ppidPermohonan, ppidPejabat } from "@/db/schema";

export type PpidInformasiItem = typeof ppidInformasi.$inferSelect;
export type PpidPermohonanItem = typeof ppidPermohonan.$inferSelect;
export type PpidPejabatItem = typeof ppidPejabat.$inferSelect;

export type PpidTipe =
  | "berkala"
  | "serta_merta"
  | "setiap_saat"
  | "dikecualikan";

// Count per tipe
export async function getPpidCount() {
  const result = await db
    .select({
      tipe: ppidInformasi.tipe,
      total: sql<number>`COUNT(*)`,
    })
    .from(ppidInformasi)
    .where(eq(ppidInformasi.status, "published"))
    .groupBy(ppidInformasi.tipe);

  return Object.fromEntries(result.map((r) => [r.tipe, r.total]));
}

// Pejabat PPID
export async function getPpidPejabat() {
  return db
    .select()
    .from(ppidPejabat)
    .where(eq(ppidPejabat.isActive, true))
    .orderBy(asc(ppidPejabat.sortOrder));
}

// Permohonan by nomor (untuk tracking publik)
export async function getPermohonanByNomor(nomor: string) {
  const result = await db
    .select()
    .from(ppidPermohonan)
    .where(eq(ppidPermohonan.nomorPermohonan, nomor))
    .limit(1);
  return result[0] ?? null;
}

// Semua permohonan (admin)
export async function getAllPermohonan(
  options: {
    status?: string;
    limit?: number;
    offset?: number;
  } = {},
) {
  const { status, limit = 20, offset = 0 } = options;
  return db
    .select()
    .from(ppidPermohonan)
    .where(status ? eq(ppidPermohonan.status, status as any) : undefined)
    .orderBy(desc(ppidPermohonan.createdAt))
    .limit(limit)
    .offset(offset);
}

// Tambahkan/ganti getPpidInformasi:
export async function getPpidInformasi(
  options: {
    tipe?: string;
    search?: string;
    limit?: number;
    offset?: number;
    sort?: string;
  } = {},
) {
  const { tipe, search, limit = 12, offset = 0, sort = "terbaru" } = options;

  const conditions = [
    eq(ppidInformasi.status, "published"),
    tipe ? eq(ppidInformasi.tipe, tipe as any) : undefined,
    search
      ? or(
          like(ppidInformasi.judul, `%${search}%`),
          like(ppidInformasi.deskripsi, `%${search}%`),
        )
      : undefined,
  ].filter(Boolean) as any[];

  const orderBy =
    sort === "az"
      ? asc(ppidInformasi.judul)
      : sort === "za"
        ? desc(ppidInformasi.judul)
        : sort === "terlama"
          ? asc(ppidInformasi.createdAt)
          : desc(ppidInformasi.createdAt);

  return db
    .select()
    .from(ppidInformasi)
    .where(and(...conditions))
    .orderBy(asc(ppidInformasi.sortOrder), orderBy)
    .limit(limit)
    .offset(offset);
}

export async function countPpidInformasi(
  options: {
    tipe?: string;
    search?: string;
  } = {},
) {
  const { tipe, search } = options;

  const conditions = [
    eq(ppidInformasi.status, "published"),
    tipe ? eq(ppidInformasi.tipe, tipe as any) : undefined,
    search
      ? or(
          like(ppidInformasi.judul, `%${search}%`),
          like(ppidInformasi.deskripsi, `%${search}%`),
        )
      : undefined,
  ].filter(Boolean) as any[];

  const result = await db
    .select({ total: sql<number>`COUNT(*)` })
    .from(ppidInformasi)
    .where(and(...conditions));

  return result[0]?.total ?? 0;
}
