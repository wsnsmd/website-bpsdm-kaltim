// src/lib/queries/announcements.ts
import { db, eq, and, sql, lte, or, isNull, gte, asc, desc } from "@/db";
import { announcements } from "@/db/schema";

export type AnnouncementItem = {
  id: number;
  title: string;
  url: string | null;
  type: string | null;
};

export async function getActiveAnnouncements(
  limit = 5,
): Promise<AnnouncementItem[]> {
  const now = new Date();

  const result = await db
    .select({
      id: announcements.id,
      title: announcements.title,
      url: announcements.url,
      type: announcements.type,
    })
    .from(announcements)
    .where(
      and(
        eq(announcements.isActive, true),
        eq(announcements.showInTicker, true),
        sql`${announcements.startDate} <= ${now}`,
        sql`(${announcements.endDate} IS NULL OR ${announcements.endDate} >= ${now})`,
      ),
    )
    .orderBy(announcements.priority)
    .limit(limit);

  return result as AnnouncementItem[];
}

export async function getAllActiveAnnouncements() {
  const now = new Date();
  return db
    .select()
    .from(announcements)
    .where(
      and(
        eq(announcements.isActive, true),
        lte(announcements.startDate, now),
        or(isNull(announcements.endDate), gte(announcements.endDate, now)),
      ),
    )
    .orderBy(asc(announcements.priority), desc(announcements.startDate));
}
