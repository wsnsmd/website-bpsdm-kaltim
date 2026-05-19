// src/lib/queries/posts.ts
import { db, eq, and, desc, sql, like, count, or } from "@/db";
import { posts, categories } from "@/db/schema";

// ── Tipe return ───────────────────────────────
export type PostListItem = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImage: string | null;
  publishedAt: Date | null;
  viewCount: number | null;
  readingTime: number | null;
  authorName: string | null;
  category: {
    id: number;
    name: string;
    slug: string;
    color: string | null;
  } | null;
};

export type PostDetail = PostListItem & {
  content: string;
  featuredImageAlt: string | null;
  featuredImageCaption: string | null;
  isFeatured: boolean | null;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
  canonicalUrl: string | null;
  updatedAt: Date;
};

// ── Columns yang sering dipakai ───────────────
const listColumns = {
  id: posts.id,
  title: posts.title,
  slug: posts.slug,
  excerpt: posts.excerpt,
  featuredImage: posts.featuredImage,
  publishedAt: posts.publishedAt,
  viewCount: posts.viewCount,
  readingTime: posts.readingTime,
  authorName: posts.authorName,
  category: {
    id: categories.id,
    name: categories.name,
    slug: categories.slug,
    color: categories.color,
  },
};

// ── Get latest posts ──────────────────────────
export async function getLatestPosts(
  options: {
    limit?: number;
    categorySlug?: string;
    offset?: number;
    search?: string;
    featured?: boolean;
  } = {},
): Promise<PostListItem[]> {
  const { limit = 10, categorySlug, offset = 0, search, featured } = options;

  const result = await db
    .select(listColumns)
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .where(
      and(
        eq(posts.status, "published"),
        categorySlug ? eq(categories.slug, categorySlug) : undefined,
        featured ? eq(posts.isFeatured, true) : undefined,
        search
          ? or(
              like(posts.title, `%${search}%`),
              like(posts.excerpt, `%${search}%`),
            )
          : undefined,
      ),
    )
    .orderBy(desc(posts.publishedAt))
    .limit(limit)
    .offset(offset);

  return result as PostListItem[];
}

// ── Get featured post ─────────────────────────
export async function getFeaturedPost(): Promise<PostListItem | null> {
  const result = await db
    .select(listColumns)
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .where(and(eq(posts.status, "published"), eq(posts.isFeatured, true)))
    .orderBy(desc(posts.publishedAt))
    .limit(1);

  return (result[0] as PostListItem) ?? null;
}

// ── Get post by slug ──────────────────────────
export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  const result = await db
    .select({
      ...listColumns,
      content: posts.content,
      featuredImageAlt: posts.featuredImageAlt,
      featuredImageCaption: posts.featuredImageCaption,
      isFeatured: posts.isFeatured,
      metaTitle: posts.metaTitle,
      metaDescription: posts.metaDescription,
      ogImage: posts.ogImage,
      canonicalUrl: posts.canonicalUrl,
      updatedAt: posts.updatedAt,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .where(and(eq(posts.status, "published"), eq(posts.slug, slug)))
    .limit(1);

  return (result[0] as PostDetail) ?? null;
}

// ── Get adjacent posts (prev/next) ────────────
export async function getAdjacentPosts(publishedAt: Date) {
  const [prev, next] = await Promise.all([
    db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        category: {
          name: categories.name,
          slug: categories.slug,
        },
      })
      .from(posts)
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .where(
        and(
          eq(posts.status, "published"),
          sql`${posts.publishedAt} < ${publishedAt}`,
        ),
      )
      .orderBy(desc(posts.publishedAt))
      .limit(1),

    db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        category: {
          name: categories.name,
          slug: categories.slug,
        },
      })
      .from(posts)
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .where(
        and(
          eq(posts.status, "published"),
          sql`${posts.publishedAt} > ${publishedAt}`,
        ),
      )
      .orderBy(desc(posts.publishedAt))
      .limit(1),
  ]);

  return {
    prev: prev[0] ?? null,
    next: next[0] ?? null,
  };
}

// ── Increment view count ──────────────────────
export async function incrementPostView(postId: number) {
  await db
    .update(posts)
    .set({ viewCount: sql`view_count + 1` })
    .where(eq(posts.id, postId));
}

// ── Search posts ──────────────────────────────
export async function searchPosts(query: string, limit = 10) {
  return await db
    .select(listColumns)
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .where(and(eq(posts.status, "published"), like(posts.title, `%${query}%`)))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
}

export async function countPosts(
  options: {
    categorySlug?: string;
    search?: string;
  } = {},
): Promise<number> {
  const { categorySlug, search } = options;

  const result = await db
    .select({ total: count() })
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .where(
      and(
        eq(posts.status, "published"),
        categorySlug ? eq(categories.slug, categorySlug) : undefined,
        search
          ? or(
              like(posts.title, `%${search}%`),
              like(posts.excerpt, `%${search}%`),
            )
          : undefined,
      ),
    );

  return result[0]?.total ?? 0;
}
