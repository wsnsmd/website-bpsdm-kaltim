// src/components/ppid/DipSearchBar.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, X } from "lucide-react";

type Props = {
  initialValue: string;
  tipe?: string;
  sort?: string;
};

export function DipSearchBar({ initialValue, tipe, sort }: Props) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue);
  const [isPending, startT] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (tipe) params.set("tipe", tipe);
    if (value.trim()) params.set("cari", value.trim());
    if (sort && sort !== "terbaru") params.set("sort", sort);
    startT(() => {
      router.push(`/ppid/daftar-informasi?${params.toString()}`);
    });
  }

  function handleClear() {
    setValue("");
    const params = new URLSearchParams();
    if (tipe) params.set("tipe", tipe);
    if (sort && sort !== "terbaru") params.set("sort", sort);
    startT(() => {
      router.push(`/ppid/daftar-informasi?${params.toString()}`);
    });
  }

  return (
    <form onSubmit={handleSubmit} style={{ position: "relative" }}>
      <Search
        size={14}
        style={{
          position: "absolute",
          left: "11px",
          top: "50%",
          transform: "translateY(-50%)",
          color: "var(--color-ink-4)",
          pointerEvents: "none",
        }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Cari judul dokumen..."
        style={{
          width: "100%",
          paddingBlock: "8px",
          paddingLeft: "32px",
          paddingRight: value ? "32px" : "12px",
          borderRadius: "8px",
          border: "1px solid var(--color-ink-5)",
          fontSize: "13.5px",
          color: "var(--color-ink)",
          outline: "none",
          background: isPending ? "var(--color-ink-8)" : "#fff",
          transition: "border-color 0.15s",
          boxSizing: "border-box",
        }}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          style={{
            position: "absolute",
            right: "8px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--color-ink-4)",
            padding: "2px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <X size={14} />
        </button>
      )}
    </form>
  );
}
