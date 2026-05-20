// src/app/admin/galeri/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { db, eq, count, desc } from "@/db";
import { galleryAlbums, galleryPhotos, galleryVideos } from "@/db/schema";
import {
  Plus,
  Image as ImageIcon,
  Video,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { DeleteAlbumButton } from "@/components/admin/galeri/DeleteAlbumButton";

export const metadata: Metadata = { title: "Manajemen Galeri" };

export default async function AdminGaleriPage() {
  const albums = await db
    .select()
    .from(galleryAlbums)
    .orderBy(desc(galleryAlbums.createdAt));

  // Count foto & video per album
  const [photoCounts, videoCounts] = await Promise.all([
    db
      .select({
        albumId: galleryPhotos.albumId,
        total: count(),
      })
      .from(galleryPhotos)
      .groupBy(galleryPhotos.albumId),
    db
      .select({
        albumId: galleryVideos.albumId,
        total: count(),
      })
      .from(galleryVideos)
      .groupBy(galleryVideos.albumId),
  ]);

  const photoMap = Object.fromEntries(
    photoCounts.map((r) => [r.albumId, r.total]),
  );
  const videoMap = Object.fromEntries(
    videoCounts.map((r) => [r.albumId, r.total]),
  );
  const totalPhoto = photoCounts.reduce((s, r) => s + r.total, 0);
  const totalVideo = videoCounts.reduce((s, r) => s + r.total, 0);

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Manajemen Galeri</h1>
          <p className="admin-page-sub">
            Kelola album foto dan video BPSDM Kaltim.
          </p>
        </div>
        <Link href="/admin/galeri/baru" className="admin-btn-save">
          <Plus size={15} /> Tambah Album
        </Link>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        {[
          {
            label: "Total Album",
            value: albums.length,
            color: "var(--color-forest-700)",
            bg: "var(--color-forest-50)",
            icon: ImageIcon,
          },
          {
            label: "Total Foto",
            value: totalPhoto,
            color: "#1d4ed8",
            bg: "#eff6ff",
            icon: ImageIcon,
          },
          {
            label: "Total Video",
            value: totalVideo,
            color: "#dc2626",
            bg: "#fef2f2",
            icon: Video,
          },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "16px 20px",
              borderRadius: "12px",
              background: "#fff",
              border: "1px solid var(--color-ink-6)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "11px",
                background: s.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <s.icon size={20} style={{ color: s.color }} />
            </div>
            <div>
              <div
                style={{
                  fontSize: "26px",
                  fontWeight: 900,
                  color: s.color,
                  lineHeight: 1,
                  letterSpacing: "-0.5px",
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--color-ink-4)",
                  marginTop: "3px",
                }}
              >
                {s.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabel album */}
      <div className="admin-card">
        <div className="admin-card-head">
          <div className="admin-card-title">
            <ImageIcon size={15} /> Daftar Album
          </div>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "64px" }}>Cover</th>
                <th>Judul Album</th>
                <th style={{ width: "80px", textAlign: "center" }}>Tipe</th>
                <th style={{ width: "70px", textAlign: "center" }}>Isi</th>
                <th style={{ width: "70px", textAlign: "center" }}>Status</th>
                <th style={{ width: "140px" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {albums.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "var(--color-ink-4)",
                    }}
                  >
                    Belum ada album.
                  </td>
                </tr>
              )}
              {albums.map((album) => {
                const isPhoto = album.type === "photo";
                const cnt = isPhoto
                  ? (photoMap[album.id] ?? 0)
                  : (videoMap[album.id] ?? 0);

                return (
                  <tr key={album.id}>
                    {/* Cover */}
                    <td>
                      <div
                        style={{
                          width: "48px",
                          height: "36px",
                          borderRadius: "6px",
                          overflow: "hidden",
                          background: "var(--color-ink-7)",
                          flexShrink: 0,
                        }}
                      >
                        {album.coverImage ? (
                          <img
                            src={album.coverImage}
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
                            {isPhoto ? (
                              <ImageIcon
                                size={14}
                                style={{ color: "var(--color-ink-4)" }}
                              />
                            ) : (
                              <Video
                                size={14}
                                style={{ color: "var(--color-ink-4)" }}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Judul */}
                    <td>
                      <div style={{ fontWeight: 600, fontSize: "13px" }}>
                        {album.title}
                      </div>
                      <div
                        style={{
                          fontSize: "11.5px",
                          color: "var(--color-ink-4)",
                        }}
                      >
                        /{album.slug}
                      </div>
                    </td>

                    {/* Tipe */}
                    <td style={{ textAlign: "center" }}>
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
                        {isPhoto ? "Foto" : "Video"}
                      </span>
                    </td>

                    {/* Jumlah */}
                    <td style={{ textAlign: "center" }}>
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "var(--color-ink-2)",
                        }}
                      >
                        {cnt}
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          color: "var(--color-ink-4)",
                          marginLeft: "2px",
                        }}
                      >
                        {isPhoto ? "foto" : "video"}
                      </span>
                    </td>

                    {/* Status */}
                    <td style={{ textAlign: "center" }}>
                      <span
                        className={`status-pill ${album.isPublished ? "status-pill-published" : "status-pill-draft"}`}
                      >
                        {album.isPublished ? "Terbit" : "Draft"}
                      </span>
                    </td>

                    {/* Aksi */}
                    <td>
                      <div className="admin-table-actions">
                        <Link
                          href={`/admin/galeri/${album.id}`}
                          className="admin-table-btn admin-table-btn-view"
                        >
                          <Eye size={13} /> Kelola
                        </Link>
                        <Link
                          href={`/admin/galeri/${album.id}/edit`}
                          className="admin-table-btn admin-table-btn-edit"
                        >
                          <Edit size={13} />
                        </Link>
                        <DeleteAlbumButton id={album.id} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
