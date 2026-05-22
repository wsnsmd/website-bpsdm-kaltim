// src/components/layout/HeaderLogoClient.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
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
      className="header-logo shrink-0 no-underline flex items-center gap-1.5"
    >
      {/* Gambar Logo */}
      <div className="relative w-10 h-11 shrink-0 flex items-center justify-center">
        <Image
          src="/pemprov.png"
          alt="Logo Pemprov Kaltim"
          width={40}
          height={44}
          className="object-contain"
          priority // Prioritaskan loading gambar ini karena ada di header
        />
      </div>

      {/* Teks logo */}
      <div className="header-logo-text flex flex-col justify-center">
        <div
          className="header-logo-name text-sm font-bold tracking-tight"
          style={{
            color: isTransparent ? "#fff" : "var(--color-forest-800)",
            transition: "color 0.3s",
          }}
        >
          BPSDM Kalimantan Timur
        </div>
        <div
          className="header-logo-sub text-[11px] mt-0.5 font-semibold"
          style={{
            color: isTransparent
              ? "var(--color-gold-400)"
              : "var(--color-ink-4)",
            transition: "color 0.3s",
          }}
        >
          Badan Pengembangan Sumber Daya Manusia
        </div>
      </div>
    </Link>
  );
}
