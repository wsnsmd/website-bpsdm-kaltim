// src/components/layout/SearchButton.tsx
"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

export function SearchButton() {
  const [isTransparent, setIsTransparent] = useState(false);

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

  return (
    <button
      aria-label="Buka pencarian"
      onClick={() => {
        /* TODO: open search */
      }}
      style={{
        width: "36px",
        height: "36px",
        borderRadius: "9px",
        border: isTransparent
          ? "1px solid rgba(255,255,255,0.15)"
          : "1px solid var(--color-ink-6)",
        background: isTransparent ? "rgba(255,255,255,0.08)" : "transparent",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: isTransparent ? "rgba(255,255,255,0.7)" : "var(--color-ink-2)",
        transition: "all 0.2s",
        flexShrink: 0,
      }}
    >
      <Search size={17} strokeWidth={2} />
    </button>
  );
}
