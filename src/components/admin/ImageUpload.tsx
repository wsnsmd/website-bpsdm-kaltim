// src/components/admin/ImageUpload.tsx
"use client";

import { useState, useRef, useCallback } from "react";

type UploadResult = {
  url: string;
  thumbUrl: string;
  fileName: string;
  size: number;
  width?: number;
  height?: number;
};

type Props = {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
  aspectRatio?: "16/9" | "1/1" | "4/3";
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const PADDINGS: Record<string, string> = {
  "16/9": "56.25%",
  "1/1": "100%",
  "4/3": "75%",
};

export function ImageUpload({
  value,
  onChange,
  label = "Gambar",
  hint,
  aspectRatio = "16/9",
}: Props) {
  // currentUrl = URL final yang sudah diupload (dari server)
  const [currentUrl, setCurrentUrl] = useState<string>(value ?? "");
  // blobPreview = URL sementara saat sedang upload
  const [blobPreview, setBlobPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileInfo, setFileInfo] = useState<UploadResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const blobRef = useRef<string | null>(null);

  // Gambar yang ditampilkan: prioritaskan blob saat upload, lalu currentUrl
  const displayUrl = blobPreview ?? currentUrl;

  const handleUpload = useCallback(
    async (file: File) => {
      setError(null);
      setUploading(true);

      // Buat blob URL untuk preview instan
      const blob = URL.createObjectURL(file);
      blobRef.current = blob;
      setBlobPreview(blob);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error ?? "Upload gagal.");
          // Kembalikan ke state sebelumnya
          setBlobPreview(null);
          return;
        }

        // Upload sukses — simpan URL server
        setCurrentUrl(data.url);
        setFileInfo(data);
        onChange(data.url);

        // Hapus blob preview setelah URL server tersedia
        setBlobPreview(null);
      } catch {
        setError("Koneksi bermasalah. Coba lagi.");
        setBlobPreview(null);
      } finally {
        setUploading(false);
        // Revoke blob URL
        if (blobRef.current) {
          URL.revokeObjectURL(blobRef.current);
          blobRef.current = null;
        }
      }
    },
    [onChange],
  );

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    // Reset input value agar file yang sama bisa diupload ulang
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  }

  function handleRemove() {
    setCurrentUrl("");
    setBlobPreview(null);
    setFileInfo(null);
    setError(null);
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="image-upload">
      {label && (
        <div className="image-upload-label">
          {label}
          <span className="admin-hint" style={{ marginLeft: "6px" }}>
            JPG, PNG, WebP · maks 5MB
          </span>
        </div>
      )}

      {/* Drop zone */}
      <div
        className={[
          "image-upload-zone",
          dragOver ? "image-upload-zone-over" : "",
          displayUrl ? "image-upload-zone-filled" : "",
        ].join(" ")}
        style={{ paddingTop: PADDINGS[aspectRatio] }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !displayUrl && inputRef.current?.click()}
      >
        <div className="image-upload-inner">
          {displayUrl ? (
            <>
              {/* Gunakan <img> biasa — lebih fleksibel untuk blob & URL lokal */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={displayUrl}
                alt="Preview gambar"
                className="image-upload-preview"
                onError={() => {
                  // Jika gambar gagal load, reset
                  if (!blobPreview) {
                    setCurrentUrl("");
                    onChange("");
                  }
                }}
              />

              {/* Overlay aksi */}
              {!uploading && (
                <div className="image-upload-overlay">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      inputRef.current?.click();
                    }}
                    className="image-upload-overlay-btn"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    Ganti
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove();
                    }}
                    className="image-upload-overlay-btn image-upload-overlay-btn-danger"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    </svg>
                    Hapus
                  </button>
                </div>
              )}

              {/* Loading overlay */}
              {uploading && (
                <div className="image-upload-loading">
                  <div className="loading-spinner">
                    <div className="loading-spinner-ring" />
                  </div>
                  <span style={{ fontSize: "13px", marginTop: "8px" }}>
                    Mengunggah & memproses...
                  </span>
                </div>
              )}
            </>
          ) : (
            /* Empty state */
            <div className="image-upload-empty">
              {uploading ? (
                <>
                  <div
                    className="loading-spinner"
                    style={{ marginBottom: "12px" }}
                  >
                    <div className="loading-spinner-ring" />
                  </div>
                  <div className="image-upload-empty-title">Mengunggah...</div>
                </>
              ) : (
                <>
                  <div className="image-upload-empty-icon">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                  <div className="image-upload-empty-title">
                    {dragOver ? "Lepaskan file di sini" : "Upload Gambar"}
                  </div>
                  <div className="image-upload-empty-sub">
                    Drag & drop atau{" "}
                    <span className="image-upload-browse">
                      klik untuk pilih file
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--color-ink-5)",
                      marginTop: "4px",
                    }}
                  >
                    JPG, PNG, WebP · Maks 5MB
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="image-upload-error">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
          <button
            type="button"
            onClick={() => setError(null)}
            style={{
              marginLeft: "auto",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#dc2626",
              padding: "0",
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* File info setelah upload sukses */}
      {fileInfo && !error && (
        <div className="image-upload-info">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            style={{ color: "var(--color-forest-700)", flexShrink: 0 }}
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>
            Berhasil diupload · {formatBytes(fileInfo.size)}
            {fileInfo.width && fileInfo.height && (
              <>
                {" "}
                · {fileInfo.width}×{fileInfo.height}px
              </>
            )}
          </span>
          <span
            style={{
              marginLeft: "auto",
              fontSize: "11px",
              color: "var(--color-ink-5)",
            }}
          >
            WebP
          </span>
        </div>
      )}

      {/* File input tersembunyi */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="image-upload-input"
        onChange={handleFileChange}
      />

      {hint && (
        <span
          className="admin-hint"
          style={{ marginTop: "4px", display: "block" }}
        >
          {hint}
        </span>
      )}
    </div>
  );
}
