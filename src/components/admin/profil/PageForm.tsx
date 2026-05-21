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
            color: "var(--color-ink)",
            border: "1px solid var(--color-ink-6)",
            borderRadius: "12px",
            padding: "12px 16px",
            fontSize: "13px",
          },
          success: {
            iconTheme: { primary: "#22c55e", secondary: "#fff" },
            style: { borderLeft: "4px solid #22c55e" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#fff" },
            style: { borderLeft: "4px solid #ef4444" },
          },
        }}
      />

      <form onSubmit={handleSubmit}>
        {/* Pembungkus Grid Responsif: 1 Kolom di HP, 2 Kolom di Layar Lebar (lg) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start">
          {/* ── Main Column ── */}
          <div className="flex flex-col gap-5">
            {/* Header dengan tombol aksi */}
            <div className="admin-card">
              <div className="admin-card-body">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Link
                      href="/admin/profil/pages"
                      className="admin-btn-cancel px-3 py-1.5"
                    >
                      <ArrowLeft size={16} />
                    </Link>
                    <h1 className="admin-page-title text-xl">
                      {isEdit ? "Edit Halaman" : "Tambah Halaman Baru"}
                    </h1>
                  </div>
                  <button
                    type="submit"
                    className="admin-btn-save w-full sm:w-auto justify-center"
                    disabled={isPending}
                  >
                    <Save size={16} />
                    {isPending ? "Menyimpan..." : "Simpan Halaman"}
                  </button>
                </div>
              </div>
            </div>

            {/* Judul & Slug */}
            <div className="admin-card">
              <div className="admin-card-body">
                <div className="admin-form gap-4">
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
                      className="admin-input text-[15px] font-semibold py-2.5"
                      placeholder="Contoh: Visi & Misi BPSDM Kaltim"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="admin-form-group mt-1">
                    <div className="flex justify-between items-center mb-1">
                      <label
                        className="admin-label admin-label-req"
                        htmlFor="slug"
                      >
                        Slug URL
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsAutoSlug(!isAutoSlug)}
                        className={`flex items-center gap-1 text-[10.5px] px-2 py-0.5 rounded-full border transition-all duration-200 font-medium ${
                          isAutoSlug
                            ? "bg-[var(--color-forest-50)] border-[var(--color-forest-200)] text-[var(--color-forest-700)]"
                            : "bg-transparent border-[var(--color-ink-6)] text-[var(--color-ink-4)]"
                        }`}
                      >
                        <RefreshCw size={10} />
                        {isAutoSlug ? "Auto" : "Manual"}
                      </button>
                    </div>

                    <div className="flex items-center gap-2 max-sm:flex-col max-sm:items-start max-sm:gap-1.5">
                      <span className="text-[13px] text-[var(--color-ink-4)] shrink-0">
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
                    <span className="admin-hint mt-0.5">
                      Gunakan "/" untuk sub-halaman. Contoh: profil/sejarah
                    </span>
                  </div>

                  <div className="admin-form-group mt-2">
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
              <div className="admin-card-body p-0">
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

          {/* ── Sidebar Column (Otomatis naik ke atas di layar HP) ── */}
          <div className="flex flex-col gap-5 lg:sticky lg:top-20 order-first lg:order-last mb-2 lg:mb-0">
            <div className="admin-card">
              <div className="admin-card-head">
                <div className="admin-card-title">Publikasi</div>
              </div>
              <div className="admin-card-body">
                <div className="admin-form gap-4">
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
                      Urutan Menu (Sort Order)
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

                  <div className="flex items-center gap-2.5 mt-1">
                    <input
                      type="checkbox"
                      id="showInNav"
                      checked={showInNav}
                      onChange={(e) => setShowInNav(e.target.checked)}
                      className="w-4 h-4 cursor-pointer accent-[var(--color-forest-700)] shrink-0"
                    />
                    <label
                      htmlFor="showInNav"
                      className="admin-label !m-0 cursor-pointer font-medium"
                    >
                      Tampilkan di navigasi menu
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Button */}
            {isEdit && slug && (
              <div className="admin-card">
                <div className="admin-card-body p-4">
                  <Link
                    href={`/${slug}`}
                    target="_blank"
                    className="admin-table-btn admin-table-btn-view w-full justify-center flex items-center gap-2 py-2 text-[13px]"
                  >
                    <Eye size={15} />
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
