// src/app/(public)/ppid/standar-layanan/page.tsx
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PpidPageContent } from "@/components/ppid/PpidPageContent";
import { Clock, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = { title: "Standar Layanan PPID" };

const SLA_ITEMS = [
  { label: "Konfirmasi tertulis permohonan diterima", durasi: "1 hari kerja" },
  { label: "Tanggapan atas permohonan informasi", durasi: "10 hari kerja" },
  { label: "Perpanjangan waktu (jika diperlukan)", durasi: "+7 hari kerja" },
  { label: "Penyelesaian keberatan internal", durasi: "30 hari kerja" },
  {
    label: "Penyelesaian sengketa di Komisi Informasi",
    durasi: "100 hari kerja",
  },
];

export default function StandarLayananPage() {
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <PpidPageContent
          slug="ppid-standar-layanan"
          title="Standar Layanan Informasi"
          fallback="Standar layanan informasi belum diisi"
        />

        {/* SLA Cards */}
        <div
          style={{
            background: "#fff",
            borderRadius: "14px",
            border: "1px solid var(--color-ink-6)",
            overflow: "hidden",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              padding: "14px 22px",
              borderBottom: "1px solid var(--color-ink-7)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "15px",
              fontWeight: 700,
              color: "var(--color-ink)",
            }}
          >
            <Clock size={16} style={{ color: "var(--color-forest-600)" }} />
            Standar Waktu Layanan
          </div>
          {SLA_ITEMS.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "14px 22px",
                borderBottom:
                  i < SLA_ITEMS.length - 1
                    ? "1px solid var(--color-ink-7)"
                    : "none",
              }}
            >
              <CheckCircle2
                size={16}
                style={{ color: "var(--color-forest-600)", flexShrink: 0 }}
              />
              <div
                style={{
                  flex: 1,
                  fontSize: "13.5px",
                  color: "var(--color-ink-2)",
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  padding: "4px 12px",
                  borderRadius: "20px",
                  background: "var(--color-forest-50)",
                  border: "1px solid var(--color-forest-100)",
                  fontSize: "12.5px",
                  fontWeight: 700,
                  color: "var(--color-forest-700)",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {item.durasi}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
