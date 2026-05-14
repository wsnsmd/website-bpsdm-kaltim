// src/app/admin/berita/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { db, desc, eq } from "@/db";
import { posts, categories } from "@/db/schema";
import { timeAgo, getCategoryBadge } from "@/lib/utils";
import { DeletePostButton } from "@/components/admin/DeletePostButton";

export const metadata: Metadata = { title: "Manajemen Berita" };

export default async function AdminBeritaPage() {
  const allPosts = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      status: posts.status,
      publishedAt: posts.publishedAt,
      viewCount: posts.viewCount,
      authorName: posts.authorName,
      category: {
        name: categories.name,
        slug: categories.slug,
      },
    })
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .orderBy(desc(posts.createdAt))
    .limit(50);

  const statusMap: Record<string, string> = {
    published: "status-pill-published",
    draft: "status-pill-draft",
    review: "status-pill-review",
    archived: "status-pill-archived",
  };

  const statusLabel: Record<string, string> = {
    published: "Terbit",
    draft: "Draft",
    review: "Review",
    archived: "Arsip",
  };

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Berita &amp; Artikel</h1>
          <p className="admin-page-sub">{allPosts.length} artikel ditemukan</p>
        </div>
        <Link href="/admin/berita/baru" className="admin-btn-save">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Tambah Berita
        </Link>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Judul</th>
                <th>Kategori</th>
                <th>Status</th>
                <th>Penulis</th>
                <th>Tanggal</th>
                <th>Views</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {allPosts.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "var(--color-ink-4)",
                    }}
                  >
                    Belum ada artikel. Tambahkan yang pertama!
                  </td>
                </tr>
              )}
              {allPosts.map((post) => (
                <tr key={post.id}>
                  <td style={{ maxWidth: "280px" }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "13.5px",
                        color: "var(--color-ink)",
                        marginBottom: "3px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {post.title}
                    </div>
                    <div
                      style={{
                        fontSize: "11.5px",
                        color: "var(--color-ink-4)",
                      }}
                    >
                      /berita/{post.slug}
                    </div>
                  </td>
                  <td>
                    {post.category ? (
                      <span
                        className={`badge ${getCategoryBadge(post.category.slug)}`}
                      >
                        {post.category.name}
                      </span>
                    ) : (
                      <span
                        style={{
                          color: "var(--color-ink-5)",
                          fontSize: "13px",
                        }}
                      >
                        —
                      </span>
                    )}
                  </td>
                  <td>
                    <span
                      className={`status-pill ${statusMap[post.status] ?? "status-pill-draft"}`}
                    >
                      {statusLabel[post.status] ?? post.status}
                    </span>
                  </td>
                  <td
                    style={{
                      fontSize: "13px",
                      color: "var(--color-ink-3)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {post.authorName ?? "—"}
                  </td>
                  <td
                    style={{
                      fontSize: "12px",
                      color: "var(--color-ink-4)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {post.publishedAt ? timeAgo(post.publishedAt) : "—"}
                  </td>
                  <td style={{ fontSize: "13px", color: "var(--color-ink-3)" }}>
                    {post.viewCount?.toLocaleString("id-ID") ?? "0"}
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      <Link
                        href={`/berita/${post.slug}`}
                        target="_blank"
                        className="admin-table-btn admin-table-btn-view"
                      >
                        Lihat
                      </Link>
                      <Link
                        href={`/admin/berita/${post.id}`}
                        className="admin-table-btn admin-table-btn-edit"
                      >
                        Edit
                      </Link>
                      <DeletePostButton postId={post.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
