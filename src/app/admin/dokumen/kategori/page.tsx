// src/app/admin/dokumen/kategori/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { db, asc } from "@/db";
import { documentCategories, documents } from "@/db/schema";
import { eq, sql } from "@/db";
import { Plus, Edit } from "lucide-react";
import { DeleteCategoryButton } from "@/components/admin/dokumen/DeleteCategoryButton";

export const metadata: Metadata = { title: "Kategori Dokumen" };

const ICON_OPTIONS = [
  "BarChart2",
  "FileCheck",
  "Scale",
  "BookOpen",
  "ClipboardList",
  "Book",
  "Megaphone",
  "Wallet",
  "FileText",
  "Folder",
  "Archive",
  "Download",
];

export default async function AdminKategoriPage() {
  const cats = await db
    .select({
      id: documentCategories.id,
      name: documentCategories.name,
      slug: documentCategories.slug,
      icon: documentCategories.icon,
      color: documentCategories.color,
      sortOrder: documentCategories.sortOrder,
      isActive: documentCategories.isActive,
    })
    .from(documentCategories)
    .orderBy(asc(documentCategories.sortOrder));

  // Hitung dokumen per kategori
  const counts = await db
    .select({
      categoryId: documents.categoryId,
      count: sql<number>`COUNT(*)`,
    })
    .from(documents)
    .groupBy(documents.categoryId);

  const countMap = Object.fromEntries(
    counts.map((c) => [c.categoryId, c.count]),
  );

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <p style={{ fontSize: "13px", color: "var(--color-ink-4)" }}>
          {cats.length} kategori terdaftar
        </p>
        <Link href="/admin/dokumen/kategori/baru" className="admin-btn-save">
          <Plus size={15} />
          Tambah Kategori
        </Link>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "60px", textAlign: "center" }}>Urutan</th>
                <th>Nama Kategori</th>
                <th style={{ width: "80px", textAlign: "center" }}>Dokumen</th>
                <th style={{ width: "80px", textAlign: "center" }}>Aktif</th>
                <th style={{ width: "140px" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {cats.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "var(--color-ink-4)",
                    }}
                  >
                    Belum ada kategori.
                  </td>
                </tr>
              )}
              {cats.map((cat) => (
                <tr key={cat.id}>
                  <td style={{ textAlign: "center" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: "var(--color-ink-7)",
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "var(--color-ink-4)",
                      }}
                    >
                      {cat.sortOrder}
                    </span>
                  </td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      {cat.color && (
                        <div
                          style={{
                            width: "12px",
                            height: "12px",
                            borderRadius: "50%",
                            backgroundColor: cat.color,
                            flexShrink: 0,
                          }}
                        />
                      )}
                      <div>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: "13.5px",
                            color: "var(--color-ink)",
                          }}
                        >
                          {cat.name}
                        </div>
                        <div
                          style={{
                            fontSize: "11.5px",
                            color: "var(--color-ink-4)",
                          }}
                        >
                          /{cat.slug} · icon: {cat.icon ?? "—"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "var(--color-forest-700)",
                      }}
                    >
                      {countMap[cat.id] ?? 0}
                    </span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {cat.isActive ? (
                      <span
                        style={{
                          color: "var(--color-forest-700)",
                          fontSize: "18px",
                        }}
                      >
                        ✓
                      </span>
                    ) : (
                      <span
                        style={{
                          color: "var(--color-ink-5)",
                          fontSize: "18px",
                        }}
                      >
                        —
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      <Link
                        href={`/admin/dokumen/kategori/${cat.id}`}
                        className="admin-table-btn admin-table-btn-edit"
                      >
                        <Edit size={13} />
                        Edit
                      </Link>
                      <DeleteCategoryButton id={cat.id} />
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
