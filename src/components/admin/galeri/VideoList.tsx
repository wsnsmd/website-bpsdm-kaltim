// src/components/admin/galeri/VideoList.tsx
"use client";

import { useState } from "react";
import { deleteVideo } from "@/lib/actions/gallery";
import { Trash2, Play, ExternalLink } from "lucide-react";
import type { GalleryVideo } from "@/lib/queries/gallery";
import { extractYoutubeId, getYoutubeThumbnail } from "@/lib/utils/gallery";
import Link from "next/link";

type Props = { videos: GalleryVideo[]; albumId: number };

export function VideoList({ videos, albumId }: Props) {
  const [deleting, setDeleting] = useState<number | null>(null);

  async function handleDelete(id: number) {
    setDeleting(id);
    await deleteVideo(id);
    setDeleting(null);
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

          return (
            <div
              key={video.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                borderBottom:
                  i < videos.length - 1
                    ? "1px solid var(--color-ink-7)"
                    : "none",
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
                {/* Source badge */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "3px",
                    right: "3px",
                    padding: "1px 5px",
                    borderRadius: "4px",
                    background:
                      video.sourceType === "youtube" ? "#ff0000" : "#e1306c",
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
                    <ExternalLink size={11} />
                    Buka sumber
                  </Link>
                </div>
              </div>

              {/* Hapus */}
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
                  flexShrink: 0,
                }}
              >
                {deleting === video.id ? (
                  <span style={{ fontSize: "9px" }}>...</span>
                ) : (
                  <Trash2 size={13} />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
