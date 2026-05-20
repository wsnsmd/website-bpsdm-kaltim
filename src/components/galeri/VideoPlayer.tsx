// src/components/galeri/VideoPlayer.tsx
"use client";

import { useState } from "react";
import { Play, Video, Camera } from "lucide-react";
import type { GalleryVideo } from "@/lib/queries/gallery";

type Props = {
  video: GalleryVideo;
  thumb: string | null;
  ytId: string | null;
};

// Badge warna per source
const SOURCE_CONFIG = {
  youtube: { label: "YouTube", color: "#ff0000", Icon: Video },
  instagram: { label: "Instagram", color: "#e1306c", Icon: Camera },
};

export function VideoPlayer({ video, thumb, ytId }: Props) {
  const [playing, setPlaying] = useState(false);

  const embedUrl = ytId
    ? `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`
    : null;

  const src =
    SOURCE_CONFIG[video.sourceType as keyof typeof SOURCE_CONFIG] ??
    SOURCE_CONFIG.youtube;

  return (
    <div
      style={{
        borderRadius: "12px",
        overflow: "hidden",
        background: "#0f0f0f",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
      className="video-card"
    >
      {/* Player area */}
      <div
        style={{
          position: "relative",
          paddingBottom: "56.25%",
          background: "#0f0f0f",
          cursor: playing ? "default" : "pointer",
        }}
        onClick={() => !playing && setPlaying(true)}
      >
        {playing && embedUrl ? (
          <iframe
            src={embedUrl}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              border: "none",
            }}
          />
        ) : (
          <>
            {/* Thumbnail */}
            {thumb ? (
              <img
                src={thumb}
                alt={video.title}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#1a1a1a",
                }}
              >
                <Play size={32} color="rgba(255,255,255,0.2)" />
              </div>
            )}

            {/* Overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.35)",
              }}
            />

            {/* Play button */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  background: src.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
                }}
                className="video-play-btn"
              >
                <Play size={22} color="#fff" style={{ marginLeft: "3px" }} />
              </div>
            </div>

            {/* Source badge */}
            <div
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                padding: "3px 8px",
                borderRadius: "6px",
                background: src.color,
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <src.Icon size={11} color="#fff" />
              <span
                style={{ fontSize: "10px", fontWeight: 700, color: "#fff" }}
              >
                {src.label}
              </span>
            </div>

            {/* Duration */}
            {video.duration && (
              <div
                style={{
                  position: "absolute",
                  bottom: "8px",
                  right: "8px",
                  padding: "2px 8px",
                  borderRadius: "5px",
                  background: "rgba(0,0,0,0.75)",
                  fontSize: "11.5px",
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {video.duration}
              </div>
            )}
          </>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "12px 14px", background: "#fff" }}>
        <div
          style={{
            fontSize: "13.5px",
            fontWeight: 700,
            color: "var(--color-ink)",
            lineHeight: 1.35,
            marginBottom: "4px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical" as const,
            overflow: "hidden",
          }}
        >
          {video.title}
        </div>
        {video.description && (
          <div
            style={{
              fontSize: "12px",
              color: "var(--color-ink-4)",
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical" as const,
              overflow: "hidden",
            }}
          >
            {video.description}
          </div>
        )}
      </div>
    </div>
  );
}
