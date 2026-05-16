// src/components/ui/SidebarNav.tsx
"use client";

import Link from "next/link";
import {
  Home,
  Newspaper,
  GraduationCap,
  Phone,
  FileText,
  Calendar,
  Users,
  Award,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/berita", label: "Berita & Artikel", icon: Newspaper },
  { href: "/program", label: "Program Diklat", icon: GraduationCap },
  { href: "/kontak", label: "Kontak", icon: Phone },
];

export function SidebarNav() {
  return (
    <div className="bg-white rounded-xl border border-ink-6 overflow-hidden">
      <div className="bg-ink p-4">
        <h3 className="text-white font-semibold text-sm">Navigasi</h3>
      </div>
      <div className="p-2">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 text-ink-2 hover:text-forest-700 hover:bg-forest-50 rounded-lg transition-colors text-sm"
          >
            <item.icon size={16} />
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
