// src/app/(public)/ppid/layout.tsx
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PpidSidebar } from "@/components/ppid/PpidSidebar";
import { Shield } from "lucide-react";

export default function PpidLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Breadcrumb
        items={[{ label: "Beranda", href: "/" }, { label: "PPID" }]}
      />

      {/* Hero — seragam dengan profil & berita */}
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
            PPID BPSDM Kaltim
          </h1>
          <p
            style={{
              fontSize: "15px",
              color: "rgba(255,255,255,0.6)",
              maxWidth: "520px",
            }}
          >
            Pejabat Pengelola Informasi dan Dokumentasi BPSDM Provinsi
            Kalimantan Timur — mewujudkan transparansi dan akuntabilitas
            penyelenggaraan negara.
          </p>
        </div>
      </div>

      {/* Content area — seragam dengan profil */}
      <div
        style={{
          backgroundColor: "var(--color-ink-8)",
          paddingBlock: "3.5rem",
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
            <PpidSidebar />
            <main style={{ minWidth: 0, overflow: "hidden" }}>{children}</main>
          </div>
        </div>
      </div>
    </>
  );
}
