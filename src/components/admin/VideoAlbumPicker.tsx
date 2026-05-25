// src/components/admin/VideoAlbumPicker.tsx
"use client";

import { useState, useTransition, useEffect } from "react";
import { updateSetting } from "@/lib/actions/settings";
import { Save } from "lucide-react";

type Album = { id: number; title: string; videoCount: number };
type Props = { albums: Album[]; currentValue: string };

export function VideoAlbumPicker({ albums, currentValue }: Props) {
  const [selected, setSelected] = useState(currentValue ?? "");
  const [isPending, startT] = useTransition();
  const [saved, setSaved] = useState(false);

  // Sync jika prop berubah (misalnya setelah revalidate)
  useEffect(() => {
    setSelected(currentValue ?? "");
  }, [currentValue]);

  function save() {
    startT(async () => {
      await updateSetting("home_video_album_id", selected);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  return (
    <div className="admin-card">
      <div className="admin-card-head">
        <div className="admin-card-title">🎬 Video di Beranda</div>
        <span style={{ fontSize: "12px", color: "var(--color-ink-4)" }}>
          Pilih album yang ditampilkan di section video beranda
        </span>
      </div>
      <div className="admin-card-body">
        <div className="admin-form-group">
          <label className="admin-label">Album Video</label>
          <select
            className="admin-select"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="">— Tidak tampilkan section video —</option>
            {albums.map((a) => (
              <option key={a.id} value={String(a.id)}>
                {a.title} ({a.videoCount} video)
              </option>
            ))}
          </select>
          <span className="admin-hint">
            Kosongkan untuk menyembunyikan section video dari beranda.
          </span>
        </div>

        {/* Tampilkan nilai tersimpan */}
        {currentValue && (
          <div
            style={{
              fontSize: "12px",
              color: "var(--color-forest-600)",
              marginTop: "6px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <span>✓ Tersimpan: Album ID {currentValue}</span>
          </div>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginTop: "14px",
          }}
        >
          <button
            type="button"
            onClick={save}
            disabled={isPending}
            className="admin-btn-save"
          >
            <Save size={14} />
            {isPending ? "Menyimpan..." : "Simpan"}
          </button>
          {saved && (
            <span
              style={{
                fontSize: "13px",
                color: "var(--color-forest-600)",
                fontWeight: 600,
              }}
            >
              ✓ Tersimpan
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
