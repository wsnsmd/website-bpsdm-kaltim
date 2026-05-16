// src/app/(public)/program/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Wrench,
  Layers,
  Users,
  Globe,
  Landmark,
  BadgeCheck,
  BookOpen,
  Award,
  Target,
  GraduationCap,
  CalendarDays,
  Activity,
  CalendarCheck,
  ArrowLeft,
  type LucideIcon,
} from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { JadwalCard } from "@/components/program/JadwalCard";
import { getProgramBySlug } from "@/lib/queries/programs";
import { fetchJadwal } from "@/lib/simpel/jadwal";
import type { StatusJadwal } from "@/lib/simpel/types";

const ICON_MAP: Record<string, LucideIcon> = {
  Wrench,
  Layers,
  Users,
  Globe,
  Landmark,
  BadgeCheck,
  BookOpen,
  Award,
  Target,
  GraduationCap,
};

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  if (!program) return { title: "Program Tidak Ditemukan" };
  return {
    title: program.name,
    description: program.description ?? undefined,
  };
}

export default async function ProgramDetailPage({ params }: Props) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  if (!program) notFound();

  // Fetch jadwal dari SIMPEL berdasarkan jenisKey program
  const jadwalList = await fetchJadwal({ jenis: program.jenisKey });

  const stats = {
    berlangsung: jadwalList.filter((j) => j.statusJadwal === "berlangsung")
      .length,
    mendatang: jadwalList.filter((j) => j.statusJadwal === "akan-datang")
      .length,
    selesai: jadwalList.filter((j) => j.statusJadwal === "selesai").length,
  };

  const color = program.color ?? "var(--color-forest-700)";
  const Icon = (program.icon ? ICON_MAP[program.icon] : null) ?? BookOpen;

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Beranda", href: "/" },
          { label: "Program Diklat", href: "/program" },
          { label: program.name },
        ]}
      />

      {/* Hero */}
      <div className="page-hero" style={{ paddingBlock: "3rem" }}>
        <div className="container-content">
          <div
            style={{ display: "flex", alignItems: "flex-start", gap: "24px" }}
          >
            {/* Icon besar */}
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "18px",
                backgroundColor: "rgba(255,255,255,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <Icon size={34} style={{ color: "#fff" }} />
            </div>

            <div style={{ flex: 1 }}>
              <p className="page-hero-eyebrow">
                Program Pengembangan Kompetensi
              </p>
              <h1 className="page-hero-title">{program.name}</h1>
              {program.description && (
                <p className="page-hero-desc">{program.description}</p>
              )}

              {/* Stats jadwal */}
              <div className="page-hero-stats">
                <div className="page-hero-stat">
                  <div
                    className="page-hero-stat-num"
                    style={{ color: "var(--color-gold-400)" }}
                  >
                    {stats.berlangsung}
                  </div>
                  <div className="page-hero-stat-label">Berlangsung</div>
                </div>
                <div className="page-hero-stat">
                  <div className="page-hero-stat-num">{stats.mendatang}</div>
                  <div className="page-hero-stat-label">Akan datang</div>
                </div>
                <div className="page-hero-stat">
                  <div
                    className="page-hero-stat-num"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    {stats.selesai}
                  </div>
                  <div className="page-hero-stat-label">Selesai</div>
                </div>
                <div className="page-hero-stat">
                  <div className="page-hero-stat-num">{jadwalList.length}</div>
                  <div className="page-hero-stat-label">Total kegiatan</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        style={{ backgroundColor: "var(--color-ink-8)", paddingBlock: "3rem" }}
      >
        <div className="container-content">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 280px",
              gap: "28px",
              alignItems: "start",
            }}
          >
            {/* ── Jadwal ── */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                }}
              >
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "var(--color-ink)",
                  }}
                >
                  Jadwal Kegiatan
                </h2>
                <Link href="/program/jadwal" className="qs-all-link">
                  Semua jadwal
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>

              {jadwalList.length === 0 ? (
                <div className="empty-state" style={{ paddingBlock: "40px" }}>
                  <CalendarDays
                    size={40}
                    style={{ color: "var(--color-ink-5)" }}
                  />
                  <div className="empty-state-title">Belum ada jadwal</div>
                  <div className="empty-state-desc">
                    Belum ada jadwal kegiatan untuk program ini saat ini. Data
                    diperbarui setiap 1 jam dari SIMPEL Kaltim.
                  </div>
                </div>
              ) : (
                <>
                  {/* Berlangsung */}
                  {stats.berlangsung > 0 && (
                    <div style={{ marginBottom: "24px" }}>
                      <div className="jadwal-month-header">
                        <div
                          className="jadwal-month-title"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            color: "var(--color-forest-700)",
                          }}
                        >
                          <Activity size={16} />
                          Sedang Berlangsung
                        </div>
                        <div className="jadwal-month-count">
                          {stats.berlangsung} kegiatan
                        </div>
                      </div>
                      <div className="jadwal-list">
                        {jadwalList
                          .filter((j) => j.statusJadwal === "berlangsung")
                          .map((j) => (
                            <JadwalCard key={j.id} jadwal={j} />
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Akan datang */}
                  {stats.mendatang > 0 && (
                    <div style={{ marginBottom: "24px" }}>
                      <div className="jadwal-month-header">
                        <div
                          className="jadwal-month-title"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <CalendarDays size={16} />
                          Akan Datang
                        </div>
                        <div className="jadwal-month-count">
                          {stats.mendatang} kegiatan
                        </div>
                      </div>
                      <div className="jadwal-list">
                        {jadwalList
                          .filter((j) => j.statusJadwal === "akan-datang")
                          .map((j) => (
                            <JadwalCard key={j.id} jadwal={j} />
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Selesai */}
                  {stats.selesai > 0 && (
                    <div>
                      <div className="jadwal-month-header">
                        <div
                          className="jadwal-month-title"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            color: "var(--color-ink-4)",
                          }}
                        >
                          <CalendarCheck size={16} />
                          Selesai
                        </div>
                        <div className="jadwal-month-count">
                          {stats.selesai} kegiatan
                        </div>
                      </div>
                      <div className="jadwal-list">
                        {jadwalList
                          .filter((j) => j.statusJadwal === "selesai")
                          .map((j) => (
                            <JadwalCard key={j.id} jadwal={j} />
                          ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ── Sidebar ── */}
            <aside
              style={{
                position: "sticky",
                top: "88px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              {/* Info program */}
              <div className="sidebar-widget">
                <div
                  className="sidebar-widget-head"
                  style={{ backgroundColor: color }}
                >
                  <Icon size={16} />
                  {program.name}
                </div>
                <div
                  className="sidebar-widget-body"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {program.objectives && (
                    <div>
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          color: "var(--color-ink-4)",
                          marginBottom: "4px",
                        }}
                      >
                        Tujuan
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "var(--color-ink-2)",
                          lineHeight: 1.6,
                        }}
                      >
                        {program.objectives}
                      </div>
                    </div>
                  )}

                  {program.target && (
                    <div>
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          color: "var(--color-ink-4)",
                          marginBottom: "4px",
                        }}
                      >
                        Sasaran Peserta
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "var(--color-ink-2)",
                          lineHeight: 1.6,
                        }}
                      >
                        {program.target}
                      </div>
                    </div>
                  )}

                  <div>
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        color: "var(--color-ink-4)",
                        marginBottom: "4px",
                      }}
                    >
                      Jenis Kompetensi
                    </div>
                    <span className="badge badge-forest">
                      {program.jenisKey}
                    </span>
                  </div>
                </div>
              </div>

              {/* Semua program */}
              <div className="sidebar-widget">
                <div className="sidebar-widget-head">
                  <Layers size={16} />
                  Program Lainnya
                </div>
                <div
                  className="sidebar-widget-body"
                  style={{ padding: "8px 8px" }}
                >
                  <Link
                    href="/program"
                    className="sidebar-cat-item"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <ArrowLeft size={14} />
                    Lihat semua program
                  </Link>
                  <Link
                    href="/program/jadwal"
                    className="sidebar-cat-item"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <CalendarDays size={14} />
                    Semua jadwal kegiatan
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
