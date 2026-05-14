// src/lib/queries/categories.ts
import { db, eq } from "@/db";
import { categories } from "@/db/schema";

export type CategoryItem = {
  id: number;
  name: string;
  slug: string;
  color: string | null;
};

export async function getPostCategories(): Promise<CategoryItem[]> {
  return await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      color: categories.color,
    })
    .from(categories)
    .where(eq(categories.type, "post"))
    .orderBy(categories.sortOrder);
}
