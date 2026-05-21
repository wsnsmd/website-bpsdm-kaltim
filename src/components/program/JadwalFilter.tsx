// src/components/program/JadwalFilter.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  jenisOptions: string[];
};

const STATUS_OPTIONS = [
  { value: "", label: "Semua" },
  { value: "akan-datang", label: "Akan Datang" },
  { value: "berlangsung", label: "Berlangsung" },
  { value: "selesai", label: "Selesai" },
];

export function JadwalFilter({ jenisOptions }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeJenis = searchParams.get("jenis") ?? "";
  const activeStatus = searchParams.get("status") ?? "";

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/program/jadwal?${params.toString()}`);
  }

  return (
    <div className="jadwal-filter-root">
      {/* Row 1: Pills status — selalu satu baris scroll */}
      <div className="jadwal-filter-top">
        <div className="jadwal-filter-pills">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s.value}
              onClick={() => updateParam("status", s.value)}
              className={`jadwal-filter-pill ${activeStatus === s.value ? "jadwal-filter-pill-active" : ""}`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Divider — hanya tampil di desktop */}
        <div className="jadwal-filter-divider" />

        {/* Select — inline di desktop, pindah ke bawah di mobile */}
        <select
          value={activeJenis}
          onChange={(e) => updateParam("jenis", e.target.value)}
          className="jadwal-filter-select jadwal-filter-select-desktop"
        >
          <option value="">Semua Jenis</option>
          {jenisOptions.map((j) => (
            <option key={j} value={j}>
              {j}
            </option>
          ))}
        </select>
      </div>

      {/* Row 2: Select — hanya tampil di mobile */}
      <select
        value={activeJenis}
        onChange={(e) => updateParam("jenis", e.target.value)}
        className="jadwal-filter-select jadwal-filter-select-mobile"
      >
        <option value="">Semua Jenis</option>
        {jenisOptions.map((j) => (
          <option key={j} value={j}>
            {j}
          </option>
        ))}
      </select>
    </div>
  );
}
