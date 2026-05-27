// src/lib/queries/analytics.ts
import { db, sql, desc, gte, lte, and, eq, count } from "@/db";
import { visitorLogs, visitorStats } from "@/db/schema";

export async function getVisitorSummary() {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  const [todayStats, yesterdayStats, totalViews, totalUnique] =
    await Promise.all([
      // Hari ini
      db
        .select()
        .from(visitorStats)
        .where(eq(visitorStats.date, todayStr))
        .limit(1),
      // Kemarin
      db
        .select()
        .from(visitorStats)
        .where(eq(visitorStats.date, yesterdayStr))
        .limit(1),
      // Total semua page views
      db.select({ total: sql<number>`SUM(page_views)` }).from(visitorStats),
      // Total unique visitors
      db
        .select({ total: sql<number>`SUM(unique_visitors)` })
        .from(visitorStats),
    ]);

  return {
    today: todayStats[0] ?? { pageViews: 0, uniqueVisitors: 0 },
    yesterday: yesterdayStats[0] ?? { pageViews: 0, uniqueVisitors: 0 },
    totalViews: Number(totalViews[0]?.total ?? 0),
    totalUnique: Number(totalUnique[0]?.total ?? 0),
  };
}

export async function getVisitorChart(days = 30) {
  const from = new Date();
  from.setDate(from.getDate() - days);
  const fromStr = from.toISOString().slice(0, 10);

  return db
    .select()
    .from(visitorStats)
    .where(gte(visitorStats.date, fromStr))
    .orderBy(visitorStats.date);
}

export async function getTopPages(limit = 10) {
  return db
    .select({
      path: visitorLogs.path,
      views: count(visitorLogs.id),
    })
    .from(visitorLogs)
    .groupBy(visitorLogs.path)
    .orderBy(desc(count(visitorLogs.id)))
    .limit(limit);
}

export async function getRecentLogs(limit = 50) {
  return db
    .select()
    .from(visitorLogs)
    .orderBy(desc(visitorLogs.createdAt))
    .limit(limit);
}

export async function getVisitorByDate(date: string) {
  return db
    .select()
    .from(visitorLogs)
    .where(sql`DATE(${visitorLogs.createdAt}) = ${date}`)
    .orderBy(desc(visitorLogs.createdAt));
}
