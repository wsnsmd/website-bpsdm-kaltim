// src/app/admin/analytics/page.tsx
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  getVisitorSummary,
  getVisitorChart,
  getTopPages,
  getRecentLogs,
} from "@/lib/queries/analytics";
import { VisitorChart } from "@/components/admin/analytics/VisitorChart";
import { TopPagesTable } from "@/components/admin/analytics/TopPagesTable";
import { RecentLogsTable } from "@/components/admin/analytics/RecentLogsTable";
import {
  Eye,
  Users,
  TrendingUp,
  TrendingDown,
  Activity,
  Globe,
  Minus,
} from "lucide-react";

export const metadata: Metadata = { title: "Analytics Pengunjung" };
export const dynamic = "force-dynamic";

function pct(a: number, b: number) {
  if (b === 0) return null;
  return Math.round(((a - b) / b) * 100);
}

export default async function AnalyticsPage() {
  const session = await auth();
  const role = (session?.user as any)?.role ?? "viewer";
  if (role !== "superadmin") redirect("/forbidden");

  const [summary, chartData, topPages, recentLogs] = await Promise.all([
    getVisitorSummary(),
    getVisitorChart(30),
    getTopPages(10),
    getRecentLogs(50),
  ]);

  const viewsDiff = pct(
    summary.today.pageViews ?? 0,
    summary.yesterday.pageViews ?? 0,
  );
  const uniqueDiff = pct(
    summary.today.uniqueVisitors ?? 0,
    summary.yesterday.uniqueVisitors ?? 0,
  );

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Analytics Pengunjung</h1>
          <p className="admin-page-sub">
            Statistik akses dan aktivitas pengunjung website
          </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 14px",
            borderRadius: "20px",
            background: "var(--color-forest-50)",
            border: "1px solid var(--color-forest-200)",
            fontSize: "12.5px",
            fontWeight: 600,
            color: "var(--color-forest-700)",
          }}
        >
          <div
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "var(--color-forest-500)",
              animation: "pulse 2s infinite",
            }}
          />
          Live
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {[
          {
            label: "Pengunjung Hari Ini",
            value: summary.today.uniqueVisitors ?? 0,
            sub: "unique visitors",
            diff: uniqueDiff,
            icon: <Users size={20} />,
            color: "#2563eb",
            bg: "#eff6ff",
          },
          {
            label: "Halaman Dilihat Hari Ini",
            value: summary.today.pageViews ?? 0,
            sub: "page views",
            diff: viewsDiff,
            icon: <Eye size={20} />,
            color: "#15803d",
            bg: "#f0fdf4",
          },
          {
            label: "Total Pengunjung",
            value: summary.totalUnique.toLocaleString("id-ID"),
            sub: "sepanjang waktu",
            diff: null,
            icon: <Globe size={20} />,
            color: "#7c3aed",
            bg: "#f5f3ff",
          },
          {
            label: "Total Halaman Dilihat",
            value: summary.totalViews.toLocaleString("id-ID"),
            sub: "sepanjang waktu",
            diff: null,
            icon: <Activity size={20} />,
            color: "#b45309",
            bg: "#fffbeb",
          },
        ].map((stat, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              borderRadius: "14px",
              border: "1px solid var(--color-ink-6)",
              padding: "18px 20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            {/* Icon + label */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "12px",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--color-ink-4)",
                }}
              >
                {stat.label}
              </span>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: stat.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: stat.color,
                }}
              >
                {stat.icon}
              </div>
            </div>

            {/* Value */}
            <div
              style={{
                fontSize: "28px",
                fontWeight: 800,
                color: "var(--color-ink)",
                lineHeight: 1,
                marginBottom: "6px",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {stat.value}
            </div>

            {/* Sub + diff */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "11.5px", color: "var(--color-ink-4)" }}>
                {stat.sub}
              </span>
              {stat.diff !== null && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "3px",
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "2px 7px",
                    borderRadius: "20px",
                    background:
                      stat.diff > 0
                        ? "#f0fdf4"
                        : stat.diff < 0
                          ? "#fef2f2"
                          : "#f8fafc",
                    color:
                      stat.diff > 0
                        ? "#15803d"
                        : stat.diff < 0
                          ? "#dc2626"
                          : "#64748b",
                  }}
                >
                  {stat.diff > 0 ? (
                    <TrendingUp size={11} />
                  ) : stat.diff < 0 ? (
                    <TrendingDown size={11} />
                  ) : (
                    <Minus size={11} />
                  )}
                  {stat.diff > 0 ? "+" : ""}
                  {stat.diff}% vs kemarin
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Chart 30 hari ── */}
      <div className="admin-card" style={{ marginBottom: "20px" }}>
        <div className="admin-card-head">
          <div className="admin-card-title">
            Tren Pengunjung (30 Hari Terakhir)
          </div>
        </div>
        <div className="admin-card-body">
          <VisitorChart data={chartData} />
        </div>
      </div>

      {/* ── Bottom grid: top pages + recent logs ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
        }}
      >
        {/* Top pages */}
        <div className="admin-card">
          <div className="admin-card-head">
            <div className="admin-card-title">Halaman Terpopuler</div>
            <span style={{ fontSize: "12px", color: "var(--color-ink-4)" }}>
              Top 10
            </span>
          </div>
          <div className="admin-card-body" style={{ padding: 0 }}>
            <TopPagesTable pages={topPages} />
          </div>
        </div>

        {/* Recent logs */}
        <div className="admin-card">
          <div className="admin-card-head">
            <div className="admin-card-title">Log Akses Terbaru</div>
            <span style={{ fontSize: "12px", color: "var(--color-ink-4)" }}>
              50 terakhir
            </span>
          </div>
          <div className="admin-card-body" style={{ padding: 0 }}>
            <RecentLogsTable logs={recentLogs} />
          </div>
        </div>
      </div>
    </>
  );
}
