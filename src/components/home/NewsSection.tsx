// src/components/home/NewsSection.tsx
import Link from "next/link";
import type { PostListItem } from "@/lib/queries/posts";

type Props = {
  featuredPost: PostListItem | null;
  posts: PostListItem[];
};

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

function formatDate(date: Date | null): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function getCategoryStyle(slug: string | undefined): string {
  const map: Record<string, string> = {
    "berita-diklat": "badge-forest",
    "berita-kabkota": "badge-gold",
    "berita-umum": "badge-blue",
    artikel: "badge-red",
  };
  return map[slug ?? ""] ?? "badge-forest";
}

export function NewsSection({ featuredPost, posts }: Props) {
  const featured = featuredPost ?? posts[0] ?? null;
  const listPosts = posts.filter((p) => p.id !== featured?.id).slice(0, 5);

  if (!featured) return null;

  return (
    <section
      style={{ backgroundColor: "var(--color-ink-8)", paddingBlock: "4rem" }}
    >
      <div className="container-content">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="sec-label">Informasi Terkini</p>
            <h2 className="sec-title">Berita &amp; Publikasi</h2>
          </div>
          <Link href="/berita" className="qs-all-link">
            Semua berita
            <svg
              width="15"
              height="15"
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

        <div className="news-layout">
          {/* Feature kiri */}
          <Link href={`/berita/${featured.slug}`} className="news-feature">
            <div className="news-feature-img">
              <div className="news-feature-img-placeholder" aria-hidden="true">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <span className="news-feature-cat-float">
                {featured.category?.name ?? "Berita"}
              </span>
            </div>

            <div className="news-feature-body">
              <div className="news-feature-meta">
                <span
                  className={`badge ${getCategoryStyle(featured.category?.slug)}`}
                >
                  {featured.category?.name ?? "Berita"}
                </span>
                <span className="news-meta-time">
                  <svg
                    width="12"
                    height="12"
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
                  {formatDate(featured.publishedAt)}
                </span>
              </div>

              <h3 className="news-feature-title">{featured.title}</h3>
              <p className="news-feature-excerpt">{featured.excerpt}</p>

              <div className="news-feature-footer">
                <span className="news-meta-time">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  {featured.viewCount?.toLocaleString("id-ID") ?? "0"} dibaca
                </span>
                <span className="news-read-more">
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
                </span>
              </div>
            </div>
          </Link>

          {/* List kanan */}
          <div className="news-stack">
            {listPosts.map((item) => (
              <Link
                key={item.id}
                href={`/berita/${item.slug}`}
                className="news-stack-item"
              >
                <div className="news-stack-thumb" aria-hidden="true">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                <div className="news-stack-body">
                  <span
                    className={`badge ${getCategoryStyle(item.category?.slug)} news-stack-badge`}
                  >
                    {item.category?.name ?? "Berita"}
                  </span>
                  <div className="news-stack-title">{item.title}</div>
                  <div className="news-stack-meta">
                    <span className="news-meta-time">
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
                    <span className="news-meta-sep" />
                    <span className="news-meta-time">
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      {item.viewCount?.toLocaleString("id-ID") ?? "0"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
