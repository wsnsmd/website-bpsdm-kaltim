// src/components/ppid/PpidLayananStats.tsx
import Link from "next/link";
import { BarChart2, Scale, Timer } from "lucide-react";
import {
  getPpidLayananStats,
  getPpidLayananYears,
} from "@/lib/queries/ppid";

type Props = {
  tahun?: number;
  /** Base path dipakai untuk link ganti tahun (mis. /ppid/laporan-tahunan) */
  basePath: string;
};

// Standar waktu tanggapan permohonan informasi (lihat /ppid/standar-layanan)
const TARGET_HARI = 10;

function fmt(n: number) {
  return n.toLocaleString("id-ID");
}

export async function PpidLayananStats({ tahun, basePath }: Props) {
  const years = await getPpidLayananYears();
  const selectedYear = tahun ?? years[0] ?? new Date().getFullYear();
  const { permohonan: p, keberatan: k } = await getPpidLayananStats(
    selectedYear,
  );

  // 3 kelompok status untuk bar proporsi — banding dihitung "dalam proses"
  // karena permohonan tsb belum tuntas secara final.
  const dikabulkan = p.selesai;
  const ditolak = p.ditolak;
  const proses = p.diterima + p.diproses + p.banding;
  const hasPermohonan = p.total > 0;

  const segments = hasPermohonan
    ? [
        { label: "Dikabulkan", value: dikabulkan, color: "#4ade80" },
        { label: "Dalam proses", value: proses, color: "#60a5fa" },
        { label: "Ditolak", value: ditolak, color: "#f87171" },
      ].filter((s) => s.value > 0)
    : [];

  const rata = p.rataRataHariPenyelesaian;
  const withinTarget = rata !== null && rata <= TARGET_HARI;
  const slaFillPct =
    rata !== null ? Math.min(100, Math.round((rata / TARGET_HARI) * 100)) : 0;

  const kbrItems = [
    { label: "Diterima", value: k.total, color: "#1d4ed8" },
    {
      label: "Diselesaikan",
      value: k.selesai,
      color: "var(--color-forest-700)",
    },
    { label: "Ditolak", value: k.ditolak, color: "#dc2626" },
    {
      label: "Diteruskan ke KI",
      value: k.diteruskanKi,
      color: "#7e22ce",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {/* ── Panel utama: permohonan (elemen berani, gelap) ── */}
      <div
        style={{
          background: "var(--color-forest-900)",
          borderRadius: "16px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", padding: "22px 26px 24px" }}>
          {/* Header + tab tahun */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              flexWrap: "wrap",
              marginBottom: "22px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "9px",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <BarChart2 size={18} color="rgba(255,255,255,0.8)" />
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>
                  Statistik Layanan Informasi Publik
                </div>
                <div
                  style={{
                    fontSize: "11.5px",
                    color: "rgba(255,255,255,0.4)",
                    marginTop: "1px",
                  }}
                >
                  Permohonan & keberatan informasi PPID BPSDM Kaltim
                </div>
              </div>
            </div>

            {years.length > 1 && (
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                {years.map((y) => {
                  const active = y === selectedYear;
                  return (
                    <Link
                      key={y}
                      href={y === years[0] ? basePath : `${basePath}?tahun=${y}`}
                      style={{
                        padding: "5px 13px",
                        borderRadius: "20px",
                        fontSize: "12.5px",
                        fontWeight: active ? 800 : 500,
                        background: active ? "#fff" : "rgba(255,255,255,0.08)",
                        color: active
                          ? "var(--color-forest-900)"
                          : "rgba(255,255,255,0.6)",
                        textDecoration: "none",
                        transition: "all 0.12s",
                      }}
                    >
                      {y}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Angka besar + bar proporsi status */}
          <div className="ppid-layanan-hero-grid">
            <div>
              <div
                style={{
                  fontSize: "52px",
                  fontWeight: 900,
                  color: "#fff",
                  lineHeight: 1,
                  letterSpacing: "-1.5px",
                }}
              >
                {fmt(p.total)}
              </div>
              <div
                style={{
                  fontSize: "12.5px",
                  color: "rgba(255,255,255,0.5)",
                  marginTop: "8px",
                  fontWeight: 500,
                }}
              >
                Permohonan informasi diterima
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.3)",
                  marginTop: "2px",
                }}
              >
                Tahun {selectedYear}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.45)",
                  marginBottom: "9px",
                }}
              >
                Status penyelesaian
              </div>

              {/* Bar proporsi */}
              <div
                style={{
                  display: "flex",
                  height: "14px",
                  borderRadius: "7px",
                  overflow: "hidden",
                  background: "rgba(255,255,255,0.07)",
                }}
              >
                {hasPermohonan ? (
                  segments.map((s) => (
                    <div
                      key={s.label}
                      style={{
                        flex: `${s.value} 0 0%`,
                        background: s.color,
                      }}
                      title={`${s.label}: ${s.value}`}
                    />
                  ))
                ) : (
                  <div style={{ flex: "1 0 0%" }} />
                )}
              </div>

              {/* Legend */}
              <div
                style={{
                  display: "flex",
                  gap: "18px",
                  flexWrap: "wrap",
                  marginTop: "12px",
                }}
              >
                {hasPermohonan ? (
                  segments.map((s) => (
                    <div
                      key={s.label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: s.color,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{ fontSize: "12px", color: "rgba(255,255,255,0.75)" }}
                      >
                        {s.label}{" "}
                        <strong style={{ color: "#fff" }}>{fmt(s.value)}</strong>
                      </span>
                    </div>
                  ))
                ) : (
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
                    Belum ada permohonan pada tahun ini
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              height: "1px",
              background: "rgba(255,255,255,0.08)",
              margin: "20px 0 16px",
            }}
          />

          {/* Rata-rata waktu penyelesaian vs standar layanan */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Timer size={15} style={{ color: "rgba(255,255,255,0.5)" }} />
              <span style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.55)" }}>
                Rata-rata waktu penyelesaian
              </span>
              <span style={{ fontSize: "18px", fontWeight: 800, color: "#fff" }}>
                {rata !== null ? `${rata} hari` : "—"}
              </span>
            </div>

            {rata !== null ? (
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "130px",
                    height: "6px",
                    borderRadius: "4px",
                    background: "rgba(255,255,255,0.1)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${slaFillPct}%`,
                      height: "100%",
                      background: withinTarget ? "#4ade80" : "#f87171",
                      borderRadius: "4px",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: "11.5px",
                    fontWeight: 700,
                    color: withinTarget ? "#4ade80" : "#f87171",
                    whiteSpace: "nowrap",
                  }}
                >
                  {withinTarget ? "Sesuai standar" : "Melebihi standar"}
                </span>
              </div>
            ) : (
              <span style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.35)" }}>
                Belum ada permohonan selesai
              </span>
            )}
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.3)",
              marginTop: "6px",
            }}
          >
            Standar layanan: {TARGET_HARI} hari kerja sejak permohonan diterima
          </div>
        </div>
      </div>

      {/* ── Panel sekunder: keberatan (tenang, terang) ── */}
      <div
        style={{
          background: "#fff",
          borderRadius: "14px",
          border: "1px solid var(--color-ink-6)",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "12px 20px",
            borderBottom: "1px solid var(--color-ink-7)",
            display: "flex",
            alignItems: "center",
            gap: "7px",
            fontSize: "12.5px",
            fontWeight: 700,
            color: "var(--color-ink-3)",
          }}
        >
          <Scale size={13} style={{ color: "var(--color-forest-600)" }} />
          Keberatan Informasi Publik — Tahun {selectedYear}
        </div>
        <div className="ppid-kbr-strip">
          {kbrItems.map((item, i) => (
            <div
              key={item.label}
              style={{
                padding: "14px 20px",
                textAlign: "center",
                borderRight:
                  i < kbrItems.length - 1
                    ? "1px solid var(--color-ink-7)"
                    : "none",
              }}
            >
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  color: item.color,
                  lineHeight: 1,
                }}
              >
                {fmt(item.value)}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--color-ink-4)",
                  marginTop: "5px",
                  fontWeight: 500,
                }}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p
        style={{
          fontSize: "11.5px",
          color: "var(--color-ink-5)",
          lineHeight: 1.6,
          margin: "2px 4px 0",
        }}
      >
        Dihitung otomatis dari sistem permohonan &amp; keberatan informasi
        publik, sesuai Pasal 11 ayat (2) UU No. 14 Tahun 2008 tentang
        Keterbukaan Informasi Publik.
      </p>
    </div>
  );
}
