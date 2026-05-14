// src/components/layout/MainNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

type NavChild = {
  label: string;
  href: string;
};

type NavItem = {
  label: string;
  href?: string;
  children?: NavChild[];
};

const NAV_ITEMS: NavItem[] = [
  { label: "Beranda", href: "/" },
  {
    label: "Profil",
    children: [
      { href: "/profil/sejarah", label: "Sejarah BPSDM" },
      { href: "/profil/visi-misi", label: "Visi & Misi" },
      { href: "/profil/struktur", label: "Struktur Organisasi" },
      { href: "/profil/kepala-badan", label: "Kepala Badan" },
      { href: "/profil/tugas-fungsi", label: "Tugas & Fungsi" },
      { href: "/profil/widyaiswara", label: "Widyaiswara" },
      { href: "/profil/sambutan", label: "Sambutan Kepala Badan" },
    ],
  },
  {
    label: "Unit Kerja",
    children: [
      { href: "/unit/sekretariat", label: "Sekretariat BPSDM" },
      {
        href: "/unit/kompetensi-dasar",
        label: "Bidang Kompetensi Dasar & Manajerial",
      },
      {
        href: "/unit/kompetensi-fungsional",
        label: "Bidang Kompetensi Fungsional",
      },
      { href: "/unit/kompetensi-teknis", label: "Bidang Kompetensi Teknis" },
      { href: "/unit/informasi", label: "Bidang Informasi Kompetensi" },
      { href: "/unit/upt-sertifikasi", label: "UPT Sertifikasi Kompetensi" },
    ],
  },
  {
    label: "Program",
    children: [
      { href: "/program", label: "Katalog Program Diklat" },
      { href: "/program/jadwal", label: "Jadwal Pelatihan" },
      { href: "/program/daftar", label: "Pendaftaran Online" },
      { href: "/program/sertifikasi", label: "Uji Sertifikasi" },
    ],
  },
  {
    label: "Publikasi",
    children: [
      { href: "/berita", label: "Berita & Artikel" },
      { href: "/galeri", label: "Galeri Foto" },
      { href: "/video", label: "Video BPSDM" },
      { href: "/unduhan", label: "Unduhan Dokumen" },
      { href: "/pengumuman", label: "Pengumuman" },
    ],
  },
  { label: "Kontak", href: "/kontak" },
];

export function MainNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpen(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Tutup dropdown saat route berubah
  useEffect(() => {
    setOpen(null);
  }, [pathname]);

  function isActive(item: NavItem): boolean {
    if (item.href) return pathname === item.href;
    return item.children?.some((c) => pathname.startsWith(c.href)) ?? false;
  }

  return (
    <nav
      ref={navRef}
      className="flex items-center gap-0.5 ml-8"
      aria-label="Navigasi utama"
    >
      {NAV_ITEMS.map((item) => {
        const active = isActive(item);

        // Item tanpa dropdown
        if (!item.children) {
          return (
            <Link
              key={item.label}
              href={item.href!}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg",
                "text-[13.5px] font-medium transition-all duration-150",
                active
                  ? "text-forest-700 bg-forest-50 font-semibold"
                  : "text-ink-2 hover:text-forest-700 hover:bg-forest-50",
              )}
            >
              {item.label}
            </Link>
          );
        }

        // Item dengan dropdown
        const isOpen = open === item.label;

        return (
          <div key={item.label} className="relative">
            <button
              onClick={() => setOpen(isOpen ? null : item.label)}
              aria-expanded={isOpen}
              aria-haspopup="true"
              className={cn(
                "flex items-center gap-1 px-3 py-2 rounded-lg",
                "text-[13.5px] font-medium transition-all duration-150",
                "border-none bg-transparent cursor-pointer",
                active || isOpen
                  ? "text-forest-700 bg-forest-50 font-semibold"
                  : "text-ink-2 hover:text-forest-700 hover:bg-forest-50",
              )}
            >
              {item.label}
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                style={{
                  color: "var(--color-ink-4)",
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Dropdown */}
            {isOpen && (
              <div
                className="absolute top-full left-0 mt-1.5 w-64 bg-white rounded-xl overflow-hidden"
                style={{
                  border: "1px solid var(--color-ink-6)",
                  boxShadow: "0 8px 28px rgba(14,61,32,0.10)",
                  zIndex: 80,
                  animation: "slideDown 0.15s ease-out",
                }}
              >
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={cn(
                      "block px-4 py-2.5 text-[13px] transition-colors duration-100",
                      pathname === child.href
                        ? "text-forest-700 bg-forest-50 font-semibold"
                        : "text-ink-2 hover:text-forest-700 hover:bg-forest-50",
                    )}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
