// src/components/documents/DocumentCard.tsx
import Link from "next/link";
import { Download, ExternalLink, Calendar } from "lucide-react";
import { FileIcon, formatFileSize } from "@/components/ui/FileIcon";
import type { DocumentItem } from "@/lib/queries/documents";

type Props = { document: DocumentItem };

export function DocumentCard({ document }: Props) {
  const isExternal = !!document.externalUrl && !document.fileUrl;
  const isUpload = !!document.fileUrl;

  // URL yang benar:
  // - Upload   → /api/unduhan/{id} (tracking + serve file lokal)
  // - Eksternal → langsung ke externalUrl (Google Drive, dll)
  const actionUrl = isExternal
    ? document.externalUrl!
    : isUpload
      ? `/api/unduhan/${document.id}`
      : null;

  const hasFile = !!actionUrl;

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid var(--color-ink-6)",
        borderRadius: "14px",
        padding: "18px 20px",
        display: "flex",
        gap: "16px",
        alignItems: "flex-start",
        transition: "all 0.2s",
        position: "relative",
      }}
    >
      {/* Border kiri aksen */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: "16px",
          bottom: "16px",
          width: "3px",
          borderRadius: "0 3px 3px 0",
          background: document.categoryColor ?? "var(--color-forest-600)",
        }}
      />

      {/* File icon */}
      <div style={{ marginLeft: "8px" }}>
        <FileIcon fileType={document.fileType} size={20} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {document.categoryName && (
          <div style={{ marginBottom: "6px" }}>
            <span
              style={{
                fontSize: "10.5px",
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: "20px",
                background: `${document.categoryColor ?? "#0e3d20"}18`,
                color: document.categoryColor ?? "var(--color-forest-700)",
              }}
            >
              {document.categoryName}
            </span>
          </div>
        )}

        <div
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "var(--color-ink)",
            lineHeight: 1.4,
            marginBottom: "6px",
          }}
        >
          {document.title}
        </div>

        {document.description && (
          <div
            style={{
              fontSize: "12.5px",
              color: "var(--color-ink-4)",
              lineHeight: 1.5,
              marginBottom: "10px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical" as const,
              overflow: "hidden",
            }}
          >
            {document.description}
          </div>
        )}

        {/* Meta */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          {document.year && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "12px",
                color: "var(--color-ink-4)",
              }}
            >
              <Calendar size={12} />
              {document.year}
            </span>
          )}
          {document.fileSize && (
            <span style={{ fontSize: "12px", color: "var(--color-ink-4)" }}>
              {formatFileSize(document.fileSize)}
            </span>
          )}
          {document.fileType && (
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--color-ink-5)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              .{document.fileType}
            </span>
          )}
          {/* Badge sumber */}
          <span
            style={{
              fontSize: "10.5px",
              fontWeight: 600,
              padding: "1px 7px",
              borderRadius: "20px",
              background: isExternal ? "#eff6ff" : "var(--color-forest-50)",
              color: isExternal ? "#1d4ed8" : "var(--color-forest-700)",
            }}
          >
            {isExternal ? "Eksternal" : "Upload"}
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "3px",
              fontSize: "12px",
              color: "var(--color-ink-5)",
            }}
          >
            <Download size={11} />
            {document.downloadCount ?? 0}×
          </span>
        </div>
      </div>

      {/* Tombol */}
      <div style={{ flexShrink: 0 }}>
        {hasFile ? (
          <Link
            href={actionUrl!}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "9px 16px",
              borderRadius: "10px",
              background: "var(--color-forest-700)",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 700,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            {isExternal ? (
              <>
                <ExternalLink size={14} /> Buka
              </>
            ) : (
              <>
                <Download size={14} /> Unduh
              </>
            )}
          </Link>
        ) : (
          <div
            style={{
              padding: "9px 16px",
              borderRadius: "10px",
              background: "var(--color-ink-7)",
              color: "var(--color-ink-4)",
              fontSize: "13px",
            }}
          >
            Tidak tersedia
          </div>
        )}
      </div>
    </div>
  );
}
