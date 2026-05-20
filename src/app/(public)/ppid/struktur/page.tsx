// src/app/(public)/ppid/struktur/page.tsx
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PpidOrgChart } from "@/components/ppid/PpidOrgChart";

export const metadata: Metadata = {
  title: "Struktur Organisasi PPID",
  description:
    "Struktur organisasi Pejabat Pengelola Informasi dan Dokumentasi BPSDM Kaltim.",
};

export default function PpidStrukturPage() {
  return (
    <>
      <div
        style={{
          background: "#fff",
          borderRadius: "14px",
          border: "1px solid var(--color-ink-6)",
          padding: "28px 24px 36px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "20px",
            fontWeight: 700,
            color: "var(--color-forest-700)",
            marginBottom: "8px",
          }}
        >
          Struktur Organisasi
        </h2>
        <p
          style={{
            fontSize: "13px",
            color: "var(--color-ink-4)",
            marginBottom: "28px",
          }}
        >
          Pejabat Pengelola Informasi dan Dokumentasi (PPID) BPSDM Kaltim
        </p>

        <PpidOrgChart />

        {/* Keterangan warna */}
        <div
          style={{
            marginTop: "24px",
            paddingTop: "18px",
            borderTop: "1px solid var(--color-ink-7)",
            display: "flex",
            gap: "24px",
            flexWrap: "wrap",
          }}
        >
          {[
            { color: "#d97706", label: "Penanggung Jawab" },
            { color: "#ca8a04", label: "Ketua" },
            { color: "#3b82f6", label: "Sekretaris & Bidang" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
              }}
            >
              <div
                style={{
                  width: "14px",
                  height: "14px",
                  borderRadius: "3px",
                  background: item.color,
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: "12.5px", color: "var(--color-ink-3)" }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
