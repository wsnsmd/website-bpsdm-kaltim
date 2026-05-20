// src/app/(public)/ppid/regulasi/page.tsx
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Scale, ExternalLink } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = { title: "Regulasi PPID" };

const REGULASI = [
  {
    kategori: "Undang-Undang",
    color: "#1d4ed8",
    bg: "#eff6ff",
    border: "#bfdbfe",
    items: [
      {
        nomor: "UU No. 14 Tahun 2008",
        judul: "Keterbukaan Informasi Publik",
        href: "https://peraturan.go.id",
      },
      {
        nomor: "UU No. 25 Tahun 2009",
        judul: "Pelayanan Publik",
        href: "https://peraturan.go.id",
      },
    ],
  },
  {
    kategori: "Peraturan Pemerintah",
    color: "#7e22ce",
    bg: "#fdf4ff",
    border: "#e9d5ff",
    items: [
      {
        nomor: "PP No. 61 Tahun 2010",
        judul:
          "Pelaksanaan UU No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik",
        href: "https://peraturan.go.id",
      },
    ],
  },
  {
    kategori: "Peraturan Komisi Informasi",
    color: "#0e7490",
    bg: "#ecfeff",
    border: "#a5f3fc",
    items: [
      {
        nomor: "PerKI No. 1 Tahun 2010",
        judul: "Standar Layanan Informasi Publik",
        href: "https://peraturan.go.id",
      },
      {
        nomor: "PerKI No. 1 Tahun 2013",
        judul: "Prosedur Penyelesaian Sengketa Informasi Publik",
        href: "https://peraturan.go.id",
      },
    ],
  },
  {
    kategori: "Peraturan Daerah & Gubernur",
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    items: [
      {
        nomor: "Pergub Kaltim",
        judul:
          "Pengelolaan Informasi dan Dokumentasi di Lingkungan Pemprov Kaltim",
        href: "#",
      },
    ],
  },
];

export default function RegulasiPage() {
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {REGULASI.map((grup) => (
          <div
            key={grup.kategori}
            style={{
              background: "#fff",
              borderRadius: "14px",
              border: `1px solid ${grup.border}`,
              overflow: "hidden",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                padding: "12px 20px",
                borderBottom: `1px solid ${grup.border}`,
                background: grup.bg,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Scale size={15} style={{ color: grup.color }} />
              <span
                style={{
                  fontSize: "13.5px",
                  fontWeight: 700,
                  color: grup.color,
                }}
              >
                {grup.kategori}
              </span>
            </div>
            {grup.items.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "14px 20px",
                  borderBottom:
                    i < grup.items.length - 1
                      ? "1px solid var(--color-ink-7)"
                      : "none",
                }}
              >
                <div
                  style={{
                    padding: "3px 10px",
                    borderRadius: "6px",
                    background: grup.bg,
                    border: `1px solid ${grup.border}`,
                    fontSize: "11.5px",
                    fontWeight: 700,
                    color: grup.color,
                    flexShrink: 0,
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.nomor}
                </div>
                <span
                  style={{
                    flex: 1,
                    fontSize: "13.5px",
                    color: "var(--color-ink-2)",
                    lineHeight: 1.5,
                  }}
                >
                  {item.judul}
                </span>
                {item.href !== "#" && (
                  <Link
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: grup.color,
                      textDecoration: "none",
                      flexShrink: 0,
                    }}
                  >
                    <ExternalLink size={13} />
                    Lihat
                  </Link>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
