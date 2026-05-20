// src/components/admin/galeri/PhotoGrid.tsx
"use client";

import { useState } from "react";
import { deletePhoto, updatePhotoCaption } from "@/lib/actions/gallery";
import { Trash2, Edit2, Check, X } from "lucide-react";
import type { GalleryPhoto } from "@/lib/queries/gallery";

type Props = { photos: GalleryPhoto[]; albumId: number };

export function PhotoGrid({ photos, albumId }: Props) {
  const [editId, setEditId] = useState<number | null>(null);
  const [editCaption, setEditCaption] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);

  async function handleDelete(id: number) {
    setDeleting(id);
    await deletePhoto(id);
    setDeleting(null);
  }

  async function handleSaveCaption(id: number) {
    await updatePhotoCaption(id, editCaption);
    setEditId(null);
  }

  if (photos.length === 0) {
    return (
      <div className="admin-card">
        <div
          style={{
            padding: "48px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            color: "var(--color-ink-4)",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: "var(--color-ink-7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Trash2 size={22} style={{ opacity: 0.3 }} />
          </div>
          <div
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--color-ink-3)",
            }}
          >
            Belum ada foto
          </div>
          <div style={{ fontSize: "13px" }}>
            Upload foto dari panel di sebelah kanan.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-card">
      <div className="admin-card-head">
        <div className="admin-card-title">
          Foto dalam Album
          <span
            style={{
              marginLeft: "8px",
              padding: "1px 8px",
              borderRadius: "20px",
              background: "var(--color-ink-7)",
              fontSize: "11.5px",
              fontWeight: 700,
              color: "var(--color-ink-4)",
            }}
          >
            {photos.length}
          </span>
        </div>
      </div>
      <div
        style={{
          padding: "16px",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
        }}
      >
        {photos.map((photo) => (
          <div
            key={photo.id}
            style={{
              borderRadius: "8px",
              overflow: "hidden",
              border: "1px solid var(--color-ink-6)",
              background: "#fff",
              position: "relative",
            }}
          >
            {/* Gambar */}
            <div
              style={{
                position: "relative",
                paddingBottom: "75%",
                background: "var(--color-ink-7)",
              }}
            >
              <img
                src={photo.thumbUrl ?? photo.imageUrl}
                alt={photo.caption ?? ""}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              {/* Tombol hapus */}
              <button
                onClick={() => handleDelete(photo.id)}
                disabled={deleting === photo.id}
                style={{
                  position: "absolute",
                  top: "6px",
                  right: "6px",
                  width: "26px",
                  height: "26px",
                  borderRadius: "6px",
                  background: "rgba(220,38,38,0.9)",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                }}
              >
                {deleting === photo.id ? (
                  <span style={{ fontSize: "9px" }}>...</span>
                ) : (
                  <Trash2 size={12} />
                )}
              </button>
            </div>

            {/* Caption */}
            <div style={{ padding: "8px" }}>
              {editId === photo.id ? (
                <div style={{ display: "flex", gap: "4px" }}>
                  <input
                    type="text"
                    value={editCaption}
                    onChange={(e) => setEditCaption(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "4px 6px",
                      borderRadius: "5px",
                      border: "1px solid var(--color-ink-5)",
                      fontSize: "11.5px",
                      outline: "none",
                    }}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveCaption(photo.id);
                      if (e.key === "Escape") setEditId(null);
                    }}
                  />
                  <button
                    onClick={() => handleSaveCaption(photo.id)}
                    style={{
                      background: "var(--color-forest-700)",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      padding: "4px 6px",
                      color: "#fff",
                    }}
                  >
                    <Check size={11} />
                  </button>
                  <button
                    onClick={() => setEditId(null)}
                    style={{
                      background: "var(--color-ink-6)",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      padding: "4px 6px",
                      color: "var(--color-ink-3)",
                    }}
                  >
                    <X size={11} />
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setEditId(photo.id);
                    setEditCaption(photo.caption ?? "");
                  }}
                >
                  <span
                    style={{
                      fontSize: "11.5px",
                      color: photo.caption
                        ? "var(--color-ink-2)"
                        : "var(--color-ink-5)",
                      fontStyle: photo.caption ? "normal" : "italic",
                      flex: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {photo.caption ?? "Tambah caption..."}
                  </span>
                  <Edit2
                    size={10}
                    style={{ color: "var(--color-ink-4)", flexShrink: 0 }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
