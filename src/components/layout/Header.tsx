// src/components/layout/Header.tsx
import Link from "next/link";
import { Topbar } from "./Topbar";
import { MainNav } from "./MainNav";

function SearchButton() {
  return (
    <button aria-label="Buka pencarian" className="header-search-btn">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    </button>
  );
}

export function Header() {
  return (
    <>
      <Topbar />
      <header className="header-root">
        <div className="container-content flex items-center h-[70px] gap-6">
          {/* Logo */}
          <Link href="/" className="header-logo">
            <div className="header-logo-mark">
              <div className="header-logo-accent" />
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                className="relative z-10"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div>
              <div className="header-logo-name">BPSDM Kalimantan Timur</div>
              <div className="header-logo-sub">
                Badan Pengembangan Sumber Daya Manusia
              </div>
            </div>
          </Link>

          {/* Navigasi */}
          <MainNav />

          {/* Aksi */}
          <div className="flex items-center gap-2 ml-auto">
            <SearchButton />
            <Link href="/program/daftar" className="btn btn-primary header-cta">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
              Daftar Diklat
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
