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
  Megaphone,
  Users,
  Settings,
  ExternalLink,
  ChevronDown,
  Circle,
  X,
  BookOpen,
  Menu,
  FolderOpen,
  LayoutGrid,
  ShieldCheck,
  Images,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  roles?: string[]; // ← tambahan: undefined = semua role bisa akses
  children?: { href: string; label: string }[];
};

const NAV: NavItem[] = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/berita",
    label: "Berita & Artikel",
    icon: Newspaper,
    children: [
      { href: "/admin/berita", label: "Semua Berita" },
      { href: "/admin/berita/baru", label: "Tambah Berita" },
      { href: "/admin/kategori", label: "Kategori" }, // ← tambahkan
    ],
  },
  {
    href: "/admin/profil",
    label: "Profil & Konten",
    icon: BookOpen,
    roles: ["superadmin", "admin"],
    children: [
      { href: "/admin/profil/pages", label: "Halaman" },
      { href: "/admin/profil/staff", label: "Pegawai" },
      { href: "/admin/profil/units", label: "Unit Kerja" },
    ],
  },
  {
    href: "/admin/program",
    label: "Program Diklat",
    icon: GraduationCap,
    roles: ["superadmin", "admin"], // ← hanya admin ke atas
    children: [
      { href: "/admin/program", label: "Semua Program" },
      { href: "/admin/program/baru", label: "Tambah Program" },
    ],
  },
  {
    href: "/admin/pengumuman",
    label: "Pengumuman",
    icon: Megaphone,
    children: [
      { href: "/admin/pengumuman", label: "Semua Pengumuman" },
      { href: "/admin/pengumuman/baru", label: "Tambah Pengumuman" },
    ],
  },
  // Di NAV array:
  {
    href: "/admin/galeri",
    label: "Galeri",
    icon: Images,
    roles: ["superadmin", "admin", "editor"],
  },
  {
    href: "/admin/dokumen",
    label: "Dokumen",
    icon: FolderOpen,
    roles: ["superadmin", "admin", "editor"],
    children: [
      { href: "/admin/dokumen", label: "Semua Dokumen" },
      { href: "/admin/dokumen/baru", label: "Tambah Dokumen" },
      { href: "/admin/dokumen/kategori", label: "Kategori" },
    ],
  },
  {
    href: "/admin/ppid",
    label: "PPID",
    icon: ShieldCheck,
    roles: ["superadmin", "admin"],
    children: [
      { href: "/admin/ppid", label: "Permohonan" },
      { href: "/admin/ppid/informasi", label: "Informasi Publik" },
    ],
  },
  {
    href: "/admin/platform",
    label: "Platform & Layanan",
    icon: LayoutGrid,
    roles: ["superadmin", "admin"],
  },
  {
    href: "/admin/menu",
    label: "Menu Navigasi",
    icon: Menu,
    roles: ["superadmin", "admin"],
  },
  {
    href: "/admin/pengguna",
    label: "Pengguna",
    icon: Users,
    roles: ["superadmin"], // ← hanya superadmin
  },
  {
    href: "/admin/pengaturan",
    label: "Pengaturan",
    icon: Settings,
    roles: ["superadmin"],
  },
];

interface AdminSidebarProps {
  role?: string; // ← tambahan: role dari session
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({
  role = "viewer",
  isOpen = true,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  // Filter NAV berdasarkan role — satu-satunya perubahan logika
  const visibleNav = NAV.filter(
    (item) => !item.roles || item.roles.includes(role),
  );

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  useEffect(() => {
    const activeMenu = visibleNav.find((item) =>
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

  // ── SidebarContent — UI identik dengan asli ──
  const SidebarContent = () => (
    <>
      {/* Brand Header */}
      <div className="admin-sidebar-logo">
        <div className="admin-sidebar-logo-mark">
          <GraduationCap size={20} className="text-white" />
        </div>
        <div className={cn("admin-sidebar-logo-text", !isOpen && "hidden")}>
          <div className="admin-sidebar-logo-name">BPSDM KALTIM</div>
          <div className="admin-sidebar-logo-sub">Administrator</div>
        </div>
      </div>

      {/* Navigation */}
      <nav
        className="admin-sidebar-nav custom-scrollbar"
        aria-label="Navigasi admin"
      >
        {/* ← pakai visibleNav, bukan NAV */}
        {visibleNav.map((item) => {
          const active = isLinkActive(item.href);
          const hasChildren = !!item.children;
          const isMenuOpen = openMenus.includes(item.href);

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
                      !isOpen && "justify-center",
                    )}
                    style={{ width: "100%", justifyContent: "space-between" }}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={16} />
                      <span className={cn(!isOpen && "hidden")}>
                        {item.label}
                      </span>
                    </div>
                    {isOpen && (
                      <ChevronDown
                        size={14}
                        className={cn(
                          "transition-transform duration-200 opacity-50",
                          isMenuOpen && "rotate-180",
                        )}
                      />
                    )}
                  </button>

                  {isOpen && (
                    <AnimatePresence>
                      {isMenuOpen && (
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
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "admin-nav-item",
                    active && "admin-nav-item-active",
                    !isOpen && "justify-center",
                  )}
                  title={!isOpen ? item.label : undefined}
                >
                  <item.icon size={16} />
                  <span className={cn(!isOpen && "hidden")}>{item.label}</span>
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="admin-sidebar-footer">
        <Link
          href="/"
          className={cn("admin-sidebar-back", !isOpen && "justify-center")}
          target="_blank"
          title={!isOpen ? "Lihat Situs" : undefined}
        >
          <ExternalLink size={14} />
          <span className={cn(!isOpen && "hidden")}>Lihat Situs</span>
        </Link>
      </div>
    </>
  );

  // Mobile sidebar
  if (isMobile) {
    return (
      <>
        {isOpen && (
          <>
            <div className="admin-sidebar-overlay" onClick={onClose} />
            <aside className="admin-sidebar-mobile">
              <div className="admin-sidebar-mobile-header">
                <div className="admin-sidebar-logo">
                  <div className="admin-sidebar-logo-mark">
                    <GraduationCap size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="admin-sidebar-logo-name">BPSDM KALTIM</div>
                    <div className="admin-sidebar-logo-sub">Administrator</div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="admin-mobile-close-btn"
                  aria-label="Tutup menu"
                >
                  <X size={20} />
                </button>
              </div>
              <SidebarContent />
            </aside>
          </>
        )}
      </>
    );
  }

  // Desktop sidebar
  return (
    <aside className={cn("admin-sidebar-desktop", !isOpen && "collapsed")}>
      <SidebarContent />
    </aside>
  );
}
