// src/app/(public)/ppid/keberatan/page.tsx
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PpidPageContent } from "@/components/ppid/PpidPageContent";
import { AlertTriangle, Scale, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = { title: "Keberatan & Sengketa Informasi" };

const DASAR_KEBERATAN = [
  "Penolakan atas permohonan informasi publik",
  "Tidak disediakannya informasi berkala",
  "Tidak ditanggapinya permohonan informasi publik",
  "Permohonan ditanggapi tidak sebagaimana mestinya",
  "Tidak dipenuhinya permohonan informasi publik",
  "Pengenaan biaya yang tidak wajar",
  "Penyampaian informasi melebihi jangka waktu",
];

export default function KeberatanPage() {
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Info keberatan */}
        <div
          style={{
            background: "#fef2f2",
            borderRadius: "12px",
            border: "1px solid #fecaca",
            padding: "16px 20px",
            display: "flex",
            gap: "12px",
          }}
        >
          <AlertTriangle
            size={20}
            style={{ color: "#dc2626", flexShrink: 0, marginTop: "2px" }}
          />
          <div>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#dc2626",
                marginBottom: "4px",
              }}
            >
              Hak Mengajukan Keberatan
            </div>
            <div
              style={{ fontSize: "13px", color: "#991b1b", lineHeight: 1.6 }}
            >
              Pemohon informasi publik dapat mengajukan keberatan secara
              tertulis kepada atasan Pejabat Pengelola Informasi dan Dokumentasi
              berdasarkan alasan berikut (Pasal 35 UU KIP No. 14/2008):
            </div>
          </div>
        </div>

        {/* Dasar keberatan */}
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
              padding: "14px 20px",
              borderBottom: "1px solid var(--color-ink-7)",
              fontSize: "14.5px",
              fontWeight: 700,
              color: "var(--color-ink)",
            }}
          >
            Alasan Pengajuan Keberatan
          </div>
          {DASAR_KEBERATAN.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                padding: "12px 20px",
                borderBottom:
                  i < DASAR_KEBERATAN.length - 1
                    ? "1px solid var(--color-ink-7)"
                    : "none",
              }}
            >
              <div
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10.5px",
                  fontWeight: 800,
                  color: "#dc2626",
                  flexShrink: 0,
                  marginTop: "1px",
                }}
              >
                {i + 1}
              </div>
              <span
                style={{
                  fontSize: "13.5px",
                  color: "var(--color-ink-2)",
                  lineHeight: 1.55,
                }}
              >
                {item}
              </span>
            </div>
          ))}
        </div>

        {/* Konten dari DB */}
        <PpidPageContent
          slug="ppid-keberatan"
          title="Prosedur Keberatan & Sengketa"
          fallback="Prosedur keberatan dan sengketa belum diisi"
        />

        {/* Link Komisi Informasi */}
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            border: "1px solid var(--color-ink-6)",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Scale
              size={20}
              style={{ color: "var(--color-forest-600)", flexShrink: 0 }}
            />
            <div>
              <div
                style={{
                  fontSize: "13.5px",
                  fontWeight: 700,
                  color: "var(--color-ink)",
                }}
              >
                Komisi Informasi Kalimantan Timur
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--color-ink-4)",
                  marginTop: "2px",
                }}
              >
                Ajukan sengketa informasi ke Komisi Informasi Kaltim
              </div>
            </div>
          </div>
          <Link
            href="https://kaltim.komisiinformasi.go.id"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              borderRadius: "8px",
              background: "var(--color-forest-700)",
              color: "#fff",
              fontSize: "12.5px",
              fontWeight: 700,
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            Kunjungi <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </>
  );
}
