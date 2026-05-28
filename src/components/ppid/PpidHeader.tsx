// src/components/ppid/PpidHeader.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Shield, ChevronDown, ArrowLeft, Menu, X } from "lucide-react";

const PPID_MENU = [
  {
    label: "Profil PPID",
    href: "/ppid/profil",
    children: [
      { label: "Profil & Tugas", href: "/ppid/profil" },
      { label: "Tugas & Fungsi", href: "/ppid/tugas-fungsi" },
      { label: "Struktur PPID", href: "/ppid/struktur" },
      { label: "Maklumat Layanan", href: "/ppid/maklumat" },
    ],
  },
  {
    label: "Daftar Informasi",
    href: "/ppid/daftar-informasi",
    children: [
      { label: "Semua Informasi Publik", href: "/ppid/daftar-informasi" },
    ],
  },
  {
    label: "Permohonan",
    href: "/ppid/permohonan",
    children: [
      { label: "Form Permohonan", href: "/ppid/permohonan" },
      { label: "Alur Permohonan", href: "/ppid/alur-permohonan" },
      { label: "Standar Layanan", href: "/ppid/standar-layanan" },
    ],
  },
  {
    label: "Keberatan & Regulasi",
    href: "/ppid/keberatan",
    children: [
      { label: "Mekanisme Keberatan", href: "/ppid/keberatan" },
      { label: "Regulasi", href: "/ppid/regulasi" },
    ],
  },
  {
    label: "Laporan",
    href: "/ppid/laporan-tahunan",
    children: [{ label: "Laporan Tahunan", href: "/ppid/laporan-tahunan" }],
  },
];

// ── Warna tema hijau BPSDM ────────────────────
const C = {
  topBg:
    "linear-gradient(90deg, var(--color-forest-950), var(--color-forest-900))",
  navBg:
    "linear-gradient(90deg, var(--color-forest-900) 0%, var(--color-forest-800) 50%, var(--color-forest-900) 100%)",
  border: "var(--color-forest-800)",
  active: "var(--color-gold-400)",
  text: "rgba(255,255,255,0.82)",
  textDim: "rgba(255,255,255,0.4)",
  dropHead:
    "linear-gradient(90deg, var(--color-forest-900), var(--color-forest-800))",
  dropActive: "var(--color-forest-50)",
  dropActiveTxt: "var(--color-forest-900)",
  dotActive: "var(--color-forest-600)",
  dotDim: "var(--color-ink-5)",
};

export function PpidHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 2px 16px rgba(0,0,0,0.25)",
      }}
    >
      {/* ── Top bar ── */}
      <div
        style={{
          background: C.topBg,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div
          className="container-content"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "50px",
            gap: "12px",
          }}
        >
          {/* Logo */}
          <Link
            href="/ppid"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "9px",
                background: "linear-gradient(135deg, #facc15, #f59e0b)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 3px 10px rgba(250,204,21,0.35)",
              }}
            >
              <Image
                src="/pemprov.png"
                alt="Logo Pemprov Kaltim"
                width={40}
                height={44}
                className="object-contain"
                priority // Prioritaskan loading gambar ini karena ada di header
              />
            </div>
            <div>
              <div
                style={{
                  fontSize: "8px",
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase" as const,
                  color: C.textDim,
                  lineHeight: 1,
                }}
              >
                Portal
              </div>
              <div
                style={{
                  fontSize: "13.5px",
                  fontWeight: 800,
                  color: "#fff",
                  lineHeight: 1.25,
                }}
              >
                PPID BPSDM Kaltim
              </div>
            </div>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Link
              href="/web"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "20px",
                background: "rgba(255,255,255,0.07)",
                border: `1px solid ${C.border}`,
                color: C.text,
                fontSize: "11.5px",
                fontWeight: 600,
                textDecoration: "none",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}
            >
              <ArrowLeft size={12} />
              Kembali ke Website
            </Link>

            <Link
              href="/ppid/permohonan"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 16px",
                borderRadius: "20px",
                background: "linear-gradient(135deg, #facc15, #f59e0b)",
                color: "#14532d",
                fontSize: "11.5px",
                fontWeight: 800,
                textDecoration: "none",
                whiteSpace: "nowrap",
                boxShadow: "0 2px 8px rgba(250,204,21,0.3)",
              }}
            >
              Ajukan Permohonan
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="ppid-mobile-toggle"
              style={{
                display: "none",
                width: "34px",
                height: "34px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.08)",
                border: `1px solid ${C.border}`,
                color: "#fff",
                cursor: "pointer",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Nav bar ── */}
      <nav style={{ background: C.navBg }}>
        <div className="container-content">
          <ul
            className="ppid-desktop-nav"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px" /* ── DIUBAH: Tambah jarak antar menu agar pills tidak berdempetan ── */,
              margin: 0,
              padding:
                "8px 0" /* ── DIUBAH: Tambah padding atas-bawah ruang pills ── */,
              listStyle: "none",
            }}
          >
            {/* Beranda */}
            <li>
              <Link
                href="/ppid"
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding:
                    "8px 16px" /* ── DIUBAH: Padding disesuaikan jadi pills ── */,
                  borderRadius:
                    "8px" /* ── DIUBAH: Border melengkung (pills) ── */,
                  fontSize: "13px",
                  fontWeight: pathname === "/ppid" ? 700 : 500,
                  color:
                    pathname === "/ppid"
                      ? "#fff"
                      : C.text /* ── DIUBAH: Teks putih saat aktif ── */,
                  background:
                    pathname === "/ppid"
                      ? "rgba(0,0,0,0.25)"
                      : "transparent" /* ── DIUBAH: Background gelap saat aktif ── */,
                  textDecoration: "none",
                  transition: "all 0.15s",
                }}
                /* ── DIUBAH: Tambahan hover effect manual ── */
                onMouseEnter={(e) => {
                  if (pathname !== "/ppid")
                    (e.currentTarget as HTMLAnchorElement).style.background =
                      "rgba(255,255,255,0.1)";
                }}
                onMouseLeave={(e) => {
                  if (pathname !== "/ppid")
                    (e.currentTarget as HTMLAnchorElement).style.background =
                      "transparent";
                }}
              >
                Beranda
              </Link>
            </li>

            {PPID_MENU.map((item) => {
              const isActive =
                pathname.startsWith(item.href) ||
                item.children?.some((c) => pathname.startsWith(c.href));
              const isOpen = openDropdown === item.label;

              return (
                <li
                  key={item.label}
                  style={{ position: "relative" }}
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      padding:
                        "8px 16px" /* ── DIUBAH: Padding disesuaikan jadi pills ── */,
                      borderRadius:
                        "8px" /* ── DIUBAH: Border melengkung (pills) ── */,
                      fontSize: "13px",
                      fontWeight: isActive || isOpen ? 700 : 500,
                      color:
                        isActive || isOpen
                          ? "#fff"
                          : C.text /* ── DIUBAH: Teks putih saat aktif ── */,
                      background:
                        isActive || isOpen
                          ? "rgba(0,0,0,0.25)"
                          : "transparent" /* ── DIUBAH: Background gelap saat aktif ── */,
                      border: "none",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      transition: "all 0.15s",
                    }}
                    /* ── DIUBAH: Tambahan hover effect manual ── */
                    onMouseEnter={(e) => {
                      if (!isActive && !isOpen)
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "rgba(255,255,255,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive && !isOpen)
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "transparent";
                    }}
                  >
                    {item.label}
                    <ChevronDown
                      size={13}
                      style={{
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s",
                        opacity: 0.55,
                      }}
                    />
                  </button>

                  {/* Dropdown */}
                  {isOpen && item.children && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%", // Menempel pas di bawah tombol
                        left: 0,
                        paddingTop:
                          "4px" /* ── GANTI MARGIN TOP JADI PADDING TOP DI SINI ── */,
                        zIndex: 200,
                      }}
                    >
                      <div
                        style={{
                          minWidth: "230px",
                          background: "#fff",
                          borderRadius: "12px",
                          boxShadow: "0 16px 40px rgba(0,0,0,0.15)",
                          border: "1px solid rgba(0,0,0,0.07)",
                          overflow: "hidden",
                          animation: "ppidDropIn 0.15s ease",
                        }}
                      >
                        {item.children.map((child, ci) => {
                          const childActive =
                            pathname === child.href ||
                            pathname.startsWith(child.href + "/");
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                padding: "11px 16px",
                                fontSize: "13px",
                                fontWeight: childActive ? 700 : 400,
                                color: childActive
                                  ? C.dropActiveTxt
                                  : "#374151",
                                background: childActive ? C.dropActive : "#fff",
                                textDecoration: "none",
                                borderBottom:
                                  ci < item.children!.length - 1
                                    ? "1px solid #f3f4f6"
                                    : "none",
                                transition: "all 0.12s",
                              }}
                              onMouseEnter={(e) => {
                                if (!childActive) {
                                  (
                                    e.currentTarget as HTMLAnchorElement
                                  ).style.background = "#f7fdf9";
                                  (
                                    e.currentTarget as HTMLAnchorElement
                                  ).style.paddingLeft = "20px";
                                  (
                                    e.currentTarget as HTMLAnchorElement
                                  ).style.color = "#14532d";
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!childActive) {
                                  (
                                    e.currentTarget as HTMLAnchorElement
                                  ).style.background = "#fff";
                                  (
                                    e.currentTarget as HTMLAnchorElement
                                  ).style.paddingLeft = "16px";
                                  (
                                    e.currentTarget as HTMLAnchorElement
                                  ).style.color = "#374151";
                                }
                              }}
                            >
                              <div
                                style={{
                                  width: "5px",
                                  height: "5px",
                                  borderRadius: "50%",
                                  background: childActive
                                    ? C.dotActive
                                    : C.dotDim,
                                  flexShrink: 0,
                                }}
                              />
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Mobile nav (TIDAK DIUBAH) */}
          {mobileOpen && (
            <div
              className="ppid-mobile-nav"
              style={{
                borderTop: `1px solid ${C.border}`,
                paddingBlock: "8px",
              }}
            >
              <Link
                href="/ppid"
                style={{
                  display: "block",
                  padding: "10px 16px",
                  fontSize: "13.5px",
                  fontWeight: pathname === "/ppid" ? 700 : 500,
                  color: pathname === "/ppid" ? C.active : C.text,
                  textDecoration: "none",
                }}
              >
                Beranda PPID
              </Link>
              {PPID_MENU.map((item) => (
                <div key={item.label}>
                  <div
                    style={{
                      padding: "8px 16px 4px",
                      fontSize: "10px",
                      fontWeight: 700,
                      color: C.textDim,
                      letterSpacing: "1px",
                      textTransform: "uppercase" as const,
                    }}
                  >
                    {item.label}
                  </div>
                  {item.children?.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setMobileOpen(false)}
                      style={{
                        display: "block",
                        padding: "9px 24px",
                        fontSize: "13px",
                        color: pathname.startsWith(child.href)
                          ? C.active
                          : C.text,
                        textDecoration: "none",
                        fontWeight: pathname.startsWith(child.href) ? 600 : 400,
                      }}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </nav>

      <style>{`
        @keyframes ppidDropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .ppid-desktop-nav   { display: none !important; }
          .ppid-mobile-toggle { display: flex !important; }
        }
        @media (min-width: 769px) {
          .ppid-mobile-nav { display: none !important; }
        }
      `}</style>
    </header>
  );
}
