// src/lib/queries/survey.ts
import { db, sql, desc } from "@/db";
import { surveyResponses } from "@/db/schema";

export async function getSurveyStats() {
  const result = await db.execute(sql`
    SELECT
      COUNT(*)                          AS total,
      ROUND(AVG(rating_tampilan),2)     AS avg_tampilan,
      ROUND(AVG(rating_kemudahan),2)    AS avg_kemudahan,
      ROUND(AVG(rating_konten),2)       AS avg_konten,
      ROUND(AVG(rating_kecepatan),2)    AS avg_kecepatan,
      ROUND(AVG(rating_layanan),2)      AS avg_layanan,
      ROUND(AVG(rating_rata),2)         AS avg_total,
      SUM(CASE WHEN rating_rata >= 4.5 THEN 1 ELSE 0 END) AS sangat_puas,
      SUM(CASE WHEN rating_rata >= 3.5 AND rating_rata < 4.5 THEN 1 ELSE 0 END) AS puas,
      SUM(CASE WHEN rating_rata >= 2.5 AND rating_rata < 3.5 THEN 1 ELSE 0 END) AS cukup,
      SUM(CASE WHEN rating_rata < 2.5 THEN 1 ELSE 0 END) AS kurang
    FROM survey_responses
  `);

  const rows = Array.isArray(result[0]) ? result[0] : result;
  const row = (rows as any[])[0] ?? {};

  return {
    total: Number(row.total ?? 0),
    avgTampilan: Number(row.avg_tampilan ?? 0),
    avgKemudahan: Number(row.avg_kemudahan ?? 0),
    avgKonten: Number(row.avg_konten ?? 0),
    avgKecepatan: Number(row.avg_kecepatan ?? 0),
    avgLayanan: Number(row.avg_layanan ?? 0),
    avgTotal: Number(row.avg_total ?? 0),
    sangatPuas: Number(row.sangat_puas ?? 0),
    puas: Number(row.puas ?? 0),
    cukup: Number(row.cukup ?? 0),
    kurang: Number(row.kurang ?? 0),
  };
}

export async function getSurveyList(limit = 20, offset = 0) {
  return db
    .select()
    .from(surveyResponses)
    .orderBy(desc(surveyResponses.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getSurveyCount() {
  const r = await db.execute(
    sql`SELECT COUNT(*) as total FROM survey_responses`,
  );
  const rows = Array.isArray(r[0]) ? r[0] : r;
  return Number((rows as any[])[0]?.total ?? 0);
}
