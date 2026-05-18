// src/app/(public)/layanan/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import {
  ClipboardList,
  GraduationCap,
  MonitorCheck,
  BookOpen,
  Database,
  BarChart2,
  Cloud,
  TrendingUp,
  Activity,
  Newspaper,
  Brain,
  Globe,
  PieChart,
  Headphones,
  MessageSquareWarning,
  CalendarDays,
  ExternalLink,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { getPlatforms } from "@/lib/queries/platforms";

export const metadata: Metadata = {
  title: "Platform & Layanan Digital | BPSDM Kaltim",
  description:
    "Seluruh platform dan layanan digital BPSDM Provinsi Kalimantan Timur untuk mendukung pengembangan SDM.",
};

const ICON_MAP: Record<string, LucideIcon> = {
  ClipboardList,
  GraduationCap,
  MonitorCheck,
  BookOpen,
  Database,
  BarChart2,
  Cloud,
  TrendingUp,
  Activity,
  Newspaper,
  Brain,
  Globe,
  PieChart,
  Headphones,
  MessageSquareWarning,
  CalendarDays,
};

type Platform = {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
  url: string | null;
  category: string | null;
  isActive: boolean | null;
  sortOrder: number | null;
  color: string | null;
  logo: string | null;
  isHighlight: boolean | null;
  createdAt: Date;
  updatedAt: Date;
};

export default async function LayananPage() {
  const [unggulan, ekosistem] = await Promise.all([
    getPlatforms({ category: "unggulan" }),
    getPlatforms({ category: "ekosistem" }),
  ]);

  const total = unggulan.length + ekosistem.length;

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Beranda", href: "/" },
          { label: "Platform & Layanan" },
        ]}
      />

      {/* Hero Section - Konsisten dengan halaman lain */}
      <div className="page-hero" style={{ paddingBlock: "3rem" }}>
        <div className="container-content">
          <p className="page-hero-eyebrow">Ekosistem Digital BPSDM</p>
          <h1 className="page-hero-title">Platform & Layanan Digital</h1>
          <p className="page-hero-desc">
            {total} sistem digital terintegrasi untuk mendukung pengembangan SDM
            Kalimantan Timur
          </p>
          <div className="page-hero-stats">
            <div className="page-hero-stat">
              <div className="page-hero-stat-num">{unggulan.length}</div>
              <div className="page-hero-stat-label">Layanan unggulan</div>
            </div>
            <div className="page-hero-stat">
              <div className="page-hero-stat-num">{ekosistem.length}</div>
              <div className="page-hero-stat-label">Platform ekosistem</div>
            </div>
            <div className="page-hero-stat">
              <div className="page-hero-stat-num">{total}</div>
              <div className="page-hero-stat-label">Total platform</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="layanan-content">
        <div className="container-content">
          {/* ── Layanan Unggulan ── */}
          <div className="layanan-unggulan-section">
            <div className="layanan-section-header">
              <p className="layanan-section-badge">Akses Cepat</p>
              <div className="layanan-section-title-wrapper">
                <div>
                  <h2 className="layanan-section-title">
                    Layanan{" "}
                    <span className="layanan-text-highlight">Unggulan</span>
                  </h2>
                  <p className="layanan-section-desc">
                    Platform utama yang paling sering diakses untuk pengembangan
                    kompetensi
                  </p>
                </div>
              </div>
            </div>

            <div className="layanan-unggulan-grid">
              {unggulan.map((platform) => {
                const Icon = ICON_MAP[platform.icon ?? ""] ?? GraduationCap;
                const isExternal = platform.url?.startsWith("http");

                return (
                  <Link
                    key={platform.id}
                    href={platform.url ?? "#"}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="layanan-unggulan-card"
                  >
                    <div className="layanan-unggulan-card-icon">
                      <Icon size={26} />
                    </div>
                    <div className="layanan-unggulan-card-content">
                      <h3 className="layanan-unggulan-card-name">
                        {platform.name}
                      </h3>
                      <p className="layanan-unggulan-card-desc">
                        {platform.description}
                      </p>
                    </div>
                    <div className="layanan-unggulan-card-cta">
                      <span>Akses Layanan</span>
                      <ArrowRight size={14} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ── Ekosistem Digital ── */}
          <div className="layanan-ekosistem-section">
            <div className="layanan-section-header">
              <p className="layanan-section-badge">Ekosistem Digital</p>
              <div className="layanan-section-title-wrapper">
                <div>
                  <h2 className="layanan-section-title">
                    Seluruh Platform & Layanan
                  </h2>
                  <p className="layanan-section-desc">
                    {ekosistem.length} sistem digital terintegrasi
                  </p>
                </div>
              </div>
            </div>

            <div className="layanan-ekosistem-grid">
              {ekosistem.map((platform) => {
                const Icon = ICON_MAP[platform.icon ?? ""] ?? GraduationCap;
                const isExternal = platform.url?.startsWith("http");
                const isAvail = !!platform.url && platform.url !== "#";

                return (
                  <div key={platform.id} className="layanan-ekosistem-card">
                    <div className="layanan-ekosistem-card-icon">
                      <Icon size={18} />
                    </div>
                    <div className="layanan-ekosistem-card-content">
                      {isAvail ? (
                        <Link
                          href={platform.url ?? "#"}
                          target={isExternal ? "_blank" : undefined}
                          rel={isExternal ? "noopener noreferrer" : undefined}
                          className="layanan-ekosistem-card-name"
                        >
                          {platform.name}
                        </Link>
                      ) : (
                        <span className="layanan-ekosistem-card-name inactive">
                          {platform.name}
                        </span>
                      )}
                      <p className="layanan-ekosistem-card-desc">
                        {platform.description}
                      </p>
                    </div>
                    {isAvail && (
                      <div className="layanan-ekosistem-card-arrow">
                        <ExternalLink size={14} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
