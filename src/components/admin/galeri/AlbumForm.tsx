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
      {error && <div className="login-error mb-4">{error}</div>}

      <div className="admin-card">
        <div className="admin-card-head">
          <div className="admin-card-title">
            {isEdit ? "Edit Album" : "Tambah Album Baru"}
          </div>
        </div>
        <div className="admin-card-body">
          {/* Pembungkus Grid Responsif: 1 Kolom di HP, 2 Kolom di Desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
            {/* ── Kolom Kiri — Data Utama ── */}
            <div className="admin-form gap-4">
              <div className="admin-form-group">
                <label className="admin-label admin-label-req" htmlFor="title">
                  Judul Album
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  className="admin-input py-2.5 font-medium"
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
                <div className="flex gap-2 max-sm:flex-col">
                  <input
                    id="slug"
                    name="slug"
                    type="text"
                    className="admin-input flex-1"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="otomatis-dari-judul"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const titleEl = document.getElementById(
                        "title",
                      ) as HTMLInputElement;
                      if (titleEl?.value) setSlug(toSlug(titleEl.value));
                    }}
                    className="px-4 py-2 max-sm:py-2.5 rounded-lg border border-[var(--color-ink-5)] bg-white text-xs font-semibold text-[var(--color-ink-3)] cursor-pointer whitespace-nowrap shrink-0 transition-all hover:border-[var(--color-ink-4)] hover:bg-[var(--color-ink-8)] hover:text-[var(--color-ink)]"
                  >
                    ↺ Generate
                  </button>
                </div>
                <span className="admin-hint mt-0.5">
                  {slug ? (
                    <>
                      URL:{" "}
                      <code className="text-[11.5px] font-mono text-[var(--color-forest-700)] bg-[var(--color-forest-50)] px-1.5 py-0.5 rounded">
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

              <label className="flex items-center gap-2.5 cursor-pointer mt-1">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="w-4 h-4 cursor-pointer accent-[var(--color-forest-700)] shrink-0"
                />
                <span className="admin-label !m-0 font-medium">
                  Tampilkan di halaman publik
                </span>
              </label>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="admin-btn-save max-sm:w-full max-sm:justify-center"
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

            {/* ── Kolom Kanan — Cover Image ── */}
            <div className="flex flex-col gap-4">
              <div className="admin-form-group !m-0">
                <label className="admin-label">Cover Album</label>
                <FeaturedImagePicker
                  value={cover}
                  onImageChange={setCover}
                  name="coverImage"
                />
              </div>

              {/* Preview info */}
              <div className="p-3.5 rounded-[10px] bg-[var(--color-ink-8)] border border-[var(--color-ink-6)] text-[12.5px] text-[var(--color-ink-4)] leading-relaxed">
                <div className="font-semibold text-[var(--color-ink-3)] mb-1">
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
