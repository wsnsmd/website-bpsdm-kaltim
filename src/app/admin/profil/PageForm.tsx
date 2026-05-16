// src/components/admin/profil/PageForm.tsx
"use client";

import { useState, useTransition } from "react";
import { createPage, updatePage } from "@/lib/actions/pages";
import { RichEditor } from "@/components/admin/editor/RichEditor";

const TEMPLATES = [
  { value: "default", label: "Default" },
  { value: "profil", label: "Profil" },
  { value: "visi-misi", label: "Visi & Misi" },
  { value: "sambutan", label: "Sambutan" },
];

type PageData = {
  id: number;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  template: string | null;
  status: string;
  sortOrder: number | null;
  metaTitle: string | null;
  metaDescription: string | null;
  showInNav: boolean | null;
};

type Props = { page?: PageData };

export function PageForm({ page }: Props) {
  const isEdit = !!page;
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState(page?.content ?? "");
  const [showInNav, setShowInNav] = useState(page?.showInNav ?? false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("content", content);
    formData.set("showInNav", showInNav ? "true" : "false");

    startTransition(async () => {
      const result = isEdit
        ? await updatePage(page.id, formData)
        : await createPage(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="login-error" style={{ marginBottom: "20px" }}>
          {error}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 280px",
          gap: "20px",
          alignItems: "start",
        }}
      >
        {/* ── Main ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Judul & Slug */}
          <div className="admin-card">
            <div className="admin-card-body">
              <div className="admin-form" style={{ gap: "12px" }}>
                <div className="admin-form-group">
                  <label
                    className="admin-label admin-label-req"
                    htmlFor="title"
                  >
                    Judul Halaman
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    className="admin-input"
                    placeholder="Contoh: Visi & Misi BPSDM Kaltim"
                    defaultValue={page?.title ?? ""}
                    required
                    style={{ fontSize: "15px", fontWeight: 600 }}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label admin-label-req" htmlFor="slug">
                    Slug URL
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        color: "var(--color-ink-4)",
                        flexShrink: 0,
                      }}
                    >
                      /
                    </span>
                    <input
                      id="slug"
                      name="slug"
                      type="text"
                      className="admin-input"
                      placeholder="profil/visi-misi"
                      defaultValue={page?.slug ?? ""}
                      required
                    />
                  </div>
                  <span className="admin-hint">
                    Gunakan "/" untuk sub-halaman. Contoh: profil/sejarah
                  </span>
                </div>
                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="excerpt">
                    Ringkasan
                  </label>
                  <textarea
                    id="excerpt"
                    name="excerpt"
                    className="admin-textarea"
                    placeholder="Ringkasan singkat halaman..."
                    defaultValue={page?.excerpt ?? ""}
                    rows={2}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Editor konten */}
          <div className="admin-card">
            <div className="admin-card-head">
              <div className="admin-card-title">Konten Halaman</div>
            </div>
            <div className="admin-card-body" style={{ padding: 0 }}>
              <RichEditor
                value={content}
                onChange={setContent}
                placeholder="Tulis konten halaman di sini..."
                minHeight={320}
              />
            </div>
          </div>

          {/* SEO */}
          <div className="admin-card">
            <div className="admin-card-head">
              <div className="admin-card-title">SEO</div>
            </div>
            <div className="admin-card-body">
              <div className="admin-form" style={{ gap: "12px" }}>
                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="metaTitle">
                    Meta Title
                  </label>
                  <input
                    id="metaTitle"
                    name="metaTitle"
                    type="text"
                    className="admin-input"
                    placeholder="Judul untuk mesin pencari"
                    defaultValue={page?.metaTitle ?? ""}
                    maxLength={60}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="metaDescription">
                    Meta Description
                  </label>
                  <textarea
                    id="metaDescription"
                    name="metaDescription"
                    className="admin-textarea"
                    placeholder="Deskripsi untuk mesin pencari"
                    defaultValue={page?.metaDescription ?? ""}
                    rows={2}
                    maxLength={160}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            position: "sticky",
            top: "80px",
          }}
        >
          <div className="admin-card">
            <div className="admin-card-head">
              <div className="admin-card-title">Publikasi</div>
            </div>
            <div className="admin-card-body">
              <div className="admin-form" style={{ gap: "14px" }}>
                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="status">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="admin-select"
                    defaultValue={page?.status ?? "draft"}
                  >
                    <option value="published">Terbit</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Arsip</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="template">
                    Template
                  </label>
                  <select
                    id="template"
                    name="template"
                    className="admin-select"
                    defaultValue={page?.template ?? "default"}
                  >
                    {TEMPLATES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
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
                    defaultValue={page?.sortOrder ?? 0}
                  />
                </div>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <input
                    type="checkbox"
                    id="showInNav"
                    checked={showInNav}
                    onChange={(e) => setShowInNav(e.target.checked)}
                    style={{ width: "16px", height: "16px", cursor: "pointer" }}
                  />
                  <label
                    htmlFor="showInNav"
                    className="admin-label"
                    style={{ margin: 0, cursor: "pointer", fontWeight: 500 }}
                  >
                    Tampilkan di navigasi
                  </label>
                </div>

                <button
                  type="submit"
                  className="admin-btn-save"
                  disabled={isPending}
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  {isPending
                    ? "Menyimpan..."
                    : isEdit
                      ? "Simpan Perubahan"
                      : "Simpan Halaman"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
