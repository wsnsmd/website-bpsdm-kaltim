// src/components/home/HeroSection.tsx
import Link from "next/link";
import type { PostListItem } from "@/lib/queries/posts";

// ── Helpers ───────────────────────────────────
function timeAgo(date: Date | null): string {
  if (!date) return "";
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const intervals = [
    { label: "tahun", secs: 31536000 },
    { label: "bulan", secs: 2592000 },
    { label: "minggu", secs: 604800 },
    { label: "hari", secs: 86400 },
    { label: "jam", secs: 3600 },
    { label: "menit", secs: 60 },
  ];
  for (const i of intervals) {
    const count = Math.floor(seconds / i.secs);
    if (count >= 1) return `${count} ${i.label} lalu`;
  }
  return "Baru saja";
}

// ── Props ─────────────────────────────────────
type Props = {
  featuredPost: PostListItem | null;
  recentPosts: PostListItem[];
};

const KPI_ITEMS = [
  { num: "1,039", suffix: "K", label: "Total kunjungan\nsitus resmi" },
  { num: "603", suffix: "+", label: "Peserta aktif\nsaat ini" },
  { num: "48", suffix: "", label: "Program diklat\ntersedia" },
];

export function HeroSection({ featuredPost, recentPosts }: Props) {
  // Fallback jika DB kosong
  const featured = featuredPost ?? {
    title: "Selamat Datang di Portal BPSDM Kaltim",
    slug: "",
    category: { name: "Berita Umum", slug: "berita-umum", id: 0, color: null },
    publishedAt: new Date(),
    viewCount: 0,
    excerpt: null,
    featuredImage: null,
  };

  const newsItems = recentPosts.filter((p) => p.slug !== featured.slug);

  return (
    <section className="hero-root" aria-label="Hero utama">
      <div className="hero-pattern" aria-hidden="true" />
      <div className="hero-accent-bar" aria-hidden="true" />

      <div className="container-content">
        <div className="hero-grid">
          {/* ── Kiri ── */}
          <div className="hero-left">
            <div className="hero-eyebrow">
              <div className="hero-eyebrow-line" />
              <span className="hero-eyebrow-text">
                Pemerintah Provinsi Kalimantan Timur
              </span>
            </div>

            <h1 className="hero-heading">
              Aparatur <em className="hero-heading-em">Unggul,</em>
              <br />
              Kaltim Maju
            </h1>

            <p className="hero-desc">
              Pusat pengembangan kompetensi ASN Kalimantan Timur — mendorong
              profesionalisme, integritas, dan inovasi pelayanan publik.
            </p>

            <div className="hero-actions">
              <Link href="/program" className="btn-gold btn hero-btn-primary">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
                Daftar Program
              </Link>
              <Link href="/program/jadwal" className="hero-btn-ghost">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Jadwal Diklat
              </Link>
            </div>

            <div className="hero-kpi">
              {KPI_ITEMS.map((item, i) => (
                <div
                  key={i}
                  className="hero-kpi-item"
                  style={{
                    borderRight:
                      i < KPI_ITEMS.length - 1
                        ? "1px solid rgba(255,255,255,0.1)"
                        : "none",
                  }}
                >
                  <div className="hero-kpi-num">
                    {item.num}
                    <sup className="hero-kpi-sup">{item.suffix}</sup>
                  </div>
                  <div className="hero-kpi-label">
                    {item.label.split("\n").map((line, j) => (
                      <span key={j}>
                        {line}
                        {j === 0 && <br />}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Kanan ── */}
          <div className="hero-right">
            {/* Featured */}
            <div className="hero-featured">
              <div className="hero-featured-img">
                <div className="hero-featured-img-pattern" aria-hidden="true" />
                <div className="hero-featured-img-icon" aria-hidden="true">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <div className="hero-featured-badge">
                  <span className="hero-featured-tag">Terbaru</span>
                  <span className="hero-featured-cat">
                    {featured.category?.name ?? "Berita"}
                  </span>
                </div>
              </div>
              <div className="hero-featured-body">
                <div className="hero-featured-meta">
                  <span className="hero-featured-cat-label">
                    {featured.category?.name ?? "Berita"}
                  </span>
                  <span className="hero-featured-time">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {timeAgo(featured.publishedAt)}
                  </span>
                </div>
                <Link
                  href={featured.slug ? `/berita/${featured.slug}` : "#"}
                  className="hero-featured-title"
                >
                  {featured.title}
                </Link>
                <Link
                  href={featured.slug ? `/berita/${featured.slug}` : "#"}
                  className="hero-featured-read"
                >
                  Baca selengkapnya
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
            </div>

            {/* News list */}
            <div className="hero-news-list">
              {newsItems.slice(0, 3).map((item, i) => (
                <Link
                  key={item.id}
                  href={`/berita/${item.slug}`}
                  className="hero-news-item"
                >
                  <div className="hero-news-num">
                    {String(i + 2).padStart(2, "0")}
                  </div>
                  <div className="hero-news-body">
                    <div className="hero-news-title">{item.title}</div>
                    <div className="hero-news-bottom">
                      <span className="hero-news-category">
                        {item.category?.name ?? "Berita"}
                      </span>
                      <span className="hero-news-time">
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        {timeAgo(item.publishedAt)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
