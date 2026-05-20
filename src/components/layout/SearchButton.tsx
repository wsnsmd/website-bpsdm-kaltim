// src/components/layout/SearchButton.tsx
"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { SearchModal } from "@/components/search/SearchModal";

export function SearchButton() {
  const [open, setOpen] = useState(false);
  const [isTransparent, setIsTransparent] = useState(false);

  // Deteksi header transparent
  useEffect(() => {
    function check() {
      const wrapper = document.querySelector("[data-transparent]");
      setIsTransparent(wrapper?.getAttribute("data-transparent") === "true");
    }

    check();

    const observer = new MutationObserver(check);
    const wrapper = document.querySelector("[data-transparent]");
    if (wrapper) {
      observer.observe(wrapper, {
        attributes: true,
        attributeFilter: ["data-transparent"],
      });
    }
    return () => observer.disconnect();
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Buka pencarian"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 12px",
          borderRadius: "9px",
          border: isTransparent
            ? "1px solid rgba(255,255,255,0.15)"
            : "1px solid var(--color-ink-6)",
          background: isTransparent ? "rgba(255,255,255,0.08)" : "transparent",
          color: isTransparent ? "rgba(255,255,255,0.7)" : "var(--color-ink-2)",
          cursor: "pointer",
          fontSize: "13px",
          transition: "all 0.2s",
          flexShrink: 0,
        }}
        className="search-btn"
      >
        <Search size={17} strokeWidth={2} />
        <span className="search-btn-label" style={{ display: "none" }}>
          Cari...
        </span>
        <kbd
          style={{
            padding: "1px 5px",
            borderRadius: "4px",
            background: isTransparent
              ? "rgba(255,255,255,0.1)"
              : "var(--color-ink-7)",
            border: isTransparent
              ? "1px solid rgba(255,255,255,0.15)"
              : "1px solid var(--color-ink-5)",
            fontSize: "10px",
            fontFamily: "monospace",
            color: isTransparent
              ? "rgba(255,255,255,0.4)"
              : "var(--color-ink-4)",
            transition: "all 0.2s",
          }}
        >
          ⌘K
        </kbd>
      </button>

      <SearchModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
