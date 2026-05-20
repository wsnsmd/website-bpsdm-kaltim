// src/components/galeri/GaleriVideos.tsx
import Link from "next/link";
import { Play } from "lucide-react";
import { FaYoutube, FaInstagram } from "react-icons/fa";
import type { GalleryAlbum, GalleryVideo } from "@/lib/queries/gallery";
import { extractYoutubeId, getYoutubeThumbnail } from "@/lib/utils/gallery";
import { VideoPlayer } from "@/components/galeri/VideoPlayer";

type Props = {
  videos: GalleryVideo[];
  albums: GalleryAlbum[];
};

export function GaleriVideos({ videos, albums }: Props) {
  if (videos.length === 0) {
    return (
      <div
        style={{
          padding: "60px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
          background: "#fff",
          borderRadius: "14px",
          border: "1px solid var(--color-ink-6)",
        }}
      >
        <Play size={40} style={{ color: "var(--color-ink-5)" }} />
        <div
          style={{
            fontSize: "15px",
            fontWeight: 700,
            color: "var(--color-ink-3)",
          }}
        >
          Belum ada video
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Album video */}
      {albums.length > 0 && (
        <div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "16px",
              fontWeight: 700,
              color: "var(--color-ink)",
              marginBottom: "14px",
            }}
          >
            Album Video
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "12px",
            }}
          >
            {albums.map((album) => (
              <Link
                key={album.id}
                href={`/galeri/album/${album.slug}`}
                style={{
                  borderRadius: "12px",
                  overflow: "hidden",
                  textDecoration: "none",
                  background: "#fff",
                  border: "1px solid var(--color-ink-6)",
                  transition: "all 0.2s",
                }}
                className="album-card"
              >
                <div
                  style={{
                    position: "relative",
                    height: "140px",
                    background: "#0f0f0f",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {album.coverImage ? (
                    <img
                      src={album.coverImage}
                      alt={album.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <Play size={36} color="rgba(255,255,255,0.3)" />
                  )}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(0,0,0,0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.9)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Play
                        size={18}
                        style={{ color: "#0f0f0f", marginLeft: "2px" }}
                      />
                    </div>
                  </div>
                </div>
                <div style={{ padding: "10px 12px" }}>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "var(--color-ink)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {album.title}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Grid video */}
      <div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "16px",
            fontWeight: 700,
            color: "var(--color-ink)",
            marginBottom: "14px",
          }}
        >
          Semua Video
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
          }}
        >
          {videos.map((video) => {
            const ytId =
              video.sourceType === "youtube"
                ? (video.videoId ?? extractYoutubeId(video.sourceUrl))
                : null;
            const thumb =
              video.thumbUrl ?? (ytId ? getYoutubeThumbnail(ytId) : null);

            return (
              <VideoPlayer
                key={video.id}
                video={video}
                thumb={thumb}
                ytId={ytId}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
