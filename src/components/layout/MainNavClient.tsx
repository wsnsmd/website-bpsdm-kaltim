// src/components/layout/MainNavClient.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Menu, X, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

// Tipe yang sesuai dengan data dari database
type MenuItem = {
  id: number;
  label: string;
  url: string | null;
  parentId: number | null;
  sortOrder: number | null; // Bisa null
  menuGroupId: number;
  target: string | null;
  isActive: boolean | null;
  children?: MenuItem[];
};

interface MainNavClientProps {
  menuItems: MenuItem[];
  isMobileMenuButtonOnly?: boolean;
}

export function MainNavClient({
  menuItems,
  isMobileMenuButtonOnly = false,
}: MainNavClientProps) {
  const pathname = usePathname();
  const [openDesktop, setOpenDesktop] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<number | null>(
    null,
  );
  const [isTransparent, setIsTransparent] = useState(false);
  const desktopNavRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Filter menu items yang aktif untuk ditampilkan
  const activeMenuItems = menuItems.filter((item) => item.isActive !== false);

  // Handle hover untuk desktop
  const handleMouseEnter = (id: number) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setOpenDesktop(id);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setOpenDesktop(null);
    }, 150); // Delay 150ms untuk mencegah flicker saat berpindah
  };

  // Tutup menu saat route berubah
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenMobileDropdown(null);
    setOpenDesktop(null);
  }, [pathname]);

  // Lock body scroll saat mobile menu terbuka
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

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

  function isActive(item: MenuItem): boolean {
    if (item.url) {
      // Handle external links
      if (item.url.startsWith("http")) return false;
      // Handle root path
      if (item.url === "/") return pathname === "/";
      // Check if current path starts with menu url
      return pathname === item.url || pathname.startsWith(item.url + "/");
    }
    return false;
  }

  // Jika hanya tombol menu (untuk mobile)
  if (isMobileMenuButtonOnly) {
    return (
      <>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg border border-ink-6 bg-white text-ink-2 hover:text-forest-700 hover:bg-forest-50 transition-colors"
          aria-label="Buka menu"
        >
          <Menu size={18} className="sm:w-5 sm:h-5" />
        </button>

        {/* MOBILE MENU OVERLAY - dari KIRI */}
        {mobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            <div
              className="fixed top-0 left-0 h-full w-70 max-w-[85vw] bg-white shadow-xl z-50 lg:hidden overflow-y-auto"
              style={{ animation: "slideInLeft 0.2s ease-out" }}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-ink-6 p-4 flex items-center justify-between">
                <div>
                  <div className="font-bold text-ink text-sm">Menu</div>
                  <div className="text-xs text-ink-4 mt-0.5">
                    BPSDM Kalimantan Timur
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-ink-7 transition-colors"
                  aria-label="Tutup menu"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Menu Items */}
              <div className="p-3 space-y-1">
                {activeMenuItems.map((item) => {
                  const active = isActive(item);

                  if (!item.children || item.children.length === 0) {
                    return (
                      <Link
                        key={item.id}
                        href={item.url || "#"}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "block px-4 py-3 text-sm font-medium transition-colors rounded-lg",
                          active
                            ? "text-forest-700 bg-forest-50 font-semibold"
                            : "text-ink-2 hover:text-forest-700 hover:bg-forest-50",
                        )}
                        target={item.target === "_blank" ? "_blank" : undefined}
                        rel={
                          item.target === "_blank"
                            ? "noopener noreferrer"
                            : undefined
                        }
                      >
                        {item.label}
                      </Link>
                    );
                  }

                  const isDropdownOpen = openMobileDropdown === item.id;

                  return (
                    <div key={item.id}>
                      <button
                        onClick={() =>
                          setOpenMobileDropdown(isDropdownOpen ? null : item.id)
                        }
                        className={cn(
                          "flex items-center justify-between w-full px-4 py-3 text-sm font-medium transition-colors rounded-lg",
                          active
                            ? "text-forest-700 bg-forest-50 font-semibold"
                            : "text-ink-2 hover:text-forest-700 hover:bg-forest-50",
                        )}
                      >
                        {item.label}
                        <ChevronDown
                          size={14}
                          className="transition-transform duration-200 shrink-0"
                          style={{
                            transform: isDropdownOpen
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                          }}
                        />
                      </button>

                      {isDropdownOpen && (
                        <div className="ml-4 space-y-0.5 border-l-2 border-ink-6 pl-3 mt-1 mb-2">
                          {item.children.map((child) => (
                            <Link
                              key={child.id}
                              href={child.url || "#"}
                              onClick={() => setMobileMenuOpen(false)}
                              className={cn(
                                "block px-4 py-2.5 text-[13px] transition-colors rounded-lg",
                                pathname === child.url
                                  ? "text-forest-700 bg-forest-50 font-semibold"
                                  : "text-ink-3 hover:text-forest-700 hover:bg-forest-50",
                              )}
                              target={
                                child.target === "_blank" ? "_blank" : undefined
                              }
                              rel={
                                child.target === "_blank"
                                  ? "noopener noreferrer"
                                  : undefined
                              }
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Footer - Tombol Daftar Diklat */}
              <div className="border-t border-ink-6 p-4 mt-4">
                <Link
                  href="/program/daftar"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center btn btn-primary py-3 text-sm"
                >
                  <GraduationCap size={14} className="inline mr-2" />
                  Daftar Diklat
                </Link>
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  // DESKTOP NAVIGATION - Hover untuk submenu
  return (
    <nav
      ref={desktopNavRef}
      className="hidden lg:flex items-center gap-0.5 ml-8"
      aria-label="Navigasi utama"
    >
      {activeMenuItems.map((item) => {
        const active = isActive(item);

        if (!item.children || item.children.length === 0) {
          return (
            <Link
              key={item.id}
              href={item.url || "#"}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg",
                "text-[13.5px] font-medium transition-all duration-150",
                active
                  ? isTransparent
                    ? "text-white bg-white/10 font-semibold"
                    : "text-forest-700 bg-forest-50 font-semibold"
                  : isTransparent
                    ? "text-white/80 hover:text-white hover:bg-white/10"
                    : "text-ink-2 hover:text-forest-700 hover:bg-forest-50",
              )}
              target={item.target === "_blank" ? "_blank" : undefined}
              rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
            >
              {item.label}
            </Link>
          );
        }

        const isOpen = openDesktop === item.id;

        return (
          <div
            key={item.id}
            className="relative"
            onMouseEnter={() => handleMouseEnter(item.id)}
            onMouseLeave={handleMouseLeave}
          >
            <button
              aria-expanded={isOpen}
              aria-haspopup="true"
              className={cn(
                "flex items-center gap-1 px-3 py-2 rounded-lg",
                "text-[13.5px] font-medium transition-all duration-150",
                "border-none bg-transparent cursor-pointer",
                active || isOpen
                  ? isTransparent
                    ? "text-white bg-white/10 font-semibold"
                    : "text-forest-700 bg-forest-50 font-semibold"
                  : isTransparent
                    ? "text-white/80 hover:text-white hover:bg-white/10"
                    : "text-ink-2 hover:text-forest-700 hover:bg-forest-50",
              )}
            >
              {item.label}
              <ChevronDown
                size={12}
                strokeWidth={2.5}
                className={cn(
                  "transition-transform duration-200 shrink-0",
                  isTransparent ? "text-white/40" : "text-ink-4",
                  isOpen && "rotate-180",
                )}
              />
            </button>

            {/* Dropdown - tampil saat hover */}
            {isOpen && (
              <div
                className="absolute top-full left-0 mt-1.5 w-64 bg-white rounded-xl overflow-hidden z-50"
                style={{
                  border: "1px solid var(--color-ink-6)",
                  boxShadow: "0 8px 28px rgba(14,61,32,0.10)",
                  animation: "slideDown 0.15s ease-out",
                }}
              >
                {item.children.map((child) => (
                  <Link
                    key={child.id}
                    href={child.url || "#"}
                    className={cn(
                      "block px-4 py-2.5 text-[13px] transition-colors duration-100",
                      pathname === child.url
                        ? "text-forest-700 bg-forest-50 font-semibold"
                        : "text-ink-2 hover:text-forest-700 hover:bg-forest-50",
                    )}
                    target={child.target === "_blank" ? "_blank" : undefined}
                    rel={
                      child.target === "_blank"
                        ? "noopener noreferrer"
                        : undefined
                    }
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
