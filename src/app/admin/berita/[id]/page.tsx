// src/app/admin/berita/[id]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db, eq } from "@/db";
import { posts } from "@/db/schema";
import { getPostCategories } from "@/lib/queries/categories";
import { PostForm } from "@/components/admin/PostForm";

export const metadata: Metadata = { title: "Edit Berita" };

type Props = { params: Promise<{ id: string }> };

export default async function EditBeritaPage({ params }: Props) {
  const { id } = await params;
  const postId = Number(id);

  if (isNaN(postId)) notFound();

  const [post, categories] = await Promise.all([
    db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        excerpt: posts.excerpt,
        content: posts.content,
        categoryId: posts.categoryId,
        status: posts.status,
        isFeatured: posts.isFeatured,
        authorName: posts.authorName,
        featuredImage: posts.featuredImage,
        metaTitle: posts.metaTitle,
        metaDescription: posts.metaDescription,
      })
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1),
    getPostCategories(),
  ]);

  if (!post[0]) notFound();

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Edit Berita</h1>
          <p
            className="admin-page-sub"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "400px",
            }}
          >
            {post[0].title}
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link
            href={`/berita/${post[0].slug}`}
            target="_blank"
            className="admin-btn-cancel"
          >
            Lihat →
          </Link>
          <Link href="/admin/berita" className="admin-btn-cancel">
            ← Kembali
          </Link>
        </div>
      </div>

      <PostForm categories={categories} post={post[0]} />
    </>
  );
}
