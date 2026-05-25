// src/app/admin/dokumen/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { db, desc, eq, like, and, count } from "@/db";
import { documents, documentCategories } from "@/db/schema";
import {
  Plus,
  Edit,
  Eye,
  Download,
  ExternalLink,
  FileText,
} from "lucide-react";
import { DeleteDocumentButton } from "@/components/admin/dokumen/DeleteDocumentButton";
import { FileIcon, formatFileSize } from "@/components/ui/FileIcon";
import { Pagination } from "@/components/ui/Pagination";
import { getDocumentCategories } from "@/lib/queries/documents";

export const metadata: Metadata = { title: "Manajemen Dokumen" };

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  published: { label: "Terbit", cls: "status-pill-published" },
  draft: { label: "Draft", cls: "status-pill-draft" },
  archived: { label: "Arsip", cls: "status-pill-archived" },
};

const PER_PAGE = 20;

type Props = {
  searchParams: Promise<{
    cari?: string;
    status?: string;
    kategori?: string;
    halaman?: string;
  }>;
};

export default async function AdminDokumenPage({ searchParams }: Props) {
  const params = await searchParams;
  const search = params.cari ?? "";
  const status = params.status ?? "";
  const kategori = params.kategori ?? "";
  const page = Math.max(1, Number(params.halaman ?? 1));
  const offset = (page - 1) * PER_PAGE;

  // Build where conditions
  const conditions = [];
  if (search) conditions.push(like(documents.title, `%${search}%`));
  if (status) conditions.push(eq(documents.status, status as any));
  if (kategori) conditions.push(eq(documents.categoryId, Number(kategori)));
  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [allDocs, totalResult, categories] = await Promise.all([
    db
      .select({
        id: documents.id,
        title: documents.title,
        fileType: documents.fileType,
        fileSize: documents.fileSize,
        externalUrl: documents.externalUrl,
        fileUrl: documents.fileUrl,
        status: documents.status,
        downloadCount: documents.downloadCount,
        year: documents.year,
        createdAt: documents.createdAt,
        categoryName: documentCategories.name,
        categoryColor: documentCategories.color,
      })
      .from(documents)
      .leftJoin(
        documentCategories,
        eq(documents.categoryId, documentCategories.id),
      )
      .where(where)
      .orderBy(desc(documents.createdAt))
      .limit(PER_PAGE)
      .offset(offset),

    db.select({ total: count() }).from(documents).where(where),
    getDocumentCategories(),
  ]);

  const total = totalResult[0]?.total ?? 0;
  const totalPages = Math.ceil(total / PER_PAGE);

  const paginationParams: Record<string, string> = {};
  if (search) paginationParams.cari = search;
  if (status) paginationParams.status = status;
  if (kategori) paginationParams.kategori = kategori;

  return (
    <>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Manajemen Dokumen</h1>
          <p className="admin-page-sub">{total} dokumen ditemukan</p>
        </div>
        <Link href="/admin/dokumen/baru" className="admin-btn-save">
          <Plus size={15} /> Tambah Dokumen
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
          {kategori && <input type="hidden" name="kategori" value={kategori} />}
          <input
            name="cari"
            type="text"
            className="admin-input"
            placeholder="Cari judul dokumen..."
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
              href="/admin/dokumen"
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
        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
          {[
            { value: "", label: "Semua" },
            { value: "published", label: "Terbit" },
            { value: "draft", label: "Draft" },
            { value: "archived", label: "Arsip" },
          ].map((s) => (
            <Link
              key={s.value}
              href={`/admin/dokumen?status=${s.value}${search ? `&cari=${search}` : ""}${kategori ? `&kategori=${kategori}` : ""}`}
              style={{
                padding: "5px 12px",
                borderRadius: "20px",
                fontSize: "12px",
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

          {/* Kategori select */}
          <form method="GET" style={{ display: "flex", gap: "6px" }}>
            {search && <input type="hidden" name="cari" value={search} />}
            {status && <input type="hidden" name="status" value={status} />}
            <select
              name="kategori"
              defaultValue={kategori}
              className="jadwal-filter-select"
              style={{ height: "34px", fontSize: "12.5px" }}
            >
              <option value="">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              style={{
                height: "34px",
                padding: "0 12px",
                borderRadius: "8px",
                background: "var(--color-forest-700)",
                border: "none",
                color: "#fff",
                fontSize: "12.5px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Filter
            </button>
          </form>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "50px" }}>Tipe</th>
                <th>Judul Dokumen</th>
                <th>Kategori</th>
                <th style={{ width: "70px", textAlign: "center" }}>Tahun</th>
                <th style={{ width: "80px" }}>Sumber</th>
                <th style={{ width: "80px" }}>Status</th>
                <th style={{ width: "70px", textAlign: "center" }}>
                  <Download size={13} style={{ display: "inline" }} />
                </th>
                <th style={{ width: "150px" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {allDocs.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "var(--color-ink-4)",
                    }}
                  >
                    {search
                      ? `Tidak ada dokumen untuk "${search}"`
                      : "Belum ada dokumen."}
                  </td>
                </tr>
              )}
              {allDocs.map((doc) => {
                const statusCfg =
                  STATUS_CONFIG[doc.status] ?? STATUS_CONFIG.draft;
                const isExternal = !!doc.externalUrl && !doc.fileUrl;
                return (
                  <tr
                    key={doc.id}
                    style={{ opacity: doc.status === "archived" ? 0.6 : 1 }}
                  >
                    <td>
                      <FileIcon fileType={doc.fileType} size={14} />
                    </td>

                    <td style={{ maxWidth: "300px" }}>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: "13.5px",
                          color: "var(--color-ink)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          marginBottom: "2px",
                        }}
                      >
                        {doc.title}
                      </div>
                      {doc.fileSize && (
                        <div
                          style={{
                            fontSize: "11.5px",
                            color: "var(--color-ink-5)",
                          }}
                        >
                          {formatFileSize(doc.fileSize)}
                        </div>
                      )}
                    </td>

                    <td>
                      {doc.categoryName ? (
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: 600,
                            padding: "2px 8px",
                            borderRadius: "20px",
                            background: `${doc.categoryColor ?? "#0e3d20"}18`,
                            color:
                              doc.categoryColor ?? "var(--color-forest-700)",
                          }}
                        >
                          {doc.categoryName}
                        </span>
                      ) : (
                        <span
                          style={{
                            fontSize: "12px",
                            color: "var(--color-ink-5)",
                          }}
                        >
                          —
                        </span>
                      )}
                    </td>

                    <td
                      style={{
                        textAlign: "center",
                        fontSize: "13px",
                        color: "var(--color-ink-3)",
                      }}
                    >
                      {doc.year ?? "—"}
                    </td>

                    <td>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "11.5px",
                          fontWeight: 600,
                          padding: "3px 8px",
                          borderRadius: "20px",
                          background: isExternal
                            ? "#eff6ff"
                            : "var(--color-forest-50)",
                          color: isExternal
                            ? "#1d4ed8"
                            : "var(--color-forest-700)",
                        }}
                      >
                        {isExternal ? (
                          <>
                            <ExternalLink size={11} /> Eksternal
                          </>
                        ) : (
                          <>
                            <FileText size={11} /> Upload
                          </>
                        )}
                      </span>
                    </td>

                    <td>
                      <span className={`status-pill ${statusCfg.cls}`}>
                        {statusCfg.label}
                      </span>
                    </td>

                    <td
                      style={{
                        textAlign: "center",
                        fontSize: "13px",
                        color: "var(--color-ink-4)",
                      }}
                    >
                      {doc.downloadCount ?? 0}
                    </td>

                    <td>
                      <div className="admin-table-actions">
                        <Link
                          href={doc.fileUrl || doc.externalUrl || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="admin-table-btn admin-table-btn-view"
                        >
                          <Eye size={13} /> Lihat
                        </Link>
                        <Link
                          href={`/admin/dokumen/${doc.id}`}
                          className="admin-table-btn admin-table-btn-edit"
                        >
                          <Edit size={13} /> Edit
                        </Link>
                        <DeleteDocumentButton id={doc.id} />
                      </div>
                    </td>
                  </tr>
                );
              })}
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
              basePath="/admin/dokumen"
              searchParams={paginationParams}
            />
          </div>
        )}

        {/* Footer summary */}
        <div
          style={{
            padding: "12px 20px",
            borderTop: totalPages > 1 ? "none" : "1px solid var(--color-ink-7)",
            fontSize: "12.5px",
            color: "var(--color-ink-4)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>
            Halaman {page} dari {totalPages || 1} · {total} total dokumen
          </span>
          <span>{PER_PAGE} per halaman</span>
        </div>
      </div>
    </>
  );
}
