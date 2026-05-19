// src/lib/queries/programs.ts
import { db, eq, and, asc } from "@/db";
import { programs } from "@/db/schema";

export type ProgramItem = typeof programs.$inferSelect;

export async function getPrograms(
  options: {
    isHighlight?: boolean;
    limit?: number;
  } = {},
): Promise<ProgramItem[]> {
  const { isHighlight, limit } = options;

  const conditions = [eq(programs.status, "active")];
  if (isHighlight !== undefined) {
    conditions.push(eq(programs.isHighlight, isHighlight));
  }

  const query = db
    .select()
    .from(programs)
    .where(and(...conditions))
    .orderBy(asc(programs.sortOrder), asc(programs.name));

  if (limit) return await query.limit(limit);
  return await query;
}

export async function getProgramBySlug(
  slug: string,
): Promise<ProgramItem | null> {
  const result = await db
    .select()
    .from(programs)
    .where(and(eq(programs.slug, slug), eq(programs.status, "active")))
    .limit(1);
  return result[0] ?? null;
}

export async function getAllProgramSlugs(): Promise<string[]> {
  const result = await db.select({ slug: programs.slug }).from(programs);
  return result.map((r) => r.slug);
}
