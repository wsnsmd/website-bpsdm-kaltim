// src/components/layout/Header.tsx
import Link from "next/link";
import { Topbar } from "./Topbar";
import { MainNav } from "./MainNav";
import { Search, GraduationCap, Home } from "lucide-react";

// Komponen SearchButton
function SearchButton() {
  return (
    <button aria-label="Buka pencarian" className="header-search-btn">
      <Search size={18} strokeWidth={2} />
    </button>
  );
}

export function Header() {
  return (
    <>
      <Topbar />
      <header className="header-root">
        <div className="container-content flex items-center justify-between h-[60px] sm:h-[70px] gap-2 sm:gap-4">
          {/* Logo - kiri */}
          <Link href="/" className="header-logo flex-shrink-0">
            <div className="header-logo-mark w-8 h-8 sm:w-10 sm:h-10">
              <div className="header-logo-accent" />
              <Home
                size={18}
                strokeWidth={1.5}
                color="white"
                className="relative z-10 sm:w-[22px] sm:h-[22px]"
              />
            </div>
            <div className="sm:block">
              <div className="header-logo-name text-xs sm:text-sm">
                BPSDM Kalimantan Timur
              </div>
              <div className="header-logo-sub text-[9px] sm:text-[11px]">
                Badan Pengembangan Sumber Daya Manusia
              </div>
            </div>
          </Link>

          {/* Desktop Navigation - tengah */}
          <div className="hidden lg:block flex-1">
            <MainNav />
          </div>

          {/* Desktop Action Buttons - kanan (hanya desktop) */}
          <div className="hidden lg:flex items-center gap-2">
            <SearchButton />
            <Link
              href="/program/daftar"
              className="btn btn-primary header-cta flex items-center gap-2"
            >
              <GraduationCap size={15} strokeWidth={2} />
              Daftar Diklat
            </Link>
          </div>

          {/* Mobile Action Buttons - kanan (hanya search dan hamburger) */}
          <div className="flex items-center gap-1 sm:gap-2 lg:hidden">
            <SearchButton />
            <MainNav isMobileMenuButtonOnly />
          </div>
        </div>
      </header>
    </>
  );
}
