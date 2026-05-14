// src/components/admin/AdminSidebar.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Newspaper,
  GraduationCap,
  CalendarDays,
  Megaphone,
  Users,
  Settings,
  ExternalLink,
  ChevronDown,
  Circle,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  children?: { href: string; label: string }[];
};

const NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  {
    href: "/admin/berita",
    label: "Berita & Artikel",
    icon: Newspaper,
    children: [
      { href: "/admin/berita", label: "Semua Berita" },
      { href: "/admin/berita/baru", label: "Tambah Berita" },
      { href: "/admin/kategori", label: "Kategori" },
    ],
  },
  {
    href: "/admin/program",
    label: "Program Diklat",
    icon: GraduationCap,
    children: [
      { href: "/admin/program", label: "Semua Program" },
      { href: "/admin/program/baru", label: "Tambah Program" },
    ],
  },
  {
    href: "/admin/jadwal",
    label: "Jadwal Pelatihan",
    icon: CalendarDays,
    children: [
      { href: "/admin/jadwal", label: "Semua Jadwal" },
      { href: "/admin/jadwal/baru", label: "Tambah Jadwal" },
    ],
  },
  { href: "/admin/pengumuman", label: "Pengumuman", icon: Megaphone },
  { href: "/admin/pengguna", label: "Pengguna", icon: Users },
  { href: "/admin/pengaturan", label: "Pengaturan", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  // Sinkronisasi menu yang terbuka berdasarkan URL saat ini
  useEffect(() => {
    const activeMenu = NAV.find((item) =>
      item.children?.some((child) => pathname === child.href),
    );
    if (activeMenu && !openMenus.includes(activeMenu.href)) {
      setOpenMenus((prev) => [...prev, activeMenu.href]);
    }
  }, [pathname]);

  const toggleMenu = (href: string) => {
    setOpenMenus((prev) =>
      prev.includes(href) ? prev.filter((i) => i !== href) : [...prev, href],
    );
  };

  const isLinkActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <aside className="admin-sidebar">
      {/* Brand Header */}
      <div className="admin-sidebar-logo">
        <div className="admin-sidebar-logo-mark">
          <GraduationCap size={20} className="text-white" />
        </div>
        <div>
          <div className="admin-sidebar-logo-name">BPSDM KALTIM</div>
          <div className="admin-sidebar-logo-sub">Administrator</div>
        </div>
      </div>

      {/* Navigation Scroll Area */}
      <nav
        className="admin-sidebar-nav custom-scrollbar"
        aria-label="Navigasi admin"
      >
        {NAV.map((item) => {
          const active = isLinkActive(item.href);
          const hasChildren = !!item.children;
          const isOpen = openMenus.includes(item.href);

          return (
            <div key={item.href} className="admin-nav-group">
              {hasChildren ? (
                <>
                  <button
                    type="button"
                    onClick={() => toggleMenu(item.href)}
                    className={cn(
                      "admin-nav-item",
                      active && "admin-nav-item-active",
                    )}
                    style={{ width: "100%", justifyContent: "space-between" }}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={16} />
                      <span>{item.label}</span>
                    </div>
                    <ChevronDown
                      size={14}
                      className={cn(
                        "transition-transform duration-200 opacity-50",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="admin-nav-sub"
                        style={{ overflow: "hidden" }}
                      >
                        {item.children?.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "admin-nav-sub-item",
                              pathname === child.href &&
                                "admin-nav-sub-item-active",
                            )}
                          >
                            <Circle
                              size={3}
                              fill="currentColor"
                              className={cn(
                                "mr-2",
                                pathname === child.href
                                  ? "text-white"
                                  : "opacity-30",
                              )}
                            />
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "admin-nav-item",
                    active && "admin-nav-item-active",
                  )}
                >
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="admin-sidebar-footer">
        <Link href="/" className="admin-sidebar-back" target="_blank">
          <ExternalLink size={14} />
          <span>Lihat Situs</span>
        </Link>
      </div>
    </aside>
  );
}
