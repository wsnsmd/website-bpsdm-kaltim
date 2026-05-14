// src/components/admin/AnnouncementForm.tsx
"use client";

import { useState, useTransition } from "react";
import {
  createAnnouncement,
  updateAnnouncement,
} from "@/lib/actions/announcements";

type AnnouncementData = {
  id: number;
  title: string;
  content: string | null;
  url: string | null;
  type: string;
  showInTicker: boolean;
  showInBanner: boolean;
  priority: number;
  startDate: Date;
  endDate: Date | null;
  isActive: boolean;
};

type Props = {
  announcement?: AnnouncementData;
};

function toDatetimeLocal(date: Date | null): string {
  if (!date) return "";
  const d = new Date(date);
  // Format: YYYY-MM-DDTHH:mm
  return d.toISOString().slice(0, 16);
}

const TYPE_OPTIONS = [
  { value: "info", label: "Info", color: "#1d4ed8" },
  { value: "warning", label: "Warning", color: "var(--color-gold-700)" },
  { value: "urgent", label: "Urgent", color: "#dc2626" },
  { value: "event", label: "Event", color: "var(--color-forest-700)" },
];

export function AnnouncementForm({ announcement }: Props) {
  const isEdit = !!announcement;
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // State untuk checkbox & toggle
  const [showInTicker, setShowInTicker] = useState(
    announcement?.showInTicker ?? true,
  );
  const [showInBanner, setShowInBanner] = useState(
    announcement?.showInBanner ?? false,
  );
  const [isActive, setIsActive] = useState(announcement?.isActive ?? true);

  async function handleSubmit(formData: FormData) {
    setError(null);

    // Inject state dari checkbox ke formData
    formData.set("showInTicker", showInTicker ? "true" : "false");
    formData.set("showInBanner", showInBanner ? "true" : "false");
    formData.set("isActive", isActive ? "true" : "false");

    startTransition(async () => {
      const result = isEdit
        ? await updateAnnouncement(announcement.id, formData)
        : await createAnnouncement(formData);

      if (result?.error) setError(result.error);
    });
  }

  return (
    <form action={handleSubmit}>
      {error && (
        <div className="login-error" style={{ marginBottom: "20px" }}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: "24px",
          alignItems: "start",
        }}
      >
        {/* Main column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Judul & URL */}
          <div className="admin-card">
            <div className="admin-card-head">
              <div className="admin-card-title">Informasi Pengumuman</div>
            </div>
            <div className="admin-card-body">
              <div className="admin-form" style={{ gap: "14px" }}>
                <div className="admin-form-group">
                  <label
                    className="admin-label admin-label-req"
                    htmlFor="title"
                  >
                    Judul Pengumuman
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    className="admin-input"
                    placeholder="Contoh: Orientasi PPPK Angkatan 603 dibuka"
                    defaultValue={announcement?.title ?? ""}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="content">
                    Deskripsi{" "}
                    <span
                      style={{ color: "var(--color-ink-4)", fontWeight: 400 }}
                    >
                      (opsional)
                    </span>
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    className="admin-textarea"
                    placeholder="Deskripsi tambahan pengumuman..."
                    defaultValue={announcement?.content ?? ""}
                    rows={3}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="url">
                    URL Tautan{" "}
                    <span
                      style={{ color: "var(--color-ink-4)", fontWeight: 400 }}
                    >
                      (opsional)
                    </span>
                  </label>
                  <input
                    id="url"
                    name="url"
                    type="url"
                    className="admin-input"
                    placeholder="https://... atau /program/jadwal"
                    defaultValue={announcement?.url ?? ""}
                  />
                  <span className="admin-hint">
                    Pengguna akan diarahkan ke URL ini saat klik pengumuman.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tanggal tayang */}
          <div className="admin-card">
            <div className="admin-card-head">
              <div className="admin-card-title">Periode Tayang</div>
            </div>
            <div className="admin-card-body">
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label
                    className="admin-label admin-label-req"
                    htmlFor="startDate"
                  >
                    Mulai Tayang
                  </label>
                  <input
                    id="startDate"
                    name="startDate"
                    type="datetime-local"
                    className="admin-input"
                    defaultValue={
                      announcement?.startDate
                        ? toDatetimeLocal(announcement.startDate)
                        : toDatetimeLocal(new Date())
                    }
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="endDate">
                    Selesai Tayang{" "}
                    <span
                      style={{ color: "var(--color-ink-4)", fontWeight: 400 }}
                    >
                      (opsional)
                    </span>
                  </label>
                  <input
                    id="endDate"
                    name="endDate"
                    type="datetime-local"
                    className="admin-input"
                    defaultValue={
                      announcement?.endDate
                        ? toDatetimeLocal(announcement.endDate)
                        : ""
                    }
                  />
                  <span className="admin-hint">
                    Kosongkan jika pengumuman tayang tidak terbatas waktu.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Lokasi tampil */}
          <div className="admin-card">
            <div className="admin-card-head">
              <div className="admin-card-title">Lokasi Tampil</div>
            </div>
            <div className="admin-card-body">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                <div className="ann-location-item">
                  <div className="ann-location-info">
                    <div className="ann-location-title">Ticker Pengumuman</div>
                    <div className="ann-location-desc">
                      Tampil di baris berjalan di bawah hero section halaman
                      utama.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowInTicker((v) => !v)}
                    className="toggle-btn"
                    style={{
                      backgroundColor: showInTicker
                        ? "var(--color-forest-700)"
                        : "var(--color-ink-6)",
                    }}
                    aria-label="Toggle ticker"
                  >
                    <div
                      className="toggle-thumb"
                      style={{
                        transform: showInTicker
                          ? "translateX(18px)"
                          : "translateX(2px)",
                      }}
                    />
                  </button>
                </div>

                <div className="ann-location-item">
                  <div className="ann-location-info">
                    <div className="ann-location-title">Banner Halaman</div>
                    <div className="ann-location-desc">
                      Tampil sebagai banner di bagian atas halaman (untuk
                      pengumuman penting).
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowInBanner((v) => !v)}
                    className="toggle-btn"
                    style={{
                      backgroundColor: showInBanner
                        ? "var(--color-forest-700)"
                        : "var(--color-ink-6)",
                    }}
                    aria-label="Toggle banner"
                  >
                    <div
                      className="toggle-thumb"
                      style={{
                        transform: showInBanner
                          ? "translateX(18px)"
                          : "translateX(2px)",
                      }}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            position: "sticky",
            top: "80px",
          }}
        >
          {/* Status & Publish */}
          <div className="admin-card">
            <div className="admin-card-head">
              <div className="admin-card-title">Status</div>
            </div>
            <div className="admin-card-body">
              {/* Toggle aktif */}
              <div
                className="ann-location-item"
                style={{
                  marginBottom: "16px",
                  paddingBottom: "16px",
                  borderBottom: "1px solid var(--color-ink-7)",
                }}
              >
                <div>
                  <div className="ann-location-title">Aktif</div>
                  <div
                    className="ann-location-desc"
                    style={{ fontSize: "11.5px" }}
                  >
                    {isActive
                      ? "Pengumuman ditampilkan"
                      : "Pengumuman disembunyikan"}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsActive((v) => !v)}
                  className="toggle-btn"
                  style={{
                    backgroundColor: isActive
                      ? "var(--color-forest-700)"
                      : "var(--color-ink-6)",
                  }}
                  aria-label="Toggle aktif"
                >
                  <div
                    className="toggle-thumb"
                    style={{
                      transform: isActive
                        ? "translateX(18px)"
                        : "translateX(2px)",
                    }}
                  />
                </button>
              </div>

              {/* Tipe */}
              <div
                className="admin-form-group"
                style={{ marginBottom: "16px" }}
              >
                <label className="admin-label" htmlFor="type">
                  Tipe Pengumuman
                </label>
                <select
                  id="type"
                  name="type"
                  className="admin-select"
                  defaultValue={announcement?.type ?? "info"}
                >
                  {TYPE_OPTIONS.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <span className="admin-hint">
                  Menentukan warna dan ikon pengumuman.
                </span>
              </div>

              {/* Prioritas */}
              <div
                className="admin-form-group"
                style={{ marginBottom: "16px" }}
              >
                <label className="admin-label" htmlFor="priority">
                  Prioritas (0–100)
                </label>
                <input
                  id="priority"
                  name="priority"
                  type="number"
                  min="0"
                  max="100"
                  className="admin-input"
                  defaultValue={announcement?.priority ?? 0}
                />
                <span className="admin-hint">
                  Angka lebih kecil = prioritas lebih tinggi (tampil duluan).
                </span>
              </div>

              {/* Tombol simpan */}
              <button
                type="submit"
                className="admin-btn-save"
                disabled={isPending}
                style={{ width: "100%", justifyContent: "center" }}
              >
                {isPending ? (
                  "Menyimpan..."
                ) : (
                  <>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                      <polyline points="17 21 17 13 7 13 7 21" />
                      <polyline points="7 3 7 8 15 8" />
                    </svg>
                    {isEdit ? "Simpan Perubahan" : "Simpan Pengumuman"}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="admin-card">
            <div className="admin-card-head">
              <div className="admin-card-title">Preview Ticker</div>
            </div>
            <div className="admin-card-body">
              <div
                style={{
                  backgroundColor: "var(--color-gold-50, #fffcee)",
                  borderTop: "3px solid var(--color-gold-500)",
                  borderRadius: "8px",
                  padding: "10px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "12.5px",
                }}
              >
                <span
                  style={{
                    backgroundColor: "var(--color-forest-900)",
                    color: "#fff",
                    fontSize: "10px",
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: "4px",
                    flexShrink: 0,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  Pengumuman
                </span>
                <span style={{ color: "var(--color-ink-2)" }}>
                  Contoh pengumuman akan tampil di sini
                </span>
              </div>
              <p
                style={{
                  fontSize: "11.5px",
                  color: "var(--color-ink-4)",
                  marginTop: "10px",
                  lineHeight: 1.5,
                }}
              >
                Pengumuman aktif akan tampil bergiliran di ticker halaman utama
                sesuai urutan prioritas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
