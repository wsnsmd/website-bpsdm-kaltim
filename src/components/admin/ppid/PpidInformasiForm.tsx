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

      {/* Layout 2 kolom */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 380px",
          gap: "20px",
          alignItems: "start",
        }}
      >
        {/* Kolom kiri — informasi utama */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Data dokumen */}
          <div className="admin-card">
            <div className="admin-card-head">
              <div className="admin-card-title">
                <FileText size={15} />
                {isEdit ? "Edit Informasi Publik" : "Data Dokumen"}
              </div>
            </div>
            <div className="admin-card-body">
              <div className="admin-form" style={{ gap: "14px" }}>
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
                    className="admin-input"
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

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                  }}
                >
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

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                  }}
                >
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

          {/* Tombol submit */}
          <button
            type="submit"
            className="admin-btn-save"
            disabled={isPending || uploading}
            style={{ alignSelf: "flex-start", padding: "10px 24px" }}
          >
            {isPending
              ? "Menyimpan..."
              : isEdit
                ? "Simpan Perubahan"
                : "Tambah Informasi"}
          </button>
        </div>

        {/* Kolom kanan — sumber file */}
        <div className="admin-card" style={{ position: "sticky", top: "80px" }}>
          <div className="admin-card-head">
            <div className="admin-card-title">Sumber Dokumen</div>
          </div>
          <div className="admin-card-body">
            {/* Toggle mode */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "6px",
                marginBottom: "16px",
              }}
            >
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
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px",
                    padding: "10px 8px",
                    borderRadius: "8px",
                    border: `1.5px solid ${fileMode === mode ? "var(--color-forest-700)" : "var(--color-ink-5)"}`,
                    background:
                      fileMode === mode ? "var(--color-forest-50)" : "#fff",
                    color:
                      fileMode === mode
                        ? "var(--color-forest-700)"
                        : "var(--color-ink-4)",
                    fontSize: "11.5px",
                    fontWeight: fileMode === mode ? 700 : 500,
                    cursor: "pointer",
                    transition: "all 0.12s",
                  }}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>

            {/* Mode: Dari Unduhan */}
            {fileMode === "existing" && (
              <div>
                <div style={{ position: "relative", marginBottom: "10px" }}>
                  <Search
                    size={14}
                    style={{
                      position: "absolute",
                      left: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--color-ink-4)",
                    }}
                  />
                  <input
                    type="text"
                    value={docSearch}
                    onChange={(e) => setDocSearch(e.target.value)}
                    placeholder="Cari dokumen..."
                    className="admin-input"
                    style={{ paddingLeft: "32px" }}
                  />
                </div>

                <div
                  style={{
                    maxHeight: "320px",
                    overflowY: "auto",
                    border: "1px solid var(--color-ink-6)",
                    borderRadius: "8px",
                  }}
                >
                  {filteredDocs.length === 0 ? (
                    <div
                      style={{
                        padding: "24px",
                        textAlign: "center",
                        color: "var(--color-ink-4)",
                        fontSize: "13px",
                      }}
                    >
                      {existingDocs.length === 0
                        ? "Belum ada dokumen tersedia"
                        : "Tidak ada hasil pencarian"}
                    </div>
                  ) : (
                    filteredDocs.map((doc, i) => (
                      <div
                        key={doc.id}
                        onClick={() => selectExistingDoc(doc)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "10px 12px",
                          borderBottom:
                            i < filteredDocs.length - 1
                              ? "1px solid var(--color-ink-7)"
                              : "none",
                          background:
                            selectedDoc?.id === doc.id
                              ? "var(--color-forest-50)"
                              : "#fff",
                          cursor: "pointer",
                          transition: "background 0.1s",
                        }}
                      >
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "7px",
                            background:
                              selectedDoc?.id === doc.id
                                ? "var(--color-forest-100)"
                                : "var(--color-ink-7)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <FileText
                            size={15}
                            style={{
                              color:
                                selectedDoc?.id === doc.id
                                  ? "var(--color-forest-700)"
                                  : "var(--color-ink-4)",
                            }}
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: "12.5px",
                              fontWeight:
                                selectedDoc?.id === doc.id ? 700 : 500,
                              color:
                                selectedDoc?.id === doc.id
                                  ? "var(--color-forest-800)"
                                  : "var(--color-ink)",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {doc.title}
                          </div>
                          <div
                            style={{
                              fontSize: "11px",
                              color: "var(--color-ink-4)",
                              marginTop: "2px",
                            }}
                          >
                            {doc.fileType?.toUpperCase() ?? "—"}
                            {doc.fileSize
                              ? ` · ${formatFileSize(doc.fileSize)}`
                              : ""}
                          </div>
                        </div>
                        {selectedDoc?.id === doc.id && (
                          <div
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              background: "var(--color-forest-600)",
                              flexShrink: 0,
                            }}
                          />
                        )}
                      </div>
                    ))
                  )}
                </div>

                {selectedDoc && (
                  <div
                    style={{
                      marginTop: "10px",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      background: "var(--color-forest-50)",
                      border: "1px solid var(--color-forest-200)",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <FileText
                      size={14}
                      style={{ color: "var(--color-forest-700)" }}
                    />
                    <span
                      style={{
                        flex: 1,
                        fontSize: "12.5px",
                        fontWeight: 600,
                        color: "var(--color-forest-800)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {selectedDoc.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedDoc(null)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--color-ink-4)",
                        flexShrink: 0,
                      }}
                    >
                      <X size={13} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mode: URL Eksternal */}
            {fileMode === "external" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div className="admin-form-group" style={{ margin: 0 }}>
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
                  <span className="admin-hint">
                    Google Drive, Dropbox, atau URL langsung ke file.
                  </span>
                </div>
                <div className="admin-form-group" style={{ margin: 0 }}>
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
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "12px 14px",
                      borderRadius: "8px",
                      background: "var(--color-forest-50)",
                      border: "1px solid var(--color-forest-200)",
                    }}
                  >
                    <FileText
                      size={18}
                      style={{
                        color: "var(--color-forest-700)",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "var(--color-forest-800)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {fileName || fileUrl.split("/").pop()}
                      </div>
                      {fileSize > 0 && (
                        <div
                          style={{
                            fontSize: "11.5px",
                            color: "var(--color-ink-4)",
                            marginTop: "2px",
                          }}
                        >
                          {fileType.toUpperCase()} · {formatFileSize(fileSize)}
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
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--color-ink-4)",
                      }}
                    >
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <label
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      padding: "32px 24px",
                      borderRadius: "10px",
                      border: "2px dashed var(--color-ink-5)",
                      background: uploading
                        ? "var(--color-forest-50)"
                        : "#fafafa",
                      cursor: uploading ? "wait" : "pointer",
                      transition: "all 0.15s",
                      textAlign: "center",
                    }}
                  >
                    <Upload size={28} style={{ color: "var(--color-ink-4)" }} />
                    <div>
                      <div
                        style={{
                          fontSize: "13.5px",
                          fontWeight: 600,
                          color: "var(--color-ink-2)",
                        }}
                      >
                        {uploading ? "Mengupload..." : "Klik untuk pilih file"}
                      </div>
                      <div
                        style={{
                          fontSize: "11.5px",
                          color: "var(--color-ink-4)",
                          marginTop: "4px",
                        }}
                      >
                        PDF, DOCX, XLSX, PPTX, ZIP — maks. 10MB
                      </div>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      style={{ display: "none" }}
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
                fileMode === "upload" || fileMode === "existing" ? fileUrl : ""
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
        </div>
      </div>
    </form>
  );
}
