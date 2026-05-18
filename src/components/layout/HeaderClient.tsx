// src/components/layout/HeaderClient.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function HeaderScrollWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Hanya transparan di halaman beranda
  const isHome = pathname === "/";

  useEffect(() => {
    if (!isHome) return;

    function handleScroll() {
      setScrolled(window.scrollY > 60);
    }

    handleScroll(); // cek awal
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  const transparent = isHome && !scrolled;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: transparent ? "transparent" : "#fff",
        borderBottom: transparent
          ? "0px solid transparent"
          : "1px solid var(--color-ink-6)",
        boxShadow: transparent ? "none" : "0 1px 8px rgba(0,0,0,0.06)",
        transition: "background 0.3s, border-color 0.3s, box-shadow 0.3s",
      }}
      data-transparent={transparent}
    >
      {children}
    </div>
  );
}
