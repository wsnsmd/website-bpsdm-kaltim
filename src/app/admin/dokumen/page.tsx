// src/app/admin/dokumen/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { db, desc, eq } from "@/db";
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

export const metadata: Metadata = { title: "Manajemen Dokumen" };

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  published: { label: "Terbit", cls: "status-pill-published" },
  draft: { label: "Draft", cls: "status-pill-draft" },
  archived: { label: "Arsip", cls: "status-pill-archived" },
};

export default async function AdminDokumenPage() {
  const allDocs = await db
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
    .orderBy(desc(documents.createdAt));

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
          {allDocs.length} dokumen terdaftar
        </p>
        <Link href="/admin/dokumen/baru" className="admin-btn-save">
          <Plus size={15} />
          Tambah Dokumen
        </Link>
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
                    Belum ada dokumen.
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
                    style={{
                      opacity: doc.status === "archived" ? 0.6 : 1,
                    }}
                  >
                    {/* Tipe file */}
                    <td>
                      <FileIcon fileType={doc.fileType} size={14} />
                    </td>

                    {/* Judul */}
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

                    {/* Kategori */}
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

                    {/* Tahun */}
                    <td
                      style={{
                        textAlign: "center",
                        fontSize: "13px",
                        color: "var(--color-ink-3)",
                      }}
                    >
                      {doc.year ?? "—"}
                    </td>

                    {/* Sumber */}
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

                    {/* Status */}
                    <td>
                      <span className={`status-pill ${statusCfg.cls}`}>
                        {statusCfg.label}
                      </span>
                    </td>

                    {/* Download count */}
                    <td
                      style={{
                        textAlign: "center",
                        fontSize: "13px",
                        color: "var(--color-ink-4)",
                      }}
                    >
                      {doc.downloadCount ?? 0}
                    </td>

                    {/* Aksi */}
                    <td>
                      <div className="admin-table-actions">
                        <Link
                          href={doc.fileUrl || doc.externalUrl || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="admin-table-btn admin-table-btn-view"
                        >
                          <Eye size={13} />
                          Lihat
                        </Link>
                        <Link
                          href={`/admin/dokumen/${doc.id}`}
                          className="admin-table-btn admin-table-btn-edit"
                        >
                          <Edit size={13} />
                          Edit
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
      </div>
    </>
  );
}
