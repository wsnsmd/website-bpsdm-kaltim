// src/components/admin/dokumen/DocumentUploader.tsx
"use client";

import { useState, useRef } from "react";
import { Upload, X, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { formatFileSize } from "@/components/ui/FileIcon";
import Link from "next/link";

type Props = {
  value?: string;
  onChange: (url: string, fileType: string, fileSize: number) => void;
  onClear: () => void;
};

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/zip",
  "application/x-zip-compressed",
];

const ACCEPTED_EXT = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip";
const MAX_SIZE_MB = 10;
const MAX_SIZE = MAX_SIZE_MB * 1024 * 1024;

function getExtFromMime(mime: string): string {
  const map: Record<string, string> = {
    "application/pdf": "pdf",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "docx",
    "application/vnd.ms-excel": "xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "application/vnd.ms-powerpoint": "ppt",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      "pptx",
    "application/zip": "zip",
    "application/x-zip-compressed": "zip",
  };
  return map[mime] ?? "file";
}

export function DocumentUploader({ value, onChange, onClear }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);

    // Validasi ukuran
    if (file.size > MAX_SIZE) {
      setError(`File terlalu besar. Maksimal ${MAX_SIZE_MB}MB.`);
      return;
    }

    // Validasi tipe
    const isValidType =
      ACCEPTED_TYPES.includes(file.type) ||
      ACCEPTED_EXT.split(",").some((ext) =>
        file.name.toLowerCase().endsWith(ext.replace(".", "")),
      );
    if (!isValidType) {
      setError(
        "Tipe file tidak didukung. Gunakan PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, atau ZIP.",
      );
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Upload gagal");
      }

      const data = await res.json();
      const ext =
        getExtFromMime(file.type) || file.name.split(".").pop() || "file";
      onChange(data.url, ext, file.size);
    } catch (err: any) {
      setError(err.message ?? "Upload gagal. Coba lagi.");
    } finally {
      setUploading(false);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  // Sudah ada file
  if (value) {
    const filename = value.split("/").pop() ?? value;
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "14px 16px",
          borderRadius: "10px",
          background: "var(--color-forest-50)",
          border: "1px solid var(--color-forest-200)",
        }}
      >
        <CheckCircle
          size={20}
          style={{ color: "var(--color-forest-700)", flexShrink: 0 }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: "13.5px",
              fontWeight: 600,
              color: "var(--color-ink)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {filename}
          </div>
          <Link
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: "12px", color: "var(--color-forest-700)" }}
          >
            Lihat file →
          </Link>
        </div>
        <button
          type="button"
          onClick={onClear}
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "8px",
            border: "1px solid var(--color-ink-6)",
            background: "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-ink-4)",
            flexShrink: 0,
          }}
          title="Hapus file"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${isDragging ? "var(--color-forest-600)" : "var(--color-ink-5)"}`,
          borderRadius: "12px",
          padding: "32px 20px",
          textAlign: "center",
          cursor: uploading ? "wait" : "pointer",
          background: isDragging
            ? "var(--color-forest-50)"
            : "var(--color-ink-8)",
          transition: "all 0.15s",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXT}
          onChange={handleInputChange}
          style={{ display: "none" }}
          disabled={uploading}
        />

        {uploading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                border: "3px solid var(--color-forest-200)",
                borderTop: "3px solid var(--color-forest-700)",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <span style={{ fontSize: "13px", color: "var(--color-ink-3)" }}>
              Mengupload...
            </span>
          </div>
        ) : (
          <>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "var(--color-forest-50)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 12px",
              }}
            >
              <Upload size={22} style={{ color: "var(--color-forest-700)" }} />
            </div>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "var(--color-ink-2)",
                marginBottom: "6px",
              }}
            >
              Klik atau seret file ke sini
            </div>
            <div
              style={{
                fontSize: "12.5px",
                color: "var(--color-ink-4)",
                marginBottom: "12px",
              }}
            >
              PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, ZIP
            </div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "7px 16px",
                borderRadius: "8px",
                background: "var(--color-forest-700)",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              <FileText size={14} />
              Pilih File
            </div>
            <div
              style={{
                marginTop: "10px",
                fontSize: "12px",
                color: "var(--color-ink-5)",
              }}
            >
              Maksimal {MAX_SIZE_MB}MB
            </div>
          </>
        )}
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginTop: "10px",
            padding: "10px 14px",
            borderRadius: "8px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#dc2626",
            fontSize: "13px",
          }}
        >
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          {error}
        </div>
      )}

      {/* Tambahkan CSS spin */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
