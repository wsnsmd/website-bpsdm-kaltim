// src/app/(public)/berita/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { NewsCard } from "@/components/news/NewsCard";
import {
  getPostBySlug,
  getLatestPosts,
  getAdjacentPosts,
  incrementPostView,
} from "@/lib/queries/posts";
import { getUpcomingSchedules } from "@/lib/queries/programs";
import { getPostCategories } from "@/lib/queries/categories";
import {
  formatDate,
  formatNumber,
  timeAgo,
  getCategoryBadge,
} from "@/lib/utils";
import { SmartImage } from "@/components/ui/SmartImage";

type Props = {
  params: Promise<{ slug: string }>;
};

// ── Dynamic metadata ───────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Artikel Tidak Ditemukan" };

  return {
    title: post.metaTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt ?? undefined,
    openGraph: {
      title: post.metaTitle ?? post.title,
      description: post.metaDescription ?? post.excerpt ?? undefined,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
    },
    alternates: {
      canonical: post.canonicalUrl ?? `/berita/${post.slug}`,
    },
  };
}

// ── Page ──────────────────────────────────────
export default async function BeritaDetailPage({ params }: Props) {
  const { slug } = await params;

  const post = await getPostBySlug(slug);
  if (!post) notFound();

  // Increment view — fire and forget
  incrementPostView(post.id).catch(() => {});

  // Fetch supporting data paralel
  const [adjacent, relatedPosts, schedules, categories] = await Promise.all([
    getAdjacentPosts(post.publishedAt!),
    getLatestPosts({ limit: 3, categorySlug: post.category?.slug }),
    getUpcomingSchedules({ limit: 3 }),
    getPostCategories(),
  ]);

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Beranda", href: "/" },
          { label: "Berita & Artikel", href: "/berita" },
          {
            label: post.category?.name ?? "Berita",
            href: `/berita?kategori=${post.category?.slug}`,
          },
          { label: post.title },
        ]}
      />

      <div
        style={{
          backgroundColor: "var(--color-ink-8)",
          paddingBlock: "3.5rem 5rem",
        }}
      >
        <div className="container-content">
          <div className="article-layout">
            {/* ── ARTIKEL UTAMA ── */}
            <article>
              {/* Hero image placeholder */}
              <div className="article-hero-img">
                {post.featuredImage ? (
                  <SmartImage
                    src={post.featuredImage}
                    alt={post.featuredImageAlt ?? post.title}
                    style={{ borderRadius: "14px" }}
                  />
                ) : (
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    style={{ color: "var(--color-ink-5)" }}
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                )}
                {post.featuredImageCaption && (
                  <div className="article-img-caption">
                    {post.featuredImageCaption}
                  </div>
                )}
              </div>
              {/* Meta atas */}
              <div className="article-meta-top">
                <span
                  className={`badge ${getCategoryBadge(post.category?.slug)}`}
                >
                  {post.category?.name ?? "Berita"}
                </span>
                <span className="article-meta-sep" />
                <span className="article-meta-item">
                  <svg
                    width="13"
                    height="13"
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
                  {formatDate(post.publishedAt)}
                </span>
                <span className="article-meta-sep" />
                <span className="article-meta-item">
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
                  {formatNumber(post.viewCount)} dibaca
                </span>
                <span className="article-meta-sep" />
                <span className="article-meta-item">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {post.readingTime ?? 3} menit baca
                </span>
              </div>
              {/* Judul */}
              <h1 className="article-title">{post.title}</h1>
              {/* Byline */}
              <div className="article-byline">
                <div className="article-author">
                  <div className="article-author-avatar">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div>
                    <div className="article-author-name">
                      {post.authorName ?? "Humas BPSDM Kaltim"}
                    </div>
                    <div className="article-author-role">
                      BPSDM Provinsi Kalimantan Timur
                    </div>
                  </div>
                </div>

                {/* Share */}
                <div className="article-share">
                  <span className="article-share-label">Bagikan:</span>
                  {[
                    {
                      label: "Facebook",
                      path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
                    },
                    {
                      label: "X",
                      path: "M4 4l16 16M4 20L20 4",
                    },
                    {
                      label: "WhatsApp",
                      path: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z",
                    },
                  ].map((s) => (
                    <button
                      key={s.label}
                      className="share-btn"
                      aria-label={`Bagikan ke ${s.label}`}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d={s.path} />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
              {/* Lead */}
              {post.excerpt && <p className="article-lead">{post.excerpt}</p>}
              {/* Body */}
              <div
                className="prose-bpsdm"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              {/* Navigasi artikel */}
              {(adjacent.prev || adjacent.next) && (
                <div className="article-nav">
                  {adjacent.prev ? (
                    <Link
                      href={`/berita/${adjacent.prev.slug}`}
                      className="article-nav-card"
                    >
                      <div className="article-nav-dir">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="15 18 9 12 15 6" />
                        </svg>
                        Sebelumnya
                      </div>
                      <div className="article-nav-title">
                        {adjacent.prev.title}
                      </div>
                    </Link>
                  ) : (
                    <div />
                  )}

                  {adjacent.next ? (
                    <Link
                      href={`/berita/${adjacent.next.slug}`}
                      className="article-nav-card article-nav-card-right"
                    >
                      <div
                        className="article-nav-dir"
                        style={{ justifyContent: "flex-end" }}
                      >
                        Berikutnya
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </div>
                      <div
                        className="article-nav-title"
                        style={{ textAlign: "right" }}
                      >
                        {adjacent.next.title}
                      </div>
                    </Link>
                  ) : (
                    <div />
                  )}
                </div>
              )}
              {/* Artikel terkait */}
              {relatedPosts.length > 0 && (
                <div style={{ marginTop: "3rem" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "20px",
                      paddingBottom: "14px",
                      borderBottom: "2px solid var(--color-ink-6)",
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
                      Artikel Terkait
                    </h2>
                    <Link href="/berita" className="qs-all-link">
                      Semua berita
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
                  <div
                    className="berita-grid"
                    style={{ gridTemplateColumns: "repeat(3,1fr)" }}
                  >
                    {relatedPosts.map((p) => (
                      <NewsCard key={p.id} post={p} />
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* ── SIDEBAR ── */}
            <aside className="article-sidebar">
              {/* Berita terbaru */}
              <div className="sidebar-widget">
                <div className="sidebar-widget-head">
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
                <div className="sidebar-widget-body">
                  {relatedPosts.map((p) => (
                    <NewsCard key={p.id} post={p} variant="horizontal" />
                  ))}
                </div>
              </div>

              {/* Jadwal pelatihan */}
              <div className="sidebar-widget">
                <div className="sidebar-widget-head">
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
                  Jadwal Pelatihan
                </div>
                <div className="sidebar-widget-body">
                  {schedules.length === 0 && (
                    <p
                      style={{
                        fontSize: "13px",
                        color: "var(--color-ink-4)",
                        padding: "8px 0",
                      }}
                    >
                      Belum ada jadwal.
                    </p>
                  )}
                  {schedules.map((s) => {
                    const d = new Date(s.startDate);
                    return (
                      <div key={s.id} className="sidebar-schedule-item">
                        <div className="sidebar-schedule-date">
                          <div className="sidebar-schedule-day">
                            {String(d.getDate()).padStart(2, "0")}
                          </div>
                          <div className="sidebar-schedule-mon">
                            {d.toLocaleDateString("id-ID", { month: "short" })}
                          </div>
                        </div>
                        <div className="sidebar-schedule-info">
                          <div className="sidebar-schedule-title">
                            {s.program.name}
                          </div>
                          {s.batchName && (
                            <div className="sidebar-schedule-batch">
                              {s.batchName}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <Link href="/program/jadwal" className="sidebar-more-link">
                    Lihat semua jadwal
                    <svg
                      width="13"
                      height="13"
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

              {/* Kategori */}
              <div className="sidebar-widget">
                <div className="sidebar-widget-head">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                  Kategori
                </div>
                <div className="sidebar-widget-body">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/berita?kategori=${cat.slug}`}
                      className={`sidebar-cat-item ${
                        post.category?.slug === cat.slug
                          ? "sidebar-cat-item-active"
                          : ""
                      }`}
                    >
                      <span>{cat.name}</span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
