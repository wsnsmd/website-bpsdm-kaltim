// src/components/admin/ProgramForm.tsx
"use client";

import { useState, useTransition } from "react";
import { createProgram, updateProgram } from "@/lib/actions/programs";

// Jenis key harus cocok persis dengan nilai jenis di API SIMPEL
const JENIS_OPTIONS = [
  { value: "Teknis", label: "Teknis" },
  { value: "Fungsional", label: "Fungsional" },
  { value: "Manajerial", label: "Manajerial" },
  { value: "Sosiokultural", label: "Sosiokultural" },
  { value: "Pemerintahan Dalam Negeri", label: "Pemerintahan Dalam Negeri" },
  { value: "Sertifikasi", label: "Sertifikasi & Uji Kompetensi" },
];

const ICON_OPTIONS = [
  { value: "Wrench", label: "🔧 Teknis" },
  { value: "Layers", label: "📚 Fungsional" },
  { value: "Users", label: "👥 Manajerial" },
  { value: "Globe", label: "🌐 Sosiokultural" },
  { value: "Landmark", label: "🏛️ Pemerintahan" },
  { value: "BadgeCheck", label: "✅ Sertifikasi" },
  { value: "BookOpen", label: "📖 Umum" },
  { value: "GraduationCap", label: "🎓 Pendidikan" },
  { value: "Award", label: "🏆 Award" },
  { value: "Target", label: "🎯 Target" },
];

type ProgramData = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  jenisKey: string;
  icon: string | null;
  color: string | null;
  status: string;
  isHighlight: boolean | null;
  sortOrder: number | null;
  objectives: string | null;
  target: string | null;
};

type Props = { program?: ProgramData };

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function ProgramForm({ program }: Props) {
  const isEdit = !!program;
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState(program?.name ?? "");
  const [slug, setSlug] = useState(program?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(isEdit);

  function handleNameChange(val: string) {
    setName(val);
    if (!slugEdited) setSlug(toSlug(val));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = isEdit
        ? await updateProgram(program.id, formData)
        : await createProgram(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="login-error mb-5">{error}</div>}

      {/* Pembungkus Grid Responsif: 1 Kolom di HP, 2 Kolom di Layar Lebar (lg) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
        {/* ── Main Column ── */}
        <div className="flex flex-col gap-5">
          <div className="admin-card">
            <div className="admin-card-head">
              <div className="admin-card-title">Informasi Program</div>
            </div>
            <div className="admin-card-body">
              <div className="admin-form gap-4">
                <div className="admin-form-group">
                  <label className="admin-label admin-label-req" htmlFor="name">
                    Nama Program
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="admin-input text-[15px] font-semibold py-2.5"
                    placeholder="Contoh: Kompetensi Teknis"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                  />
                </div>

                <div className="admin-form-group mt-1">
                  <label className="admin-label" htmlFor="slug">
                    Slug URL
                  </label>
                  <div className="flex items-center gap-2 max-sm:flex-col max-sm:items-start max-sm:gap-1.5">
                    <span className="text-[13px] text-[var(--color-ink-4)] shrink-0">
                      /program/
                    </span>
                    <input
                      id="slug"
                      name="slug"
                      type="text"
                      className="admin-input"
                      value={slug}
                      onChange={(e) => {
                        setSlug(e.target.value);
                        setSlugEdited(true);
                      }}
                      placeholder="kompetensi-teknis"
                    />
                  </div>
                </div>

                <div className="admin-form-group mt-1">
                  <label className="admin-label" htmlFor="description">
                    Deskripsi
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    className="admin-textarea"
                    placeholder="Deskripsi singkat program pengembangan kompetensi..."
                    defaultValue={program?.description ?? ""}
                    rows={4}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="objectives">
                    Tujuan Program
                  </label>
                  <textarea
                    id="objectives"
                    name="objectives"
                    className="admin-textarea"
                    placeholder="Tujuan yang ingin dicapai..."
                    defaultValue={program?.objectives ?? ""}
                    rows={2}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="target">
                    Sasaran Peserta
                  </label>
                  <textarea
                    id="target"
                    name="target"
                    className="admin-textarea"
                    placeholder="Siapa yang menjadi sasaran peserta..."
                    defaultValue={program?.target ?? ""}
                    rows={2}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Info mapping SIMPEL */}
          <div className="ann-info-box">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="shrink-0"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>
              <strong>Jenis Kompetensi</strong> digunakan untuk mencocokkan
              jadwal dari <strong>SIMPEL Kaltim</strong>. Pastikan nilainya
              sesuai persis dengan jenis yang ada di sistem SIMPEL.
            </span>
          </div>
        </div>

        {/* ── Sidebar Column (Otomatis naik ke atas di layar HP) ── */}
        <div className="flex flex-col gap-5 lg:sticky lg:top-20 order-first lg:order-last mb-2 lg:mb-0">
          {/* Jenis & Status */}
          <div className="admin-card">
            <div className="admin-card-head">
              <div className="admin-card-title">Konfigurasi</div>
            </div>
            <div className="admin-card-body">
              <div className="admin-form gap-4">
                <div className="admin-form-group">
                  <label
                    className="admin-label admin-label-req"
                    htmlFor="jenisKey"
                  >
                    Jenis Kompetensi (SIMPEL)
                  </label>
                  <select
                    id="jenisKey"
                    name="jenisKey"
                    className="admin-select"
                    defaultValue={program?.jenisKey ?? ""}
                    required
                  >
                    <option value="">— Pilih Jenis —</option>
                    {JENIS_OPTIONS.map((j) => (
                      <option key={j.value} value={j.value}>
                        {j.label}
                      </option>
                    ))}
                  </select>
                  <span className="admin-hint mt-0.5">
                    Harus cocok dengan nilai jenis di API SIMPEL.
                  </span>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="status">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="admin-select"
                    defaultValue={program?.status ?? "active"}
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Nonaktif</option>
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
                    defaultValue={program?.sortOrder ?? 0}
                  />
                  <span className="admin-hint mt-0.5">
                    Angka lebih kecil tampil lebih awal.
                  </span>
                </div>

                <div className="flex items-center gap-2.5 mt-1 mb-2">
                  <input
                    type="checkbox"
                    id="isHighlight"
                    name="isHighlight"
                    value="true"
                    defaultChecked={program?.isHighlight ?? true}
                    className="w-4 h-4 cursor-pointer accent-[var(--color-forest-700)] shrink-0"
                  />
                  <label
                    htmlFor="isHighlight"
                    className="admin-label !m-0 cursor-pointer font-medium"
                  >
                    Tampilkan di beranda
                  </label>
                </div>

                <button
                  type="submit"
                  className="admin-btn-save w-full justify-center"
                  disabled={isPending}
                >
                  {isPending
                    ? "Menyimpan..."
                    : isEdit
                      ? "Simpan Perubahan"
                      : "Simpan Program"}
                </button>
              </div>
            </div>
          </div>

          {/* Tampilan */}
          <div className="admin-card">
            <div className="admin-card-head">
              <div className="admin-card-title">Tampilan</div>
            </div>
            <div className="admin-card-body">
              <div className="admin-form gap-4">
                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="icon">
                    Icon
                  </label>
                  <select
                    id="icon"
                    name="icon"
                    className="admin-select"
                    defaultValue={program?.icon ?? ""}
                  >
                    <option value="">— Pilih Icon —</option>
                    {ICON_OPTIONS.map((i) => (
                      <option key={i.value} value={i.value}>
                        {i.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="color">
                    Warna Aksen
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      id="color"
                      name="color"
                      type="color"
                      defaultValue={program?.color ?? "#0e3d20"}
                      className="w-11 h-[34px] rounded-md border border-[var(--color-ink-6)] cursor-pointer p-0.5 bg-white"
                    />
                    <span className="admin-hint">
                      Warna ikon dan aksen kartu.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
