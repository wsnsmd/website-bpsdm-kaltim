// src/lib/queries/platforms.ts
import { db, eq, and, asc } from "@/db";
import { platforms } from "@/db/schema";

export type PlatformItem = typeof platforms.$inferSelect;

export async function getPlatforms(
  options: {
    isHighlight?: boolean;
    category?: string;
    isActive?: boolean;
  } = {},
): Promise<PlatformItem[]> {
  const { isHighlight, category, isActive = true } = options;

  const conditions = [eq(platforms.isActive, isActive)];

  if (isHighlight !== undefined) {
    conditions.push(eq(platforms.isHighlight, isHighlight));
  }
  if (category) {
    conditions.push(eq(platforms.category, category));
  }

  return await db
    .select()
    .from(platforms)
    .where(and(...conditions))
    .orderBy(asc(platforms.sortOrder));
}

export async function getPlatformById(
  id: number,
): Promise<PlatformItem | null> {
  const result = await db
    .select()
    .from(platforms)
    .where(eq(platforms.id, id))
    .limit(1);
  return result[0] ?? null;
}
