// src/app/(public)/galeri/album/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { GaleriLightbox } from "@/components/galeri/GaleriLightbox";
import { VideoPlayer } from "@/components/galeri/VideoPlayer";
import {
  getAlbumBySlug,
  getPhotosByAlbum,
  getVideosByAlbum,
  extractYoutubeId,
  getYoutubeThumbnail,
} from "@/lib/queries/gallery";
import { Images, Play, Calendar } from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const album = await getAlbumBySlug(slug);
  if (!album) return {};
  return {
    title: album.title,
    description: album.description ?? undefined,
  };
}

export default async function AlbumDetailPage({ params }: Props) {
  const { slug } = await params;
  const album = await getAlbumBySlug(slug);
  if (!album) notFound();

  const isPhoto = album.type === "photo";

  const [photos, videos] = await Promise.all([
    isPhoto ? getPhotosByAlbum(album.id) : Promise.resolve([]),
    !isPhoto ? getVideosByAlbum(album.id) : Promise.resolve([]),
  ]);

  const itemCount = isPhoto ? photos.length : videos.length;

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Beranda", href: "/" },
          { label: "Galeri", href: "/galeri" },
          { label: album.title },
        ]}
      />

      {/* Hero */}
      <div className="page-hero" style={{ paddingBlock: "2rem 2.5rem" }}>
        <div className="container-content">
          <p className="page-hero-eyebrow">
            {isPhoto ? "Album Foto" : "Album Video"}
          </p>
          <h1 className="page-hero-title" style={{ fontSize: "32px" }}>
            {album.title}
          </h1>
          {album.description && (
            <p className="page-hero-desc" style={{ maxWidth: "540px" }}>
              {album.description}
            </p>
          )}
          <div className="page-hero-stats">
            <div className="page-hero-stat">
              <div className="page-hero-stat-num">{itemCount}</div>
              <div className="page-hero-stat-label">
                {isPhoto ? "Foto" : "Video"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Konten */}
      <div
        style={{ backgroundColor: "var(--color-ink-8)", paddingBlock: "3rem" }}
      >
        <div className="container-content">
          {/* Empty state */}
          {itemCount === 0 && (
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
              {isPhoto ? (
                <Images size={40} style={{ color: "var(--color-ink-5)" }} />
              ) : (
                <Play size={40} style={{ color: "var(--color-ink-5)" }} />
              )}
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "var(--color-ink-3)",
                }}
              >
                Belum ada {isPhoto ? "foto" : "video"}
              </div>
            </div>
          )}

          {/* Masonry foto */}
          {isPhoto && photos.length > 0 && <GaleriLightbox photos={photos} />}

          {/* Grid video */}
          {!isPhoto && videos.length > 0 && (
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
          )}
        </div>
      </div>
    </>
  );
}
