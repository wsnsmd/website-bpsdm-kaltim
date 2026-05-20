// src/components/search/SearchModal.tsx
"use client";

import { useState, useEffect, useRef, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  X,
  FileText,
  Briefcase,
  FolderOpen,
  ArrowRight,
  Loader2,
  Clock,
} from "lucide-react";
import type { SearchResult } from "@/lib/queries/search";

const TYPE_CONFIG = {
  berita: {
    label: "Berita",
    icon: FileText,
    color: "var(--color-forest-700)",
    bg: "var(--color-forest-50)",
  },
  program: {
    label: "Program",
    icon: Briefcase,
    color: "#1d4ed8",
    bg: "#eff6ff",
  },
  dokumen: {
    label: "Dokumen",
    icon: FolderOpen,
    color: "#c2410c",
    bg: "#fff7ed",
  },
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function SearchModal({ isOpen, onClose }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Focus input saat modal buka
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
      setActiveIdx(-1);
    }
  }, [isOpen]);

  // Debounce search
  const doSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results ?? []);
      setActiveIdx(-1);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(query), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, doSearch]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, results.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, -1));
      }
      if (e.key === "Enter" && activeIdx >= 0) {
        e.preventDefault();
        router.push(results[activeIdx].url);
        onClose();
      }
      if (e.key === "Enter" && activeIdx < 0 && query.trim().length >= 2) {
        router.push(`/cari?q=${encodeURIComponent(query.trim())}`);
        onClose();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, results, activeIdx, query, onClose, router]);

  if (!isOpen) return null;

  const hasResults = results.length > 0;
  const showEmpty = query.trim().length >= 2 && !loading && !hasResults;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          zIndex: 9998,
          backdropFilter: "blur(2px)",
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "80px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(640px, 94vw)",
          zIndex: 9999,
          animation: "slideDownFade 0.2s ease",
        }}
      >
        {/* Search input */}
        <div
          style={{
            background: "#fff",
            borderRadius:
              hasResults || showEmpty || loading ? "14px 14px 0 0" : "14px",
            border: "1px solid var(--color-ink-5)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "14px 16px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          }}
        >
          {loading ? (
            <Loader2
              size={20}
              style={{
                color: "var(--color-ink-4)",
                flexShrink: 0,
                animation: "spin 0.8s linear infinite",
              }}
            />
          ) : (
            <Search
              size={20}
              style={{ color: "var(--color-ink-4)", flexShrink: 0 }}
            />
          )}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari berita, program, dokumen..."
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: "16px",
              color: "var(--color-ink)",
              background: "transparent",
            }}
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
                inputRef.current?.focus();
              }}
              style={{
                background: "var(--color-ink-7)",
                border: "none",
                borderRadius: "50%",
                width: "22px",
                height: "22px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <X size={13} style={{ color: "var(--color-ink-3)" }} />
            </button>
          )}
          <kbd
            style={{
              padding: "3px 7px",
              borderRadius: "5px",
              background: "var(--color-ink-7)",
              border: "1px solid var(--color-ink-5)",
              fontSize: "11px",
              color: "var(--color-ink-4)",
              fontFamily: "monospace",
              flexShrink: 0,
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Hasil */}
        {(hasResults || showEmpty || (loading && query.length >= 2)) && (
          <div
            style={{
              background: "#fff",
              borderRadius: "0 0 14px 14px",
              border: "1px solid var(--color-ink-5)",
              borderTop: "1px solid var(--color-ink-7)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
              overflow: "hidden",
              maxHeight: "60vh",
              overflowY: "auto",
            }}
          >
            {/* Loading skeleton */}
            {loading && (
              <div
                style={{
                  padding: "20px 16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      height: "52px",
                      borderRadius: "8px",
                      background:
                        "linear-gradient(90deg, var(--color-ink-7) 25%, var(--color-ink-6) 50%, var(--color-ink-7) 75%)",
                      backgroundSize: "200% 100%",
                      animation: "shimmer 1.2s infinite",
                    }}
                  />
                ))}
              </div>
            )}

            {/* Empty */}
            {showEmpty && (
              <div
                style={{
                  padding: "32px",
                  textAlign: "center",
                  color: "var(--color-ink-4)",
                  fontSize: "14px",
                }}
              >
                <Search
                  size={28}
                  style={{ margin: "0 auto 10px", opacity: 0.3 }}
                />
                Tidak ada hasil untuk <strong>"{query}"</strong>
              </div>
            )}

            {/* Hasil pencarian */}
            {!loading && hasResults && (
              <>
                {results.map((result, i) => {
                  const cfg = TYPE_CONFIG[result.type];
                  const Icon = cfg.icon;
                  const active = i === activeIdx;

                  return (
                    <Link
                      key={`${result.type}-${result.id}`}
                      href={result.url}
                      onClick={onClose}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px 16px",
                        textDecoration: "none",
                        background: active ? "var(--color-forest-50)" : "#fff",
                        borderBottom:
                          i < results.length - 1
                            ? "1px solid var(--color-ink-7)"
                            : "none",
                        transition: "background 0.1s",
                      }}
                      onMouseEnter={() => setActiveIdx(i)}
                    >
                      {/* Icon tipe */}
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "9px",
                          background: cfg.bg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={16} style={{ color: cfg.color }} />
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: "13.5px",
                            fontWeight: 600,
                            color: active
                              ? "var(--color-forest-800)"
                              : "var(--color-ink)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            marginBottom: "2px",
                          }}
                        >
                          {result.title}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "11.5px",
                            color: "var(--color-ink-4)",
                          }}
                        >
                          <span style={{ fontWeight: 700, color: cfg.color }}>
                            {cfg.label}
                          </span>
                          {result.category && (
                            <>
                              <span>·</span>
                              <span>{result.category}</span>
                            </>
                          )}
                          {result.meta && (
                            <>
                              <span>·</span>
                              <span
                                style={{
                                  padding: "1px 5px",
                                  borderRadius: "4px",
                                  background: "var(--color-ink-7)",
                                  fontWeight: 700,
                                  fontSize: "10px",
                                  color: "var(--color-ink-4)",
                                }}
                              >
                                {result.meta}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <ArrowRight
                        size={14}
                        style={{
                          color: active
                            ? "var(--color-forest-600)"
                            : "var(--color-ink-5)",
                          flexShrink: 0,
                        }}
                      />
                    </Link>
                  );
                })}

                {/* Lihat semua hasil */}
                <Link
                  href={`/cari?q=${encodeURIComponent(query)}`}
                  onClick={onClose}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    padding: "12px",
                    borderTop: "1px solid var(--color-ink-6)",
                    background: "var(--color-ink-8)",
                    textDecoration: "none",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "var(--color-forest-700)",
                    transition: "background 0.12s",
                  }}
                >
                  Lihat semua hasil untuk "{query}"
                  <ArrowRight size={14} />
                </Link>
              </>
            )}

            {/* Tips keyboard */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "8px 16px",
                borderTop: hasResults ? "none" : "1px solid var(--color-ink-7)",
                background: "var(--color-ink-8)",
                fontSize: "11px",
                color: "var(--color-ink-4)",
              }}
            >
              {[
                { key: "↑↓", label: "navigasi" },
                { key: "↵", label: "buka" },
                { key: "ESC", label: "tutup" },
              ].map((k) => (
                <div
                  key={k.key}
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <kbd
                    style={{
                      padding: "1px 5px",
                      borderRadius: "4px",
                      background: "#fff",
                      border: "1px solid var(--color-ink-5)",
                      fontFamily: "monospace",
                      fontSize: "10px",
                      color: "var(--color-ink-3)",
                    }}
                  >
                    {k.key}
                  </kbd>
                  <span>{k.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
