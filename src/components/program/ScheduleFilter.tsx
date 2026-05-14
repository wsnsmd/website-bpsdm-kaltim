// src/components/program/ScheduleFilter.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";

const MODES = [
  { value: "", label: "Semua Mode" },
  { value: "online", label: "Daring" },
  { value: "offline", label: "Luring" },
  { value: "blended", label: "Mandiri" },
];

const STATUSES = [
  { value: "", label: "Semua Status" },
  { value: "open", label: "Bisa Daftar" },
  { value: "full", label: "Penuh" },
];

export function ScheduleFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeMode = searchParams.get("mode") ?? "";
  const activeStatus = searchParams.get("status") ?? "";

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("halaman");
    router.push(`/program/jadwal?${params.toString()}`);
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "24px",
        flexWrap: "wrap",
        marginBottom: "24px",
      }}
    >
      {/* Mode filter */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span
          style={{
            fontSize: "13px",
            color: "var(--color-ink-4)",
            fontWeight: 500,
            flexShrink: 0,
          }}
        >
          Mode:
        </span>
        <div className="cat-filter-bar" style={{ marginBottom: 0 }}>
          {MODES.map((m) => (
            <button
              key={m.value}
              onClick={() => updateParam("mode", m.value)}
              className={`cat-filter-pill ${
                activeMode === m.value ? "cat-filter-pill-active" : ""
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Status filter */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span
          style={{
            fontSize: "13px",
            color: "var(--color-ink-4)",
            fontWeight: 500,
            flexShrink: 0,
          }}
        >
          Status:
        </span>
        <div className="cat-filter-bar" style={{ marginBottom: 0 }}>
          {STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => updateParam("status", s.value)}
              className={`cat-filter-pill ${
                activeStatus === s.value ? "cat-filter-pill-active" : ""
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
