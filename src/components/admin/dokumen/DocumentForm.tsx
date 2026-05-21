// src/components/admin/dokumen/DocumentForm.tsx
"use client";

import { useState, useTransition } from "react";
import { createDocument, updateDocument } from "@/lib/actions/documents";
import { DocumentUploader } from "@/components/admin/dokumen/DocumentUploader";
import { Upload, Link as LinkIcon, Info } from "lucide-react";

type CategoryOption = { id: number; name: string; color: string | null };

type DocData = {
  id: number;
  title: string;
  description: string | null;
  categoryId: number | null;
  fileUrl: string | null;
  externalUrl: string | null;
  fileType: string | null;
  fileSize: number | null;
  year: number | null;
  tags: string | null;
  status: string;
};

type Props = {
  document?: DocData;
  categories: CategoryOption[];
};

const FILE_TYPES = [
  "pdf",
  "docx",
  "doc",
  "xlsx",
  "xls",
  "pptx",
  "jpg",
  "png",
  "zip",
];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - i);

export function DocumentForm({ document, categories }: Props) {
  const isEdit = !!document;
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Tab: upload atau external
  const [sourceTab, setSourceTab] = useState<"upload" | "external">(
    document?.externalUrl && !document?.fileUrl ? "external" : "upload",
  );
  const [fileUrl, setFileUrl] = useState(document?.fileUrl ?? "");
  const [fileType, setFileType] = useState(document?.fileType ?? "");
  const [fileSize, setFileSize] = useState(document?.fileSize ?? 0);
  const [externalUrl, setExternalUrl] = useState(document?.externalUrl ?? "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    formData.delete("fileUrl");
    formData.delete("externalUrl");

    if (sourceTab === "upload") {
      formData.set("fileUrl", fileUrl);
      formData.set("externalUrl", "");
      // fileType & fileSize otomatis dari DocumentUploader
      formData.set("fileType", fileType);
      formData.set("fileSize", String(fileSize || 0));
    } else {
      formData.set("externalUrl", externalUrl);
      formData.set("fileUrl", "");
      // fileType & fileSize dari input manual (sudah ada di formData)
    }

    startTransition(async () => {
      const result = isEdit
        ? await updateDocument(document.id, formData)
        : await createDocument(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="login-error mb-5">{error}</div>}

      {/* Pembungkus Grid Responsif: 1 Kolom di HP, 2 Kolom di Desktop (lg) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
        {/* ── Main Column ── */}
        <div className="flex flex-col gap-5">
          {/* Info dokumen */}
          <div className="admin-card">
            <div className="admin-card-head">
              <div className="admin-card-title">Informasi Dokumen</div>
            </div>
            <div className="admin-card-body">
              <div className="admin-form gap-4">
                <div className="admin-form-group">
                  <label
                    className="admin-label admin-label-req"
                    htmlFor="title"
                  >
                    Judul Dokumen
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    className="admin-input py-2.5 font-semibold text-[15px]"
                    placeholder="Contoh: Laporan Kinerja BPSDM Kaltim 2024"
                    defaultValue={document?.title ?? ""}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="description">
                    Deskripsi
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    className="admin-textarea"
                    placeholder="Deskripsi singkat dokumen..."
                    defaultValue={document?.description ?? ""}
                    rows={3}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="tags">
                    Tags
                  </label>
                  <input
                    id="tags"
                    name="tags"
                    type="text"
                    className="admin-input"
                    placeholder="laporan, kinerja, 2024 (pisahkan dengan koma)"
                    defaultValue={document?.tags ?? ""}
                  />
                  <span className="admin-hint mt-0.5">
                    Pisahkan tag dengan koma.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sumber file */}
          <div className="admin-card">
            <div className="admin-card-head">
              <div className="admin-card-title">Sumber Dokumen</div>
            </div>
            <div className="admin-card-body">
              {/* Tab toggle */}
              <div className="flex rounded-[10px] border border-[var(--color-ink-6)] overflow-hidden mb-4 w-fit max-sm:w-full">
                {[
                  { key: "upload", label: "Upload File", icon: Upload },
                  { key: "external", label: "Link Eksternal", icon: LinkIcon },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() =>
                      setSourceTab(tab.key as "upload" | "external")
                    }
                    className={`flex items-center justify-center gap-1.5 px-4.5 py-2 max-sm:flex-1 border-none text-[13px] font-semibold cursor-pointer transition-all duration-150 ${
                      sourceTab === tab.key
                        ? "bg-[var(--color-forest-700)] text-white"
                        : "bg-white text-[var(--color-ink-3)] hover:bg-[var(--color-ink-8)]"
                    }`}
                  >
                    <tab.icon size={14} />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Upload */}
              {sourceTab === "upload" && (
                <div className="admin-form gap-4">
                  <div className="admin-form-group">
                    <label className="admin-label">File Dokumen</label>
                    <DocumentUploader
                      value={fileUrl}
                      onChange={(url, type, size) => {
                        setFileUrl(url);
                        setFileType(type);
                        setFileSize(size);
                      }}
                      onClear={() => {
                        setFileUrl("");
                        setFileType("");
                        setFileSize(0);
                      }}
                    />
                  </div>
                </div>
              )}

              {/* External */}
              {sourceTab === "external" && (
                <div className="admin-form gap-4">
                  <div className="admin-form-group">
                    <label
                      className="admin-label admin-label-req"
                      htmlFor="externalUrl"
                    >
                      URL Eksternal
                    </label>
                    <input
                      id="externalUrl"
                      type="url"
                      className="admin-input"
                      placeholder="https://drive.google.com/..."
                      value={externalUrl}
                      onChange={(e) => setExternalUrl(e.target.value)}
                    />
                    <span className="admin-hint mt-0.5">
                      Google Drive, Dropbox, atau URL file langsung.
                    </span>
                  </div>

                  {/* Tipe & ukuran — hanya untuk eksternal karena tidak otomatis */}
                  <div className="admin-form-grid">
                    <div className="admin-form-group">
                      <label className="admin-label" htmlFor="fileType">
                        Tipe File
                      </label>
                      <select
                        id="fileType"
                        name="fileType"
                        className="admin-select"
                        defaultValue={document?.fileType ?? "pdf"}
                      >
                        <option value="">— Pilih —</option>
                        {[
                          "pdf",
                          "docx",
                          "doc",
                          "xlsx",
                          "xls",
                          "pptx",
                          "zip",
                        ].map((t) => (
                          <option key={t} value={t}>
                            {t.toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label" htmlFor="fileSize">
                        Ukuran File (bytes)
                      </label>
                      <input
                        id="fileSize"
                        name="fileSize"
                        type="number"
                        min="0"
                        className="admin-input"
                        placeholder="mis: 2097152 = 2MB"
                        defaultValue={document?.fileSize ?? ""}
                      />
                    </div>
                  </div>

                  <div className="ann-info-box">
                    <Info size={15} className="shrink-0" />
                    <span>
                      Pastikan link dapat diakses publik. Untuk Google Drive,
                      set sharing ke <strong>"Anyone with the link"</strong>.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Sidebar Column (Otomatis naik ke atas di layar HP) ── */}
        <div className="flex flex-col gap-5 lg:sticky lg:top-20 order-first lg:order-last mb-2 lg:mb-0">
          {/* Publikasi */}
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
                    defaultValue={document?.status ?? "published"}
                  >
                    <option value="published">Terbit</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Arsip</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="categoryId">
                    Kategori
                  </label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    className="admin-select"
                    defaultValue={document?.categoryId ?? ""}
                  >
                    <option value="">— Pilih Kategori —</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="year">
                    Tahun
                  </label>
                  <select
                    id="year"
                    name="year"
                    className="admin-select"
                    defaultValue={document?.year ?? CURRENT_YEAR}
                  >
                    {YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="admin-btn-save w-full justify-center mt-1"
                  disabled={isPending}
                >
                  {isPending
                    ? "Menyimpan..."
                    : isEdit
                      ? "Simpan Perubahan"
                      : "Simpan Dokumen"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
