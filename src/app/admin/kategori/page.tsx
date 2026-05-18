// src/app/admin/kategori/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { db, asc, count, eq } from "@/db";
import { categories, posts } from "@/db/schema";
import { Plus, Edit } from "lucide-react";
import { DeleteCategoryPostButton } from "@/components/admin/DeleteCategoryPostButton";

export const metadata: Metadata = { title: "Kategori Berita" };

export default async function AdminKategoriPage() {
  const allCats = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      description: categories.description,
    })
    .from(categories)
    .orderBy(asc(categories.name));

  // Hitung jumlah berita per kategori
  const counts = await db
    .select({
      categoryId: posts.categoryId,
      total: count(),
    })
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
                    Belum ada kategori. Tambahkan yang pertama!
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
                        fontSize: "13px",
                        fontWeight: 700,
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
      </div>
    </>
  );
}
