// src/app/(public)/program/page.tsx
import type { Metadata } from "next";
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
  type LucideIcon,
} from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { getPrograms } from "@/lib/queries/programs";
import { fetchJadwal } from "@/lib/simpel/jadwal";

export const metadata: Metadata = {
  title: "Katalog Program Diklat",
  description: "Program pengembangan kompetensi ASN Kalimantan Timur.",
};

export const revalidate = 3600;

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

export default async function ProgramPage() {
  // Ambil semua program aktif + semua jadwal paralel
  const [programs, allJadwal] = await Promise.all([
    getPrograms(),
    fetchJadwal(),
  ]);

  return (
    <>
      <Breadcrumb
        items={[{ label: "Beranda", href: "/" }, { label: "Program Diklat" }]}
      />

      {/* Hero */}
      <div className="page-hero">
        <div className="container-content">
          <p className="page-hero-eyebrow">Pengembangan Kompetensi ASN</p>
          <h1 className="page-hero-title">Katalog Program Diklat</h1>
          <p className="page-hero-desc">
            Program pengembangan kompetensi ASN Kalimantan Timur yang dikelola
            BPSDM Provinsi Kalimantan Timur.
          </p>
          <div className="page-hero-stats">
            <div className="page-hero-stat">
              <div className="page-hero-stat-num">{programs.length}</div>
              <div className="page-hero-stat-label">Jenis program</div>
            </div>
            <div className="page-hero-stat">
              <div className="page-hero-stat-num">
                {
                  allJadwal.filter((j) => j.statusJadwal === "akan-datang")
                    .length
                }
              </div>
              <div className="page-hero-stat-label">Jadwal akan datang</div>
            </div>
            <div className="page-hero-stat">
              <div
                className="page-hero-stat-num"
                style={{ color: "var(--color-gold-400)" }}
              >
                {
                  allJadwal.filter((j) => j.statusJadwal === "berlangsung")
                    .length
                }
              </div>
              <div className="page-hero-stat-label">Sedang berlangsung</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          backgroundColor: "var(--color-ink-8)",
          paddingBlock: "3.5rem",
        }}
      >
        <div className="container-content">
          {programs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-title">Belum ada program</div>
            </div>
          ) : (
            <div className="prog-grid">
              {programs.map((program, i) => {
                const Icon =
                  (program.icon ? ICON_MAP[program.icon] : null) ?? BookOpen;
                const color = program.color ?? "var(--color-forest-700)";
                const badge = JENIS_BADGE[program.jenisKey];
                const num = String(i + 1).padStart(2, "0");

                // Hitung jadwal untuk program ini
                const jadwalProgram = allJadwal.filter(
                  (j) =>
                    j.jenis.toLowerCase() === program.jenisKey.toLowerCase(),
                );
                const jadwalAktif = jadwalProgram.filter(
                  (j) => j.statusJadwal === "berlangsung",
                ).length;
                const jadwalMendatang = jadwalProgram.filter(
                  (j) => j.statusJadwal === "akan-datang",
                ).length;

                return (
                  <Link
                    key={program.id}
                    href={`/program/${program.slug}`}
                    className="prog-card-v2"
                    style={{ textDecoration: "none" }}
                  >
                    {/* Header card */}
                    <div
                      className="prog-card-v2-header"
                      style={{
                        background: `linear-gradient(135deg, ${color}15, ${color}08)`,
                      }}
                    >
                      <div className="prog-card-v2-num">{num}</div>
                      <div
                        className="prog-card-v2-icon"
                        style={{ backgroundColor: `${color}20`, color }}
                      >
                        <Icon size={24} />
                      </div>
                    </div>

                    {/* Body */}
                    <div className="prog-card-v2-body">
                      {/* Badge jenis */}
                      {badge && (
                        <span
                          className="prog-card-v2-badge"
                          style={{
                            backgroundColor: badge.bg,
                            color: badge.color,
                          }}
                        >
                          {program.jenisKey}
                        </span>
                      )}

                      {/* Nama */}
                      <h3 className="prog-card-v2-name">{program.name}</h3>

                      {/* Deskripsi */}
                      {program.description && (
                        <p className="prog-card-v2-desc">
                          {program.description}
                        </p>
                      )}

                      {/* Statistik jadwal */}
                      <div className="prog-card-v2-stats">
                        {jadwalAktif > 0 && (
                          <div
                            className="prog-card-v2-stat"
                            style={{
                              background: "var(--color-forest-50)",
                              color: "var(--color-forest-700)",
                            }}
                          >
                            <span
                              className="prog-stat-dot"
                              style={{
                                backgroundColor: "var(--color-forest-600)",
                              }}
                            />
                            {jadwalAktif} berlangsung
                          </div>
                        )}
                        <div
                          className="prog-card-v2-stat"
                          style={{
                            background: "var(--color-ink-7)",
                            color: "var(--color-ink-3)",
                          }}
                        >
                          <CalendarDays size={11} />
                          {jadwalMendatang} akan datang
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div
                      className="prog-card-v2-footer"
                      style={{ borderTop: `2px solid ${color}20` }}
                    >
                      <span className="prog-card-v2-link" style={{ color }}>
                        Lihat jadwal
                        <ArrowRight size={14} />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
