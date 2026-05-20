// src/components/admin/galeri/AddPhotosForm.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addPhotos } from "@/lib/actions/gallery";
import { Upload, X, ImageIcon } from "lucide-react";

type Props = { albumId: number };

type UploadedPhoto = { url: string; name: string };

export function AddPhotosForm({ albumId }: Props) {
  const router = useRouter();
  const [isPending, startT] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setUploading(true);
    setError(null);
    const uploaded: UploadedPhoto[] = [];

    for (const file of files) {
      try {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("type", "image");
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (data.url) {
          uploaded.push({ url: data.url, name: file.name });
        }
      } catch {
        // skip gagal
      }
    }

    setPhotos((prev) => [...prev, ...uploaded]);
    setUploading(false);
    // Reset input
    e.target.value = "";
  }

  function removePhoto(url: string) {
    setPhotos((prev) => prev.filter((p) => p.url !== url));
  }

  async function handleSave() {
    if (photos.length === 0) return;
    setError(null);
    const fd = new FormData();
    photos.forEach((p) => fd.append("imageUrl", p.url));
    startT(async () => {
      const res = await addPhotos(albumId, fd);
      if (res?.error) {
        setError(res.error);
        return;
      }
      setPhotos([]);
      router.refresh();
    });
  }

  return (
    <div className="admin-card">
      <div className="admin-card-head">
        <div className="admin-card-title">
          <Upload size={15} /> Tambah Foto
        </div>
      </div>
      <div className="admin-card-body">
        {error && (
          <div
            style={{
              padding: "8px 12px",
              borderRadius: "7px",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#dc2626",
              fontSize: "13px",
              marginBottom: "12px",
            }}
          >
            {error}
          </div>
        )}

        {/* Upload zone */}
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            padding: "20px",
            borderRadius: "10px",
            border: "2px dashed var(--color-ink-5)",
            background: uploading ? "var(--color-forest-50)" : "#fafafa",
            cursor: uploading ? "wait" : "pointer",
            textAlign: "center",
            marginBottom: "12px",
          }}
        >
          <ImageIcon size={24} style={{ color: "var(--color-ink-4)" }} />
          <div>
            <div
              style={{
                fontSize: "13.5px",
                fontWeight: 600,
                color: "var(--color-ink-2)",
              }}
            >
              {uploading ? "Mengupload..." : "Klik pilih foto"}
            </div>
            <div
              style={{
                fontSize: "11.5px",
                color: "var(--color-ink-4)",
                marginTop: "3px",
              }}
            >
              JPG, PNG, WebP — bisa pilih banyak sekaligus
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFiles}
            disabled={uploading}
            style={{ display: "none" }}
          />
        </label>

        {/* Preview foto yang akan diupload */}
        {photos.length > 0 && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "6px",
                marginBottom: "12px",
              }}
            >
              {photos.map((p) => (
                <div key={p.url} style={{ position: "relative" }}>
                  <img
                    src={p.url}
                    alt={p.name}
                    style={{
                      width: "100%",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "6px",
                      display: "block",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(p.url)}
                    style={{
                      position: "absolute",
                      top: "3px",
                      right: "3px",
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      background: "rgba(0,0,0,0.7)",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                    }}
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={isPending}
              className="admin-btn-save"
              style={{ width: "100%", justifyContent: "center" }}
            >
              {isPending ? "Menyimpan..." : `Simpan ${photos.length} Foto`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
