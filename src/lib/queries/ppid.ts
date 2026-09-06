// src/lib/queries/ppid.ts
import { db, eq, and, desc, asc, sql, like, or, gte, lte } from "@/db";
import {
  ppidInformasi,
  ppidPermohonan,
  ppidKeberatan,
  ppidPejabat,
} from "@/db/schema";

export type PpidInformasiItem = typeof ppidInformasi.$inferSelect;
export type PpidPermohonanItem = typeof ppidPermohonan.$inferSelect;
export type PpidKeberatanItem = typeof ppidKeberatan.$inferSelect;
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

// Keberatan by nomor (untuk tracking publik)
export async function getKeberatanByNomor(nomor: string) {
  const result = await db
    .select()
    .from(ppidKeberatan)
    .where(eq(ppidKeberatan.nomorKeberatan, nomor))
    .limit(1);
  return result[0] ?? null;
}

// Semua keberatan (admin)
export async function getAllKeberatan(
  options: {
    status?: string;
    limit?: number;
    offset?: number;
  } = {},
) {
  const { status, limit = 20, offset = 0 } = options;
  return db
    .select()
    .from(ppidKeberatan)
    .where(status ? eq(ppidKeberatan.status, status as any) : undefined)
    .orderBy(desc(ppidKeberatan.createdAt))
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

// ═══════════════════════════════════════════
// STATISTIK LAYANAN INFORMASI PUBLIK
// Dipakai untuk Berkala #4/#13 & Pelayanan Info #22
// (jumlah permohonan, waktu penyelesaian, dikabulkan/ditolak)
// ═══════════════════════════════════════════

export type PpidLayananStats = {
  tahun: number;
  permohonan: {
    total: number;
    diterima: number;
    diproses: number;
    selesai: number; // dikabulkan (sebagian/seluruhnya)
    ditolak: number;
    banding: number;
    rataRataHariPenyelesaian: number | null;
  };
  keberatan: {
    total: number;
    diterima: number;
    diproses: number;
    selesai: number;
    ditolak: number;
    diteruskanKi: number;
    rataRataHariPenyelesaian: number | null;
  };
};

// Daftar tahun yang punya data (permohonan atau keberatan), terbaru dulu.
// Dipakai untuk dropdown/tab pemilihan tahun di halaman publik.
export async function getPpidLayananYears(): Promise<number[]> {
  const [permYears, kbrYears] = await Promise.all([
    db
      .select({ tahun: sql<number>`YEAR(${ppidPermohonan.createdAt})` })
      .from(ppidPermohonan)
      .groupBy(sql`YEAR(${ppidPermohonan.createdAt})`),
    db
      .select({ tahun: sql<number>`YEAR(${ppidKeberatan.createdAt})` })
      .from(ppidKeberatan)
      .groupBy(sql`YEAR(${ppidKeberatan.createdAt})`),
  ]);

  const years = new Set<number>([
    ...permYears.map((r) => r.tahun),
    ...kbrYears.map((r) => r.tahun),
  ]);

  // Selalu sertakan tahun berjalan & tahun sebelumnya meski belum ada data.
  const now = new Date().getFullYear();
  years.add(now);
  years.add(now - 1);

  return Array.from(years).sort((a, b) => b - a);
}

// Statistik agregat permohonan & keberatan untuk satu tahun.
export async function getPpidLayananStats(
  tahun: number,
): Promise<PpidLayananStats> {
  const start = new Date(`${tahun}-01-01T00:00:00`);
  const end = new Date(`${tahun + 1}-01-01T00:00:00`);

  const [permRows] = await db
    .select({
      total: sql<number>`COUNT(*)`,
      diterima: sql<number>`SUM(CASE WHEN ${ppidPermohonan.status} = 'diterima' THEN 1 ELSE 0 END)`,
      diproses: sql<number>`SUM(CASE WHEN ${ppidPermohonan.status} = 'diproses' THEN 1 ELSE 0 END)`,
      selesai: sql<number>`SUM(CASE WHEN ${ppidPermohonan.status} = 'selesai' THEN 1 ELSE 0 END)`,
      ditolak: sql<number>`SUM(CASE WHEN ${ppidPermohonan.status} = 'ditolak' THEN 1 ELSE 0 END)`,
      banding: sql<number>`SUM(CASE WHEN ${ppidPermohonan.status} = 'banding' THEN 1 ELSE 0 END)`,
      rataRataHari: sql<
        number | null
      >`AVG(CASE WHEN ${ppidPermohonan.status} = 'selesai' AND ${ppidPermohonan.selesaiAt} IS NOT NULL THEN DATEDIFF(${ppidPermohonan.selesaiAt}, ${ppidPermohonan.createdAt}) END)`,
    })
    .from(ppidPermohonan)
    .where(
      and(
        gte(ppidPermohonan.createdAt, start),
        lte(ppidPermohonan.createdAt, new Date(end.getTime() - 1)),
      ),
    );

  const [kbrRows] = await db
    .select({
      total: sql<number>`COUNT(*)`,
      diterima: sql<number>`SUM(CASE WHEN ${ppidKeberatan.status} = 'diterima' THEN 1 ELSE 0 END)`,
      diproses: sql<number>`SUM(CASE WHEN ${ppidKeberatan.status} = 'diproses' THEN 1 ELSE 0 END)`,
      selesai: sql<number>`SUM(CASE WHEN ${ppidKeberatan.status} = 'selesai' THEN 1 ELSE 0 END)`,
      ditolak: sql<number>`SUM(CASE WHEN ${ppidKeberatan.status} = 'ditolak' THEN 1 ELSE 0 END)`,
      diteruskanKi: sql<number>`SUM(CASE WHEN ${ppidKeberatan.status} = 'diteruskan_ki' THEN 1 ELSE 0 END)`,
      rataRataHari: sql<
        number | null
      >`AVG(CASE WHEN ${ppidKeberatan.status} = 'selesai' AND ${ppidKeberatan.selesaiAt} IS NOT NULL THEN DATEDIFF(${ppidKeberatan.selesaiAt}, ${ppidKeberatan.createdAt}) END)`,
    })
    .from(ppidKeberatan)
    .where(
      and(
        gte(ppidKeberatan.createdAt, start),
        lte(ppidKeberatan.createdAt, new Date(end.getTime() - 1)),
      ),
    );

  const toNum = (v: unknown) => Number(v ?? 0);
  const toAvg = (v: unknown) =>
    v === null || v === undefined ? null : Math.round(Number(v) * 10) / 10;

  return {
    tahun,
    permohonan: {
      total: toNum(permRows?.total),
      diterima: toNum(permRows?.diterima),
      diproses: toNum(permRows?.diproses),
      selesai: toNum(permRows?.selesai),
      ditolak: toNum(permRows?.ditolak),
      banding: toNum(permRows?.banding),
      rataRataHariPenyelesaian: toAvg(permRows?.rataRataHari),
    },
    keberatan: {
      total: toNum(kbrRows?.total),
      diterima: toNum(kbrRows?.diterima),
      diproses: toNum(kbrRows?.diproses),
      selesai: toNum(kbrRows?.selesai),
      ditolak: toNum(kbrRows?.ditolak),
      diteruskanKi: toNum(kbrRows?.diteruskanKi),
      rataRataHariPenyelesaian: toAvg(kbrRows?.rataRataHari),
    },
  };
}
