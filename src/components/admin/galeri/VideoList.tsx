// src/components/admin/galeri/VideoList.tsx
"use client";

import { useState } from "react";
import { deleteVideo, updateVideo } from "@/lib/actions/gallery";
import { Trash2, Play, ExternalLink, Pencil, X, Save } from "lucide-react";
import type { GalleryVideo } from "@/lib/queries/gallery";
import { extractYoutubeId, getYoutubeThumbnail } from "@/lib/utils/gallery";
import Link from "next/link";

type Props = { videos: GalleryVideo[]; albumId: number };

type EditState = {
  title: string;
  sourceUrl: string;
  description: string;
  duration: string;
};

export function VideoList({ videos, albumId }: Props) {
  const [deleting, setDeleting] = useState<number | null>(null);
  const [editing, setEditing] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState<EditState>({
    title: "",
    sourceUrl: "",
    description: "",
    duration: "",
  });

  async function handleDelete(id: number) {
    if (!confirm("Hapus video ini?")) return;
    setDeleting(id);
    await deleteVideo(id);
    setDeleting(null);
  }

  function startEdit(video: GalleryVideo) {
    setEditing(video.id);
    setEditForm({
      title: video.title,
      sourceUrl: video.sourceUrl,
      description: video.description ?? "",
      duration: video.duration ?? "",
    });
  }

  function cancelEdit() {
    setEditing(null);
  }

  async function handleSave(id: number) {
    setSaving(true);
    await updateVideo(id, editForm);
    setSaving(false);
    setEditing(null);
  }

  if (videos.length === 0) {
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
          <Play size={32} style={{ opacity: 0.3 }} />
          <div
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--color-ink-3)",
            }}
          >
            Belum ada video
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-card">
      <div className="admin-card-head">
        <div className="admin-card-title">
          Video dalam Album
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
            {videos.length}
          </span>
        </div>
      </div>

      <div>
        {videos.map((video, i) => {
          const ytId =
            video.sourceType === "youtube"
              ? (video.videoId ?? extractYoutubeId(video.sourceUrl))
              : null;
          const thumb =
            video.thumbUrl ?? (ytId ? getYoutubeThumbnail(ytId) : null);
          const isEditingThis = editing === video.id;

          return (
            <div
              key={video.id}
              style={{
                borderBottom:
                  i < videos.length - 1
                    ? "1px solid var(--color-ink-7)"
                    : "none",
              }}
            >
              {/* ── View mode ── */}
              {!isEditingThis && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 16px",
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    style={{
                      width: "80px",
                      height: "52px",
                      borderRadius: "7px",
                      overflow: "hidden",
                      background: "#0f0f0f",
                      flexShrink: 0,
                      position: "relative",
                    }}
                  >
                    {thumb ? (
                      <img
                        src={thumb}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Play size={20} color="rgba(255,255,255,0.3)" />
                      </div>
                    )}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(0,0,0,0.3)",
                      }}
                    >
                      <Play size={14} color="#fff" />
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        bottom: "3px",
                        right: "3px",
                        padding: "1px 5px",
                        borderRadius: "4px",
                        background:
                          video.sourceType === "youtube"
                            ? "#ff0000"
                            : "#e1306c",
                        fontSize: "8px",
                        fontWeight: 800,
                        color: "#fff",
                      }}
                    >
                      {video.sourceType === "youtube" ? "YT" : "IG"}
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "13.5px",
                        fontWeight: 600,
                        color: "var(--color-ink)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        marginBottom: "3px",
                      }}
                    >
                      {video.title}
                    </div>
                    {video.description && (
                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--color-ink-4)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          marginBottom: "3px",
                        }}
                      >
                        {video.description}
                      </div>
                    )}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      {video.duration && (
                        <span
                          style={{
                            fontSize: "11.5px",
                            color: "var(--color-ink-4)",
                          }}
                        >
                          {video.duration}
                        </span>
                      )}
                      <Link
                        href={video.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "3px",
                          fontSize: "11.5px",
                          color: "var(--color-forest-700)",
                          textDecoration: "none",
                        }}
                      >
                        <ExternalLink size={11} /> Buka sumber
                      </Link>
                    </div>
                  </div>

                  {/* Aksi */}
                  <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                    <button
                      onClick={() => startEdit(video)}
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "7px",
                        background: "var(--color-forest-50)",
                        border: "1px solid var(--color-forest-200)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--color-forest-700)",
                      }}
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(video.id)}
                      disabled={deleting === video.id}
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "7px",
                        background: "#fef2f2",
                        border: "1px solid #fecaca",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#dc2626",
                      }}
                    >
                      {deleting === video.id ? (
                        <span style={{ fontSize: "9px" }}>...</span>
                      ) : (
                        <Trash2 size={13} />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* ── Edit mode ── */}
              {isEditingThis && (
                <div
                  style={{
                    padding: "14px 16px",
                    background: "var(--color-forest-50)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "var(--color-forest-700)",
                      marginBottom: "12px",
                    }}
                  >
                    Edit Video
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    {/* Title */}
                    <div className="admin-form-group">
                      <label className="admin-label">Judul</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={editForm.title}
                        onChange={(e) =>
                          setEditForm((p) => ({ ...p, title: e.target.value }))
                        }
                        placeholder="Judul video"
                      />
                    </div>

                    {/* Source URL */}
                    <div className="admin-form-group">
                      <label className="admin-label">URL Video</label>
                      <input
                        type="url"
                        className="admin-input"
                        value={editForm.sourceUrl}
                        onChange={(e) =>
                          setEditForm((p) => ({
                            ...p,
                            sourceUrl: e.target.value,
                          }))
                        }
                        placeholder="https://youtube.com/watch?v=..."
                      />
                    </div>

                    {/* Description */}
                    <div className="admin-form-group">
                      <label className="admin-label">Deskripsi</label>
                      <textarea
                        className="admin-textarea"
                        rows={2}
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm((p) => ({
                            ...p,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Deskripsi video (opsional)"
                      />
                    </div>

                    {/* Duration */}
                    <div className="admin-form-group">
                      <label className="admin-label">Durasi</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={editForm.duration}
                        onChange={(e) =>
                          setEditForm((p) => ({
                            ...p,
                            duration: e.target.value,
                          }))
                        }
                        placeholder="Contoh: 5:30"
                        style={{ maxWidth: "140px" }}
                      />
                    </div>

                    {/* Actions */}
                    <div
                      style={{ display: "flex", gap: "8px", marginTop: "4px" }}
                    >
                      <button
                        onClick={() => handleSave(video.id)}
                        disabled={saving}
                        className="admin-btn-save"
                        style={{ padding: "7px 16px" }}
                      >
                        <Save size={13} />
                        {saving ? "Menyimpan..." : "Simpan"}
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="admin-btn-cancel"
                        style={{ padding: "7px 14px" }}
                      >
                        <X size={13} /> Batal
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
