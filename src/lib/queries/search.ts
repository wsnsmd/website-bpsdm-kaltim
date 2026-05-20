// src/lib/queries/search.ts
import { db, eq, or, like, and, desc } from "@/db";
import {
  posts,
  categories,
  programs,
  documents,
  documentCategories,
} from "@/db/schema";

export type SearchResult = {
  id: number;
  type: "berita" | "program" | "dokumen";
  title: string;
  excerpt?: string | null;
  url: string;
  category?: string | null;
  meta?: string | null;
};

export async function globalSearch(
  query: string,
  limit = 10,
): Promise<SearchResult[]> {
  if (!query || query.trim().length < 2) return [];
  const q = `%${query.trim()}%`;

  const [beritaRows, programRows, dokumenRows] = await Promise.all([
    // Berita
    db
      .select({
        id: posts.id,
        title: posts.title,
        excerpt: posts.excerpt,
        slug: posts.slug,
        category: categories.name,
      })
      .from(posts)
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .where(
        and(
          eq(posts.status, "published"),
          or(
            like(posts.title, q),
            like(posts.excerpt, q),
            like(posts.content, q),
          ),
        ),
      )
      .orderBy(desc(posts.publishedAt))
      .limit(limit),

    // Program
    db
      .select({
        id: programs.id,
        title: programs.name,
        excerpt: programs.description,
        slug: programs.slug,
      })
      .from(programs)
      .where(or(like(programs.name, q), like(programs.description, q)))
      .limit(limit),

    // Dokumen
    db
      .select({
        id: documents.id,
        title: documents.title,
        fileType: documents.fileType,
        category: documentCategories.name,
      })
      .from(documents)
      .leftJoin(
        documentCategories,
        eq(documents.categoryId, documentCategories.id),
      )
      .where(
        and(
          eq(documents.status, "published"),
          or(like(documents.title, q), like(documents.description, q)),
        ),
      )
      .limit(limit),
  ]);

  const results: SearchResult[] = [
    ...beritaRows.map((r) => ({
      id: r.id,
      type: "berita" as const,
      title: r.title,
      excerpt: r.excerpt,
      url: `/berita/${r.slug}`,
      category: r.category,
    })),
    ...programRows.map((r) => ({
      id: r.id,
      type: "program" as const,
      title: r.title,
      excerpt: r.excerpt,
      url: `/program/${r.slug}`,
    })),
    ...dokumenRows.map((r) => ({
      id: r.id,
      type: "dokumen" as const,
      title: r.title,
      url: `/unduhan`,
      meta: r.fileType?.toUpperCase() ?? null,
      category: r.category,
    })),
  ];

  return results;
}

// Untuk halaman hasil lengkap dengan paginasi per tipe
export async function searchBerita(query: string, limit = 12, offset = 0) {
  const q = `%${query.trim()}%`;
  return db
    .select({
      id: posts.id,
      title: posts.title,
      excerpt: posts.excerpt,
      slug: posts.slug,
      publishedAt: posts.publishedAt,
      category: categories.name,
      categorySlug: categories.slug,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .where(
      and(
        eq(posts.status, "published"),
        or(
          like(posts.title, q),
          like(posts.excerpt, q),
          like(posts.content, q),
        ),
      ),
    )
    .orderBy(desc(posts.publishedAt))
    .limit(limit)
    .offset(offset);
}

export async function searchProgram(query: string, limit = 12, offset = 0) {
  const q = `%${query.trim()}%`;
  return db
    .select()
    .from(programs)
    .where(or(like(programs.name, q), like(programs.description, q)))
    .limit(limit)
    .offset(offset);
}

export async function searchDokumen(query: string, limit = 12, offset = 0) {
  const q = `%${query.trim()}%`;
  return db
    .select({
      id: documents.id,
      title: documents.title,
      fileType: documents.fileType, // ← hapus slug
      fileSize: documents.fileSize,
      fileUrl: documents.fileUrl,
      externalUrl: documents.externalUrl,
      category: documentCategories.name,
    })
    .from(documents)
    .leftJoin(
      documentCategories,
      eq(documents.categoryId, documentCategories.id),
    )
    .where(
      and(
        eq(documents.status, "published"),
        or(like(documents.title, q), like(documents.description, q)),
      ),
    )
    .limit(limit)
    .offset(offset);
}

export async function countSearch(query: string) {
  const [b, p, d] = await Promise.all([
    searchBerita(query, 999, 0).then((r) => r.length),
    searchProgram(query, 999, 0).then((r) => r.length),
    searchDokumen(query, 999, 0).then((r) => r.length),
  ]);
  return { berita: b, program: p, dokumen: d, total: b + p + d };
}
