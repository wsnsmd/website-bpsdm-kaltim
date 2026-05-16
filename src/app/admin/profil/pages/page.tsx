// src/app/admin/profil/pages/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Eye, Edit, Globe, FileText } from "lucide-react";
import { db, asc } from "@/db";
import { pages } from "@/db/schema";
import { formatDate } from "@/lib/utils";
import { DeletePageButton } from "@/components/admin/profil/DeletePageButton";

export const metadata: Metadata = { title: "Manajemen Halaman" };

const STATUS_STYLE: Record<string, string> = {
  published: "status-pill-published",
  draft: "status-pill-draft",
  archived: "status-pill-archived",
};

const STATUS_LABEL: Record<string, string> = {
  published: "Terbit",
  draft: "Draft",
  archived: "Arsip",
};

export default async function AdminPagesPage() {
  const allPages = await db
    .select()
    .from(pages)
    .orderBy(asc(pages.sortOrder), asc(pages.title));

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
          {allPages.length} halaman terdaftar
        </p>
        <Link href="/admin/profil/pages/baru" className="admin-btn-save">
          <Plus size={15} />
          Tambah Halaman
        </Link>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Urutan</th>
                <th>Judul Halaman</th>
                <th>Template</th>
                <th>Status</th>
                <th style={{ textAlign: "center" }}>Di Nav</th>
                <th>Diperbarui</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {allPages.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "var(--color-ink-4)",
                    }}
                  >
                    Belum ada halaman.
                  </td>
                </tr>
              )}
              {allPages.map((page) => (
                <tr key={page.id}>
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
                      {page.sortOrder}
                    </span>
                  </td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <FileText
                        size={14}
                        style={{ color: "var(--color-ink-4)", flexShrink: 0 }}
                      />
                      <div>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: "13.5px",
                            color: "var(--color-ink)",
                          }}
                        >
                          {page.title}
                        </div>
                        <div
                          style={{
                            fontSize: "11.5px",
                            color: "var(--color-ink-4)",
                          }}
                        >
                          /{page.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "var(--color-ink-3)",
                        background: "var(--color-ink-7)",
                        padding: "2px 8px",
                        borderRadius: "6px",
                      }}
                    >
                      {page.template ?? "default"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status-pill ${STATUS_STYLE[page.status] ?? "status-pill-draft"}`}
                    >
                      {STATUS_LABEL[page.status] ?? page.status}
                    </span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {page.showInNav ? (
                      <Globe
                        size={15}
                        style={{ color: "var(--color-forest-700)" }}
                      />
                    ) : (
                      <span
                        style={{
                          color: "var(--color-ink-5)",
                          fontSize: "16px",
                        }}
                      >
                        —
                      </span>
                    )}
                  </td>
                  <td style={{ fontSize: "12px", color: "var(--color-ink-4)" }}>
                    {formatDate(page.updatedAt, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      <Link
                        href={`/${page.slug}`}
                        target="_blank"
                        className="admin-table-btn admin-table-btn-view"
                      >
                        <Eye size={13} />
                        Lihat
                      </Link>
                      <Link
                        href={`/admin/profil/pages/${page.id}`}
                        className="admin-table-btn admin-table-btn-edit"
                      >
                        <Edit size={13} />
                        Edit
                      </Link>
                      <DeletePageButton id={page.id} />
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
