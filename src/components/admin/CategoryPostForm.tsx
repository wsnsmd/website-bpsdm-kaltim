// src/components/admin/CategoryPostForm.tsx
"use client";

import { useState, useTransition } from "react";
import { createCategory, updateCategory } from "@/lib/actions/posts";

type CatData = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
};

type Props = { category?: CatData };

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function CategoryPostForm({ category }: Props) {
  const isEdit = !!category;
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(isEdit);

  function handleNameChange(val: string) {
    setName(val);
    if (!slugEdited) setSlug(toSlug(val));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = isEdit
        ? await updateCategory(category.id, formData)
        : await createCategory(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "520px" }}>
      {error && (
        <div className="login-error" style={{ marginBottom: "20px" }}>
          {error}
        </div>
      )}

      <div className="admin-card">
        <div className="admin-card-head">
          <div className="admin-card-title">
            {isEdit ? "Edit Kategori" : "Tambah Kategori"}
          </div>
        </div>
        <div className="admin-card-body">
          <div className="admin-form" style={{ gap: "16px" }}>
            <div className="admin-form-group">
              <label className="admin-label admin-label-req" htmlFor="name">
                Nama Kategori
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="admin-input"
                placeholder="Contoh: Berita Diklat"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label" htmlFor="slug">
                Slug URL
              </label>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    color: "var(--color-ink-4)",
                    flexShrink: 0,
                  }}
                >
                  /berita?kategori=
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
                  placeholder="berita-diklat"
                />
              </div>
              <span className="admin-hint">
                Kosongkan untuk generate otomatis dari nama.
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
                placeholder="Deskripsi singkat kategori ini..."
                defaultValue={category?.description ?? ""}
                rows={3}
              />
            </div>

            <button
              type="submit"
              className="admin-btn-save"
              disabled={isPending}
              style={{ alignSelf: "flex-start" }}
            >
              {isPending
                ? "Menyimpan..."
                : isEdit
                  ? "Simpan Perubahan"
                  : "Tambah Kategori"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
