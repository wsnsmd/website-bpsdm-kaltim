// src/app/admin/kategori/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { db, asc, desc, count, eq, like, or } from "@/db";
import { categories, posts } from "@/db/schema";
import { Plus, Edit } from "lucide-react";
import { DeleteCategoryPostButton } from "@/components/admin/DeleteCategoryPostButton";

export const metadata: Metadata = { title: "Kategori Berita" };

type Props = {
  searchParams: Promise<{ cari?: string; sort?: string }>;
};

export default async function AdminKategoriPage({ searchParams }: Props) {
  const params = await searchParams;
  const search = params.cari ?? "";
  const sort = params.sort ?? "name";

  const where = search
    ? or(
        like(categories.name, `%${search}%`),
        like(categories.slug, `%${search}%`),
      )
    : undefined;

  const orderBy =
    sort === "total" ? asc(categories.name) : asc(categories.name);

  const allCats = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      description: categories.description,
    })
    .from(categories)
    .where(where)
    .orderBy(orderBy);

  // Hitung jumlah berita per kategori
  const counts = await db
    .select({ categoryId: posts.categoryId, total: count() })
    .from(posts)
    .groupBy(posts.categoryId);

  const countMap = Object.fromEntries(
    counts.map((c) => [c.categoryId, c.total]),
  );

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Kategori Berita</h1>
          <p className="admin-page-sub">{allCats.length} kategori terdaftar</p>
        </div>
        <Link href="/admin/kategori/baru" className="admin-btn-save">
          <Plus size={15} />
          Tambah Kategori
        </Link>
      </div>

      {/* Filter bar */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        <form
          method="GET"
          style={{ display: "flex", gap: "8px", flex: 1, minWidth: "200px" }}
        >
          <input
            name="cari"
            type="text"
            className="admin-input"
            placeholder="Cari kategori..."
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
          {search && (
            <Link
              href="/admin/kategori"
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
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nama Kategori</th>
                <th>Slug</th>
                <th>Deskripsi</th>
                <th style={{ width: "80px", textAlign: "center" }}>
                  Jumlah Berita
                </th>
                <th style={{ width: "130px" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {allCats.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "var(--color-ink-4)",
                    }}
                  >
                    {search
                      ? `Tidak ada kategori untuk "${search}"`
                      : "Belum ada kategori. Tambahkan yang pertama!"}
                  </td>
                </tr>
              )}
              {allCats.map((cat) => (
                <tr key={cat.id}>
                  <td>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "13.5px",
                        color: "var(--color-ink)",
                      }}
                    >
                      {cat.name}
                    </div>
                  </td>
                  <td>
                    <code
                      style={{
                        fontSize: "12px",
                        background: "var(--color-ink-7)",
                        padding: "2px 8px",
                        borderRadius: "5px",
                        color: "var(--color-ink-3)",
                      }}
                    >
                      {cat.slug}
                    </code>
                  </td>
                  <td
                    style={{
                      fontSize: "13px",
                      color: "var(--color-ink-4)",
                      maxWidth: "280px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {cat.description ?? "—"}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "36px",
                        height: "24px",
                        borderRadius: "20px",
                        fontSize: "12.5px",
                        fontWeight: 700,
                        background: countMap[cat.id]
                          ? "var(--color-forest-50)"
                          : "var(--color-ink-7)",
                        color: countMap[cat.id]
                          ? "var(--color-forest-700)"
                          : "var(--color-ink-5)",
                      }}
                    >
                      {countMap[cat.id] ?? 0}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      <Link
                        href={`/berita?kategori=${cat.slug}`}
                        target="_blank"
                        className="admin-table-btn admin-table-btn-view"
                      >
                        Lihat
                      </Link>
                      <Link
                        href={`/admin/kategori/${cat.id}`}
                        className="admin-table-btn admin-table-btn-edit"
                      >
                        <Edit size={13} />
                        Edit
                      </Link>
                      <DeleteCategoryPostButton id={cat.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary footer */}
        <div
          style={{
            padding: "12px 20px",
            borderTop: "1px solid var(--color-ink-7)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "12.5px",
            color: "var(--color-ink-4)",
          }}
        >
          <span>
            Total {allCats.reduce((sum, c) => sum + (countMap[c.id] ?? 0), 0)}{" "}
            berita dalam {allCats.length} kategori
          </span>
          <Link
            href="/admin/berita/baru"
            style={{
              fontSize: "12.5px",
              color: "var(--color-forest-700)",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            + Tambah berita baru
          </Link>
        </div>
      </div>
    </>
  );
}
