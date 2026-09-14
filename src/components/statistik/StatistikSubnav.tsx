// src/components/statistik/StatistikSubnav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { label: "Realisasi Anggaran", href: "/statistik/realisasi-anggaran" },
  // { label: "Kompetensi ASN", href: "/statistik/kompetensi-asn" },
];

export function StatistikSubnav() {
  const pathname = usePathname();

  return (
    <div
      style={{
        background: "var(--color-forest-900)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        className="container-content"
        style={{ display: "flex", gap: "28px", height: "46px", overflowX: "auto" }}
      >
        {TABS.map((tab) => {
          const active = pathname?.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "13px",
                fontWeight: active ? 700 : 500,
                color: active ? "#fff" : "rgba(255,255,255,0.55)",
                borderBottom: active
                  ? "2px solid var(--color-gold-400)"
                  : "2px solid transparent",
                whiteSpace: "nowrap",
                textDecoration: "none",
                transition: "color 0.12s",
              }}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
