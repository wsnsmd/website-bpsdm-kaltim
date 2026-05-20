// src/app/(public)/ppid/laporan-tahunan/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { getPpidInformasi } from "@/lib/queries/ppid";
import { Download, ExternalLink, FileText, BarChart2 } from "lucide-react";
import { formatFileSize } from "@/components/ui/FileIcon";

export const metadata: Metadata = { title: "Laporan Tahunan PPID" };

export default async function LaporanTahunanPage() {
  // Ambil informasi berkala sebagai laporan tahunan
  const laporan = await getPpidInformasi({ tipe: "berkala", limit: 200 });

  // Group by tahun
  const byTahun = laporan.reduce<Record<number, typeof laporan>>(
    (acc, item) => {
      const tahun = item.tahun ?? 0;
      if (!acc[tahun]) acc[tahun] = [];
      acc[tahun].push(item);
      return acc;
    },
    {},
  );

  const tahunList = Object.keys(byTahun)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Header info */}
        <div
          style={{
            background: "var(--color-forest-50)",
            borderRadius: "12px",
            border: "1px solid var(--color-forest-100)",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <BarChart2
            size={20}
            style={{ color: "var(--color-forest-700)", flexShrink: 0 }}
          />
          <div>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "var(--color-forest-800)",
              }}
            >
              Laporan Tahunan PPID BPSDM Kaltim
            </div>
            <div
              style={{
                fontSize: "12.5px",
                color: "var(--color-forest-600)",
                marginTop: "2px",
              }}
            >
              Laporan berkala keterbukaan informasi publik sesuai UU KIP No.
              14/2008
            </div>
          </div>
        </div>

        {/* Daftar per tahun */}
        {tahunList.length === 0 ? (
          <div
            style={{
              background: "#fff",
              borderRadius: "14px",
              border: "1px solid var(--color-ink-6)",
              padding: "48px",
              textAlign: "center",
              color: "var(--color-ink-4)",
              fontSize: "13.5px",
            }}
          >
            <FileText
              size={36}
              style={{ margin: "0 auto 12px", opacity: 0.3 }}
            />
            Belum ada laporan tahunan tersedia.
          </div>
        ) : (
          tahunList.map((tahun) => (
            <div
              key={tahun}
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
                  padding: "12px 20px",
                  borderBottom: "1px solid var(--color-ink-7)",
                  background: "var(--color-ink-8)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    padding: "3px 12px",
                    borderRadius: "20px",
                    background: "var(--color-forest-700)",
                    color: "#fff",
                    fontSize: "13px",
                    fontWeight: 800,
                  }}
                >
                  {tahun || "Lainnya"}
                </div>
                <span style={{ fontSize: "12px", color: "var(--color-ink-4)" }}>
                  {byTahun[tahun].length} dokumen
                </span>
              </div>

              {byTahun[tahun].map((item, i) => {
                const url = item.fileUrl || item.externalUrl;
                const isExt = !!item.externalUrl && !item.fileUrl;
                return (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      padding: "14px 20px",
                      borderBottom:
                        i < byTahun[tahun].length - 1
                          ? "1px solid var(--color-ink-7)"
                          : "none",
                    }}
                  >
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "8px",
                        background: "var(--color-forest-50)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <FileText
                        size={16}
                        style={{ color: "var(--color-forest-700)" }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "13.5px",
                          fontWeight: 600,
                          color: "var(--color-ink)",
                          marginBottom: "3px",
                        }}
                      >
                        {item.judul}
                      </div>
                      {item.deskripsi && (
                        <div
                          style={{
                            fontSize: "12px",
                            color: "var(--color-ink-4)",
                            lineHeight: 1.5,
                          }}
                        >
                          {item.deskripsi}
                        </div>
                      )}
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          marginTop: "4px",
                        }}
                      >
                        {item.fileType && (
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              color: "var(--color-ink-5)",
                            }}
                          >
                            {item.fileType}
                          </span>
                        )}
                        {item.fileSize && (
                          <span
                            style={{
                              fontSize: "11px",
                              color: "var(--color-ink-5)",
                            }}
                          >
                            {formatFileSize(item.fileSize)}
                          </span>
                        )}
                      </div>
                    </div>
                    {url ? (
                      <Link
                        href={isExt ? url : `/api/unduhan-ppid/${item.id}`}
                        target={isExt ? "_blank" : undefined}
                        rel={isExt ? "noopener noreferrer" : undefined}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          padding: "7px 14px",
                          borderRadius: "8px",
                          background: "var(--color-forest-50)",
                          border: "1px solid var(--color-forest-200)",
                          color: "var(--color-forest-700)",
                          fontSize: "12.5px",
                          fontWeight: 700,
                          textDecoration: "none",
                          flexShrink: 0,
                        }}
                      >
                        {isExt ? (
                          <ExternalLink size={13} />
                        ) : (
                          <Download size={13} />
                        )}
                        {isExt ? "Buka" : "Unduh"}
                      </Link>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
    </>
  );
}
