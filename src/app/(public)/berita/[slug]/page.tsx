// src/app/(public)/berita/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { NewsCard } from "@/components/news/NewsCard";
import { ShareButtons } from "@/components/ui/ShareButtons";
import {
  getPostBySlug,
  getLatestPosts,
  getAdjacentPosts,
  incrementPostView,
} from "@/lib/queries/posts";
import { fetchJadwalMendatang } from "@/lib/simpel/jadwal";
import { getPostCategories } from "@/lib/queries/categories";
import { formatDate, getCategoryBadge } from "@/lib/utils";
import { SmartImage } from "@/components/ui/SmartImage";
import {
  Calendar,
  Eye,
  Clock,
  User,
  Image as ImageIcon,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Folder,
  FileText,
  CalendarDays,
} from "lucide-react";
import { buildMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

// ── Dynamic metadata ───────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Artikel Tidak Ditemukan | BPSDM Kaltim" };

  // Title yang lebih informatif
  const pageTitle = post.metaTitle ? `${post.metaTitle}` : `${post.title}`;

  const pageDescription = post.metaDescription
    ? post.metaDescription
    : post.excerpt ||
      `Baca selengkapnya tentang ${post.title} di website resmi BPSDM Provinsi Kalimantan Timur.`;

  return buildMetadata({
    title: pageTitle,
    description: pageDescription,
    path: `/berita/${post.slug}`,
    image: post.featuredImage ?? undefined,
    type: "article",
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    tags: post.category ? [post.category.name] : [],
  });
  // return {
  //   title: pageTitle,
  //   description: pageDescription,
  //   openGraph: {
  //     title: pageTitle,
  //     description: pageDescription,
  //     type: "article",
  //     publishedTime: post.publishedAt?.toISOString(),
  //     authors: [post.authorName ?? "Humas BPSDM Kaltim"],
  //     tags: post.category?.name ? [post.category.name] : [],
  //   },
  //   twitter: {
  //     card: "summary_large_image",
  //     title: pageTitle,
  //     description: pageDescription,
  //   },
  //   alternates: {
  //     canonical: post.canonicalUrl ?? `/berita/${post.slug}`,
  //   },
  // };
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
    fetchJadwalMendatang(3),
    getPostCategories(),
  ]);

  // Get current URL for sharing
  const currentUrl = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/berita/${post.slug}`
    : `http://localhost:3000/berita/${post.slug}`;

  // Hitung estimasi waktu baca (jika tidak ada)
  const readingTime =
    post.readingTime || Math.ceil(post.content?.length / 1500) || 3;

  return (
    <>
      <ArticleJsonLd
        title={post.title}
        description={post.excerpt ?? undefined}
        url={`/berita/${post.slug}`}
        image={post.featuredImage ?? undefined}
        publishedAt={post.publishedAt}
        updatedAt={post.updatedAt}
      />
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
          backgroundColor: "#F9FAFB",
          paddingBlock: "2rem 4rem",
        }}
      >
        <div className="container-content">
          <div className="article-layout">
            {/* ── ARTIKEL UTAMA ── */}
            <article>
              {/* Hero image */}
              <div className="article-hero-img">
                {post.featuredImage ? (
                  <SmartImage
                    src={post.featuredImage}
                    alt={post.featuredImageAlt ?? post.title}
                    style={{ borderRadius: "14px" }}
                  />
                ) : (
                  <ImageIcon size={64} strokeWidth={1} className="text-ink-5" />
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
                  <Calendar size={13} strokeWidth={2} />
                  {formatDate(post.publishedAt)}
                </span>
                <span className="article-meta-sep" />
                <span className="article-meta-item">
                  <Eye size={13} strokeWidth={2} />
                  {post.viewCount?.toLocaleString() ?? 0} dibaca
                </span>
                <span className="article-meta-sep" />
                <span className="article-meta-item">
                  <Clock size={13} strokeWidth={2} />
                  {readingTime} menit baca
                </span>
              </div>

              {/* Judul */}
              <h1 className="article-title">{post.title}</h1>

              {/* Byline */}
              <div className="article-byline">
                <div className="article-author">
                  <div className="article-author-avatar">
                    <User size={20} strokeWidth={2} />
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

                {/* Share Buttons - Client Component */}
                <ShareButtons
                  title={post.title}
                  excerpt={post.excerpt}
                  url={currentUrl}
                />
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
                        <ArrowLeft size={14} strokeWidth={2} />
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
                        <ArrowRight size={14} strokeWidth={2} />
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
              {relatedPosts.filter((p) => p.id !== post.id).length > 0 && (
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
                      <ArrowRight size={14} strokeWidth={2} />
                    </Link>
                  </div>
                  <div className="berita-grid article-related-grid">
                    {relatedPosts
                      .filter((p) => p.id !== post.id)
                      .slice(0, 3)
                      .map((p) => (
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
                  <FileText size={16} strokeWidth={2} />
                  Berita Terbaru
                </div>
                <div className="sidebar-widget-body">
                  {relatedPosts
                    .filter((p) => p.id !== post.id)
                    .slice(0, 3)
                    .map((p) => (
                      <NewsCard key={p.id} post={p} variant="horizontal" />
                    ))}
                  {relatedPosts.filter((p) => p.id !== post.id).length ===
                    0 && (
                    <p
                      style={{
                        fontSize: "13px",
                        color: "var(--color-ink-4)",
                        padding: "8px 0",
                      }}
                    >
                      Belum ada berita lain.
                    </p>
                  )}
                </div>
              </div>

              {/* Jadwal pelatihan */}
              <div className="sidebar-widget">
                <div className="sidebar-widget-head">
                  <CalendarDays size={16} strokeWidth={2} />
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
                  {schedules.slice(0, 3).map((s) => {
                    const d = new Date(s.tgl_awal);
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
                          <div className="sidebar-schedule-title">{s.nama}</div>
                          <div className="sidebar-schedule-batch">
                            {s.jenis}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <Link href="/program/jadwal" className="sidebar-more-link">
                    Lihat semua jadwal
                    <ArrowRight size={13} strokeWidth={2} />
                  </Link>
                </div>
              </div>

              {/* Kategori */}
              <div className="sidebar-widget">
                <div className="sidebar-widget-head">
                  <Folder size={16} strokeWidth={2} />
                  Kategori
                </div>
                <div className="sidebar-widget-body">
                  {categories.slice(0, 8).map((cat) => (
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
                      <ChevronRight size={14} strokeWidth={2} />
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
