// src/components/program/JadwalFilter.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  jenisOptions: string[];
};

const STATUS_OPTIONS = [
  { value: "", label: "Semua Status" },
  { value: "akan-datang", label: "Akan Datang" },
  { value: "berlangsung", label: "Sedang Berlangsung" },
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
    <div
      style={{
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
        marginBottom: "20px",
      }}
    >
      {/* Filter Status */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span
          style={{
            fontSize: "12.5px",
            color: "var(--color-ink-4)",
            fontWeight: 500,
            flexShrink: 0,
          }}
        >
          Status:
        </span>
        <div className="cat-filter-bar" style={{ marginBottom: 0, gap: "6px" }}>
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s.value}
              onClick={() => updateParam("status", s.value)}
              className={`cat-filter-pill ${activeStatus === s.value ? "cat-filter-pill-active" : ""}`}
              style={{ fontSize: "12px", padding: "5px 12px" }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Jenis */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span
          style={{
            fontSize: "12.5px",
            color: "var(--color-ink-4)",
            fontWeight: 500,
            flexShrink: 0,
          }}
        >
          Jenis:
        </span>
        <select
          value={activeJenis}
          onChange={(e) => updateParam("jenis", e.target.value)}
          className="tiptap-select"
          style={{ height: "34px", fontSize: "12.5px" }}
        >
          <option value="">Semua Jenis</option>
          {jenisOptions.map((j) => (
            <option key={j} value={j}>
              {j}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
