// src/components/admin/dokumen/CategoryForm.tsx
"use client";

import { useState, useTransition } from "react";
import {
  createDocumentCategory,
  updateDocumentCategory,
} from "@/lib/actions/documents";

const ICON_OPTIONS = [
  { value: "BarChart2", label: "📊 Grafik Batang" },
  { value: "FileCheck", label: "✅ File Check" },
  { value: "Scale", label: "⚖️ Skala / Hukum" },
  { value: "BookOpen", label: "📖 Buku Terbuka" },
  { value: "ClipboardList", label: "📋 Formulir" },
  { value: "Book", label: "📚 Buku" },
  { value: "Megaphone", label: "📢 Pengumuman" },
  { value: "Wallet", label: "💼 Anggaran" },
  { value: "FileText", label: "📄 Dokumen" },
  { value: "Folder", label: "📁 Folder" },
  { value: "Archive", label: "🗄️ Arsip" },
  { value: "Download", label: "⬇️ Unduhan" },
];

type CatData = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  sortOrder: number | null;
  isActive: boolean | null;
};

type Props = { category?: CatData };

export function CategoryForm({ category }: Props) {
  const isEdit = !!category;
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(category?.isActive ?? true);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("isActive", isActive ? "true" : "false");

    startTransition(async () => {
      const result = isEdit
        ? await updateDocumentCategory(category.id, formData)
        : await createDocumentCategory(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "560px" }}>
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
                placeholder="Contoh: Laporan Kinerja"
                defaultValue={category?.name ?? ""}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label" htmlFor="slug">
                Slug URL
              </label>
              <input
                id="slug"
                name="slug"
                type="text"
                className="admin-input"
                placeholder="laporan-kinerja"
                defaultValue={category?.slug ?? ""}
              />
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
                placeholder="Deskripsi singkat kategori..."
                defaultValue={category?.description ?? ""}
                rows={2}
              />
            </div>

            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label className="admin-label" htmlFor="icon">
                  Icon
                </label>
                <select
                  id="icon"
                  name="icon"
                  className="admin-select"
                  defaultValue={category?.icon ?? ""}
                >
                  <option value="">— Pilih Icon —</option>
                  {ICON_OPTIONS.map((i) => (
                    <option key={i.value} value={i.value}>
                      {i.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-label" htmlFor="color">
                  Warna Aksen
                </label>
                <div
                  style={{ display: "flex", gap: "8px", alignItems: "center" }}
                >
                  <input
                    id="color"
                    name="color"
                    type="color"
                    defaultValue={category?.color ?? "#0e3d20"}
                    style={{
                      width: "44px",
                      height: "34px",
                      borderRadius: "7px",
                      border: "1px solid var(--color-ink-6)",
                      cursor: "pointer",
                      padding: "2px",
                    }}
                  />
                  <span className="admin-hint">
                    Warna untuk ikon dan badge.
                  </span>
                </div>
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label" htmlFor="sortOrder">
                Urutan Tampil
              </label>
              <input
                id="sortOrder"
                name="sortOrder"
                type="number"
                min="0"
                className="admin-input"
                style={{ maxWidth: "120px" }}
                defaultValue={category?.sortOrder ?? 0}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                style={{ width: "16px", height: "16px", cursor: "pointer" }}
              />
              <label
                htmlFor="isActive"
                className="admin-label"
                style={{ margin: 0, cursor: "pointer", fontWeight: 500 }}
              >
                Kategori aktif
              </label>
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
