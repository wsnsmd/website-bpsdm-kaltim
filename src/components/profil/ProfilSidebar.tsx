// src/components/profil/ProfilSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Building2 } from "lucide-react";

type MenuItem = {
  id: number;
  label: string;
  url: string | null;
  children: { id: number; label: string; url: string | null }[];
};

type Props = { menuItems: MenuItem[] };

export function ProfilSidebar({ menuItems }: Props) {
  const pathname = usePathname();

  function isActive(url: string | null): boolean {
    if (!url) return false;
    // Exact match saja — tidak pakai startsWith agar tidak selalu aktif
    return pathname === url;
  }

  function isParentActive(item: MenuItem): boolean {
    if (isActive(item.url)) return true;
    return item.children.some((c) => isActive(c.url));
  }

  return (
    <aside style={{ position: "sticky", top: "88px" }}>
      {/* Header widget */}
      <div
        style={{
          background: "var(--color-forest-900)",
          borderRadius: "12px 12px 0 0",
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <Building2 size={16} color="rgba(255,255,255,0.7)" />
        <span
          style={{
            fontSize: "13px",
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "0.3px",
          }}
        >
          Profil BPSDM Kaltim
        </span>
      </div>

      {/* Menu items */}
      <div
        style={{
          background: "#fff",
          border: "1px solid var(--color-ink-6)",
          borderTop: "none",
          borderRadius: "0 0 12px 12px",
          overflow: "hidden",
        }}
      >
        {menuItems.map((item, i) => {
          const active = isActive(item.url);
          const parentActive = isParentActive(item);
          const isLast = i === menuItems.length - 1;

          return (
            <div key={item.id}>
              <Link
                href={item.url ?? "#"}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "11px 16px",
                  fontSize: "13.5px",
                  fontWeight: active ? 700 : parentActive ? 600 : 500,
                  color: active
                    ? "var(--color-forest-800)"
                    : parentActive
                      ? "var(--color-forest-700)"
                      : "var(--color-ink-2)",
                  background: active ? "var(--color-forest-50)" : "transparent",
                  borderBottom:
                    isLast && !parentActive
                      ? "none"
                      : "1px solid var(--color-ink-7)",
                  borderLeft: active
                    ? "3px solid var(--color-forest-700)"
                    : "3px solid transparent",
                  textDecoration: "none",
                  transition: "all 0.15s",
                }}
              >
                <span>{item.label}</span>
                <ChevronRight
                  size={14}
                  style={{
                    color: active
                      ? "var(--color-forest-700)"
                      : "var(--color-ink-5)",
                    flexShrink: 0,
                  }}
                />
              </Link>

              {/* Sub menu — tampil jika parent aktif */}
              {item.children.length > 0 && parentActive && (
                <div
                  style={{
                    background: "var(--color-forest-50)",
                    borderBottom: "1px solid var(--color-ink-6)",
                  }}
                >
                  {item.children.map((child) => {
                    const childActive = isActive(child.url);
                    return (
                      <Link
                        key={child.id}
                        href={child.url ?? "#"}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "8px 16px 8px 28px",
                          fontSize: "12.5px",
                          fontWeight: childActive ? 700 : 400,
                          color: childActive
                            ? "var(--color-forest-800)"
                            : "var(--color-ink-3)",
                          borderLeft: childActive
                            ? "3px solid var(--color-forest-600)"
                            : "3px solid transparent",
                          textDecoration: "none",
                          transition: "all 0.15s",
                        }}
                      >
                        <div
                          style={{
                            width: "5px",
                            height: "5px",
                            borderRadius: "50%",
                            backgroundColor: childActive
                              ? "var(--color-forest-600)"
                              : "var(--color-ink-4)",
                            flexShrink: 0,
                          }}
                        />
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Back link */}
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginTop: "12px",
          padding: "8px 12px",
          fontSize: "12.5px",
          color: "var(--color-ink-4)",
          textDecoration: "none",
          transition: "color 0.15s",
        }}
      >
        <ChevronRight size={13} style={{ transform: "rotate(180deg)" }} />
        Kembali ke Beranda
      </Link>
    </aside>
  );
}
