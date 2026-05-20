// src/app/(public)/ppid/permohonan/page.tsx
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PpidFormClient } from "@/components/ppid/PpidFormClient";
import { PpidTrackClient } from "@/components/ppid/PpidTrackClient";

export const metadata: Metadata = { title: "Permohonan Informasi Publik" };

export default function PermohonanPage() {
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Form */}
        <div
          style={{
            background: "#fff",
            borderRadius: "14px",
            border: "1px solid var(--color-ink-6)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "16px 22px",
              borderBottom: "1px solid var(--color-ink-7)",
              fontSize: "16px",
              fontWeight: 700,
              color: "var(--color-ink)",
            }}
          >
            Formulir Permohonan Informasi
          </div>
          <div style={{ padding: "24px 22px" }}>
            <PpidFormClient />
          </div>
        </div>

        {/* Tracking */}
        <div
          id="tracking"
          style={{
            background: "#fff",
            borderRadius: "14px",
            border: "1px solid var(--color-ink-6)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "16px 22px",
              borderBottom: "1px solid var(--color-ink-7)",
              fontSize: "16px",
              fontWeight: 700,
              color: "var(--color-ink)",
            }}
          >
            Cek Status Permohonan
          </div>
          <div style={{ padding: "24px 22px" }}>
            <PpidTrackClient />
          </div>
        </div>
      </div>
    </>
  );
}
