// src/components/admin/profil/UnitForm.tsx
"use client";

import { useState, useTransition } from "react";
import { createUnit, updateUnit } from "@/lib/actions/units";

type UnitOption = { id: number; name: string; level: number | null };

type UnitData = {
  id: number;
  name: string;
  shortName: string | null;
  description: string | null;
  parentId: number | null;
  level: number | null;
  sortOrder: number | null;
  isActive: boolean | null;
};

type Props = {
  unit?: UnitData;
  units: UnitOption[];
};

const LEVEL_OPTIONS = [
  { value: 0, label: "0 — Pimpinan" },
  { value: 1, label: "1 — Sekretariat" },
  { value: 2, label: "2 — Bidang / UPT" },
  { value: 3, label: "3 — Sub Bagian" },
];

export function UnitForm({ unit, units }: Props) {
  const isEdit = !!unit;
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(unit?.isActive ?? true);

  // Filter: tidak bisa pilih diri sendiri sebagai parent
  const parentOptions = units.filter((u) => u.id !== unit?.id);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("isActive", isActive ? "true" : "false");

    startTransition(async () => {
      const result = isEdit
        ? await updateUnit(unit.id, formData)
        : await createUnit(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="login-error mb-5">{error}</div>}

      {/* Pembungkus Grid Responsif: 1 Kolom di HP, 2 Kolom di Layar Lebar (lg) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start">
        {/* ── Main Column ── */}
        <div className="flex flex-col gap-5">
          <div className="admin-card">
            <div className="admin-card-head">
              <div className="admin-card-title">Informasi Unit Kerja</div>
            </div>
            <div className="admin-card-body">
              <div className="admin-form gap-4">
                <div className="admin-form-group">
                  <label className="admin-label admin-label-req" htmlFor="name">
                    Nama Unit
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="admin-input"
                    placeholder="Contoh: Bidang Pengembangan Kompetensi Teknis"
                    defaultValue={unit?.name ?? ""}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="shortName">
                    Nama Singkat
                  </label>
                  <input
                    id="shortName"
                    name="shortName"
                    type="text"
                    className="admin-input"
                    placeholder="Contoh: Bid. PKT"
                    defaultValue={unit?.shortName ?? ""}
                  />
                  <span className="admin-hint">
                    Ditampilkan di org chart sebagai keterangan.
                  </span>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="description">
                    Deskripsi / Tugas Pokok
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    className="admin-textarea"
                    placeholder="Tugas pokok dan fungsi unit kerja..."
                    defaultValue={unit?.description ?? ""}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Sidebar Column (Otomatis naik ke atas di layar HP) ── */}
        <div className="flex flex-col gap-5 lg:sticky lg:top-20 order-first lg:order-last mb-2 lg:mb-0">
          <div className="admin-card">
            <div className="admin-card-head">
              <div className="admin-card-title">Struktur</div>
            </div>
            <div className="admin-card-body">
              <div className="admin-form gap-4">
                <div className="admin-form-group">
                  <label
                    className="admin-label admin-label-req"
                    htmlFor="level"
                  >
                    Level Hierarki
                  </label>
                  <select
                    id="level"
                    name="level"
                    className="admin-select"
                    defaultValue={unit?.level ?? 0}
                    required
                  >
                    {LEVEL_OPTIONS.map((l) => (
                      <option key={l.value} value={l.value}>
                        {l.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="parentId">
                    Unit Induk (Parent)
                  </label>
                  <select
                    id="parentId"
                    name="parentId"
                    className="admin-select"
                    defaultValue={unit?.parentId ?? ""}
                  >
                    <option value="">— Tidak ada (Root) —</option>
                    {parentOptions.map((u) => (
                      <option key={u.id} value={u.id}>
                        {"  ".repeat(u.level ?? 0)}
                        {u.name}
                      </option>
                    ))}
                  </select>
                  <span className="admin-hint mt-0.5">
                    Tentukan unit induk untuk tampilan org chart.
                  </span>
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
                    defaultValue={unit?.sortOrder ?? 0}
                  />
                </div>

                <div className="flex items-center gap-2.5 mt-1 mb-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 cursor-pointer accent-[var(--color-forest-700)] shrink-0"
                  />
                  <label
                    htmlFor="isActive"
                    className="admin-label !m-0 cursor-pointer font-medium"
                  >
                    Unit aktif
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
                      : "Tambah Unit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
