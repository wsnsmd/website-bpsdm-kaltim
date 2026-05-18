// src/components/admin/dokumen/AdminDokumenNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, FolderOpen } from "lucide-react";

const TABS = [
  { href: "/admin/dokumen", label: "Semua Dokumen", icon: FileText },
  { href: "/admin/dokumen/kategori", label: "Kategori", icon: FolderOpen },
];

export function AdminDokumenNav() {
  const pathname = usePathname();

  return (
    <div
      style={{
        display: "flex",
        gap: "4px",
        borderBottom: "2px solid var(--color-ink-6)",
        marginBottom: "20px",
      }}
    >
      {TABS.map((tab) => {
        const active =
          tab.href === "/admin/dokumen"
            ? pathname === "/admin/dokumen" ||
              pathname.startsWith("/admin/dokumen/baru") ||
              (pathname.startsWith("/admin/dokumen/") &&
                !pathname.includes("kategori"))
            : pathname.startsWith(tab.href);

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
