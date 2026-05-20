// src/components/admin/ppid/AdminPpidNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, FolderOpen, Users } from "lucide-react";

const TABS = [
  { href: "/admin/ppid", label: "Permohonan", icon: FileText },
  {
    href: "/admin/ppid/informasi",
    label: "Informasi Publik",
    icon: FolderOpen,
  },
];

export function AdminPpidNav() {
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
          tab.href === "/admin/ppid"
            ? pathname === "/admin/ppid" ||
              /^\/admin\/ppid\/\d+$/.test(pathname)
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
