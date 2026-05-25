// src/app/(public)/pengumuman/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { getAllActiveAnnouncements } from "@/lib/queries/announcements";
import { formatDate } from "@/lib/utils";
import {
  Info,
  AlertTriangle,
  Zap,
  CalendarDays,
  ArrowRight,
  Bell,
  ExternalLink,
  Clock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Pengumuman — BPSDM Kaltim",
  description:
    "Pengumuman resmi dan informasi terkini BPSDM Provinsi Kalimantan Timur.",
};

export const revalidate = 300; // 5 menit

const TYPE_CONFIG = {
  info: {
    label: "Informasi",
    icon: Info,
    color: "#1d4ed8",
    bg: "#eff6ff",
    border: "#bfdbfe",
    headerBg: "#1d4ed8",
  },
  warning: {
    label: "Perhatian",
    icon: AlertTriangle,
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
    headerBg: "#d97706",
  },
  urgent: {
    label: "Mendesak",
    icon: Zap,
    color: "#dc2626",
    bg: "#fef2f2",
    border: "#fecaca",
    headerBg: "#dc2626",
  },
  event: {
    label: "Kegiatan",
    icon: CalendarDays,
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    headerBg: "#16a34a",
  },
} as const;

export default async function PengumumanPage() {
  const all = await getAllActiveAnnouncements();

  // Kelompokkan per tipe
  const urgent = all.filter((a) => a.type === "urgent");
  const warning = all.filter((a) => a.type === "warning");
  const event = all.filter((a) => a.type === "event");
  const info = all.filter((a) => a.type === "info");

  const groups = [
    { key: "urgent", items: urgent },
    { key: "warning", items: warning },
    { key: "event", items: event },
    { key: "info", items: info },
  ].filter((g) => g.items.length > 0);

  return (
    <>
      <Breadcrumb
        items={[{ label: "Beranda", href: "/web" }, { label: "Pengumuman" }]}
      />

      {/* Hero */}
      <div className="page-hero" style={{ paddingBlock: "2.5rem 3rem" }}>
        <div className="container-content">
          <p className="page-hero-eyebrow">Informasi Resmi</p>
          <h1 className="page-hero-title" style={{ fontSize: "34px" }}>
            Pengumuman
          </h1>
          <p className="page-hero-desc">
            Pengumuman resmi, pemberitahuan kegiatan, dan informasi penting dari
            BPSDM Provinsi Kalimantan Timur.
          </p>

          {/* Stats */}
          <div className="page-hero-stats">
            <div className="page-hero-stat">
              <div className="page-hero-stat-num">{all.length}</div>
              <div className="page-hero-stat-label">Total pengumuman</div>
            </div>
            {urgent.length > 0 && (
              <div className="page-hero-stat">
                <div
                  className="page-hero-stat-num"
                  style={{ color: "#f87171" }}
                >
                  {urgent.length}
                </div>
                <div className="page-hero-stat-label">Mendesak</div>
              </div>
            )}
            {event.length > 0 && (
              <div className="page-hero-stat">
                <div
                  className="page-hero-stat-num"
                  style={{ color: "#4ade80" }}
                >
                  {event.length}
                </div>
                <div className="page-hero-stat-label">Kegiatan</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        style={{ backgroundColor: "var(--color-ink-8)", paddingBlock: "3rem" }}
      >
        <div className="container-content">
          {all.length === 0 ? (
            /* Empty state */
            <div className="empty-state" style={{ paddingBlock: "60px" }}>
              <Bell
                size={48}
                style={{ color: "var(--color-ink-5)" }}
                strokeWidth={1}
              />
              <div className="empty-state-title">
                Tidak ada pengumuman aktif
              </div>
              <div className="empty-state-desc">
                Saat ini tidak ada pengumuman yang sedang aktif. Silakan
                kunjungi kembali nanti.
              </div>
              <Link
                href="/web"
                className="btn btn-primary"
                style={{ marginTop: "16px" }}
              >
                Kembali ke Beranda
              </Link>
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "32px" }}
            >
              {groups.map(({ key, items }) => {
                const cfg = TYPE_CONFIG[key as keyof typeof TYPE_CONFIG];
                const Icon = cfg.icon;
                return (
                  <div key={key}>
                    {/* Group header */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "16px",
                        paddingBottom: "12px",
                        borderBottom: `2px solid ${cfg.border}`,
                      }}
                    >
                      <div
                        style={{
                          width: "34px",
                          height: "34px",
                          borderRadius: "9px",
                          background: cfg.bg,
                          border: `1px solid ${cfg.border}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={17} style={{ color: cfg.color }} />
                      </div>
                      <div>
                        <h2
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "18px",
                            fontWeight: 700,
                            color: "var(--color-ink)",
                            margin: 0,
                          }}
                        >
                          {cfg.label}
                        </h2>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "var(--color-ink-4)",
                            marginTop: "1px",
                          }}
                        >
                          {items.length} pengumuman
                        </div>
                      </div>
                    </div>

                    {/* Cards */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      {items.map((ann) => (
                        <div
                          key={ann.id}
                          style={{
                            background: "#fff",
                            borderRadius: "14px",
                            border: `1px solid ${cfg.border}`,
                            overflow: "hidden",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                          }}
                        >
                          {/* Card header bar */}
                          <div
                            style={{
                              height: "4px",
                              background: cfg.headerBg,
                            }}
                          />

                          <div style={{ padding: "18px 20px" }}>
                            {/* Badge + tanggal */}
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                marginBottom: "10px",
                                flexWrap: "wrap",
                              }}
                            >
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "5px",
                                  padding: "3px 10px",
                                  borderRadius: "20px",
                                  fontSize: "11px",
                                  fontWeight: 700,
                                  background: cfg.bg,
                                  color: cfg.color,
                                  letterSpacing: "0.3px",
                                }}
                              >
                                <Icon size={10} />
                                {cfg.label}
                              </span>

                              <span
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  fontSize: "12px",
                                  color: "var(--color-ink-4)",
                                }}
                              >
                                <Clock size={11} />
                                {formatDate(ann.startDate, {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })}
                              </span>

                              {ann.endDate && (
                                <span
                                  style={{
                                    fontSize: "12px",
                                    color: "var(--color-ink-4)",
                                  }}
                                >
                                  s/d{" "}
                                  {formatDate(ann.endDate, {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  })}
                                </span>
                              )}
                            </div>

                            {/* Judul */}
                            <h3
                              style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "16px",
                                fontWeight: 700,
                                color: "var(--color-ink)",
                                lineHeight: 1.35,
                                marginBottom: ann.content ? "10px" : "0",
                              }}
                            >
                              {ann.title}
                            </h3>

                            {/* Konten */}
                            {ann.content && (
                              <div
                                className="prose-bpsdm"
                                dangerouslySetInnerHTML={{
                                  __html: ann.content,
                                }}
                                style={{ fontSize: "14px" }}
                              />
                            )}

                            {/* Link */}
                            {ann.url && (
                              <Link
                                href={ann.url}
                                target={
                                  ann.url.startsWith("http")
                                    ? "_blank"
                                    : undefined
                                }
                                rel="noopener noreferrer"
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "6px",
                                  marginTop: "12px",
                                  padding: "8px 16px",
                                  borderRadius: "8px",
                                  background: cfg.bg,
                                  border: `1px solid ${cfg.border}`,
                                  color: cfg.color,
                                  fontSize: "13px",
                                  fontWeight: 700,
                                  textDecoration: "none",
                                  transition: "all 0.15s",
                                }}
                              >
                                {ann.url.startsWith("http") ? (
                                  <>
                                    <ExternalLink size={13} /> Kunjungi Tautan
                                  </>
                                ) : (
                                  <>
                                    <ArrowRight size={13} /> Selengkapnya
                                  </>
                                )}
                              </Link>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
