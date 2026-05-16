// src/components/admin/profil/AdminProfilNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Users, Building2 } from "lucide-react";

const TABS = [
  { href: "/admin/profil/pages", label: "Halaman", icon: FileText },
  { href: "/admin/profil/staff", label: "Pegawai & Pimpinan", icon: Users },
  { href: "/admin/profil/units", label: "Unit Kerja", icon: Building2 },
];

export function AdminProfilNav() {
  const pathname = usePathname();

  return (
    <div
      style={{
        display: "flex",
        gap: "4px",
        borderBottom: "2px solid var(--color-ink-6)",
        paddingBottom: "0",
      }}
    >
      {TABS.map((tab) => {
        const active = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "10px 18px",
              fontSize: "13.5px",
              fontWeight: active ? 700 : 500,
              color: active ? "var(--color-forest-800)" : "var(--color-ink-3)",
              borderBottom: active
                ? "2px solid var(--color-forest-700)"
                : "2px solid transparent",
              marginBottom: "-2px",
              textDecoration: "none",
              transition: "all 0.15s",
              background: active ? "var(--color-forest-50)" : "transparent",
              borderRadius: "8px 8px 0 0",
            }}
          >
            <tab.icon size={15} />
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
