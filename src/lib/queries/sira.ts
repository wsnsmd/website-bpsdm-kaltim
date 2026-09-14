// src/lib/queries/sira.ts
import { db, eq, and, desc, inArray } from "@/db";
import { siraSummary, siraPrograms, siraActivities } from "@/db/schema";

export type SiraSummaryItem = typeof siraSummary.$inferSelect;
export type SiraProgramItem = typeof siraPrograms.$inferSelect;
export type SiraActivityItem = typeof siraActivities.$inferSelect;

/** Sub kegiatan diembed langsung di dalam kegiatan induknya. */
export type SiraKegiatanWithSub = SiraActivityItem & {
  subKegiatan: SiraActivityItem[];
};

export type SiraProgramWithActivities = SiraProgramItem & {
  kegiatan: SiraKegiatanWithSub[];
};

export type SiraDashboardData = {
  summary: SiraSummaryItem;
  programs: SiraProgramWithActivities[];
};

/**
 * Ambil satu periode (tahun+bulan) realisasi anggaran.
 *
 * Hierarki kode rekening:
 *   Program      5.04.01          → 3 segmen  (dari tabel sira_programs)
 *   Kegiatan     5.04.01.1.01     → 5 segmen  (level di DB tidak reliable, pakai split)
 *   Sub Kegiatan 5.04.01.1.01.0001 → 6 segmen
 *
 * Sub kegiatan dipasangkan ke kegiatan induknya via startsWith(keg.kode + "."),
 * sehingga tampil nested dan tidak terbalik meski satu program punya banyak kegiatan.
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

      // Kegiatan: 5 segmen kode (5.04.01.1.01)
      const kegiatanList = activitiesForProgram.filter(
        (a) => a.kode.split(".").length === 5,
      );

      // Sub Kegiatan: 6 segmen kode (5.04.01.1.01.0001)
      const subKegiatanList = activitiesForProgram.filter(
        (a) => a.kode.split(".").length === 6,
      );

      return {
        ...program,
        kegiatan: kegiatanList.map((keg) => ({
          ...keg,
          // Pasangkan sub kegiatan ke induknya via prefix kode
          subKegiatan: subKegiatanList.filter((sub) =>
            sub.kode.startsWith(keg.kode + "."),
          ),
        })),
      };
    },
  );

  return { summary, programs: programsWithActivities };
}

/** Daftar tahun yang ada datanya — untuk selector periode. */
export async function getSiraAvailableYears(): Promise<number[]> {
  const rows = await db
    .selectDistinct({ tahun: siraSummary.tahun })
    .from(siraSummary)
    .orderBy(desc(siraSummary.tahun));
  return rows.map((r) => r.tahun);
}
