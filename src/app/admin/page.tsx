// src/app/admin/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { db, eq, count } from "@/db";
import { posts, programs, announcements } from "@/db/schema";
import { getLatestPosts } from "@/lib/queries/posts";
import { fetchJadwalMendatang } from "@/lib/simpel/jadwal";
import { timeAgo } from "@/lib/utils";
import { getSimpelDetailUrl } from "@/lib/simpel/jadwal";
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
} from "lucide-react";

export const metadata: Metadata = { title: "Dashboard | Admin BPSDM" };

async function getDashboardStats() {
  const [totalPosts, totalPrograms, totalAnnouncements] = await Promise.all([
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
  ]);

  return {
    posts: totalPosts[0]?.total ?? 0,
    programs: totalPrograms[0]?.total ?? 0,
    announcements: totalAnnouncements[0]?.total ?? 0,
  };
}

// Tambahkan formatTanggalJadwal ke utils jika belum ada
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminDashboard() {
  const [stats, recentPosts, jadwalMendatang] = await Promise.all([
    getDashboardStats(),
    getLatestPosts({ limit: 5 }),
    fetchJadwalMendatang(5),
  ]);

  const STAT_CARDS = [
    {
      label: "Berita Terbit",
      value: stats.posts,
      icon: FileText,
      color: "var(--color-forest-700)",
      bg: "var(--color-forest-50)",
      href: "/admin/berita",
    },
    {
      label: "Program Aktif",
      value: stats.programs,
      icon: Briefcase,
      color: "#1d4ed8",
      bg: "#eff6ff",
      href: "/admin/program",
    },
    {
      label: "Jadwal Mendatang",
      value: jadwalMendatang.length,
      icon: CalendarDays,
      color: "var(--color-gold-700)",
      bg: "var(--color-gold-100)",
      href: "/program/jadwal",
    },
    {
      label: "Pengumuman Aktif",
      value: stats.announcements,
      icon: Bell,
      color: "#7e22ce",
      bg: "#fdf4ff",
      href: "/admin/pengumuman",
    },
  ];

  return (
    <>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-sub">
            Ringkasan konten dan aktivitas terkini BPSDM Kaltim.
          </p>
        </div>
        <Link href="/admin/berita/baru" className="admin-btn-save">
          <Plus size={15} />
          Tambah Berita
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="admin-stats-grid">
        {STAT_CARDS.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="admin-stat-card"
            style={{ textDecoration: "none" }}
          >
            <div
              className="admin-stat-icon"
              style={{ backgroundColor: card.bg }}
            >
              <card.icon
                size={22}
                style={{ color: card.color }}
                strokeWidth={1.5}
              />
            </div>
            <div>
              <div className="admin-stat-value">{card.value}</div>
              <div className="admin-stat-label">{card.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Content Grid */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
      >
        {/* ── Berita Terbaru ── */}
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

          <div style={{ padding: "8px 0" }}>
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
                    padding: "12px 20px",
                    borderBottom:
                      i < recentPosts.length - 1
                        ? "1px solid var(--color-ink-7)"
                        : "none",
                  }}
                >
                  {/* Nomor */}
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

                  {/* Info */}
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
                        gap: "8px",
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
                    </div>
                  </div>

                  {/* Edit */}
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
                      transition: "all 0.15s",
                    }}
                  >
                    <Edit size={13} />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── Jadwal Mendatang (SIMPEL) ── */}
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

          <div style={{ padding: "8px 0" }}>
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
                      padding: "12px 20px",
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

                    {/* Info */}
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

                    {/* Link SIMPEL */}
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

          {/* Footer note */}
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
