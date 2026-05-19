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
  GraduationCap,
  Award,
  Target,
  CalendarDays,
  ArrowRight,
  Clock,
  Phone,
  CheckCircle2,
  Activity,
  CalendarCheck,
  CalendarX,
  type LucideIcon,
} from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { JadwalCard } from "@/components/program/JadwalCard";
import { buildMetadata } from "@/lib/seo";
import {
  getProgramBySlug,
  getPrograms,
  getAllProgramSlugs,
} from "@/lib/queries/programs";
import { fetchJadwal } from "@/lib/simpel/jadwal";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

type Props = { params: Promise<{ slug: string }> };

const ICON_MAP: Record<string, LucideIcon> = {
  Wrench,
  Layers,
  Users,
  Globe,
  Landmark,
  BadgeCheck,
  BookOpen,
  GraduationCap,
  Award,
  Target,
};

const JENIS_BADGE: Record<string, { bg: string; color: string }> = {
  Teknis: { bg: "#eff6ff", color: "#1d4ed8" },
  Fungsional: {
    bg: "var(--color-forest-100)",
    color: "var(--color-forest-700)",
  },
  Manajerial: { bg: "var(--color-gold-100)", color: "var(--color-gold-700)" },
  Sosiokultural: { bg: "#fdf4ff", color: "#7e22ce" },
  "Pemerintahan Dalam Negeri": { bg: "#ecfeff", color: "#0e7490" },
  Sertifikasi: { bg: "#fff7ed", color: "#c2410c" },
};

export async function generateStaticParams() {
  const slugs = await getAllProgramSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  if (!program) return {};

  return buildMetadata({
    title: program.name,
    description: program.description ?? undefined,
    path: `/program/${program.slug}`,
  });
}

export default async function ProgramDetailPage({ params }: Props) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  if (!program) notFound();

  // Semua program untuk sidebar
  const [allPrograms, allJadwal] = await Promise.all([
    getPrograms(),
    fetchJadwal({ jenis: program.jenisKey }),
  ]);

  const Icon = (program.icon ? ICON_MAP[program.icon] : null) ?? BookOpen;
  const color = program.color ?? "var(--color-forest-700)";
  const badge = JENIS_BADGE[program.jenisKey];

  const jadwalBerlangsung = allJadwal.filter(
    (j) => j.statusJadwal === "berlangsung",
  );
  const jadwalMendatang = allJadwal.filter(
    (j) => j.statusJadwal === "akan-datang",
  );
  const jadwalSelesai = allJadwal.filter((j) => j.statusJadwal === "selesai");

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Beranda", href: "/" },
          { name: "Program Diklat", href: "/program" },
          { name: program.name, href: `/program/${program.slug}` },
        ]}
      />

      <Breadcrumb
        items={[
          { label: "Beranda", href: "/" },
          { label: "Program Diklat", href: "/program" },
          { label: program.name },
        ]}
      />

      {/* ── Hero ── */}
      <div className="page-hero" style={{ paddingBlock: "2.5rem 3rem" }}>
        <div className="container-content">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "14px",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon size={26} color="#fff" />
            </div>
            <div>
              {badge && (
                <span
                  style={{
                    display: "inline-block",
                    padding: "3px 10px",
                    borderRadius: "20px",
                    background: "rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.8)",
                    fontSize: "11px",
                    fontWeight: 700,
                    marginBottom: "6px",
                    letterSpacing: "0.5px",
                  }}
                >
                  {program.jenisKey}
                </span>
              )}
              <h1
                className="page-hero-title"
                style={{ fontSize: "30px", margin: 0 }}
              >
                {program.name}
              </h1>
            </div>
          </div>

          {program.description && (
            <p className="page-hero-desc" style={{ maxWidth: "600px" }}>
              {program.description}
            </p>
          )}

          <div className="page-hero-stats">
            <div className="page-hero-stat">
              <div
                className="page-hero-stat-num"
                style={{
                  color:
                    jadwalBerlangsung.length > 0
                      ? "var(--color-gold-400)"
                      : undefined,
                }}
              >
                {jadwalBerlangsung.length}
              </div>
              <div className="page-hero-stat-label">Sedang berlangsung</div>
            </div>
            <div className="page-hero-stat">
              <div className="page-hero-stat-num">{jadwalMendatang.length}</div>
              <div className="page-hero-stat-label">Akan datang</div>
            </div>
            <div className="page-hero-stat">
              <div className="page-hero-stat-num">{allJadwal.length}</div>
              <div className="page-hero-stat-label">Total jadwal</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div
        style={{ backgroundColor: "var(--color-ink-8)", paddingBlock: "3rem" }}
      >
        <div className="container-content">
          <div className="article-layout">
            {/* ── Main ── */}
            <div>
              {/* Jadwal — berlangsung */}
              {jadwalBerlangsung.length > 0 && (
                <div style={{ marginBottom: "28px" }}>
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
                      <Activity
                        size={16}
                        style={{ color: "var(--color-forest-600)" }}
                      />
                      Sedang Berlangsung
                    </div>
                    <div className="jadwal-month-count">
                      {jadwalBerlangsung.length} kegiatan
                    </div>
                  </div>
                  <div className="jadwal-list">
                    {jadwalBerlangsung.map((j) => (
                      <JadwalCard key={j.id} jadwal={j} />
                    ))}
                  </div>
                </div>
              )}

              {/* Jadwal — akan datang */}
              {jadwalMendatang.length > 0 && (
                <div style={{ marginBottom: "28px" }}>
                  <div className="jadwal-month-header">
                    <div
                      className="jadwal-month-title"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <CalendarDays
                        size={16}
                        style={{ color: "var(--color-forest-500)" }}
                      />
                      Jadwal Mendatang
                    </div>
                    <div className="jadwal-month-count">
                      {jadwalMendatang.length} kegiatan
                    </div>
                  </div>
                  <div className="jadwal-list">
                    {jadwalMendatang.slice(0, 10).map((j) => (
                      <JadwalCard key={j.id} jadwal={j} />
                    ))}
                    {jadwalMendatang.length > 10 && (
                      <div style={{ textAlign: "center", paddingTop: "12px" }}>
                        <Link
                          href={`/program/jadwal?jenis=${encodeURIComponent(program.jenisKey)}`}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "var(--color-forest-700)",
                            textDecoration: "none",
                          }}
                        >
                          Lihat {jadwalMendatang.length - 10} jadwal lainnya
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Jadwal — selesai (collapsible) */}
              {jadwalSelesai.length > 0 && (
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
                      <CalendarCheck
                        size={16}
                        style={{ color: "var(--color-ink-5)" }}
                      />
                      Sudah Selesai
                    </div>
                    <div className="jadwal-month-count">
                      {jadwalSelesai.length} kegiatan
                    </div>
                  </div>
                  <div className="jadwal-list">
                    {jadwalSelesai.slice(0, 5).map((j) => (
                      <JadwalCard key={j.id} jadwal={j} />
                    ))}
                  </div>
                  {jadwalSelesai.length > 5 && (
                    <div style={{ textAlign: "center", paddingTop: "12px" }}>
                      <Link
                        href={`/program/jadwal?jenis=${encodeURIComponent(program.jenisKey)}&status=selesai`}
                        className="qs-all-link"
                      >
                        Lihat semua {jadwalSelesai.length} jadwal selesai
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Empty state */}
              {allJadwal.length === 0 && (
                <div className="empty-state" style={{ paddingBlock: "48px" }}>
                  <CalendarX
                    size={40}
                    style={{ color: "var(--color-ink-5)" }}
                  />
                  <div className="empty-state-title">Belum ada jadwal</div>
                  <div className="empty-state-desc">
                    Belum ada jadwal untuk program ini saat ini.
                  </div>
                  <Link
                    href="/program/jadwal"
                    style={{
                      marginTop: "12px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "9px 18px",
                      borderRadius: "9px",
                      background: "var(--color-forest-700)",
                      color: "#fff",
                      fontSize: "13px",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    Lihat semua jadwal
                    <ArrowRight size={13} />
                  </Link>
                </div>
              )}
            </div>

            {/* ── Sidebar ── */}
            <aside className="article-sidebar">
              {/* Program lain */}
              <div className="sidebar-widget">
                <div className="sidebar-widget-head">
                  <GraduationCap size={16} />
                  Program Lainnya
                </div>
                <div style={{ padding: "6px 0" }}>
                  {allPrograms
                    .filter((p) => p.id !== program.id)
                    .map((p) => {
                      const PIcon =
                        (p.icon ? ICON_MAP[p.icon] : null) ?? BookOpen;
                      const pColor = p.color ?? "var(--color-forest-700)";
                      return (
                        <Link
                          key={p.id}
                          href={`/program/${p.slug}`}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "10px 14px",
                            textDecoration: "none",
                            borderBottom: "1px solid var(--color-ink-7)",
                            transition: "background 0.12s",
                          }}
                          className="sidebar-prog-link"
                        >
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "8px",
                              background: `${pColor}15`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <PIcon size={16} style={{ color: pColor }} />
                          </div>
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: p.id === program.id ? 700 : 500,
                              color:
                                p.id === program.id
                                  ? "var(--color-forest-700)"
                                  : "var(--color-ink-2)",
                              lineHeight: 1.3,
                            }}
                          >
                            {p.name}
                          </span>
                        </Link>
                      );
                    })}
                </div>
              </div>

              {/* CTA */}
              <div className="jadwal-cta">
                <div className="jadwal-cta-title">Ingin mendaftar?</div>
                <div className="jadwal-cta-desc">
                  Hubungi tim BPSDM Kaltim untuk informasi pendaftaran program
                  ini.
                </div>
                <Link href="/kontak" className="btn-gold btn jadwal-cta-btn">
                  <Phone size={15} />
                  Hubungi Kami
                </Link>
                <Link
                  href="/program/jadwal"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    marginTop: "8px",
                    padding: "9px",
                    borderRadius: "9px",
                    border: "1px solid var(--color-ink-5)",
                    color: "var(--color-ink-6)",
                    fontSize: "13px",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  <CalendarDays size={14} />
                  Semua Jadwal
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
