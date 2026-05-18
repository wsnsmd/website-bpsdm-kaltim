// src/components/documents/DocumentFilter.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, X, Filter, FolderOpen } from "lucide-react";
import type { DocumentCategoryItem } from "@/lib/queries/documents";

type Props = {
  categories: DocumentCategoryItem[];
  years: number[];
  activeCategory?: string;
  activeYear?: number;
  search?: string;
};

export function DocumentFilter({
  categories,
  years,
  activeCategory,
  activeYear,
  search: initialSearch,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialSearch ?? "");

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("halaman");
    router.push(`/unduhan?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateParams("cari", search);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Search */}
      <div className="sidebar-widget">
        <div className="sidebar-widget-head">
          <Search size={15} />
          Cari Dokumen
        </div>
        <div className="sidebar-widget-body">
          <form onSubmit={handleSearch} style={{ display: "flex", gap: "6px" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nama dokumen..."
                className="admin-input"
                style={{
                  paddingRight: search ? "32px" : "12px",
                  fontSize: "13px",
                }}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    updateParams("cari", "");
                  }}
                  style={{
                    position: "absolute",
                    right: "8px",
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
                  <X size={13} />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="admin-btn-save"
              style={{ padding: "0 12px", height: "38px" }}
            >
              <Search size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* Kategori */}
      <div className="sidebar-widget">
        <div className="sidebar-widget-head">
          <FolderOpen size={15} />
          Kategori
        </div>
        <div>
          {/* Semua */}
          <button
            onClick={() => updateParams("kategori", "")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              padding: "9px 16px",
              background: !activeCategory
                ? "var(--color-forest-50)"
                : "transparent",
              border: "none",
              borderLeft: !activeCategory
                ? "3px solid var(--color-forest-700)"
                : "3px solid transparent",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: !activeCategory ? 700 : 400,
              color: !activeCategory
                ? "var(--color-forest-700)"
                : "var(--color-ink-2)",
              textAlign: "left",
            }}
          >
            <span>Semua Kategori</span>
            <span
              style={{
                fontSize: "11px",
                color: "var(--color-ink-4)",
                background: "var(--color-ink-7)",
                padding: "1px 7px",
                borderRadius: "20px",
              }}
            >
              {categories.reduce((s, c) => s + (c.count ?? 0), 0)}
            </span>
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateParams("kategori", cat.slug)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                padding: "9px 16px",
                background:
                  activeCategory === cat.slug
                    ? "var(--color-forest-50)"
                    : "transparent",
                border: "none",
                borderLeft:
                  activeCategory === cat.slug
                    ? `3px solid ${cat.color ?? "var(--color-forest-700)"}`
                    : "3px solid transparent",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: activeCategory === cat.slug ? 700 : 400,
                color:
                  activeCategory === cat.slug
                    ? (cat.color ?? "var(--color-forest-700)")
                    : "var(--color-ink-2)",
                textAlign: "left",
              }}
            >
              <span>{cat.name}</span>
              <span
                style={{
                  fontSize: "11px",
                  color: "var(--color-ink-4)",
                  background: "var(--color-ink-7)",
                  padding: "1px 7px",
                  borderRadius: "20px",
                }}
              >
                {cat.count ?? 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tahun */}
      {years.length > 0 && (
        <div className="sidebar-widget">
          <div className="sidebar-widget-head">Tahun</div>
          <div
            style={{
              padding: "10px 14px",
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
            }}
          >
            <button
              onClick={() => updateParams("tahun", "")}
              style={{
                padding: "4px 12px",
                borderRadius: "20px",
                cursor: "pointer",
                border: `1px solid ${!activeYear ? "var(--color-forest-600)" : "var(--color-ink-6)"}`,
                background: !activeYear ? "var(--color-forest-700)" : "#fff",
                color: !activeYear ? "#fff" : "var(--color-ink-3)",
                fontSize: "12.5px",
                fontWeight: !activeYear ? 700 : 400,
              }}
            >
              Semua
            </button>
            {years.map((y) => (
              <button
                key={y}
                onClick={() => updateParams("tahun", String(y))}
                style={{
                  padding: "4px 12px",
                  borderRadius: "20px",
                  cursor: "pointer",
                  border: `1px solid ${activeYear === y ? "var(--color-forest-600)" : "var(--color-ink-6)"}`,
                  background:
                    activeYear === y ? "var(--color-forest-700)" : "#fff",
                  color: activeYear === y ? "#fff" : "var(--color-ink-3)",
                  fontSize: "12.5px",
                  fontWeight: activeYear === y ? 700 : 400,
                }}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
