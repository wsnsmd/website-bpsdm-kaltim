// src/components/galeri/GaleriPhotos.tsx
import Link from "next/link";
import { Image as ImageIcon, Images } from "lucide-react";
import type { GalleryAlbum, GalleryPhoto } from "@/lib/queries/gallery";
import { GaleriLightbox } from "@/components/galeri/GaleriLightbox";

type Props = {
  photos: GalleryPhoto[];
  albums: GalleryAlbum[];
};

export function GaleriPhotos({ photos, albums }: Props) {
  if (photos.length === 0 && albums.length === 0) {
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
        <ImageIcon size={40} style={{ color: "var(--color-ink-5)" }} />
        <div
          style={{
            fontSize: "15px",
            fontWeight: 700,
            color: "var(--color-ink-3)",
          }}
        >
          Belum ada foto
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Album grid */}
      {albums.length > 0 && (
        <div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "16px",
              fontWeight: 700,
              color: "var(--color-ink)",
              marginBottom: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Images size={16} style={{ color: "var(--color-forest-600)" }} />
            Album Foto
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
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
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}
                className="album-card"
              >
                {/* Cover */}
                <div
                  style={{
                    position: "relative",
                    height: "120px",
                    overflow: "hidden",
                    background: "var(--color-forest-900)",
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
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ImageIcon size={32} color="rgba(255,255,255,0.2)" />
                    </div>
                  )}
                  {/* Overlay */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)",
                    }}
                  />
                </div>
                {/* Info */}
                <div style={{ padding: "10px 12px" }}>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "var(--color-ink)",
                      lineHeight: 1.3,
                      marginBottom: "2px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {album.title}
                  </div>
                  {album.description && (
                    <div
                      style={{
                        fontSize: "11.5px",
                        color: "var(--color-ink-4)",
                        lineHeight: 1.4,
                      }}
                    >
                      {album.description.slice(0, 50)}
                      {album.description.length > 50 ? "..." : ""}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Masonry grid semua foto */}
      {photos.length > 0 && (
        <div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "16px",
              fontWeight: 700,
              color: "var(--color-ink)",
              marginBottom: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <ImageIcon size={16} style={{ color: "var(--color-forest-600)" }} />
            Semua Foto
          </h2>
          <GaleriLightbox photos={photos} />
        </div>
      )}
    </div>
  );
}
