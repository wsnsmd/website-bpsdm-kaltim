// src/components/news/NewsSearchBar.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, X } from "lucide-react";

export function NewsSearchBar({
  initialValue = "",
}: {
  initialValue?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initialValue);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) params.set("cari", value.trim());
    else params.delete("cari");
    params.delete("halaman");
    startTransition(() => router.push(`/berita?${params.toString()}`));
  }

  function handleClear() {
    setValue("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("cari");
    params.delete("halaman");
    startTransition(() => router.push(`/berita?${params.toString()}`));
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ position: "relative", width: "280px" }}
    >
      <Search
        size={15}
        style={{
          position: "absolute",
          left: "12px",
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
        placeholder="Cari berita..."
        style={{
          width: "100%",
          paddingBlock: "9px",
          paddingLeft: "36px",
          paddingRight: value ? "36px" : "12px",
          borderRadius: "10px",
          border: "1px solid var(--color-ink-5)",
          background: "#fff",
          fontSize: "13.5px",
          color: "var(--color-ink)",
          outline: "none",
          transition: "border-color 0.15s",
        }}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--color-ink-4)",
            display: "flex",
            alignItems: "center",
            padding: "2px",
          }}
        >
          <X size={14} />
        </button>
      )}
    </form>
  );
}
