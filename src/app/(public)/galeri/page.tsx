// src/app/(public)/galeri/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { GaleriTabs } from "@/components/galeri/GaleriTabs";
import { GaleriPhotos } from "@/components/galeri/GaleriPhotos";
import { GaleriVideos } from "@/components/galeri/GaleriVideos";
import {
  getGalleryAlbums,
  getAllPhotos,
  getAllVideos,
  getGalleryStats,
} from "@/lib/queries/gallery";

export const metadata: Metadata = {
  title: "Galeri Foto & Video",
  description:
    "Dokumentasi kegiatan dan program BPSDM Provinsi Kalimantan Timur.",
};

export const revalidate = 3600;

type Props = {
  searchParams: Promise<{ tab?: string; album?: string }>;
};

export default async function GaleriPage({ searchParams }: Props) {
  const params = await searchParams;
  const tab = params.tab === "video" ? "video" : "foto";

  const [stats, photoAlbums, videoAlbums, photos, videos] = await Promise.all([
    getGalleryStats(),
    getGalleryAlbums("photo"),
    getGalleryAlbums("video"),
    getAllPhotos(50),
    getAllVideos(24),
  ]);

  return (
    <>
      <Breadcrumb
        items={[{ label: "Beranda", href: "/" }, { label: "Galeri" }]}
      />

      {/* Hero */}
      <div className="page-hero">
        <div className="container-content">
          <p className="page-hero-eyebrow">Dokumentasi Kegiatan</p>
          <h1 className="page-hero-title">Galeri Foto &amp; Video</h1>
          <p className="page-hero-desc">
            Dokumentasi kegiatan, program pelatihan, dan momen penting BPSDM
            Provinsi Kalimantan Timur.
          </p>
          <div className="page-hero-stats">
            <div className="page-hero-stat">
              <div className="page-hero-stat-num">{stats.photos}</div>
              <div className="page-hero-stat-label">Foto</div>
            </div>
            <div className="page-hero-stat">
              <div className="page-hero-stat-num">{stats.videos}</div>
              <div className="page-hero-stat-label">Video</div>
            </div>
            <div className="page-hero-stat">
              <div className="page-hero-stat-num">{stats.albums}</div>
              <div className="page-hero-stat-label">Album</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        style={{ backgroundColor: "var(--color-ink-8)", paddingBlock: "3rem" }}
      >
        <div className="container-content">
          {/* Tab navigasi */}
          <GaleriTabs
            activeTab={tab}
            photoCount={stats.photos}
            videoCount={stats.videos}
          />

          {/* Konten tab */}
          {tab === "foto" ? (
            <GaleriPhotos photos={photos} albums={photoAlbums} />
          ) : (
            <GaleriVideos videos={videos} albums={videoAlbums} />
          )}
        </div>
      </div>
    </>
  );
}
