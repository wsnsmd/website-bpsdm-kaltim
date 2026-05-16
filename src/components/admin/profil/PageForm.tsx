// src/components/admin/profil/PageForm.tsx
"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPage, updatePage } from "@/lib/actions/pages";
import { RichEditor } from "@/components/admin/editor/RichEditor";
import { ArrowLeft, Save, Eye, RefreshCw } from "lucide-react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

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

// Fungsi untuk generate slug dari judul
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function PageForm({ page }: Props) {
  const isEdit = !!page;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [content, setContent] = useState(page?.content ?? "");
  const [showInNav, setShowInNav] = useState(page?.showInNav ?? false);
  const [title, setTitle] = useState(page?.title ?? "");
  const [slug, setSlug] = useState(page?.slug ?? "");
  const [isAutoSlug, setIsAutoSlug] = useState(true);

  // Auto-generate slug ketika title berubah (jika mode auto aktif)
  useEffect(() => {
    if (isAutoSlug && title) {
      setSlug(generateSlug(title));
    }
  }, [title, isAutoSlug]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    formData.set("content", content);
    formData.set("showInNav", showInNav ? "true" : "false");
    formData.set("slug", slug);

    startTransition(async () => {
      try {
        let result;
        if (isEdit) {
          result = await updatePage(page.id, formData);
        } else {
          result = await createPage(formData);
        }

        if (result?.error) {
          toast.error(result.error);
        } else if (result?.success) {
          toast.success(
            isEdit
              ? "Halaman berhasil diperbarui!"
              : "Halaman berhasil dibuat!",
          );
          // Redirect setelah sukses
          setTimeout(() => {
            router.push("/admin/profil/pages");
            router.refresh();
          }, 1500);
        }
      } catch (err) {
        toast.error("Terjadi kesalahan saat menyimpan data");
        console.error(err);
      }
    });
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#111714",
            border: "1px solid #d8e8dc",
            borderRadius: "12px",
            padding: "12px 16px",
            fontSize: "13px",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#fff",
            },
            style: {
              borderLeft: "4px solid #22c55e",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
            style: {
              borderLeft: "4px solid #ef4444",
            },
          },
        }}
      />

      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 280px",
            gap: "20px",
            alignItems: "start",
          }}
        >
          {/* ── Main ── */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {/* Header dengan tombol aksi */}
            <div className="admin-card">
              <div className="admin-card-body">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Link
                      href="/admin/profil/pages"
                      className="admin-btn-cancel"
                    >
                      <ArrowLeft size={16} />
                      Kembali
                    </Link>
                    <h1 className="admin-page-title" style={{ margin: 0 }}>
                      {isEdit ? "Edit Halaman" : "Tambah Halaman Baru"}
                    </h1>
                  </div>
                  <button
                    type="submit"
                    className="admin-btn-save"
                    disabled={isPending}
                  >
                    <Save size={16} />
                    {isPending ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              </div>
            </div>

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
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      style={{ fontSize: "15px", fontWeight: 600 }}
                    />
                  </div>

                  <div className="admin-form-group">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "4px",
                      }}
                    >
                      <label
                        className="admin-label admin-label-req"
                        htmlFor="slug"
                      >
                        Slug URL
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsAutoSlug(!isAutoSlug)}
                        style={{
                          fontSize: "10px",
                          padding: "2px 8px",
                          borderRadius: "12px",
                          border: "1px solid var(--color-ink-5)",
                          background: isAutoSlug
                            ? "var(--color-forest-50)"
                            : "transparent",
                          cursor: "pointer",
                          color: isAutoSlug
                            ? "var(--color-forest-700)"
                            : "var(--color-ink-4)",
                          transition: "all 0.2s",
                        }}
                      >
                        <RefreshCw
                          size={10}
                          style={{ display: "inline", marginRight: "4px" }}
                        />
                        {isAutoSlug ? "Auto" : "Manual"}
                      </button>
                    </div>
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
                        value={slug}
                        onChange={(e) => {
                          setSlug(e.target.value);
                          if (!isAutoSlug) setIsAutoSlug(false);
                        }}
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
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <input
                      type="checkbox"
                      id="showInNav"
                      checked={showInNav}
                      onChange={(e) => setShowInNav(e.target.checked)}
                      style={{
                        width: "16px",
                        height: "16px",
                        cursor: "pointer",
                      }}
                    />
                    <label
                      htmlFor="showInNav"
                      className="admin-label"
                      style={{ margin: 0, cursor: "pointer", fontWeight: 500 }}
                    >
                      Tampilkan di navigasi
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Button */}
            {isEdit && slug && (
              <div className="admin-card">
                <div className="admin-card-body">
                  <Link
                    href={`/${slug}`}
                    target="_blank"
                    className="admin-table-btn admin-table-btn-view w-full justify-center"
                    style={{ display: "flex", gap: "8px" }}
                  >
                    <Eye size={14} />
                    Preview Halaman
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </>
  );
}
