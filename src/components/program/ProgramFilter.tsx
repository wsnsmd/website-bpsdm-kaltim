// src/components/program/ProgramFilter.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";

const TYPES = [
  { value: "", label: "Semua Jenis" },
  { value: "teknis", label: "Kompetensi Teknis" },
  { value: "fungsional", label: "Kompetensi Fungsional" },
  { value: "manajerial", label: "Kompetensi Manajerial" },
  { value: "pola-apbd", label: "Pola APBD" },
  { value: "pola-kontribusi", label: "Pola Kontribusi" },
  { value: "pola-kemitraan", label: "Pola Kemitraan" },
  { value: "orientasi", label: "Orientasi" },
];

export function ProgramFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeType = searchParams.get("jenis") ?? "";

  function handleType(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("jenis", value);
    } else {
      params.delete("jenis");
    }
    params.delete("halaman");
    router.push(`/program?${params.toString()}`);
  }

  return (
    <div className="cat-filter-bar">
      {TYPES.map((t) => (
        <button
          key={t.value}
          onClick={() => handleType(t.value)}
          className={`cat-filter-pill ${
            activeType === t.value ? "cat-filter-pill-active" : ""
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
