// src/components/admin/ppid/PpidInformasiForm.tsx
"use client";

import { useState, useTransition } from "react";
import { createPpidInformasi, updatePpidInformasi } from "@/lib/actions/ppid";
import { Upload, Link as LinkIcon, FileText, X, Search } from "lucide-react";

type ExistingDoc = {
  id: number;
  title: string;
  fileUrl: string | null;
  externalUrl: string | null;
  fileType: string | null;
  fileSize: number | null;
};

type ItemData = {
  id: number;
  judul: string;
  deskripsi: string | null;
  tipe: string;
  fileUrl: string | null;
  externalUrl: string | null;
  fileType: string | null;
  fileSize: number | null;
  tahun: number | null;
  status: string;
  sortOrder: number | null;
};

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - i);
type FileMode = "upload" | "external" | "existing";

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export function PpidInformasiForm({
  item,
  existingDocs = [],
}: {
  item?: ItemData;
  existingDocs?: ExistingDoc[];
}) {
  const getInitialMode = (): FileMode => {
    if (item?.fileUrl) {
      // Cek apakah fileUrl milik dokumen existing
      return "upload";
    }
    if (item?.externalUrl) return "external";
    return "external";
  };
  const isEdit = !!item;
  const [isPending, startT] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fileMode, setFileMode] = useState<FileMode>(getInitialMode());
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState(item?.fileUrl ?? "");
  const [extUrl, setExtUrl] = useState(item?.externalUrl ?? "");
  const [fileType, setFileType] = useState(item?.fileType ?? "pdf");
  const [fileSize, setFileSize] = useState<number>(item?.fileSize ?? 0);
  const [fileName, setFileName] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<ExistingDoc | null>(() => {
    if (!item) return null;
    // Cari di existingDocs apakah ada yang fileUrl-nya cocok
    const match = existingDocs.find(
      (d) =>
        (item.fileUrl && d.fileUrl === item.fileUrl) ||
        (item.externalUrl && d.externalUrl === item.externalUrl),
    );
    return match ?? null;
  });
  const [docSearch, setDocSearch] = useState("");
  const filteredDocs = existingDocs.filter((d) =>
    d.title.toLowerCase().includes(docSearch.toLowerCase()),
  );
  const [initialized, setInitialized] = useState(false);

  if (!initialized && item && existingDocs.length > 0) {
    const match = existingDocs.find(
      (d) =>
        (item.fileUrl && d.fileUrl === item.fileUrl) ||
        (item.externalUrl && d.externalUrl === item.externalUrl),
    );
    if (match && !initialized) {
      // set via useEffect-like — tapi karena ini SSR, langsung init
    }
    setInitialized(true);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setFileName(file.name);
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "pdf";
    setFileType(ext);
    setFileSize(file.size);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("type", "document");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) setFileUrl(data.url);
      else setError("Gagal mengupload file.");
    } catch {
      setError("Gagal mengupload file.");
    } finally {
      setUploading(false);
    }
  }

  function selectExistingDoc(doc: ExistingDoc) {
    setSelectedDoc(doc);
    if (doc.fileUrl) {
      setFileUrl(doc.fileUrl);
      setExtUrl("");
    } else if (doc.externalUrl) {
      setExtUrl(doc.externalUrl);
      setFileUrl("");
    }
    setFileType(doc.fileType ?? "pdf");
    setFileSize(doc.fileSize ?? 0);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    if (fileMode === "upload") {
      fd.set("fileUrl", fileUrl);
      fd.set("externalUrl", "");
    } else if (fileMode === "external") {
      fd.set("fileUrl", "");
      fd.set("externalUrl", extUrl);
    } else {
      fd.set("fileUrl", selectedDoc?.fileUrl ?? "");
      fd.set("externalUrl", selectedDoc?.externalUrl ?? "");
    }
    fd.set("fileType", fileType);
    fd.set("fileSize", String(fileSize));
    startT(async () => {
      const res = isEdit
        ? await updatePpidInformasi(item.id, fd)
        : await createPpidInformasi(fd);
      if (res?.error) setError(res.error);
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="login-error mb-4">{error}</div>}

      {/* Pembungkus Grid Responsif: 1 Kolom di HP, 2 Kolom di Layar Lebar (lg) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
        {/* ── Kolom Kiri — Informasi Utama ── */}
        <div className="flex flex-col gap-4">
          {/* Data dokumen */}
          <div className="admin-card">
            <div className="admin-card-head">
              <div className="admin-card-title items-center flex gap-2">
                <FileText size={15} />
                {isEdit ? "Edit Informasi Publik" : "Data Dokumen"}
              </div>
            </div>
            <div className="admin-card-body">
              <div className="admin-form gap-4">
                <div className="admin-form-group">
                  <label
                    className="admin-label admin-label-req"
                    htmlFor="judul"
                  >
                    Judul Dokumen
                  </label>
                  <input
                    id="judul"
                    name="judul"
                    type="text"
                    className="admin-input py-2.5 font-medium"
                    defaultValue={item?.judul ?? ""}
                    required
                    placeholder="Contoh: Laporan Kinerja BPSDM 2024"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="deskripsi">
                    Deskripsi
                  </label>
                  <textarea
                    id="deskripsi"
                    name="deskripsi"
                    className="admin-textarea"
                    rows={3}
                    defaultValue={item?.deskripsi ?? ""}
                    placeholder="Deskripsi singkat dokumen ini..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="admin-form-group">
                    <label
                      className="admin-label admin-label-req"
                      htmlFor="tipe"
                    >
                      Tipe Informasi
                    </label>
                    <select
                      id="tipe"
                      name="tipe"
                      className="admin-select"
                      defaultValue={item?.tipe ?? "berkala"}
                    >
                      <option value="berkala">Informasi Berkala</option>
                      <option value="serta_merta">Serta Merta</option>
                      <option value="setiap_saat">Setiap Saat</option>
                      <option value="dikecualikan">Dikecualikan</option>
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label" htmlFor="tahun">
                      Tahun
                    </label>
                    <select
                      id="tahun"
                      name="tahun"
                      className="admin-select"
                      defaultValue={item?.tahun ?? CURRENT_YEAR}
                    >
                      {YEARS.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="admin-form-group">
                    <label className="admin-label" htmlFor="status">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      className="admin-select"
                      defaultValue={item?.status ?? "published"}
                    >
                      <option value="published">Terbit</option>
                      <option value="draft">Draft</option>
                    </select>
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
                      defaultValue={item?.sortOrder ?? 0}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tombol submit (Disembunyikan di HP karena tombol Sidebar akan pindah ke atas) */}
          <button
            type="submit"
            className="admin-btn-save max-lg:hidden self-start px-6 py-2.5"
            disabled={isPending || uploading}
          >
            {isPending
              ? "Menyimpan..."
              : isEdit
                ? "Simpan Perubahan"
                : "Tambah Informasi"}
          </button>
        </div>

        {/* ── Kolom Kanan — Sumber File (Otomatis naik ke atas di layar HP) ── */}
        <div className="flex flex-col lg:sticky lg:top-20 order-first lg:order-last mb-2 lg:mb-0">
          <div className="admin-card">
            <div className="admin-card-head">
              <div className="admin-card-title">Sumber Dokumen</div>
            </div>
            <div className="admin-card-body">
              {/* Toggle mode */}
              <div className="grid grid-cols-3 max-sm:grid-cols-1 gap-2 mb-4">
                {[
                  {
                    mode: "existing" as FileMode,
                    label: "Dari Unduhan",
                    icon: FileText,
                  },
                  {
                    mode: "external" as FileMode,
                    label: "URL Eksternal",
                    icon: LinkIcon,
                  },
                  {
                    mode: "upload" as FileMode,
                    label: "Upload File",
                    icon: Upload,
                  },
                ].map(({ mode, label, icon: Icon }) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setFileMode(mode)}
                    className={`flex flex-col max-sm:flex-row items-center justify-center gap-1.5 max-sm:gap-2.5 px-2 py-2.5 rounded-lg border-2 text-[11.5px] max-sm:text-xs cursor-pointer transition-all duration-150 ${
                      fileMode === mode
                        ? "border-[var(--color-forest-700)] bg-[var(--color-forest-50)] text-[var(--color-forest-700)] font-bold"
                        : "border-[var(--color-ink-6)] bg-white text-[var(--color-ink-4)] hover:border-[var(--color-ink-5)] font-medium"
                    }`}
                  >
                    <Icon size={16} className="shrink-0" />
                    <span className="max-sm:truncate">{label}</span>
                  </button>
                ))}
              </div>

              {/* Mode: Dari Unduhan */}
              {fileMode === "existing" && (
                <div>
                  <div className="relative mb-3">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-4)]"
                    />
                    <input
                      type="text"
                      value={docSearch}
                      onChange={(e) => setDocSearch(e.target.value)}
                      placeholder="Cari dokumen..."
                      className="admin-input pl-9"
                    />
                  </div>

                  <div className="max-h-[320px] overflow-y-auto border border-[var(--color-ink-6)] rounded-lg">
                    {filteredDocs.length === 0 ? (
                      <div className="p-6 text-center text-[13px] text-[var(--color-ink-4)]">
                        {existingDocs.length === 0
                          ? "Belum ada dokumen tersedia"
                          : "Tidak ada hasil pencarian"}
                      </div>
                    ) : (
                      filteredDocs.map((doc, i) => (
                        <div
                          key={doc.id}
                          onClick={() => selectExistingDoc(doc)}
                          className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors ${
                            i < filteredDocs.length - 1
                              ? "border-b border-[var(--color-ink-7)]"
                              : ""
                          } ${
                            selectedDoc?.id === doc.id
                              ? "bg-[var(--color-forest-50)]"
                              : "bg-white hover:bg-[var(--color-ink-8)]"
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${
                              selectedDoc?.id === doc.id
                                ? "bg-[var(--color-forest-100)] text-[var(--color-forest-700)]"
                                : "bg-[var(--color-ink-7)] text-[var(--color-ink-4)]"
                            }`}
                          >
                            <FileText size={15} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div
                              className={`text-[12.5px] truncate ${
                                selectedDoc?.id === doc.id
                                  ? "font-bold text-[var(--color-forest-800)]"
                                  : "font-medium text-[var(--color-ink)]"
                              }`}
                            >
                              {doc.title}
                            </div>
                            <div className="text-[11px] text-[var(--color-ink-4)] mt-0.5">
                              {doc.fileType?.toUpperCase() ?? "—"}
                              {doc.fileSize
                                ? ` · ${formatFileSize(doc.fileSize)}`
                                : ""}
                            </div>
                          </div>
                          {selectedDoc?.id === doc.id && (
                            <div className="w-2 h-2 rounded-full bg-[var(--color-forest-600)] shrink-0" />
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {selectedDoc && (
                    <div className="mt-3 px-3 py-2.5 rounded-lg bg-[var(--color-forest-50)] border border-[var(--color-forest-200)] flex items-center gap-2.5">
                      <FileText
                        size={14}
                        className="text-[var(--color-forest-700)] shrink-0"
                      />
                      <span className="flex-1 text-[12.5px] font-semibold text-[var(--color-forest-800)] truncate">
                        {selectedDoc.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedDoc(null)}
                        className="bg-transparent border-none cursor-pointer text-[var(--color-ink-4)] shrink-0 hover:text-red-500"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Mode: URL Eksternal */}
              {fileMode === "external" && (
                <div className="flex flex-col gap-3">
                  <div className="admin-form-group !m-0">
                    <label className="admin-label" htmlFor="extUrl">
                      URL Dokumen
                    </label>
                    <input
                      id="extUrl"
                      type="url"
                      className="admin-input"
                      value={extUrl}
                      onChange={(e) => setExtUrl(e.target.value)}
                      placeholder="https://drive.google.com/file/..."
                    />
                    <span className="admin-hint mt-0.5">
                      Google Drive, Dropbox, atau URL langsung ke file.
                    </span>
                  </div>
                  <div className="admin-form-group !m-0">
                    <label className="admin-label" htmlFor="extFileType">
                      Tipe File
                    </label>
                    <select
                      id="extFileType"
                      className="admin-select"
                      value={fileType}
                      onChange={(e) => setFileType(e.target.value)}
                    >
                      {["pdf", "docx", "xlsx", "pptx", "zip"].map((t) => (
                        <option key={t} value={t}>
                          {t.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Mode: Upload File */}
              {fileMode === "upload" && (
                <div>
                  {fileUrl ? (
                    <div className="flex items-center gap-3 px-3.5 py-3 rounded-lg bg-[var(--color-forest-50)] border border-[var(--color-forest-200)]">
                      <FileText
                        size={18}
                        className="text-[var(--color-forest-700)] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold text-[var(--color-forest-800)] truncate">
                          {fileName || fileUrl.split("/").pop()}
                        </div>
                        {fileSize > 0 && (
                          <div className="text-[11.5px] text-[var(--color-ink-4)] mt-0.5">
                            {fileType.toUpperCase()} ·{" "}
                            {formatFileSize(fileSize)}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFileUrl("");
                          setFileName("");
                          setFileSize(0);
                        }}
                        className="bg-transparent border-none cursor-pointer text-[var(--color-ink-4)] hover:text-red-500"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ) : (
                    <label
                      className={`flex flex-col items-center justify-center gap-2 py-8 px-6 rounded-lg border-2 border-dashed transition-all duration-150 text-center ${
                        uploading
                          ? "border-[var(--color-forest-400)] bg-[var(--color-forest-50)] cursor-wait"
                          : "border-[var(--color-ink-5)] bg-[var(--color-ink-8)] cursor-pointer hover:border-[var(--color-forest-700)] hover:bg-[var(--color-forest-50)]"
                      }`}
                    >
                      <Upload size={28} className="text-[var(--color-ink-4)]" />
                      <div>
                        <div className="text-[13.5px] font-semibold text-[var(--color-ink-2)]">
                          {uploading
                            ? "Mengupload..."
                            : "Klik untuk pilih file"}
                        </div>
                        <div className="text-[11.5px] text-[var(--color-ink-4)] mt-1">
                          PDF, DOCX, XLSX, PPTX, ZIP — maks. 10MB
                        </div>
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              )}

              {/* Hidden fields */}
              <input
                type="hidden"
                name="fileUrl"
                value={
                  fileMode === "upload" || fileMode === "existing"
                    ? fileUrl
                    : ""
                }
              />
              <input
                type="hidden"
                name="externalUrl"
                value={
                  fileMode === "external"
                    ? extUrl
                    : fileMode === "existing" && selectedDoc?.externalUrl
                      ? selectedDoc.externalUrl
                      : ""
                }
              />
              <input type="hidden" name="fileType" value={fileType} />
              <input type="hidden" name="fileSize" value={fileSize} />
            </div>

            {/* Tombol Simpan untuk tampilan Mobile (Tampil di dalam kotak konfigurasi di layar kecil) */}
            <div className="p-4 border-t border-[var(--color-ink-6)] lg:hidden bg-[var(--color-ink-8)] rounded-b-xl">
              <button
                type="submit"
                className="admin-btn-save w-full justify-center"
                disabled={isPending || uploading}
              >
                {isPending
                  ? "Menyimpan..."
                  : isEdit
                    ? "Simpan Perubahan"
                    : "Tambah Informasi"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
