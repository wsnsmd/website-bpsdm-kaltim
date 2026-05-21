// src/app/admin/survei/page.tsx
import type { Metadata } from "next";
import {
  getSurveyStats,
  getSurveyList,
  getSurveyCount,
} from "@/lib/queries/survey";
import { Star, MessageSquare } from "lucide-react";

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
    <div className="flex gap-0.5">
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
    <div className="flex items-center gap-2.5 flex-1">
      <div className="flex-1 h-2 rounded-full bg-[var(--color-ink-7)] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${pct}%`,
            background: color,
          }}
        />
      </div>
      <span
        className="text-[13px] font-bold w-[30px] text-right"
        style={{ color }}
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

      {/* ── Overview Stats Grid (1 Kolom HP, 2 Kolom Desktop) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-5 mb-5">
        {/* Nilai rata-rata besar */}
        <div className="p-6 rounded-[14px] bg-[var(--color-forest-900)] flex flex-col items-center justify-center gap-2 text-center">
          <div className="text-[52px] font-black text-white leading-none tracking-tight">
            {stats.avgTotal.toFixed(1)}
          </div>
          <div className="flex gap-[3px]">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={18}
                className={
                  s <= Math.round(stats.avgTotal)
                    ? "text-amber-400 fill-amber-400"
                    : "text-white/20 fill-transparent"
                }
              />
            ))}
          </div>
          <div className="text-[13.5px] font-bold text-green-400">
            {kategoriLabel}
          </div>
          <div className="text-xs text-white/40">
            dari {stats.total.toLocaleString("id-ID")} responden
          </div>
        </div>

        {/* Per aspek */}
        <div className="bg-white rounded-[14px] border border-[var(--color-ink-6)] p-5 lg:p-6 shadow-sm">
          <div className="text-[13px] font-bold text-[var(--color-ink-3)] mb-4 uppercase tracking-wide">
            Rata-rata per Aspek
          </div>
          <div className="flex flex-col gap-3">
            {ASPEK_LABELS.map((a) => {
              const val = stats[a.key as keyof typeof stats] as number;
              return (
                <div
                  key={a.key}
                  className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3"
                >
                  <div className="text-[13px] font-semibold text-[var(--color-ink-2)] sm:w-[160px] shrink-0">
                    {a.label}
                  </div>
                  <div className="flex items-center gap-3 flex-1">
                    <StarDisplay value={val} color={a.color} />
                    <RatingBar value={val} color={a.color} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Distribusi Kepuasan (2 Kolom HP, 4 Kolom Desktop) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
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
              className="py-4 px-3 sm:px-4 rounded-xl text-center border bg-white"
              style={{ borderColor: s.border }}
            >
              <div
                className="text-3xl font-black leading-none tracking-tight"
                style={{ color: s.color }}
              >
                {s.value}
              </div>
              <div
                className="text-[12px] font-semibold mt-1.5 mb-0.5"
                style={{ color: s.color }}
              >
                {s.label}
              </div>
              <div className="text-[11px] sm:text-[11.5px] text-[var(--color-ink-4)]">
                {pct}% dari total
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Tabel Respons Terbaru ── */}
      <div className="admin-card">
        <div className="admin-card-head">
          <div className="admin-card-title flex items-center gap-2">
            <MessageSquare size={15} /> Respons Terbaru
          </div>
          <span className="text-xs text-[var(--color-ink-4)]">
            {total} total responden
          </span>
        </div>

        {/* Table wrapper memberikan fitur geser horizontal pada layar kecil */}
        <div className="admin-table-wrap">
          <table className="admin-table min-w-[800px]">
            <thead>
              <tr>
                <th className="w-[140px]">Tanggal</th>
                <th className="text-center w-[60px]">Tampilan</th>
                <th className="text-center w-[60px]">Navigasi</th>
                <th className="text-center w-[60px]">Konten</th>
                <th className="text-center w-[60px]">Kecepatan</th>
                <th className="text-center w-[60px]">Layanan</th>
                <th className="text-center w-[70px]">Rata-rata</th>
                <th>Komentar</th>
              </tr>
            </thead>
            <tbody>
              {responses.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-10 text-[var(--color-ink-4)]"
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
                    <td className="text-xs text-[var(--color-ink-4)]">
                      {new Date(r.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                      <div className="text-[11px] mt-0.5">
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
                      <td key={i} className="text-center">
                        <div
                          className="inline-flex items-center justify-center w-7 h-7 rounded-full text-[13px] font-extrabold"
                          style={{
                            background:
                              val >= 4
                                ? "#f0fdf4"
                                : val >= 3
                                  ? "#fffbeb"
                                  : "#fef2f2",
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
                    <td className="text-center">
                      <span
                        className="px-2.5 py-1 rounded-full text-[12.5px] font-bold border"
                        style={{
                          background: `${rataColor}15`,
                          borderColor: `${rataColor}30`,
                          color: rataColor,
                        }}
                      >
                        {rata.toFixed(1)}
                      </span>
                    </td>
                    <td>
                      {r.komentar ? (
                        <div className="text-[12.5px] text-[var(--color-ink-2)] leading-relaxed line-clamp-2 max-w-[240px]">
                          "{r.komentar}"
                        </div>
                      ) : (
                        <span className="text-xs text-[var(--color-ink-5)] italic">
                          —
                        </span>
                      )}
                      {r.saran && (
                        <div className="text-[11.5px] text-[var(--color-ink-4)] mt-1 line-clamp-1 max-w-[240px]">
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
