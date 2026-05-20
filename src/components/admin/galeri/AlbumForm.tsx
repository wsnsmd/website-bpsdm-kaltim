// src/components/admin/galeri/AlbumForm.tsx
"use client";

import { useState, useTransition } from "react";
import { createAlbum, updateAlbum } from "@/lib/actions/gallery";
import { FeaturedImagePicker } from "@/components/admin/FeaturedImagePicker";

type AlbumData = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  type: string;
  isPublished: boolean | null;
  sortOrder: number | null;
};

export function AlbumForm({ album }: { album?: AlbumData }) {
  const isEdit = !!album;
  const [isPending, startT] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [cover, setCover] = useState(album?.coverImage ?? "");
  const [published, setPublished] = useState(album?.isPublished ?? true);
  const [slug, setSlug] = useState(album?.slug ?? "");

  function toSlug(str: string): string {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    fd.set("coverImage", cover);
    fd.set("isPublished", published ? "true" : "false");
    fd.set("slug", slug); // ← tambah ini
    startT(async () => {
      const res = isEdit
        ? await updateAlbum(album.id, fd)
        : await createAlbum(fd);
      if (res?.error) setError(res.error);
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div
          style={{
            padding: "10px 14px",
            borderRadius: "8px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#dc2626",
            fontSize: "13px",
            marginBottom: "16px",
          }}
        >
          {error}
        </div>
      )}

      <div className="admin-card">
        <div className="admin-card-head">
          <div className="admin-card-title">
            {isEdit ? "Edit Album" : "Tambah Album Baru"}
          </div>
        </div>
        <div className="admin-card-body">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 320px",
              gap: "24px",
              alignItems: "start",
            }}
          >
            {/* Kolom kiri — data utama */}
            <div className="admin-form" style={{ gap: "14px" }}>
              <div className="admin-form-group">
                <label className="admin-label admin-label-req" htmlFor="title">
                  Judul Album
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  className="admin-input"
                  defaultValue={album?.title ?? ""}
                  required
                  placeholder="Contoh: Diklat Teknis Angkatan I 2025"
                  onChange={(e) => {
                    // Hanya auto-generate jika belum diedit manual
                    // atau saat tambah baru
                    if (!isEdit) {
                      setSlug(toSlug(e.target.value));
                    }
                  }}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label" htmlFor="slug">
                  Slug URL
                </label>
                <div style={{ display: "flex", gap: "6px" }}>
                  <input
                    id="slug"
                    name="slug"
                    type="text"
                    className="admin-input"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="otomatis-dari-judul"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const titleEl = document.getElementById(
                        "title",
                      ) as HTMLInputElement;
                      if (titleEl?.value) setSlug(toSlug(titleEl.value));
                    }}
                    style={{
                      padding: "0 12px",
                      borderRadius: "8px",
                      border: "1px solid var(--color-ink-5)",
                      background: "#fff",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "var(--color-ink-3)",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                      transition: "all 0.12s",
                    }}
                  >
                    ↺ Generate
                  </button>
                </div>
                <span className="admin-hint">
                  {slug ? (
                    <>
                      URL:{" "}
                      <code
                        style={{
                          fontSize: "11px",
                          color: "var(--color-forest-700)",
                        }}
                      >
                        /galeri/album/{slug}
                      </code>
                    </>
                  ) : (
                    "Otomatis dari judul saat disimpan."
                  )}
                </span>
              </div>

              <div className="admin-form-group">
                <label className="admin-label" htmlFor="description">
                  Deskripsi
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="admin-textarea"
                  rows={4}
                  defaultValue={album?.description ?? ""}
                  placeholder="Deskripsi singkat album..."
                />
              </div>

              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label className="admin-label admin-label-req" htmlFor="type">
                    Tipe Album
                  </label>
                  <select
                    id="type"
                    name="type"
                    className="admin-select"
                    defaultValue={album?.type ?? "photo"}
                  >
                    <option value="photo">📷 Album Foto</option>
                    <option value="video">🎬 Album Video</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="sortOrder">
                    Urutan
                  </label>
                  <input
                    id="sortOrder"
                    name="sortOrder"
                    type="number"
                    min="0"
                    className="admin-input"
                    defaultValue={album?.sortOrder ?? 0}
                  />
                </div>
              </div>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  style={{ width: "16px", height: "16px" }}
                />
                <span className="admin-label" style={{ margin: 0 }}>
                  Tampilkan di halaman publik
                </span>
              </label>

              <div style={{ display: "flex", gap: "8px", paddingTop: "4px" }}>
                <button
                  type="submit"
                  className="admin-btn-save"
                  disabled={isPending}
                >
                  {isPending
                    ? "Menyimpan..."
                    : isEdit
                      ? "Simpan Perubahan"
                      : "Buat Album"}
                </button>
              </div>
            </div>

            {/* Kolom kanan — cover image */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Cover Album</label>
                <FeaturedImagePicker
                  value={cover}
                  onImageChange={setCover}
                  name="coverImage"
                />
              </div>

              {/* Preview info */}
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: "10px",
                  background: "var(--color-ink-8)",
                  border: "1px solid var(--color-ink-6)",
                  fontSize: "12.5px",
                  color: "var(--color-ink-4)",
                  lineHeight: 1.6,
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    color: "var(--color-ink-3)",
                    marginBottom: "4px",
                  }}
                >
                  Tips Cover Album
                </div>
                Gunakan gambar landscape dengan rasio 16:9 atau 4:3. Ukuran
                minimal 800×400 piksel untuk tampilan terbaik.
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
