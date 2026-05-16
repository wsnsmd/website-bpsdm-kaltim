// src/app/(public)/profil/layout.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { getMenuByLocation } from "@/lib/queries/profil";
import { ProfilSidebar } from "@/components/profil/ProfilSidebar";

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
      {/* Page hero kecil */}
      <div
        style={{
          background: "var(--color-forest-900)",
          paddingBlock: "2rem 2.5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Pattern background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.05,
            backgroundImage:
              "repeating-linear-gradient(-45deg, #fff 0, #fff 1px, transparent 0, transparent 20px)",
            pointerEvents: "none",
          }}
        />

        <div className="container-content" style={{ position: "relative" }}>
          {/* Breadcrumb */}
          <div style={{ marginBottom: "12px" }}>
            <nav style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Link
                href="/"
                style={{
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.5)",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
                Beranda
              </Link>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="2"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
              <span
                style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)" }}
              >
                Profil
              </span>
            </nav>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* Icon */}
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "14px",
                backgroundColor: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255,255,255,0.9)"
                strokeWidth="1.5"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div>
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.5)",
                  marginBottom: "4px",
                }}
              >
                Pemerintah Provinsi Kalimantan Timur
              </p>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "26px",
                  fontWeight: 700,
                  color: "#fff",
                  lineHeight: 1.2,
                }}
              >
                Badan Pengembangan Sumber Daya Manusia
              </h1>
            </div>
          </div>

          {/* Tab menu ringkas */}
          <div
            style={{
              display: "flex",
              gap: "4px",
              marginTop: "20px",
              flexWrap: "wrap",
            }}
          >
            {menuItems.slice(0, 6).map((item) => (
              <Link
                key={item.id}
                href={item.url ?? "#"}
                style={{
                  padding: "5px 14px",
                  borderRadius: "20px",
                  fontSize: "12.5px",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.7)",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
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

      {/* Content area */}
      <div
        style={{
          backgroundColor: "var(--color-ink-8)",
          paddingBlock: "2.5rem",
        }}
      >
        <div className="container-content">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "260px 1fr",
              gap: "24px",
              alignItems: "start",
            }}
          >
            <ProfilSidebar menuItems={menuItems} />
            <main style={{ minWidth: 0, overflow: "hidden" }}>{children}</main>
          </div>
        </div>
      </div>
    </>
  );
}
