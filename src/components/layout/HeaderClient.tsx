// src/components/layout/HeaderClient.tsx
"use client";

import { useEffect, useState, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

// Gunakan useLayoutEffect di client, useEffect di server
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function HeaderScrollWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/web" || pathname === "/web/";

  // Inisialisasi langsung transparan jika home
  const [transparent, setTransparent] = useState(isHome);

  useIsomorphicLayoutEffect(() => {
    if (!isHome) {
      setTransparent(false);
      return;
    }

    function update() {
      setTransparent(window.scrollY <= 60);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [isHome]);

  return (
    <div
      suppressHydrationWarning
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
      data-transparent={String(transparent)}
    >
      {children}
    </div>
  );
}
