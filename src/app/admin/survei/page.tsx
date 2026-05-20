// src/app/admin/survei/page.tsx
import type { Metadata } from "next";
import {
  getSurveyStats,
  getSurveyList,
  getSurveyCount,
} from "@/lib/queries/survey";
import { Star, MessageSquare, TrendingUp } from "lucide-react";

export const metadata: Metadata = { title: "Hasil Survei Kepuasan" };

const ASPEK_LABELS = [
  { key: "avgTampilan", label: "Tampilan & Desain", color: "#1d4ed8" },
  { key: "avgKemudahan", label: "Kemudahan Navigasi", color: "#7e22ce" },
  { key: "avgKonten", label: "Kelengkapan Konten", color: "#0e7490" },
  { key: "avgKecepatan", label: "Kecepatan Akses", color: "#d97706" },
  { key: "avgLayanan", label: "Layanan Online", color: "#16a34a" },
];

function StarDisplay({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={14}
          style={{
            color: s <= Math.round(value) ? color : "var(--color-ink-6)",
            fill: s <= Math.round(value) ? color : "transparent",
          }}
        />
      ))}
    </div>
  );
}

function RatingBar({ value, color }: { value: number; color: string }) {
  const pct = (value / 5) * 100;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        flex: 1,
      }}
    >
      <div
        style={{
          flex: 1,
          height: "8px",
          borderRadius: "4px",
          background: "var(--color-ink-7)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: color,
            borderRadius: "4px",
            transition: "width 0.5s ease",
          }}
        />
      </div>
      <span
        style={{
          fontSize: "13px",
          fontWeight: 700,
          color,
          width: "30px",
          textAlign: "right",
        }}
      >
        {value.toFixed(1)}
      </span>
    </div>
  );
}

export default async function AdminSurveiPage() {
  const [stats, responses, total] = await Promise.all([
    getSurveyStats(),
    getSurveyList(20),
    getSurveyCount(),
  ]);

  const pctSangatPuas =
    stats.total > 0 ? Math.round((stats.sangatPuas / stats.total) * 100) : 0;

  const kategoriLabel =
    stats.avgTotal >= 4.5
      ? "Sangat Puas"
      : stats.avgTotal >= 3.5
        ? "Puas"
        : stats.avgTotal >= 2.5
          ? "Cukup Puas"
          : "Perlu Peningkatan";

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Hasil Survei Kepuasan</h1>
          <p className="admin-page-sub">
            Rekapitulasi penilaian kepuasan pengguna website BPSDM Kaltim.
          </p>
        </div>
      </div>

      {/* Overview stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "200px 1fr",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        {/* Nilai rata-rata besar */}
        <div
          style={{
            padding: "24px",
            borderRadius: "14px",
            background: "var(--color-forest-900)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "52px",
              fontWeight: 900,
              color: "#fff",
              lineHeight: 1,
              letterSpacing: "-2px",
            }}
          >
            {stats.avgTotal.toFixed(1)}
          </div>
          <div style={{ display: "flex", gap: "3px" }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={18}
                style={{
                  color:
                    s <= Math.round(stats.avgTotal)
                      ? "#fbbf24"
                      : "rgba(255,255,255,0.2)",
                  fill:
                    s <= Math.round(stats.avgTotal) ? "#fbbf24" : "transparent",
                }}
              />
            ))}
          </div>
          <div
            style={{ fontSize: "13.5px", fontWeight: 700, color: "#4ade80" }}
          >
            {kategoriLabel}
          </div>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
            dari {stats.total.toLocaleString("id-ID")} responden
          </div>
        </div>

        {/* Per aspek */}
        <div
          style={{
            background: "#fff",
            borderRadius: "14px",
            border: "1px solid var(--color-ink-6)",
            padding: "20px 24px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "var(--color-ink-3)",
              marginBottom: "16px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Rata-rata per Aspek
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {ASPEK_LABELS.map((a) => {
              const val = stats[a.key as keyof typeof stats] as number;
              return (
                <div
                  key={a.key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "var(--color-ink-2)",
                      width: "160px",
                      flexShrink: 0,
                    }}
                  >
                    {a.label}
                  </div>
                  <StarDisplay value={val} color={a.color} />
                  <RatingBar value={val} color={a.color} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Distribusi kepuasan */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        {[
          {
            label: "Sangat Puas",
            value: stats.sangatPuas,
            color: "#16a34a",
            bg: "#f0fdf4",
            border: "#bbf7d0",
          },
          {
            label: "Puas",
            value: stats.puas,
            color: "#1d4ed8",
            bg: "#eff6ff",
            border: "#bfdbfe",
          },
          {
            label: "Cukup Puas",
            value: stats.cukup,
            color: "#d97706",
            bg: "#fffbeb",
            border: "#fde68a",
          },
          {
            label: "Kurang Puas",
            value: stats.kurang,
            color: "#dc2626",
            bg: "#fef2f2",
            border: "#fecaca",
          },
        ].map((s) => {
          const pct =
            stats.total > 0 ? Math.round((s.value / stats.total) * 100) : 0;
          return (
            <div
              key={s.label}
              style={{
                padding: "16px 18px",
                borderRadius: "12px",
                background: "#fff",
                border: `1px solid ${s.border}`,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: 900,
                  color: s.color,
                  lineHeight: 1,
                  letterSpacing: "-0.5px",
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: s.color,
                  margin: "4px 0 2px",
                }}
              >
                {s.label}
              </div>
              <div style={{ fontSize: "11.5px", color: "var(--color-ink-4)" }}>
                {pct}% dari total
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabel respons */}
      <div className="admin-card">
        <div className="admin-card-head">
          <div className="admin-card-title">
            <MessageSquare size={15} /> Respons Terbaru
          </div>
          <span style={{ fontSize: "12px", color: "var(--color-ink-4)" }}>
            {total} total responden
          </span>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "140px" }}>Tanggal</th>
                <th style={{ textAlign: "center", width: "60px" }}>Tampilan</th>
                <th style={{ textAlign: "center", width: "60px" }}>Navigasi</th>
                <th style={{ textAlign: "center", width: "60px" }}>Konten</th>
                <th style={{ textAlign: "center", width: "60px" }}>
                  Kecepatan
                </th>
                <th style={{ textAlign: "center", width: "60px" }}>Layanan</th>
                <th style={{ textAlign: "center", width: "70px" }}>
                  Rata-rata
                </th>
                <th>Komentar</th>
              </tr>
            </thead>
            <tbody>
              {responses.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "var(--color-ink-4)",
                    }}
                  >
                    Belum ada respons survei.
                  </td>
                </tr>
              )}
              {responses.map((r) => {
                const rata = Number(r.ratingRata ?? 0);
                const rataColor =
                  rata >= 4.5
                    ? "#16a34a"
                    : rata >= 3.5
                      ? "#1d4ed8"
                      : rata >= 2.5
                        ? "#d97706"
                        : "#dc2626";

                return (
                  <tr key={r.id}>
                    <td
                      style={{ fontSize: "12px", color: "var(--color-ink-4)" }}
                    >
                      {new Date(r.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                      <div style={{ fontSize: "11px" }}>
                        {new Date(r.createdAt).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                    {[
                      r.ratingTampilan,
                      r.ratingKemudahan,
                      r.ratingKonten,
                      r.ratingKecepatan,
                      r.ratingLayanan,
                    ].map((val, i) => (
                      <td key={i} style={{ textAlign: "center" }}>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "28px",
                            height: "28px",
                            borderRadius: "50%",
                            background:
                              val >= 4
                                ? "#f0fdf4"
                                : val >= 3
                                  ? "#fffbeb"
                                  : "#fef2f2",
                            fontSize: "13px",
                            fontWeight: 800,
                            color:
                              val >= 4
                                ? "#16a34a"
                                : val >= 3
                                  ? "#d97706"
                                  : "#dc2626",
                          }}
                        >
                          {val}
                        </div>
                      </td>
                    ))}
                    <td style={{ textAlign: "center" }}>
                      <span
                        style={{
                          padding: "3px 10px",
                          borderRadius: "20px",
                          background: `${rataColor}15`,
                          border: `1px solid ${rataColor}30`,
                          fontSize: "12.5px",
                          fontWeight: 700,
                          color: rataColor,
                        }}
                      >
                        {rata.toFixed(1)}
                      </span>
                    </td>
                    <td>
                      {r.komentar ? (
                        <div
                          style={{
                            fontSize: "12.5px",
                            color: "var(--color-ink-2)",
                            lineHeight: 1.5,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical" as const,
                            overflow: "hidden",
                            maxWidth: "240px",
                          }}
                        >
                          "{r.komentar}"
                        </div>
                      ) : (
                        <span
                          style={{
                            fontSize: "12px",
                            color: "var(--color-ink-5)",
                            fontStyle: "italic",
                          }}
                        >
                          —
                        </span>
                      )}
                      {r.saran && (
                        <div
                          style={{
                            fontSize: "11.5px",
                            color: "var(--color-ink-4)",
                            marginTop: "3px",
                            display: "-webkit-box",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical" as const,
                            overflow: "hidden",
                            maxWidth: "240px",
                          }}
                        >
                          💡 {r.saran}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
