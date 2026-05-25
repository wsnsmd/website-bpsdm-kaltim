// src/lib/queries/categories.ts
import { db, eq, count } from "@/db";
import { categories, posts } from "@/db/schema";

export type CategoryItem = {
  id: number;
  name: string;
  slug: string;
  color: string | null;
  count: number;
};

export async function getPostCategories(): Promise<CategoryItem[]> {
  const rows = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      color: categories.color,
      count: count(posts.id), // ← tambah
    })
    .from(categories)
    .leftJoin(posts, eq(posts.categoryId, categories.id)) // ← tambah
    .where(eq(categories.type, "post"))
    .groupBy(categories.id) // ← tambah
    .orderBy(categories.sortOrder);

  return rows.map((r) => ({ ...r, count: Number(r.count) }));
}
