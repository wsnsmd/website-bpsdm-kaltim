// src/app/admin/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { db, eq, count } from "@/db";
import { posts, programs, schedules, announcements } from "@/db/schema";
import { getLatestPosts } from "@/lib/queries/posts";
import { getUpcomingSchedules } from "@/lib/queries/programs";
import { formatDate, timeAgo } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

async function getDashboardStats() {
  const [totalPosts, totalPrograms, totalSchedules, totalAnnouncements] =
    await Promise.all([
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
        .from(schedules)
        .where(eq(schedules.status, "open")),
      db
        .select({ total: count() })
        .from(announcements)
        .where(eq(announcements.isActive, true)),
    ]);

  return {
    posts: totalPosts[0]?.total ?? 0,
    programs: totalPrograms[0]?.total ?? 0,
    schedules: totalSchedules[0]?.total ?? 0,
    announcements: totalAnnouncements[0]?.total ?? 0,
  };
}

export default async function AdminDashboard() {
  const [stats, recentPosts, upcomingSchedules] = await Promise.all([
    getDashboardStats(),
    getLatestPosts({ limit: 5 }),
    getUpcomingSchedules({ limit: 4 }),
  ]);

  const STAT_CARDS = [
    {
      label: "Berita Terbit",
      value: stats.posts,
      icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6",
      color: "var(--color-forest-100)",
      icolor: "var(--color-forest-700)",
      href: "/admin/berita",
    },
    {
      label: "Program Aktif",
      value: stats.programs,
      icon: "M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5",
      color: "#eff6ff",
      icolor: "#1d4ed8",
      href: "/admin/program",
    },
    {
      label: "Jadwal Terbuka",
      value: stats.schedules,
      icon: "M3 4h18v18H3z M16 2v4 M8 2v4 M3 10h18",
      color: "var(--color-gold-100)",
      icolor: "var(--color-gold-700)",
      href: "/admin/jadwal",
    },
    {
      label: "Pengumuman Aktif",
      value: stats.announcements,
      icon: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0",
      color: "#fdf4ff",
      icolor: "#7e22ce",
      href: "/admin/pengumuman",
    },
  ];

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-sub">
            Ringkasan konten dan aktivitas terkini.
          </p>
        </div>
        <Link href="/admin/berita/baru" className="admin-btn-save">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Tambah Berita
        </Link>
      </div>

      {/* Stats */}
      <div className="admin-stats-grid">
        {STAT_CARDS.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="admin-stat-card"
            style={{ textDecoration: "none" }}
          >
            <div
              className="admin-stat-icon"
              style={{ backgroundColor: s.color }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke={s.icolor}
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d={s.icon} />
              </svg>
            </div>
            <div>
              <div className="admin-stat-value">{s.value}</div>
              <div className="admin-stat-label">{s.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Grid konten */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
      >
        {/* Berita terbaru */}
        <div className="admin-card">
          <div className="admin-card-head">
            <div className="admin-card-title">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              Berita Terbaru
            </div>
            <Link
              href="/admin/berita"
              className="admin-sidebar-back"
              style={{ width: "auto", padding: "4px 10px" }}
            >
              Semua →
            </Link>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Judul</th>
                  <th>Status</th>
                  <th>Tanggal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recentPosts.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      style={{
                        textAlign: "center",
                        padding: "24px",
                        color: "var(--color-ink-4)",
                        fontSize: "13px",
                      }}
                    >
                      Belum ada berita.
                    </td>
                  </tr>
                )}
                {recentPosts.map((post) => (
                  <tr key={post.id}>
                    <td style={{ maxWidth: "220px" }}>
                      <div
                        style={{
                          fontWeight: 600,
                          color: "var(--color-ink)",
                          fontSize: "13px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {post.title}
                      </div>
                      <div
                        style={{
                          fontSize: "11.5px",
                          color: "var(--color-ink-4)",
                          marginTop: "2px",
                        }}
                      >
                        {post.category?.name ?? "—"}
                      </div>
                    </td>
                    <td>
                      <span className="status-pill status-pill-published">
                        Terbit
                      </span>
                    </td>
                    <td
                      style={{
                        fontSize: "12px",
                        color: "var(--color-ink-4)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {timeAgo(post.publishedAt)}
                    </td>
                    <td>
                      <Link
                        href={`/admin/berita/${post.id}`}
                        className="admin-table-btn admin-table-btn-edit"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Jadwal mendatang */}
        <div className="admin-card">
          <div className="admin-card-head">
            <div className="admin-card-title">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Jadwal Mendatang
            </div>
            <Link
              href="/admin/jadwal"
              className="admin-sidebar-back"
              style={{ width: "auto", padding: "4px 10px" }}
            >
              Semua →
            </Link>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Program</th>
                  <th>Mulai</th>
                  <th>Kuota</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {upcomingSchedules.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      style={{
                        textAlign: "center",
                        padding: "24px",
                        color: "var(--color-ink-4)",
                        fontSize: "13px",
                      }}
                    >
                      Belum ada jadwal mendatang.
                    </td>
                  </tr>
                )}
                {upcomingSchedules.map((s) => (
                  <tr key={s.id}>
                    <td style={{ maxWidth: "200px" }}>
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
                        {s.program.name}
                      </div>
                      {s.batchName && (
                        <div
                          style={{
                            fontSize: "11.5px",
                            color: "var(--color-ink-4)",
                            marginTop: "2px",
                          }}
                        >
                          {s.batchName}
                        </div>
                      )}
                    </td>
                    <td
                      style={{
                        fontSize: "12px",
                        color: "var(--color-ink-4)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatDate(s.startDate, {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "var(--color-forest-700)",
                        }}
                      >
                        {s.quota - (s.registeredCount ?? 0)}/{s.quota}
                      </span>
                    </td>
                    <td>
                      <Link
                        href={`/admin/jadwal/${s.id}`}
                        className="admin-table-btn admin-table-btn-edit"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
