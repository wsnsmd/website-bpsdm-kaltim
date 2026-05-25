// src/app/admin/berita/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { db, desc, eq, like, count, and } from "@/db";
import { posts, categories } from "@/db/schema";
import { timeAgo, getCategoryBadge } from "@/lib/utils";
import { DeletePostButton } from "@/components/admin/DeletePostButton";
import { Pagination } from "@/components/ui/Pagination";
import { getPostCategories } from "@/lib/queries/categories";

export const metadata: Metadata = { title: "Manajemen Berita" };

const PER_PAGE = 20;

type Props = {
  searchParams: Promise<{
    halaman?: string;
    status?: string;
    cari?: string;
    kategori?: string;
  }>;
};

export default async function AdminBeritaPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.halaman ?? 1));
  const status = params.status ?? "";
  const search = params.cari ?? "";
  const kategori = params.kategori ?? "";
  const offset = (page - 1) * PER_PAGE;

  // Build where conditions
  const conditions = [];
  if (status) conditions.push(eq(posts.status, status as any));
  if (search) conditions.push(like(posts.title, `%${search}%`));
  if (kategori) conditions.push(eq(posts.categoryId, Number(kategori)));
  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [allPosts, totalResult, allCategories] = await Promise.all([
    db
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
      .where(where)
      .orderBy(desc(posts.publishedAt), desc(posts.createdAt))
      .limit(PER_PAGE)
      .offset(offset),

    db.select({ total: count() }).from(posts).where(where),
    getPostCategories(),
  ]);

  const total = totalResult[0]?.total ?? 0;
  const totalPages = Math.ceil(total / PER_PAGE);

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

  const paginationParams: Record<string, string> = {};
  if (status) paginationParams.status = status;
  if (search) paginationParams.cari = search;
  if (kategori) paginationParams.kategori = kategori;

  const pillStyle = (active: boolean) => ({
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "12.5px",
    fontWeight: 500,
    textDecoration: "none" as const,
    border: "1px solid",
    borderColor: active ? "var(--color-forest-700)" : "var(--color-ink-6)",
    background: active ? "var(--color-forest-700)" : "#fff",
    color: active ? "#fff" : "var(--color-ink-3)",
    whiteSpace: "nowrap" as const,
    display: "inline-block",
  });

  return (
    <>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Berita &amp; Artikel</h1>
          <p className="admin-page-sub">
            {total} artikel ditemukan
            {kategori && (
              <>
                {" "}
                · Kategori:{" "}
                <strong>
                  {allCategories.find((c) => String(c.id) === kategori)?.name}
                </strong>
              </>
            )}
          </p>
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

      {/* Filter bar */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "16px",
          flexWrap: "wrap",
          alignItems: "flex-start",
        }}
      >
        {/* Search */}
        <form
          method="GET"
          style={{ display: "flex", gap: "8px", flex: 1, minWidth: "220px" }}
        >
          {status && <input type="hidden" name="status" value={status} />}
          {kategori && <input type="hidden" name="kategori" value={kategori} />}
          <input
            name="cari"
            type="text"
            className="admin-input"
            placeholder="Cari judul berita..."
            defaultValue={search}
            style={{ flex: 1, height: "36px", fontSize: "13px" }}
          />
          <button
            type="submit"
            className="admin-btn-save"
            style={{ height: "36px", padding: "0 16px" }}
          >
            Cari
          </button>
          {(search || status || kategori) && (
            <Link
              href="/admin/berita"
              style={{
                height: "36px",
                padding: "0 14px",
                borderRadius: "8px",
                border: "1px solid var(--color-ink-6)",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                fontSize: "13px",
                color: "var(--color-ink-3)",
                textDecoration: "none",
              }}
            >
              Reset
            </Link>
          )}
        </form>

        {/* Pills container */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {/* Status pills */}
          <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
            {[
              { value: "", label: "Semua" },
              { value: "published", label: "Terbit" },
              { value: "draft", label: "Draft" },
              { value: "review", label: "Review" },
              { value: "archived", label: "Arsip" },
            ].map((s) => (
              <Link
                key={s.value}
                href={`/admin/berita?status=${s.value}${search ? `&cari=${search}` : ""}${kategori ? `&kategori=${kategori}` : ""}`}
                style={pillStyle(status === s.value)}
              >
                {s.label}
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div
            style={{
              width: "1px",
              height: "28px",
              background: "var(--color-ink-6)",
            }}
          />

          {/* Kategori pills */}
          <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
            <Link
              href={`/admin/berita?${status ? `status=${status}&` : ""}${search ? `cari=${search}` : ""}`}
              style={pillStyle(!kategori)}
            >
              Semua Kategori
            </Link>
            {allCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/admin/berita?kategori=${cat.id}${status ? `&status=${status}` : ""}${search ? `&cari=${search}` : ""}`}
                style={pillStyle(kategori === String(cat.id))}
              >
                {cat.name}
                {(cat.count ?? 0) > 0 && (
                  <span
                    style={{
                      marginLeft: "5px",
                      opacity: 0.55,
                      fontSize: "11px",
                    }}
                  >
                    {cat.count}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
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
                    {search
                      ? `Tidak ada hasil untuk "${search}"`
                      : "Belum ada artikel."}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            style={{
              padding: "16px 20px",
              borderTop: "1px solid var(--color-ink-7)",
            }}
          >
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              basePath="/admin/berita"
              searchParams={paginationParams}
            />
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            padding: "12px 20px",
            borderTop:
              totalPages <= 1 ? "1px solid var(--color-ink-7)" : "none",
            fontSize: "12.5px",
            color: "var(--color-ink-4)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>
            Halaman {page} dari {totalPages || 1} · {total} total artikel
          </span>
          <span>{PER_PAGE} per halaman</span>
        </div>
      </div>
    </>
  );
}
