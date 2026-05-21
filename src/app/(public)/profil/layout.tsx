// src/app/(public)/profil/layout.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { getMenuByLocation } from "@/lib/queries/profil";
import { ProfilSidebar } from "@/components/profil/ProfilSidebar";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: {
    default: "Profil BPSDM Kaltim",
    template: "%s — BPSDM Kaltim",
  },
};

export default async function ProfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const menuItems = await getMenuByLocation("profil");

  return (
    <>
      <Breadcrumb
        items={[{ label: "Beranda", href: "/" }, { label: "Profil" }]}
      />

      {/* Page hero - SAMA PERSIS dengan halaman berita */}
      <div className="page-hero">
        <div className="container-content" style={{ position: "relative" }}>
          <p
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.55)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "10px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "20px",
                height: "2px",
                backgroundColor: "var(--color-gold-500)",
              }}
            />
            Pemerintah Provinsi Kalimantan Timur
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "38px",
              fontWeight: 700,
              color: "#fff",
              marginBottom: "10px",
              lineHeight: 1.15,
            }}
          >
            Profil BPSDM Kaltim
          </h1>
          <p
            style={{
              fontSize: "15px",
              color: "rgba(255,255,255,0.6)",
              maxWidth: "480px",
            }}
          >
            Badan Pengembangan Sumber Daya Manusia Provinsi Kalimantan Timur
            berkomitmen mewujudkan aparatur sipil negara yang kompeten,
            profesional, dan berintegritas.
          </p>
        </div>
      </div>

      {/* Tab menu ringkas - di bawah hero */}
      <div
        style={{
          backgroundColor: "var(--color-ink-8)",
          borderBottom: "1px solid var(--color-ink-6)",
        }}
      >
        <div className="container-content">
          <div className="profil-tab-bar">
            {menuItems.slice(0, 8).map((item) => (
              <Link
                key={item.id}
                href={item.url ?? "#"}
                style={{
                  padding: "6px 16px",
                  borderRadius: "24px",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "var(--color-ink-3)",
                  background: "transparent",
                  border: "1px solid var(--color-ink-6)",
                  textDecoration: "none",
                  transition: "all 0.15s",
                  whiteSpace: "nowrap",
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Content area - SAMA dengan halaman berita */}
      <div
        style={{
          backgroundColor: "var(--color-ink-8)",
          paddingBlock: "3.5rem",
        }}
      >
        <div className="container-content">
          <div className="profil-layout">
            <ProfilSidebar menuItems={menuItems} />
            <main style={{ minWidth: 0, overflow: "hidden" }}>{children}</main>
          </div>
        </div>
      </div>
    </>
  );
}
