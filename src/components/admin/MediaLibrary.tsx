// src/components/admin/MediaLibrary.tsx
"use client";

import { useState, useEffect, useCallback } from "react";

type ImageItem = {
  fileName: string;
  url: string;
  thumbUrl: string;
  size: number;
};

type Props = {
  onSelect: (url: string) => void;
  onClose: () => void;
};

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaLibrary({ onSelect, onClose }: Props) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/upload");
      const data = await res.json();
      setImages(data.images ?? []);
    } catch {
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  async function handleDelete(fileName: string) {
    if (!confirm("Hapus gambar ini? Tindakan tidak dapat dibatalkan.")) return;
    setDeleting(fileName);
    try {
      await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName }),
      });
      setImages((prev) => prev.filter((img) => img.fileName !== fileName));
      if (selected === fileName) setSelected(null);
    } finally {
      setDeleting(null);
    }
  }

  function handleSelect() {
    if (!selected) return;
    const img = images.find((i) => i.fileName === selected);
    if (img) onSelect(img.url);
    onClose();
  }

  return (
    <div
      className="media-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="media-modal">
        {/* Header */}
        <div className="media-modal-head">
          <div>
            <h2 className="media-modal-title">Perpustakaan Media</h2>
            <p className="media-modal-sub">{images.length} gambar tersedia</p>
          </div>
          <button
            onClick={onClose}
            className="media-close-btn"
            aria-label="Tutup"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Grid gambar */}
        <div className="media-modal-body">
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "60px",
              }}
            >
              <div className="loading-spinner">
                <div className="loading-spinner-ring" />
              </div>
            </div>
          ) : images.length === 0 ? (
            <div className="empty-state" style={{ padding: "60px 20px" }}>
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                style={{ color: "var(--color-ink-5)" }}
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <div className="empty-state-title">Belum ada gambar</div>
              <div className="empty-state-desc">
                Upload gambar menggunakan tombol di atas.
              </div>
            </div>
          ) : (
            <div className="media-grid">
              {images.map((img) => (
                <div
                  key={img.fileName}
                  className={`media-item ${selected === img.fileName ? "media-item-selected" : ""}`}
                  onClick={() =>
                    setSelected(selected === img.fileName ? null : img.fileName)
                  }
                >
                  <div className="media-item-img">
                    <img src={img.thumbUrl} alt={img.fileName} loading="lazy" />
                    {selected === img.fileName && (
                      <div className="media-item-check">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="3"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="media-item-info">
                    <div className="media-item-name">{img.fileName}</div>
                    <div className="media-item-size">
                      {formatBytes(img.size)}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(img.fileName);
                    }}
                    className="media-item-delete"
                    disabled={deleting === img.fileName}
                    aria-label="Hapus gambar"
                  >
                    {deleting === img.fileName ? (
                      "..."
                    ) : (
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      </svg>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="media-modal-foot">
          <button type="button" onClick={onClose} className="admin-btn-cancel">
            Batal
          </button>
          <button
            type="button"
            onClick={handleSelect}
            disabled={!selected}
            className="admin-btn-save"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Gunakan Gambar
          </button>
        </div>
      </div>
    </div>
  );
}
