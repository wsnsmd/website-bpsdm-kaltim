// src/lib/queries/visitors.ts
import { db, sql, desc } from "@/db";
import { visitorLogs, visitorStats } from "@/db/schema";

export type VisitorSummary = {
  today: number;
  yesterday: number;
  thisMonth: number;
  total: number;
  onlineNow: number;
};

export async function getVisitorSummary(): Promise<VisitorSummary> {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  // Kemarin
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  // Bulan ini YYYY-MM
  const thisMonthStr = todayStr.slice(0, 7);

  const [todayRow, yesterdayRow, monthRows, totalRow, onlineRow] =
    await Promise.all([
      // Hari ini
      db.execute(sql`
        SELECT COALESCE(unique_visitors, 0) as val
        FROM visitor_stats WHERE date = ${todayStr} LIMIT 1
      `),
      // Kemarin
      db.execute(sql`
        SELECT COALESCE(unique_visitors, 0) as val
        FROM visitor_stats WHERE date = ${yesterdayStr} LIMIT 1
      `),
      // Bulan ini
      db.execute(sql`
        SELECT COALESCE(SUM(unique_visitors), 0) as val
        FROM visitor_stats WHERE date LIKE ${thisMonthStr + "%"}
      `),
      // Total semua
      db.execute(sql`
        SELECT COALESCE(SUM(unique_visitors), 0) as val
        FROM visitor_stats
      `),
      // Online sekarang — session dalam 5 menit terakhir
      db.execute(sql`
        SELECT COUNT(DISTINCT session_id) as val
        FROM visitor_logs
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 5 MINUTE)
      `),
    ]);

  function extractVal(rows: any): number {
    const row = Array.isArray(rows[0]) ? rows[0][0] : rows[0];
    return Number(row?.val ?? 0);
  }

  return {
    today: extractVal(todayRow),
    yesterday: extractVal(yesterdayRow),
    thisMonth: extractVal(monthRows),
    total: extractVal(totalRow),
    onlineNow: extractVal(onlineRow),
  };
}

// Data 7 hari terakhir untuk mini chart
export async function getVisitorLast7Days(): Promise<
  { date: string; visitors: number; views: number }[]
> {
  const result = await db.execute(sql`
    SELECT
      date,
      COALESCE(unique_visitors, 0) as visitors,
      COALESCE(page_views, 0) as views
    FROM visitor_stats
    WHERE date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
    ORDER BY date ASC
  `);

  const rows = Array.isArray(result[0]) ? result[0] : result;
  return (rows as any[]).map((r) => ({
    date: r.date,
    visitors: Number(r.visitors),
    views: Number(r.views),
  }));
}
