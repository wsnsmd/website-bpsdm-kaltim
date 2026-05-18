// src/components/home/HeroSection.tsx
import Link from "next/link";
import {
  GraduationCap,
  CalendarDays,
  ArrowRight,
  Clock,
  ChevronRight,
  Star,
  BadgeCheck,
  Users,
  Activity,
} from "lucide-react";
import type { PostListItem } from "@/lib/queries/posts";
import { getPublicSettings } from "@/lib/queries/settings";
import { timeAgo } from "@/lib/utils";

type Props = {
  featuredPost: PostListItem | null;
  recentPosts: PostListItem[];
};

export async function HeroSection({ featuredPost, recentPosts }: Props) {
  const s = await getPublicSettings();

  const featured = featuredPost ?? recentPosts[0] ?? null;
  const newsItems = recentPosts
    .filter((p) => p.id !== featured?.id)
    .slice(0, 2);

  const kpiItems = [
    {
      icon: Users,
      color: "#4ade80",
      num: s.kpi_peserta ?? "12.547",
      suffix: "+",
      label: "Peserta Diklat",
      sublabel: "Tahun berjalan",
    },
    {
      icon: Star,
      color: "#fbbf24",
      num: s.kpi_kepuasan ?? "96,8",
      suffix: "%",
      label: "Tingkat Kepuasan",
      sublabel: "Indeks peserta",
    },
    {
      icon: BadgeCheck,
      color: "#60a5fa",
      num: s.kpi_akreditasi ?? "24",
      suffix: "",
      label: "Terakreditasi LAN",
      sublabel: "Program terstandar",
    },
    {
      icon: Activity,
      color: "#fb923c",
      num: s.kpi_kegiatan ?? "603",
      suffix: "+",
      label: "Kegiatan Kompetensi",
      sublabel: "Jadwal tahun ini",
    },
  ];

  return (
    <section className="hero-simple">
      <div className="hero-simple-bg">
        <div className="hero-simple-pattern" />
        <div className="hero-simple-glow" />
      </div>

      <div className="container-content hero-simple-container">
        {/* Main Content */}
        <div className="hero-simple-grid pt-40">
          {/* Left Column */}
          <div className="hero-simple-left">
            <h1 className="hero-simple-title">
              Aparatur
              <span className="hero-simple-title-outline">Unggul,</span>
              <span>Kaltim Maju</span>
            </h1>

            <p className="hero-simple-desc">
              {s.site_description
                ? s.site_description.slice(0, 140)
                : "Pusat pengembangan kompetensi ASN Kalimantan Timur — mendorong profesionalisme, integritas, dan inovasi pelayanan publik."}
            </p>

            <div className="hero-simple-buttons">
              <Link href="/program" className="hero-simple-btn-primary">
                <GraduationCap size={16} />
                Daftar Program
              </Link>
              <Link
                href="/program/jadwal"
                className="hero-simple-btn-secondary"
              >
                <CalendarDays size={16} />
                Jadwal Diklat
              </Link>
              <Link href="/layanan" className="hero-simple-btn-icon">
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Right Column - News */}
          <div className="hero-simple-right">
            <div className="hero-simple-news-header">
              <div className="hero-simple-news-dot" />
              <span>Berita Terkini</span>
            </div>

            {featured && (
              <Link
                href={`/berita/${featured.slug}`}
                className="hero-simple-featured"
              >
                <div className="hero-simple-featured-image">
                  {featured.featuredImage ? (
                    <img src={featured.featuredImage} alt={featured.title} />
                  ) : (
                    <div className="hero-simple-featured-placeholder" />
                  )}
                  <span className="hero-simple-featured-badge">Terbaru</span>
                </div>
                <div className="hero-simple-featured-content">
                  <div className="hero-simple-featured-meta">
                    <span className="category">
                      {featured.category?.name ?? "Berita"}
                    </span>
                    <span>·</span>
                    <span>
                      <Clock size={10} />
                      {timeAgo(featured.publishedAt)}
                    </span>
                  </div>
                  <h3 className="hero-simple-featured-title">
                    {featured.title}
                  </h3>
                  <div className="hero-simple-featured-link">
                    Baca selengkapnya <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            )}

            {newsItems.length > 0 && (
              <div className="hero-simple-news-list">
                <div className="hero-simple-news-list-header">
                  <span>Berita Lainnya</span>
                </div>
                {newsItems.map((item, index) => (
                  <Link
                    key={item.id}
                    href={`/berita/${item.slug}`}
                    className="hero-simple-news-item"
                  >
                    <span className="hero-simple-news-number">
                      {String(index + 2).padStart(2, "0")}
                    </span>
                    <div className="hero-simple-news-content">
                      <div className="hero-simple-news-title">{item.title}</div>
                      <div className="hero-simple-news-time">
                        <Clock size={10} />
                        {timeAgo(item.publishedAt)}
                      </div>
                    </div>
                    <ChevronRight size={14} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* KPI Bar */}
        <div className="hero-simple-kpi">
          {kpiItems.map((kpi, index) => (
            <div key={index} className="hero-simple-kpi-item">
              <div
                className="hero-simple-kpi-icon"
                style={{
                  background: `${kpi.color}15`,
                  borderColor: `${kpi.color}30`,
                  color: kpi.color,
                }}
              >
                <kpi.icon size={20} />
              </div>
              <div className="hero-simple-kpi-info">
                <div className="hero-simple-kpi-value">
                  {kpi.num}
                  <span style={{ color: kpi.color }}>{kpi.suffix}</span>
                </div>
                <div className="hero-simple-kpi-label">{kpi.label}</div>
                <div className="hero-simple-kpi-sublabel">{kpi.sublabel}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
