// src/components/layout/HeaderLogoClient.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function HeaderLogoClient() {
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
    <Link
      href="/"
      className="header-logo"
      style={{ flexShrink: 0, textDecoration: "none" }}
    >
      {/* Logo mark */}
      <div className="header-logo-mark">
        <div className="header-logo-accent" />
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          style={{ position: "relative", zIndex: 1 }}
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </div>

      {/* Teks logo */}
      <div className="header-logo-text">
        <div
          className="header-logo-name"
          style={{
            color: isTransparent ? "#fff" : "var(--color-forest-800)",
            transition: "color 0.3s",
          }}
        >
          BPSDM Kalimantan Timur
        </div>
        <div
          className="header-logo-sub"
          style={{
            color: isTransparent
              ? "rgba(255,255,255,0.5)"
              : "var(--color-ink-2)",
            transition: "color 0.3s",
          }}
        >
          Badan Pengembangan Sumber Daya Manusia
        </div>
      </div>
    </Link>
  );
}
