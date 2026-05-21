// src/components/admin/AnnouncementForm.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createAnnouncement,
  updateAnnouncement,
} from "@/lib/actions/announcements";
import { Save } from "lucide-react";

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
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
    setSuccess(null);

    // Inject state dari checkbox ke formData
    formData.set("showInTicker", showInTicker ? "true" : "false");
    formData.set("showInBanner", showInBanner ? "true" : "false");
    formData.set("isActive", isActive ? "true" : "false");

    startTransition(async () => {
      const result = isEdit
        ? await updateAnnouncement(announcement.id, formData)
        : await createAnnouncement(formData);

      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(
          isEdit
            ? "Pengumuman berhasil diperbarui!"
            : "Pengumuman berhasil dibuat!",
        );
        setTimeout(() => {
          router.push("/admin/pengumuman");
          router.refresh();
        }, 1500);
      }
    });
  }

  return (
    <form action={handleSubmit}>
      {/* Error & Success Messages */}
      {error && <div className="login-error mb-5">{error}</div>}
      {success && (
        <div className="mb-5 p-3 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-medium flex items-center gap-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="shrink-0"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          {success}
        </div>
      )}

      {/* Pembungkus Grid Responsif: 1 Kolom di HP, 2 Kolom di Layar Lebar (lg) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
        {/* ── Main Column ── */}
        <div className="flex flex-col gap-5">
          {/* Judul & URL */}
          <div className="admin-card">
            <div className="admin-card-head">
              <div className="admin-card-title">Informasi Pengumuman</div>
            </div>
            <div className="admin-card-body">
              <div className="admin-form gap-4">
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
                    className="admin-input font-medium py-2.5"
                    placeholder="Contoh: Orientasi PPPK Angkatan 603 dibuka"
                    defaultValue={announcement?.title ?? ""}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="content">
                    Deskripsi{" "}
                    <span className="text-[var(--color-ink-4)] font-normal ml-1">
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
                    <span className="text-[var(--color-ink-4)] font-normal ml-1">
                      (opsional)
                    </span>
                  </label>
                  <input
                    id="url"
                    name="url"
                    type="text"
                    className="admin-input"
                    placeholder="/program/tes atau https://example.com"
                    defaultValue={announcement?.url ?? ""}
                  />
                  <span className="admin-hint">
                    Gunakan /path/url untuk link internal, atau https:// untuk
                    link eksternal.
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
                    <span className="text-[var(--color-ink-4)] font-normal ml-1">
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
              <div className="flex flex-col gap-4">
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
                    className={`toggle-btn ${
                      showInTicker
                        ? "bg-[var(--color-forest-700)]"
                        : "bg-[var(--color-ink-6)]"
                    }`}
                    aria-label="Toggle ticker"
                  >
                    <div
                      className={`toggle-thumb ${
                        showInTicker
                          ? "translate-x-[18px]"
                          : "translate-x-[2px]"
                      }`}
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
                    className={`toggle-btn ${
                      showInBanner
                        ? "bg-[var(--color-forest-700)]"
                        : "bg-[var(--color-ink-6)]"
                    }`}
                    aria-label="Toggle banner"
                  >
                    <div
                      className={`toggle-thumb ${
                        showInBanner
                          ? "translate-x-[18px]"
                          : "translate-x-[2px]"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Sidebar Column (Otomatis naik ke atas di layar HP) ── */}
        <div className="flex flex-col gap-5 lg:sticky lg:top-20 order-first lg:order-last mb-2 lg:mb-0">
          {/* Status & Publish */}
          <div className="admin-card">
            <div className="admin-card-head">
              <div className="admin-card-title">Status</div>
            </div>
            <div className="admin-card-body">
              {/* Toggle aktif */}
              <div className="ann-location-item mb-4 pb-4 border-b border-[var(--color-ink-7)]">
                <div>
                  <div className="ann-location-title">Aktif</div>
                  <div className="ann-location-desc text-[11.5px]">
                    {isActive
                      ? "Pengumuman ditampilkan"
                      : "Pengumuman disembunyikan"}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsActive((v) => !v)}
                  className={`toggle-btn ${
                    isActive
                      ? "bg-[var(--color-forest-700)]"
                      : "bg-[var(--color-ink-6)]"
                  }`}
                  aria-label="Toggle aktif"
                >
                  <div
                    className={`toggle-thumb ${
                      isActive ? "translate-x-[18px]" : "translate-x-[2px]"
                    }`}
                  />
                </button>
              </div>

              <div className="admin-form gap-4">
                {/* Tipe */}
                <div className="admin-form-group">
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
                  <span className="admin-hint mt-0.5">
                    Menentukan warna dan ikon pengumuman.
                  </span>
                </div>

                {/* Prioritas */}
                <div className="admin-form-group">
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
                  <span className="admin-hint mt-0.5">
                    Angka lebih kecil = prioritas lebih tinggi (tampil duluan).
                  </span>
                </div>

                {/* Tombol simpan */}
                <button
                  type="submit"
                  className="admin-btn-save w-full justify-center mt-1"
                  disabled={isPending}
                >
                  <Save size={15} />
                  {isPending
                    ? "Menyimpan..."
                    : isEdit
                      ? "Simpan Perubahan"
                      : "Simpan Pengumuman"}
                </button>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="admin-card">
            <div className="admin-card-head">
              <div className="admin-card-title">Preview Ticker</div>
            </div>
            <div className="admin-card-body">
              <div className="bg-[var(--color-gold-50)] border-t-[3px] border-[var(--color-gold-500)] rounded-lg py-2.5 px-3.5 flex items-center gap-2.5 text-[12.5px]">
                <span className="bg-[var(--color-forest-900)] text-white text-[10px] font-bold py-0.5 px-2 rounded shrink-0 tracking-[0.5px] uppercase">
                  Pengumuman
                </span>
                <span className="text-[var(--color-ink-2)] truncate">
                  Contoh pengumuman akan tampil di sini
                </span>
              </div>
              <p className="text-[11.5px] text-[var(--color-ink-4)] mt-2.5 leading-relaxed">
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
