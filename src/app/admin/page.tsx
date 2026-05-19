// src/app/admin/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { db, eq, count, desc, sql } from "@/db";
import {
  posts,
  programs,
  announcements,
  documents,
  visitorStats,
  visitorLogs,
} from "@/db/schema";
import { getLatestPosts } from "@/lib/queries/posts";
import { fetchJadwalMendatang } from "@/lib/simpel/jadwal";
import { getSimpelDetailUrl } from "@/lib/simpel/jadwal";
import { timeAgo } from "@/lib/utils";
import {
  FileText,
  Briefcase,
  CalendarDays,
  Bell,
  Plus,
  Edit,
  Clock,
  ArrowRight,
  AlertCircle,
  ExternalLink,
  Activity,
  Download,
  Users,
  Eye,
  TrendingUp,
  FolderOpen,
  BarChart3,
  Newspaper,
  Settings,
  GraduationCap,
} from "lucide-react";

export const metadata: Metadata = { title: "Dashboard | Admin BPSDM" };

async function getDashboardStats() {
  const todayStr = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const thisMonthStr = todayStr.slice(0, 7);

  const [
    totalPosts,
    totalPrograms,
    totalAnnouncements,
    totalDocuments,
    visitorsToday,
    visitorsYesterday,
    visitorsMonth,
    visitorsTotal,
    onlineNow,
    totalDownloads,
  ] = await Promise.all([
    db
      .select({ total: count() })
      .from(posts)
      .where(eq(posts.status, "published")),
    db
      .select({ total: count() })
      .from(programs)
      .where(eq(programs.status, "active")),
    db
      .select({ total: count() })
      .from(announcements)
      .where(eq(announcements.isActive, true)),
    db
      .select({ total: count() })
      .from(documents)
      .where(eq(documents.status, "published")),
    // Visitor stats
    db.execute(
      sql`SELECT COALESCE(unique_visitors,0) as val FROM visitor_stats WHERE date=${todayStr} LIMIT 1`,
    ),
    db.execute(
      sql`SELECT COALESCE(unique_visitors,0) as val FROM visitor_stats WHERE date=${yesterday} LIMIT 1`,
    ),
    db.execute(
      sql`SELECT COALESCE(SUM(unique_visitors),0) as val FROM visitor_stats WHERE date LIKE ${thisMonthStr + "%"}`,
    ),
    db.execute(
      sql`SELECT COALESCE(SUM(unique_visitors),0) as val FROM visitor_stats`,
    ),
    db.execute(
      sql`SELECT COUNT(DISTINCT session_id) as val FROM visitor_logs WHERE created_at >= DATE_SUB(NOW(), INTERVAL 5 MINUTE)`,
    ),
    db.execute(
      sql`SELECT COALESCE(SUM(download_count),0) as val FROM documents`,
    ),
  ]);

  function extractVal(rows: any): number {
    const row = Array.isArray(rows[0]) ? rows[0][0] : rows[0];
    return Number(row?.val ?? 0);
  }

  return {
    posts: totalPosts[0]?.total ?? 0,
    programs: totalPrograms[0]?.total ?? 0,
    announcements: totalAnnouncements[0]?.total ?? 0,
    documents: totalDocuments[0]?.total ?? 0,
    visitors: {
      today: extractVal(visitorsToday),
      yesterday: extractVal(visitorsYesterday),
      month: extractVal(visitorsMonth),
      total: extractVal(visitorsTotal),
      online: extractVal(onlineNow),
    },
    downloads: extractVal(totalDownloads),
  };
}

async function getVisitorLast7Days() {
  try {
    const result = await db.execute(sql`
      SELECT date,
        COALESCE(unique_visitors,0) as visitors,
        COALESCE(page_views,0)      as views
      FROM visitor_stats
      WHERE date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      ORDER BY date ASC
    `);
    const rows = Array.isArray(result[0]) ? result[0] : result;
    return (rows as any[]).map((r) => ({
      date: r.date,
      visitors: Number(r.visitors),
      views: Number(r.views),
    }));
  } catch {
    return [];
  }
}

export default async function AdminDashboard() {
  const [stats, recentPosts, jadwalMendatang, chart7] = await Promise.all([
    getDashboardStats(),
    getLatestPosts({ limit: 5 }),
    fetchJadwalMendatang(5),
    getVisitorLast7Days(),
  ]);

  const maxVisitors = Math.max(...chart7.map((d) => d.visitors), 1);
  const DAY_LABELS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const today = new Date().toISOString().slice(0, 10);

  // Trend hari ini vs kemarin
  const trend =
    stats.visitors.yesterday > 0
      ? Math.round(
          ((stats.visitors.today - stats.visitors.yesterday) /
            stats.visitors.yesterday) *
            100,
        )
      : 0;

  const STAT_CARDS = [
    {
      label: "Berita Terbit",
      value: stats.posts,
      icon: FileText,
      color: "var(--color-forest-700)",
      bg: "var(--color-forest-50)",
      href: "/admin/berita",
      sub: "artikel publik",
    },
    {
      label: "Program Aktif",
      value: stats.programs,
      icon: Briefcase,
      color: "#1d4ed8",
      bg: "#eff6ff",
      href: "/admin/program",
      sub: "jenis program",
    },
    {
      label: "Jadwal Mendatang",
      value: jadwalMendatang.length,
      icon: CalendarDays,
      color: "var(--color-gold-700)",
      bg: "var(--color-gold-100)",
      href: "/program/jadwal",
      sub: "dari SIMPEL",
    },
    {
      label: "Pengumuman Aktif",
      value: stats.announcements,
      icon: Bell,
      color: "#7e22ce",
      bg: "#fdf4ff",
      href: "/admin/pengumuman",
      sub: "tampil di beranda",
    },
    {
      label: "Dokumen Publik",
      value: stats.documents,
      icon: FolderOpen,
      color: "#c2410c",
      bg: "#fff7ed",
      href: "/admin/dokumen",
      sub: "tersedia diunduh",
    },
    {
      label: "Total Unduhan",
      value: stats.downloads,
      icon: Download,
      color: "#0e7490",
      bg: "#ecfeff",
      href: "/admin/dokumen",
      sub: "semua dokumen",
    },
  ];

  const QUICK_ACTIONS = [
    {
      label: "Tambah Berita",
      href: "/admin/berita/baru",
      icon: Newspaper,
      color: "var(--color-forest-700)",
    },
    {
      label: "Tambah Dokumen",
      href: "/admin/dokumen/baru",
      icon: FolderOpen,
      color: "#c2410c",
    },
    {
      label: "Tambah Pengumuman",
      href: "/admin/pengumuman/baru",
      icon: Bell,
      color: "#7e22ce",
    },
    {
      label: "Lihat Jadwal",
      href: "/program/jadwal",
      icon: CalendarDays,
      color: "#1d4ed8",
    },
    {
      label: "Pengaturan",
      href: "/admin/pengaturan",
      icon: Settings,
      color: "var(--color-ink-3)",
    },
  ];

  return (
    <>
      {/* ── Header ── */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-sub">
            Ringkasan konten dan aktivitas terkini BPSDM Kaltim.
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {QUICK_ACTIONS.slice(0, 2).map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="admin-btn-save"
              style={{ background: a.color }}
            >
              <Plus size={15} />
              {a.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Visitor Stats Banner ── */}
      <div
        style={{
          background: "var(--color-forest-900)",
          borderRadius: "16px",
          padding: "20px 24px",
          marginBottom: "20px",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "24px",
          alignItems: "center",
        }}
      >
        <div>
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "7px",
                background: "rgba(74,222,128,0.12)",
                border: "1px solid rgba(74,222,128,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BarChart3 size={14} style={{ color: "#4ade80" }} />
            </div>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "rgba(255,255,255,0.7)",
              }}
            >
              Statistik Kunjungan
            </span>
            {/* Online dot */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                marginLeft: "auto",
                padding: "3px 10px",
                borderRadius: "20px",
                background: "rgba(74,222,128,0.08)",
                border: "1px solid rgba(74,222,128,0.15)",
              }}
            >
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#4ade80",
                  boxShadow: "0 0 6px rgba(74,222,128,0.6)",
                }}
              />
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "rgba(74,222,128,0.85)",
                }}
              >
                {stats.visitors.online} online
              </span>
            </div>
          </div>

          {/* 4 stat kolom */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "0",
            }}
          >
            {[
              {
                label: "Hari Ini",
                value: stats.visitors.today,
                color: "#60a5fa",
                sub:
                  trend !== 0
                    ? `${trend > 0 ? "+" : ""}${trend}% vs kemarin`
                    : "sama dengan kemarin",
              },
              {
                label: "Kemarin",
                value: stats.visitors.yesterday,
                color: "#a78bfa",
                sub: "pengunjung unik",
              },
              {
                label: "Bulan Ini",
                value: stats.visitors.month,
                color: "#34d399",
                sub: "total kunjungan",
              },
              {
                label: "Total",
                value: stats.visitors.total,
                color: "#fbbf24",
                sub: "sejak diluncurkan",
              },
            ].map((v, i) => (
              <div
                key={v.label}
                style={{
                  padding: "0 20px",
                  borderRight:
                    i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none",
                }}
              >
                <div
                  style={{
                    fontSize: "26px",
                    fontWeight: 900,
                    color: "#fff",
                    letterSpacing: "-0.5px",
                    lineHeight: 1,
                  }}
                >
                  {v.value.toLocaleString("id-ID")}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.45)",
                    marginTop: "4px",
                  }}
                >
                  {v.label}
                </div>
                <div
                  style={{
                    fontSize: "10.5px",
                    color: v.color,
                    marginTop: "2px",
                  }}
                >
                  {v.sub}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mini bar chart 7 hari */}
        {chart7.length > 0 && (
          <div style={{ flexShrink: 0 }}>
            <div
              style={{
                fontSize: "9.5px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: "rgba(255,255,255,0.25)",
                marginBottom: "10px",
                textAlign: "right",
              }}
            >
              7 Hari Terakhir
            </div>
            <div
              style={{
                display: "flex",
                gap: "5px",
                alignItems: "flex-end",
                height: "48px",
              }}
            >
              {chart7.map((day) => {
                const pct = Math.max(
                  Math.round((day.visitors / maxVisitors) * 100),
                  4,
                );
                const isToday = day.date === today;
                const dayLabel = DAY_LABELS[new Date(day.date).getDay()];
                return (
                  <div
                    key={day.date}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "4px",
                      width: "24px",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "36px",
                        display: "flex",
                        alignItems: "flex-end",
                        borderRadius: "3px",
                        overflow: "hidden",
                        background: "rgba(255,255,255,0.06)",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: `${pct}%`,
                          background: isToday
                            ? "#4ade80"
                            : "rgba(255,255,255,0.25)",
                          borderRadius: "2px 2px 0 0",
                          transition: "height 0.3s",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: "9px",
                        color: isToday ? "#4ade80" : "rgba(255,255,255,0.2)",
                        fontWeight: isToday ? 700 : 400,
                      }}
                    >
                      {dayLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Stat Cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "14px",
          marginBottom: "20px",
        }}
      >
        {STAT_CARDS.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "16px 18px",
              borderRadius: "12px",
              background: "#fff",
              border: "1px solid var(--color-ink-6)",
              textDecoration: "none",
              transition: "all 0.18s",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
            className="admin-stat-card-link"
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "11px",
                background: card.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <card.icon
                size={20}
                style={{ color: card.color }}
                strokeWidth={1.5}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 900,
                  color: "var(--color-ink)",
                  lineHeight: 1,
                  letterSpacing: "-0.5px",
                }}
              >
                {card.value.toLocaleString("id-ID")}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--color-ink-3)",
                  marginTop: "3px",
                }}
              >
                {card.label}
              </div>
              <div
                style={{
                  fontSize: "10.5px",
                  color: "var(--color-ink-5)",
                  marginTop: "1px",
                }}
              >
                {card.sub}
              </div>
            </div>
            <ArrowRight
              size={14}
              style={{ color: "var(--color-ink-5)", flexShrink: 0 }}
            />
          </Link>
        ))}
      </div>

      {/* ── Quick Actions ── */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "var(--color-ink-4)",
            alignSelf: "center",
            marginRight: "4px",
          }}
        >
          Akses Cepat:
        </span>
        {QUICK_ACTIONS.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 14px",
              borderRadius: "8px",
              border: "1px solid var(--color-ink-6)",
              background: "#fff",
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--color-ink-2)",
              textDecoration: "none",
              transition: "all 0.15s",
            }}
          >
            <a.icon size={14} style={{ color: a.color }} />
            {a.label}
          </Link>
        ))}
      </div>

      {/* ── Content Grid ── */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
      >
        {/* Berita Terbaru */}
        <div className="admin-card">
          <div className="admin-card-head">
            <div className="admin-card-title">
              <FileText
                size={16}
                style={{ color: "var(--color-forest-700)" }}
              />
              Berita Terbaru
            </div>
            <Link
              href="/admin/berita"
              className="admin-sidebar-back"
              style={{
                width: "auto",
                padding: "4px 10px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              Semua <ArrowRight size={13} />
            </Link>
          </div>

          <div style={{ padding: "4px 0" }}>
            {recentPosts.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "32px",
                  gap: "8px",
                  color: "var(--color-ink-4)",
                }}
              >
                <AlertCircle size={32} />
                <p style={{ fontSize: "13px" }}>Belum ada berita</p>
              </div>
            ) : (
              recentPosts.map((post, i) => (
                <div
                  key={post.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "11px 20px",
                    borderBottom:
                      i < recentPosts.length - 1
                        ? "1px solid var(--color-ink-7)"
                        : "none",
                  }}
                >
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "var(--color-ink-7)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "var(--color-ink-4)",
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "13px",
                        color: "var(--color-ink)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {post.title}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        marginTop: "3px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          color: "var(--color-forest-700)",
                          fontWeight: 600,
                        }}
                      >
                        {post.category?.name ?? "—"}
                      </span>
                      <span
                        style={{
                          color: "var(--color-ink-5)",
                          fontSize: "11px",
                        }}
                      >
                        ·
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          color: "var(--color-ink-4)",
                          display: "flex",
                          alignItems: "center",
                          gap: "3px",
                        }}
                      >
                        <Clock size={10} />
                        {timeAgo(post.publishedAt)}
                      </span>
                      <span
                        style={{
                          color: "var(--color-ink-5)",
                          fontSize: "11px",
                        }}
                      >
                        ·
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          color: "var(--color-ink-4)",
                          display: "flex",
                          alignItems: "center",
                          gap: "3px",
                        }}
                      >
                        <Eye size={10} />
                        {post.viewCount?.toLocaleString("id-ID") ?? 0}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/admin/berita/${post.id}`}
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "7px",
                      border: "1px solid var(--color-ink-6)",
                      background: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--color-ink-3)",
                      flexShrink: 0,
                    }}
                  >
                    <Edit size={13} />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Jadwal Mendatang */}
        <div className="admin-card">
          <div className="admin-card-head">
            <div className="admin-card-title">
              <CalendarDays
                size={16}
                style={{ color: "var(--color-forest-700)" }}
              />
              Jadwal Mendatang
            </div>
            <Link
              href="/program/jadwal"
              target="_blank"
              className="admin-sidebar-back"
              style={{
                width: "auto",
                padding: "4px 10px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              SIMPEL <ExternalLink size={12} />
            </Link>
          </div>

          <div style={{ padding: "4px 0" }}>
            {jadwalMendatang.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "32px",
                  gap: "8px",
                  color: "var(--color-ink-4)",
                }}
              >
                <CalendarDays size={32} />
                <p style={{ fontSize: "13px" }}>Belum ada jadwal mendatang</p>
              </div>
            ) : (
              jadwalMendatang.map((jadwal, i) => {
                const startDate = new Date(jadwal.tgl_awal);
                const isActive = jadwal.statusJadwal === "berlangsung";

                return (
                  <div
                    key={jadwal.id}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                      padding: "11px 20px",
                      borderBottom:
                        i < jadwalMendatang.length - 1
                          ? "1px solid var(--color-ink-7)"
                          : "none",
                    }}
                  >
                    {/* Tanggal */}
                    <div
                      style={{
                        width: "40px",
                        flexShrink: 0,
                        textAlign: "center",
                        background: isActive
                          ? "var(--color-forest-900)"
                          : "var(--color-forest-700)",
                        borderRadius: "8px",
                        padding: "6px 4px",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "18px",
                          fontWeight: 700,
                          color: "#fff",
                          lineHeight: 1,
                        }}
                      >
                        {String(startDate.getDate()).padStart(2, "0")}
                      </div>
                      <div
                        style={{
                          fontSize: "9px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          color: "rgba(255,255,255,0.7)",
                          marginTop: "2px",
                        }}
                      >
                        {startDate.toLocaleDateString("id-ID", {
                          month: "short",
                        })}
                      </div>
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: "13px",
                          color: "var(--color-ink)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          marginBottom: "4px",
                        }}
                      >
                        {jadwal.nama}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          flexWrap: "wrap",
                        }}
                      >
                        {isActive && (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "3px",
                              fontSize: "10px",
                              fontWeight: 700,
                              color: "var(--color-forest-700)",
                              background: "var(--color-forest-50)",
                              padding: "2px 7px",
                              borderRadius: "20px",
                              border: "1px solid var(--color-forest-200)",
                            }}
                          >
                            <Activity size={9} />
                            Live
                          </span>
                        )}
                        <span
                          style={{
                            fontSize: "11px",
                            color: "var(--color-gold-700)",
                            fontWeight: 600,
                          }}
                        >
                          {jadwal.jenis}
                        </span>
                        <span
                          style={{
                            color: "var(--color-ink-5)",
                            fontSize: "11px",
                          }}
                        >
                          ·
                        </span>
                        <span
                          style={{
                            fontSize: "11px",
                            color: "var(--color-ink-4)",
                          }}
                        >
                          {jadwal.kuota} kuota
                        </span>
                      </div>
                    </div>

                    <Link
                      href={getSimpelDetailUrl(jadwal.id, jadwal.nama)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "7px",
                        border: "1px solid var(--color-ink-6)",
                        background: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--color-ink-3)",
                        flexShrink: 0,
                      }}
                    >
                      <ExternalLink size={13} />
                    </Link>
                  </div>
                );
              })
            )}
          </div>

          <div
            style={{
              padding: "10px 20px",
              borderTop: "1px solid var(--color-ink-7)",
              background: "var(--color-ink-8)",
              fontSize: "11.5px",
              color: "var(--color-ink-4)",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <Clock size={11} />
            Data realtime dari SIMPEL Kaltim · diperbarui setiap 1 jam
          </div>
        </div>
      </div>
    </>
  );
}
