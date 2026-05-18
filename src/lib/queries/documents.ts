// src/lib/queries/documents.ts
import { db, eq, and, asc, desc, like, or, sql } from "@/db";
import { documents, documentCategories } from "@/db/schema";

export type DocumentItem = typeof documents.$inferSelect & {
  categoryName?: string | null;
  categorySlug?: string | null;
  categoryColor?: string | null;
};

export type DocumentCategoryItem = typeof documentCategories.$inferSelect & {
  count?: number;
};

export async function getDocumentCategories(): Promise<DocumentCategoryItem[]> {
  const cats = await db
    .select()
    .from(documentCategories)
    .where(eq(documentCategories.isActive, true))
    .orderBy(asc(documentCategories.sortOrder));

  const counts = await db
    .select({
      categoryId: documents.categoryId,
      count: sql<number>`COUNT(*)`,
    })
    .from(documents)
    .where(eq(documents.status, "published"))
    .groupBy(documents.categoryId);

  const countMap = Object.fromEntries(
    counts.map((c) => [c.categoryId, c.count]),
  );

  return cats.map((cat) => ({ ...cat, count: countMap[cat.id] ?? 0 }));
}

export async function getDocuments(
  options: {
    categorySlug?: string;
    search?: string;
    year?: number;
    limit?: number;
    offset?: number;
  } = {},
): Promise<DocumentItem[]> {
  const { categorySlug, search, year, limit = 20, offset = 0 } = options;

  const result = await db
    .select({
      id: documents.id,
      title: documents.title,
      description: documents.description,
      categoryId: documents.categoryId,
      fileUrl: documents.fileUrl,
      externalUrl: documents.externalUrl,
      fileType: documents.fileType,
      fileSize: documents.fileSize,
      year: documents.year,
      tags: documents.tags,
      status: documents.status,
      downloadCount: documents.downloadCount,
      createdBy: documents.createdBy,
      createdAt: documents.createdAt,
      updatedAt: documents.updatedAt,
      categoryName: documentCategories.name,
      categorySlug: documentCategories.slug,
      categoryColor: documentCategories.color,
    })
    .from(documents)
    .leftJoin(
      documentCategories,
      eq(documents.categoryId, documentCategories.id),
    )
    .where(
      and(
        eq(documents.status, "published"),
        categorySlug ? eq(documentCategories.slug, categorySlug) : undefined,
        year ? eq(documents.year, year) : undefined,
        search
          ? or(
              like(documents.title, `%${search}%`),
              like(documents.description, `%${search}%`),
            )
          : undefined,
      ),
    )
    .orderBy(desc(documents.createdAt))
    .limit(limit)
    .offset(offset);

  return result as DocumentItem[];
}

export async function countDocuments(
  options: {
    categorySlug?: string;
    search?: string;
    year?: number;
  } = {},
): Promise<number> {
  const { categorySlug, search, year } = options;

  const result = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(documents)
    .leftJoin(
      documentCategories,
      eq(documents.categoryId, documentCategories.id),
    )
    .where(
      and(
        eq(documents.status, "published"),
        categorySlug ? eq(documentCategories.slug, categorySlug) : undefined,
        year ? eq(documents.year, year) : undefined,
        search
          ? or(
              like(documents.title, `%${search}%`),
              like(documents.description, `%${search}%`),
            )
          : undefined,
      ),
    );

  return result[0]?.count ?? 0;
}

export async function incrementDownloadCount(id: number) {
  await db
    .update(documents)
    .set({ downloadCount: sql`${documents.downloadCount} + 1` })
    .where(eq(documents.id, id));
}

export async function getDocumentYears(): Promise<number[]> {
  const result = await db
    .selectDistinct({ year: documents.year })
    .from(documents)
    .where(
      and(
        eq(documents.status, "published"),
        sql`${documents.year} IS NOT NULL`,
      ),
    )
    .orderBy(desc(documents.year));

  return result.map((r) => r.year).filter(Boolean) as number[];
}
