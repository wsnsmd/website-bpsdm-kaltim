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
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "4px",
            }}
          >
            <Link
              href="/admin/galeri"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "13px",
                color: "var(--color-ink-4)",
                textDecoration: "none",
              }}
            >
              <ArrowLeft size={13} /> Galeri
            </Link>
            <span style={{ color: "var(--color-ink-5)" }}>/</span>
            <span
              style={{
                fontSize: "13px",
                color: "var(--color-ink-2)",
                fontWeight: 600,
              }}
            >
              {album.title}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "22px",
                fontWeight: 700,
                color: "var(--color-ink)",
                margin: 0,
              }}
            >
              {album.title}
            </h1>
            <span
              style={{
                padding: "3px 10px",
                borderRadius: "20px",
                fontSize: "11.5px",
                fontWeight: 700,
                background: isPhoto ? "#eff6ff" : "#fef2f2",
                color: isPhoto ? "#1d4ed8" : "#dc2626",
              }}
            >
              {isPhoto ? `${photos.length} Foto` : `${videos.length} Video`}
            </span>
            <span
              className={`status-pill ${album.isPublished ? "status-pill-published" : "status-pill-draft"}`}
            >
              {album.isPublished ? "Terbit" : "Draft"}
            </span>
          </div>
        </div>
        <Link href={`/admin/galeri/${nid}/edit`} className="admin-btn-cancel">
          Edit Album
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: "20px",
          alignItems: "start",
        }}
      >
        {/* Kiri — konten album */}
        <div>
          {isPhoto ? (
            <PhotoGrid photos={photos} albumId={nid} />
          ) : (
            <VideoList videos={videos} albumId={nid} />
          )}
        </div>

        {/* Kanan — form tambah */}
        <div style={{ position: "sticky", top: "80px" }}>
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
