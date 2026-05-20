// src/components/admin/galeri/AddVideoForm.tsx
"use client";

import { useState, useTransition } from "react";
import { addVideo } from "@/lib/actions/gallery";
import { Video, Link as LinkIcon } from "lucide-react";

type Props = { albumId: number };

export function AddVideoForm({ albumId }: Props) {
  const [isPending, startT] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [sourceType, setSourceType] = useState<"youtube" | "instagram">(
    "youtube",
  );

  // Ganti handleSubmit:
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    fd.set("sourceType", sourceType); // override dengan state
    startT(async () => {
      const res = await addVideo(albumId, fd);
      if (res?.error) setError(res.error);
    });
  }

  return (
    <div className="admin-card">
      <div className="admin-card-head">
        <div className="admin-card-title">
          <Video size={15} /> Tambah Video
        </div>
      </div>
      <div className="admin-card-body">
        <form onSubmit={handleSubmit}>
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

          {/* Toggle sumber */}
          <div style={{ display: "flex", gap: "6px", marginBottom: "14px" }}>
            {(["youtube", "instagram"] as const).map((src) => (
              <button
                key={src}
                type="button"
                onClick={() => setSourceType(src)}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "8px",
                  border: `1.5px solid ${
                    sourceType === src
                      ? src === "youtube"
                        ? "#ff0000"
                        : "#e1306c"
                      : "var(--color-ink-6)"
                  }`,
                  background:
                    sourceType === src
                      ? src === "youtube"
                        ? "#fff5f5"
                        : "#fff0f6"
                      : "#fff",
                  color:
                    sourceType === src
                      ? src === "youtube"
                        ? "#ff0000"
                        : "#e1306c"
                      : "var(--color-ink-3)",
                  fontSize: "12.5px",
                  fontWeight: sourceType === src ? 700 : 500,
                  cursor: "pointer",
                  transition: "all 0.12s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "5px",
                }}
              >
                {src === "youtube" ? "▶ YouTube" : "📷 Instagram"}
              </button>
            ))}
          </div>

          <div className="admin-form" style={{ gap: "12px" }}>
            <div className="admin-form-group">
              <label className="admin-label admin-label-req" htmlFor="title">
                Judul Video
              </label>
              <input
                id="title"
                name="title"
                type="text"
                className="admin-input"
                required
                placeholder="Judul video..."
              />
            </div>

            <div className="admin-form-group">
              <label
                className="admin-label admin-label-req"
                htmlFor="sourceUrl"
              >
                URL {sourceType === "youtube" ? "YouTube" : "Instagram"}
              </label>
              <input
                id="sourceUrl"
                name="sourceUrl"
                type="url"
                className="admin-input"
                required
                placeholder={
                  sourceType === "youtube"
                    ? "https://youtube.com/watch?v=..."
                    : "https://www.instagram.com/p/..."
                }
              />
              <span className="admin-hint">
                {sourceType === "youtube"
                  ? "Tempel URL video YouTube atau Shorts."
                  : "Tempel URL post/reel Instagram."}
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
                rows={2}
                placeholder="Deskripsi singkat video..."
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label" htmlFor="duration">
                Durasi
              </label>
              <input
                id="duration"
                name="duration"
                type="text"
                className="admin-input"
                placeholder="Contoh: 5:32"
                style={{ maxWidth: "120px" }}
              />
            </div>

            {/* Di dalam <form>, sebelum tombol submit: */}
            <input type="hidden" name="sourceType" value={sourceType} />

            <button
              type="submit"
              className="admin-btn-save"
              disabled={isPending}
              style={{ width: "100%", justifyContent: "center" }}
            >
              {isPending ? "Menyimpan..." : "Tambah Video"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
