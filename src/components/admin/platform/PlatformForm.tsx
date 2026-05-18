// src/components/admin/platform/PlatformForm.tsx
"use client";

import { useState, useTransition } from "react";
import { createPlatform, updatePlatform } from "@/lib/actions/platforms";

const ICONS = [
  { value: "ClipboardList", label: "📋 SIMPel / Daftar" },
  { value: "GraduationCap", label: "🎓 Pendidikan" },
  { value: "MonitorCheck", label: "🖥️ CBT / Monitor" },
  { value: "BookOpen", label: "📖 Pustaka" },
  { value: "Database", label: "🗄️ Database" },
  { value: "BarChart2", label: "📊 Statistik/Survei" },
  { value: "Cloud", label: "☁️ Cloud" },
  { value: "TrendingUp", label: "📈 Analisis" },
  { value: "Activity", label: "⚡ Monitoring" },
  { value: "Newspaper", label: "📰 Jurnal" },
  { value: "Brain", label: "🧠 Knowledge" },
  { value: "Globe", label: "🌐 Portal" },
  { value: "PieChart", label: "🥧 Data" },
  { value: "Headphones", label: "🎧 Helpdesk" },
  { value: "MessageSquareWarning", label: "💬 Pengaduan" },
  { value: "CalendarDays", label: "📅 Kalender" },
];

type PlatformData = {
  id: number;
  name: string;
  description: string | null;
  url: string | null;
  icon: string | null;
  color: string | null;
  category: string | null;
  isHighlight: boolean | null;
  isActive: boolean | null;
  sortOrder: number | null;
};

type Props = { platform?: PlatformData };

export function PlatformForm({ platform }: Props) {
  const isEdit = !!platform;
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isHighlight, setIsHighlight] = useState(
    platform?.isHighlight ?? false,
  );
  const [isActive, setIsActive] = useState(platform?.isActive ?? true);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("isHighlight", isHighlight ? "true" : "false");
    formData.set("isActive", isActive ? "true" : "false");

    startTransition(async () => {
      const result = isEdit
        ? await updatePlatform(platform.id, formData)
        : await createPlatform(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "640px" }}>
      {error && (
        <div className="login-error" style={{ marginBottom: "20px" }}>
          {error}
        </div>
      )}

      <div className="admin-card">
        <div className="admin-card-head">
          <div className="admin-card-title">
            {isEdit ? "Edit Platform" : "Tambah Platform"}
          </div>
        </div>
        <div className="admin-card-body">
          <div className="admin-form" style={{ gap: "16px" }}>
            <div className="admin-form-group">
              <label className="admin-label admin-label-req" htmlFor="name">
                Nama Platform
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="admin-input"
                placeholder="Contoh: SIMPel"
                defaultValue={platform?.name ?? ""}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label" htmlFor="description">
                Deskripsi
              </label>
              <input
                id="description"
                name="description"
                type="text"
                className="admin-input"
                placeholder="Deskripsi singkat platform"
                defaultValue={platform?.description ?? ""}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label" htmlFor="url">
                URL / Link
              </label>
              <input
                id="url"
                name="url"
                type="text"
                className="admin-input"
                placeholder="https://simpel.kaltimprov.go.id atau /jadwal"
                defaultValue={platform?.url ?? ""}
              />
              <span className="admin-hint">
                Gunakan URL lengkap untuk eksternal, atau path relatif (/jadwal)
                untuk internal. Isi # jika belum tersedia.
              </span>
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
                  defaultValue={platform?.icon ?? ""}
                >
                  <option value="">— Pilih Icon —</option>
                  {ICONS.map((i) => (
                    <option key={i.value} value={i.value}>
                      {i.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-label" htmlFor="category">
                  Kategori
                </label>
                <select
                  id="category"
                  name="category"
                  className="admin-select"
                  defaultValue={platform?.category ?? "ekosistem"}
                >
                  <option value="unggulan">Unggulan (Beranda)</option>
                  <option value="ekosistem">Ekosistem Digital</option>
                </select>
              </div>
            </div>

            <div className="admin-form-grid">
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
                  defaultValue={platform?.sortOrder ?? 0}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label" htmlFor="color">
                  Warna Aksen
                </label>
                <input
                  id="color"
                  name="color"
                  type="color"
                  defaultValue={platform?.color ?? "#0e3d20"}
                  style={{
                    width: "44px",
                    height: "34px",
                    borderRadius: "7px",
                    border: "1px solid var(--color-ink-6)",
                    cursor: "pointer",
                    padding: "2px",
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "20px" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={isHighlight}
                  onChange={(e) => setIsHighlight(e.target.checked)}
                  style={{ width: "16px", height: "16px" }}
                />
                <span className="admin-label" style={{ margin: 0 }}>
                  Tampil di beranda (Unggulan)
                </span>
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  style={{ width: "16px", height: "16px" }}
                />
                <span className="admin-label" style={{ margin: 0 }}>
                  Platform aktif
                </span>
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
                  : "Tambah Platform"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
