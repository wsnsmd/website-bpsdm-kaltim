// src/app/admin/galeri/[id]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db, eq, asc } from "@/db";
import { galleryAlbums, galleryPhotos, galleryVideos } from "@/db/schema";
import { ArrowLeft, Plus, Image as ImageIcon, Video } from "lucide-react";
import { PhotoGrid } from "@/components/admin/galeri/PhotoGrid";
import { VideoList } from "@/components/admin/galeri/VideoList";
import { AddPhotosForm } from "@/components/admin/galeri/AddPhotosForm";
import { AddVideoForm } from "@/components/admin/galeri/AddVideoForm";

export const metadata: Metadata = { title: "Kelola Album" };

type Props = { params: Promise<{ id: string }> };

export default async function KelolaAlbumPage({ params }: Props) {
  const { id } = await params;
  const nid = Number(id);
  if (isNaN(nid)) notFound();

  const [albumResult, photos, videos] = await Promise.all([
    db.select().from(galleryAlbums).where(eq(galleryAlbums.id, nid)).limit(1),
    db
      .select()
      .from(galleryPhotos)
      .where(eq(galleryPhotos.albumId, nid))
      .orderBy(asc(galleryPhotos.sortOrder), asc(galleryPhotos.createdAt)),
    db
      .select()
      .from(galleryVideos)
      .where(eq(galleryVideos.albumId, nid))
      .orderBy(asc(galleryVideos.sortOrder), asc(galleryVideos.createdAt)),
  ]);

  if (!albumResult[0]) notFound();
  const album = albumResult[0];
  const isPhoto = album.type === "photo";

  return (
    <>
      {/* ── Header ── */}
      <div className="flex max-sm:flex-col max-sm:items-stretch items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Link
              href="/admin/galeri"
              className="flex items-center gap-1 text-[13px] text-[var(--color-ink-4)] no-underline transition-colors hover:text-[var(--color-forest-700)]"
            >
              <ArrowLeft size={13} /> Galeri
            </Link>
            <span className="text-[var(--color-ink-5)] text-xs">/</span>
            <span className="text-[13px] text-[var(--color-ink-2)] font-semibold line-clamp-1">
              {album.title}
            </span>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="font-display text-2xl font-bold text-[var(--color-ink)] m-0">
              {album.title}
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide ${
                isPhoto ? "bg-blue-50 text-blue-700" : "bg-red-50 text-red-600"
              }`}
            >
              {isPhoto ? `${photos.length} Foto` : `${videos.length} Video`}
            </span>
            <span
              className={`status-pill ${
                album.isPublished
                  ? "status-pill-published"
                  : "status-pill-draft"
              }`}
            >
              {album.isPublished ? "Terbit" : "Draft"}
            </span>
          </div>
        </div>

        <Link
          href={`/admin/galeri/${nid}/edit`}
          className="admin-btn-cancel max-sm:w-full max-sm:justify-center shrink-0"
        >
          Edit Album
        </Link>
      </div>

      {/* ── Pembungkus Grid Responsif ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        {/* Kolom Kiri — Konten Album (Foto/Video) */}
        <div className="flex flex-col gap-4">
          {isPhoto ? (
            <PhotoGrid photos={photos} albumId={nid} />
          ) : (
            <VideoList videos={videos} albumId={nid} />
          )}
        </div>

        {/* Kolom Kanan — Form Tambah (Otomatis naik ke atas di layar HP) */}
        <div className="flex flex-col gap-5 lg:sticky lg:top-20 order-first lg:order-last mb-2 lg:mb-0">
          {isPhoto ? (
            <AddPhotosForm albumId={nid} />
          ) : (
            <AddVideoForm albumId={nid} />
          )}
        </div>
      </div>
    </>
  );
}
