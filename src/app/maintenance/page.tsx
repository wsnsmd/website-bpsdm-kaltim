// src/app/maintenance/page.tsx
import type { Metadata } from "next";
import { getSetting } from "@/lib/queries/settings";
import { Settings, Clock, ArrowRight } from "lucide-react";
import { MaintenanceToggle } from "@/components/admin/MaintenanceToggle";

export const metadata: Metadata = {
  title: "Website Sedang Maintenance — BPSDM Kaltim",
  robots: { index: false, follow: false },
};

export default async function MaintenancePage() {
  const message =
    (await getSetting("maintenance_message")) ??
    "Website sedang dalam pemeliharaan. Kami akan segera kembali.";
  const endTime = (await getSetting("maintenance_end")) ?? "";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#061610",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "24px",
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
      }}
    >
      {/* Dot grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          pointerEvents: "none",
        }}
      />

      {/* Glow */}
      <div
        style={{
          position: "absolute",
          top: "-200px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(218,165,32,0.08) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          maxWidth: "520px",
          width: "100%",
          textAlign: "center",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "18px",
            background: "rgba(218,165,32,0.1)",
            border: "1px solid rgba(218,165,32,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 28px",
          }}
        >
          <Settings
            size={32}
            color="#daa520"
            style={{
              animation: "spin 8s linear infinite",
            }}
          />
        </div>

        {/* Logo */}
        <div
          style={{
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)",
            marginBottom: "20px",
          }}
        >
          BPSDM Provinsi Kalimantan Timur
        </div>

        {/* Judul */}
        <h1
          style={{
            fontFamily: "var(--font-display, system-ui)",
            fontSize: "clamp(28px, 6vw, 42px)",
            fontWeight: 900,
            color: "#fff",
            lineHeight: 1.1,
            marginBottom: "16px",
            letterSpacing: "-1px",
          }}
        >
          Sedang dalam
          <span
            style={{
              display: "block",
              color: "#daa520",
            }}
          >
            Pemeliharaan
          </span>
        </h1>

        {/* Pesan */}
        <p
          style={{
            fontSize: "15px",
            color: "rgba(255,255,255,0.5)",
            lineHeight: 1.7,
            marginBottom: "32px",
            maxWidth: "400px",
            margin: "0 auto 32px",
          }}
        >
          {message}
        </p>

        {/* Estimasi selesai */}
        {endTime && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              borderRadius: "30px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              marginBottom: "32px",
            }}
          >
            <Clock size={15} color="rgba(255,255,255,0.4)" />
            <span
              style={{
                fontSize: "13.5px",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              Estimasi selesai:
            </span>
            <span
              style={{
                fontSize: "13.5px",
                fontWeight: 700,
                color: "#daa520",
              }}
            >
              {endTime}
            </span>
          </div>
        )}

        {/* Progress bar animasi */}
        <div
          style={{
            width: "100%",
            height: "3px",
            background: "rgba(255,255,255,0.08)",
            borderRadius: "2px",
            overflow: "hidden",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              height: "100%",
              background:
                "linear-gradient(90deg, transparent, #daa520, transparent)",
              animation: "slide 2s ease-in-out infinite",
              width: "40%",
            }}
          />
        </div>

        {/* Kontak */}
        <div
          style={{
            padding: "16px 20px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            fontSize: "13px",
            color: "rgba(255,255,255,0.35)",
            lineHeight: 1.6,
          }}
        >
          Pertanyaan? Hubungi kami di{" "}
          <a
            href="mailto:bpsdm@kaltimprov.go.id"
            style={{ color: "#daa520", textDecoration: "none" }}
          >
            bpsdm@kaltimprov.go.id
          </a>
        </div>

        {/* Link admin */}
        <div style={{ marginTop: "24px" }}>
          <a
            href="/admin"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              color: "rgba(255,255,255,0.2)",
              textDecoration: "none",
              transition: "color 0.15s",
            }}
          >
            Admin Login <ArrowRight size={12} />
          </a>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes slide {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
      `}</style>
    </div>
  );
}
