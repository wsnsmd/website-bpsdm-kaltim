// src/app/admin/profil/pages/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Eye, Edit, Globe, FileText } from "lucide-react";
import { db, asc, like, or } from "@/db";
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

type Props = {
  searchParams: Promise<{ cari?: string; status?: string }>;
};

export default async function AdminPagesPage({ searchParams }: Props) {
  const params = await searchParams;
  const search = params.cari ?? "";
  const status = params.status ?? "";

  const conditions = [];
  if (search)
    conditions.push(
      or(like(pages.title, `%${search}%`), like(pages.slug, `%${search}%`)),
    );
  if (status)
    conditions.push(
      // eq tidak import — pakai raw filter
      like(pages.status, status),
    );

  const allPages = await db
    .select()
    .from(pages)
    .orderBy(asc(pages.sortOrder), asc(pages.title));

  // Filter di JS karena kondisi sederhana
  const filtered = allPages.filter((p) => {
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !status || p.status === status;
    return matchSearch && matchStatus;
  });

  return (
    <>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Manajemen Halaman</h1>
          <p className="admin-page-sub">
            {filtered.length} dari {allPages.length} halaman
          </p>
        </div>
        <Link href="/admin/profil/pages/baru" className="admin-btn-save">
          <Plus size={15} />
          Tambah Halaman
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
        {/* Search */}
        <form
          method="GET"
          style={{ display: "flex", gap: "8px", flex: 1, minWidth: "200px" }}
        >
          {status && <input type="hidden" name="status" value={status} />}
          <input
            name="cari"
            type="text"
            className="admin-input"
            placeholder="Cari judul atau slug halaman..."
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
          {(search || status) && (
            <Link
              href="/admin/profil/pages"
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

        {/* Status pills */}
        <div style={{ display: "flex", gap: "5px" }}>
          {[
            { value: "", label: "Semua" },
            { value: "published", label: "Terbit" },
            { value: "draft", label: "Draft" },
            { value: "archived", label: "Arsip" },
          ].map((s) => (
            <Link
              key={s.value}
              href={`/admin/profil/pages?status=${s.value}${search ? `&cari=${search}` : ""}`}
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "12.5px",
                fontWeight: 500,
                textDecoration: "none",
                border: "1px solid",
                borderColor:
                  status === s.value
                    ? "var(--color-forest-700)"
                    : "var(--color-ink-6)",
                background:
                  status === s.value ? "var(--color-forest-700)" : "#fff",
                color: status === s.value ? "#fff" : "var(--color-ink-3)",
                whiteSpace: "nowrap",
              }}
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "60px" }}>Urutan</th>
                <th>Judul Halaman</th>
                <th>Template</th>
                <th>Status</th>
                <th style={{ textAlign: "center", width: "80px" }}>Di Nav</th>
                <th>Diperbarui</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
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
                      ? `Tidak ada halaman untuk "${search}"`
                      : "Belum ada halaman."}
                  </td>
                </tr>
              )}
              {filtered.map((page) => (
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
                      {page.sortOrder ?? "—"}
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
                        <Eye size={13} /> Lihat
                      </Link>
                      <Link
                        href={`/admin/profil/pages/${page.id}`}
                        className="admin-table-btn admin-table-btn-edit"
                      >
                        <Edit size={13} /> Edit
                      </Link>
                      <DeletePageButton id={page.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {filtered.length > 0 && (
          <div
            style={{
              padding: "12px 20px",
              borderTop: "1px solid var(--color-ink-7)",
              fontSize: "12.5px",
              color: "var(--color-ink-4)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>
              {filtered.filter((p) => p.status === "published").length} terbit ·{" "}
              {filtered.filter((p) => p.status === "draft").length} draft ·{" "}
              {filtered.filter((p) => p.showInNav).length} di navigasi
            </span>
            <span>{filtered.length} halaman ditampilkan</span>
          </div>
        )}
      </div>
    </>
  );
}
