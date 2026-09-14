// src/lib/queries/sira.ts
import { db, eq, and, desc, inArray } from "@/db";
import { siraSummary, siraPrograms, siraActivities } from "@/db/schema";

export type SiraSummaryItem = typeof siraSummary.$inferSelect;
export type SiraProgramItem = typeof siraPrograms.$inferSelect;
export type SiraActivityItem = typeof siraActivities.$inferSelect;

export type SiraProgramWithActivities = SiraProgramItem & {
  // Tanpa parentId di skema, Kegiatan (level 1) dan Sub Kegiatan (level 2)
  // TIDAK bisa dipasangkan induk-anak yang benar kalau satu program punya
  // lebih dari satu Kegiatan — jadi disajikan sebagai dua daftar terpisah,
  // bukan pohon nested yang bisa salah pasang.
  kegiatan: SiraActivityItem[];
  subKegiatan: SiraActivityItem[];
};

export type SiraDashboardData = {
  summary: SiraSummaryItem;
  programs: SiraProgramWithActivities[];
};

/**
 * Ambil satu periode (tahun+bulan) realisasi anggaran.
 * Skema saat ini tidak punya kolom status draft/published, jadi ini selalu
 * mengambil periode terbaru yang ada di tabel apa adanya.
 */
export async function getSiraDashboardData(params?: {
  tahun?: number;
  bulan?: number;
}): Promise<SiraDashboardData | null> {
  const whereClauses = [];
  if (params?.tahun) whereClauses.push(eq(siraSummary.tahun, params.tahun));
  if (params?.bulan)
    whereClauses.push(eq(siraSummary.periodeBulan, params.bulan));

  const [summary] = await db
    .select()
    .from(siraSummary)
    .where(whereClauses.length ? and(...whereClauses) : undefined)
    .orderBy(desc(siraSummary.tahun), desc(siraSummary.periodeBulan))
    .limit(1);

  if (!summary) return null;

  const programs = await db
    .select()
    .from(siraPrograms)
    .where(eq(siraPrograms.summaryId, summary.id))
    .orderBy(siraPrograms.kodeProgram);

  if (programs.length === 0) {
    return { summary, programs: [] };
  }

  const programIds = programs.map((p) => p.id);
  const allActivities = await db
    .select()
    .from(siraActivities)
    .where(inArray(siraActivities.programId, programIds))
    .orderBy(siraActivities.kode);

  const programsWithActivities: SiraProgramWithActivities[] = programs.map(
    (program) => {
      const activitiesForProgram = allActivities.filter(
        (a) => a.programId === program.id,
      );
      return {
        ...program,
        kegiatan: activitiesForProgram.filter((a) => a.level === 1),
        subKegiatan: activitiesForProgram.filter((a) => a.level === 2),
      };
    },
  );

  return { summary, programs: programsWithActivities };
}

/** Daftar tahun yang ada datanya — untuk selector periode nanti. */
export async function getSiraAvailableYears(): Promise<number[]> {
  const rows = await db
    .selectDistinct({ tahun: siraSummary.tahun })
    .from(siraSummary)
    .orderBy(desc(siraSummary.tahun));
  return rows.map((r) => r.tahun);
}
