// src/components/ppid/PpidSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  User,
  Users,
  ClipboardList,
  Star,
  BookOpen,
  BarChart2,
  List,
  GitBranch,
  AlertTriangle,
  Scale,
  FileText,
  ChevronRight,
  Shield,
  type LucideIcon,
} from "lucide-react";

type SingleItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
};

type GroupSection = {
  group: string;
  items: { label: string; href: string; icon: LucideIcon }[];
};

type MenuEntry = SingleItem | GroupSection;

const PPID_MENU: MenuEntry[] = [
  {
    label: "Beranda PPID",
    href: "/ppid",
    icon: Home,
    exact: true,
  },
  {
    group: "Tentang PPID",
    items: [
      { label: "Profil PPID", href: "/ppid/profil", icon: User },
      { label: "Struktur Organisasi", href: "/ppid/struktur", icon: Users },
      {
        label: "Tugas & Fungsi",
        href: "/ppid/tugas-fungsi",
        icon: ClipboardList,
      },
      { label: "Maklumat Pelayanan", href: "/ppid/maklumat", icon: Star },
      {
        label: "Standar Layanan",
        href: "/ppid/standar-layanan",
        icon: BookOpen,
      },
    ],
  },
  {
    group: "Informasi Publik",
    items: [
      {
        label: "Daftar Informasi Publik",
        href: "/ppid/daftar-informasi",
        icon: List,
      },
      {
        label: "Laporan Tahunan",
        href: "/ppid/laporan-tahunan",
        icon: BarChart2,
      },
      { label: "Regulasi PPID", href: "/ppid/regulasi", icon: Scale },
    ],
  },
  {
    group: "Permohonan",
    items: [
      {
        label: "Alur Permohonan",
        href: "/ppid/alur-permohonan",
        icon: GitBranch,
      },
      { label: "Ajukan Permohonan", href: "/ppid/permohonan", icon: FileText },
      {
        label: "Keberatan & Sengketa",
        href: "/ppid/keberatan",
        icon: AlertTriangle,
      },
    ],
  },
];

function NavIcon({
  icon: Icon,
  ...props
}: {
  icon: LucideIcon;
  size: number;
  style: React.CSSProperties;
}) {
  return <Icon {...props} />;
}

export function PpidSidebar() {
  const pathname = usePathname();

  function isActive(href: string, exact = false): boolean {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <aside style={{ position: "sticky", top: "88px" }}>
      {/* Header */}
      <div
        style={{
          background: "var(--color-forest-900)",
          borderRadius: "14px 14px 0 0",
          padding: "16px 18px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            background: "rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Shield size={16} color="#fff" />
        </div>
        <div>
          <div style={{ fontSize: "13.5px", fontWeight: 700, color: "#fff" }}>
            PPID BPSDM
          </div>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>
            Keterbukaan Informasi
          </div>
        </div>
      </div>

      {/* Menu */}
      <div
        style={{
          background: "#fff",
          border: "1px solid var(--color-ink-6)",
          borderTop: "none",
          borderRadius: "0 0 14px 14px",
          overflow: "hidden",
        }}
      >
        {PPID_MENU.map((section, si) => {
          // Single item
          if (!("group" in section)) {
            const active = isActive(section.href, section.exact);
            return (
              <Link
                key={section.href}
                href={section.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 16px",
                  borderBottom: "1px solid var(--color-ink-7)",
                  textDecoration: "none",
                  background: active ? "var(--color-forest-50)" : "#fff",
                  borderLeft: active
                    ? "3px solid var(--color-forest-700)"
                    : "3px solid transparent",
                  transition: "all 0.12s",
                }}
              >
                <NavIcon
                  icon={section.icon}
                  size={15}
                  style={{
                    color: active
                      ? "var(--color-forest-700)"
                      : "var(--color-ink-4)",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: "13.5px",
                    fontWeight: active ? 700 : 500,
                    color: active
                      ? "var(--color-forest-700)"
                      : "var(--color-ink-2)",
                  }}
                >
                  {section.label}
                </span>
                {active && (
                  <ChevronRight
                    size={13}
                    style={{
                      color: "var(--color-forest-500)",
                      marginLeft: "auto",
                    }}
                  />
                )}
              </Link>
            );
          }

          // Group
          return (
            <div key={section.group}>
              <div
                style={{
                  padding: "10px 16px 6px",
                  fontSize: "10px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: "var(--color-ink-4)",
                  background: "var(--color-ink-8)",
                  borderBottom: "1px solid var(--color-ink-7)",
                }}
              >
                {section.group}
              </div>
              {section.items.map((item, ii) => {
                const active = isActive(item.href);
                const isLast =
                  ii === section.items.length - 1 &&
                  si === PPID_MENU.length - 1;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 16px",
                      borderBottom: isLast
                        ? "none"
                        : "1px solid var(--color-ink-7)",
                      textDecoration: "none",
                      background: active ? "var(--color-forest-50)" : "#fff",
                      borderLeft: active
                        ? "3px solid var(--color-forest-700)"
                        : "3px solid transparent",
                      transition: "all 0.12s",
                    }}
                  >
                    <NavIcon
                      icon={item.icon}
                      size={14}
                      style={{
                        color: active
                          ? "var(--color-forest-700)"
                          : "var(--color-ink-4)",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: active ? 700 : 400,
                        color: active
                          ? "var(--color-forest-700)"
                          : "var(--color-ink-2)",
                        flex: 1,
                      }}
                    >
                      {item.label}
                    </span>
                    {active && (
                      <ChevronRight
                        size={12}
                        style={{
                          color: "var(--color-forest-500)",
                          flexShrink: 0,
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
