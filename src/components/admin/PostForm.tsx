// src/components/admin/PostForm.tsx
"use client";

import { useState, useTransition } from "react";
import type { CategoryItem } from "@/lib/queries/categories";
import { createPost, updatePost } from "@/lib/actions/posts";
import { createSlug } from "@/lib/utils";
import { FeaturedImagePicker } from "./FeaturedImagePicker";
import { RichEditor } from "./editor/RichEditor";

type Props = {
  categories: CategoryItem[];
  post?: {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    categoryId: number | null;
    status: string;
    isFeatured: boolean | null;
    authorName: string | null;
    featuredImage: string | null;
    metaTitle: string | null;
    metaDescription: string | null;
  };
};

export function PostForm({ categories, post }: Props) {
  const isEdit = !!post;
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // State untuk slug
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(isEdit);

  // State untuk gambar — dikelola di sini, bukan di hidden input
  const [featuredImage, setFeaturedImage] = useState(post?.featuredImage ?? "");
  const [content, setContent] = useState(post?.content ?? "");

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!slugEdited) setSlug(createSlug(val));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    formData.set("featuredImage", featuredImage);
    formData.set("content", content);

    startTransition(async () => {
      const result = isEdit
        ? await updatePost(post.id, formData)
        : await createPost(formData);

      if (result?.error) setError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="login-error mb-5">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="shrink-0"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      {/* Pembungkus Grid Responsif: 1 Kolom di HP, 2 Kolom di Layar Lebar (lg) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
        {/* ── Kolom Utama (Main Column) ── */}
        <div className="flex flex-col gap-5">
          {/* Judul & Slug */}
          <div className="admin-card">
            <div className="admin-card-body">
              <div className="admin-form-group">
                <label className="admin-label admin-label-req" htmlFor="title">
                  Judul Berita
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  className="admin-input text-base font-semibold p-3"
                  placeholder="Tulis judul berita yang menarik..."
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                />
              </div>

              <div className="admin-form-group mt-3">
                <label className="admin-label" htmlFor="slug">
                  Slug URL
                </label>
                <div className="flex items-center gap-2 max-sm:flex-col max-sm:items-start max-sm:gap-1.5">
                  <span className="text-[13px] text-[var(--color-ink-4)] shrink-0">
                    /berita/
                  </span>
                  <input
                    id="slug"
                    name="slug"
                    type="text"
                    className="admin-input"
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value);
                      setSlugEdited(true);
                    }}
                    placeholder="slug-artikel"
                  />
                </div>
                <span className="admin-hint mt-1">
                  Otomatis dibuat dari judul. Edit jika diperlukan.
                </span>
              </div>
            </div>
          </div>

          {/* Gambar Utama */}
          <div className="admin-card">
            <div className="admin-card-head">
              <div className="admin-card-title">Gambar Utama</div>
            </div>
            <div className="admin-card-body">
              <FeaturedImagePicker
                value={featuredImage}
                onImageChange={setFeaturedImage}
              />
              {featuredImage && (
                <div className="mt-2 text-[11px] text-[var(--color-ink-4)] flex items-center gap-1.5 break-all">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="text-[var(--color-forest-700)] shrink-0"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {featuredImage}
                </div>
              )}
            </div>
          </div>

          {/* Excerpt */}
          <div className="admin-card">
            <div className="admin-card-head">
              <div className="admin-card-title">Ringkasan</div>
            </div>
            <div className="admin-card-body">
              <div className="admin-form-group">
                <textarea
                  name="excerpt"
                  className="admin-textarea"
                  placeholder="Tulis ringkasan singkat artikel (1-2 kalimat)..."
                  defaultValue={post?.excerpt ?? ""}
                  rows={3}
                />
                <span className="admin-hint">
                  Ditampilkan di listing berita dan preview media sosial.
                </span>
              </div>
            </div>
          </div>

          {/* Konten */}
          <div className="admin-card">
            <div className="admin-card-head">
              <div className="admin-card-title">Konten Artikel</div>
            </div>
            <div className="admin-card-body p-0">
              <RichEditor
                value={content}
                onChange={setContent}
                placeholder="Tulis konten artikel di sini..."
              />
            </div>
          </div>

          {/* SEO */}
          <div className="admin-card">
            <div className="admin-card-head">
              <div className="admin-card-title">SEO &amp; Meta</div>
            </div>
            <div className="admin-card-body">
              <div className="admin-form gap-4">
                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="metaTitle">
                    Meta Title
                  </label>
                  <input
                    id="metaTitle"
                    name="metaTitle"
                    type="text"
                    className="admin-input"
                    placeholder="Judul untuk mesin pencari (kosongkan = gunakan judul artikel)"
                    defaultValue={post?.metaTitle ?? ""}
                    maxLength={60}
                  />
                  <span className="admin-hint">Maksimal 60 karakter.</span>
                </div>
                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="metaDescription">
                    Meta Description
                  </label>
                  <textarea
                    id="metaDescription"
                    name="metaDescription"
                    className="admin-textarea"
                    placeholder="Deskripsi untuk mesin pencari..."
                    defaultValue={post?.metaDescription ?? ""}
                    rows={2}
                    maxLength={160}
                  />
                  <span className="admin-hint">Maksimal 160 karakter.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Kolom Sidebar (Akan turun ke bawah secara otomatis di HP) ── */}
        <div className="flex flex-col gap-5 lg:sticky lg:top-20 order-first lg:order-last mb-6 lg:mb-0">
          {/* Publikasi */}
          <div className="admin-card">
            <div className="admin-card-head">
              <div className="admin-card-title">Publikasi</div>
            </div>
            <div className="admin-card-body">
              <div className="admin-form-group mb-4">
                <label className="admin-label" htmlFor="status">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  className="admin-select"
                  defaultValue={post?.status ?? "draft"}
                >
                  <option value="draft">Draft</option>
                  <option value="review">Menunggu Review</option>
                  <option value="published">Terbitkan</option>
                  <option value="archived">Arsip</option>
                </select>
              </div>

              <div className="admin-form-group mb-4">
                <label className="admin-label" htmlFor="authorName">
                  Penulis
                </label>
                <input
                  id="authorName"
                  name="authorName"
                  type="text"
                  className="admin-input"
                  placeholder="Nama penulis"
                  defaultValue={post?.authorName ?? "Humas BPSDM Kaltim"}
                />
              </div>

              <div className="flex items-center gap-2.5 mb-5">
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  value="true"
                  defaultChecked={post?.isFeatured ?? false}
                  className="w-4 h-4 cursor-pointer accent-[var(--color-forest-700)] shrink-0"
                />
                <label
                  htmlFor="isFeatured"
                  className="admin-label !m-0 cursor-pointer font-medium"
                >
                  Jadikan berita unggulan
                </label>
              </div>

              <button
                type="submit"
                className="admin-btn-save w-full justify-center"
                disabled={isPending}
              >
                {isPending ? (
                  "Menyimpan..."
                ) : (
                  <>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                      <polyline points="17 21 17 13 7 13 7 21" />
                      <polyline points="7 3 7 8 15 8" />
                    </svg>
                    {isEdit ? "Simpan Perubahan" : "Simpan Artikel"}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Kategori */}
          <div className="admin-card">
            <div className="admin-card-head">
              <div className="admin-card-title">Kategori</div>
            </div>
            <div className="admin-card-body">
              <select
                name="categoryId"
                className="admin-select"
                defaultValue={post?.categoryId ?? ""}
              >
                <option value="">— Pilih kategori —</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
