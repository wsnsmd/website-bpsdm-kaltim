// src/components/home/NewsSection.tsx
import Link from "next/link";
import { Clock, Eye, ArrowRight, CalendarDays, ImageIcon } from "lucide-react";
import type { PostListItem } from "@/lib/queries/posts";
import { timeAgo, formatDate } from "@/lib/utils";

type Props = {
  featuredPost: PostListItem | null;
  posts: PostListItem[];
};

const CATEGORY_BADGE: Record<string, string> = {
  "berita-diklat": "badge-forest",
  "berita-kabkota": "badge-gold",
  "berita-umum": "badge-blue",
  artikel: "badge-red",
};

function getCategoryBadge(slug?: string): string {
  return CATEGORY_BADGE[slug ?? ""] ?? "badge-forest";
}

function Thumb({
  src,
  alt,
  size = "full",
}: {
  src?: string | null;
  alt: string;
  size?: "full" | "sm";
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    );
  }
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-forest-900)",
        color: "rgba(255,255,255,0.15)",
      }}
    >
      <ImageIcon size={size === "sm" ? 22 : 48} strokeWidth={1} />
    </div>
  );
}

export function NewsSection({ featuredPost, posts }: Props) {
  const featured = featuredPost ?? posts[0] ?? null;
  const rest = posts.filter((p) => p.id !== featured?.id);
  const secondary = rest.slice(0, 2);
  const listPosts = rest.slice(2, 5);

  if (!featured) return null;

  return (
    <section style={{ background: "var(--color-ink-8)", paddingBlock: "4rem" }}>
      <div className="container-content">
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "1.75rem",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <p className="sec-label">Informasi Terkini</p>
            <h2 className="sec-title">Berita &amp; Publikasi</h2>
          </div>
          <Link href="/berita" className="qs-all-link">
            Semua berita <ArrowRight size={14} />
          </Link>
        </div>

        {/* Grid */}
        <div className="news-section-grid">
          {/* ── Featured — full image dengan overlay ── */}
          <Link
            href={`/berita/${featured.slug}`}
            className="news-featured-link"
          >
            {/* Gambar full */}
            <div style={{ position: "absolute", inset: 0 }}>
              <Thumb src={featured.featuredImage} alt={featured.title} />
            </div>

            {/* Gradient overlay — pakai class untuk hover transition */}
            <div className="news-featured-overlay-inner" />

            {/* Badge atas */}
            <div
              style={{
                position: "absolute",
                top: "16px",
                left: "16px",
                zIndex: 2,
              }}
            >
              <span
                className={`badge ${getCategoryBadge(featured.category?.slug)}`}
              >
                {featured.category?.name ?? "Berita"}
              </span>
            </div>

            {/* Konten bawah */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "24px 22px",
                zIndex: 2,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.6)",
                  marginBottom: "8px",
                }}
              >
                <CalendarDays size={12} />
                {formatDate(featured.publishedAt)}
              </div>

              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#fff",
                  lineHeight: 1.35,
                  margin: "0 0 8px",
                }}
              >
                {featured.title}
              </h3>

              {featured.excerpt && (
                <p
                  style={{
                    fontSize: "13.5px",
                    color: "rgba(255,255,255,0.65)",
                    lineHeight: 1.55,
                    margin: "0 0 14px",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical" as const,
                    overflow: "hidden",
                  }}
                >
                  {featured.excerpt}
                </p>
              )}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: "12px",
                  borderTop: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.45)",
                  }}
                >
                  <Eye size={12} />
                  {featured.viewCount?.toLocaleString("id-ID") ?? "0"} dibaca
                </span>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "var(--color-gold-400)",
                  }}
                >
                  Baca selengkapnya <ArrowRight size={13} />
                </span>
              </div>
            </div>
          </Link>

          {/* ── Kolom kanan ── */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {/* 2 card medium */}
            {secondary.map((item) => (
              <Link
                key={item.id}
                href={`/berita/${item.slug}`}
                className="news-medium-link"
              >
                <div className="news-medium-thumb">
                  <Thumb src={item.featuredImage} alt={item.title} size="sm" />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <span
                    className={`badge ${getCategoryBadge(item.category?.slug)}`}
                    style={{
                      fontSize: "10.5px",
                      marginBottom: "5px",
                      display: "inline-block",
                    }}
                  >
                    {item.category?.name ?? "Berita"}
                  </span>
                  <div
                    style={{
                      fontSize: "13.5px",
                      fontWeight: 700,
                      color: "var(--color-ink)",
                      lineHeight: 1.35,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical" as const,
                      overflow: "hidden",
                      marginBottom: "6px",
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "11.5px",
                      color: "var(--color-ink-4)",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "3px",
                      }}
                    >
                      <Clock size={11} /> {timeAgo(item.publishedAt)}
                    </span>
                    <span style={{ color: "var(--color-ink-5)" }}>·</span>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "3px",
                      }}
                    >
                      <Eye size={11} />{" "}
                      {item.viewCount?.toLocaleString("id-ID") ?? "0"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}

            {/* List compact */}
            {listPosts.length > 0 && (
              <div className="news-list-card">
                <div
                  style={{
                    padding: "10px 14px",
                    borderBottom: "1px solid var(--color-ink-7)",
                    fontSize: "10.5px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    color: "var(--color-ink-4)",
                  }}
                >
                  Berita Lainnya
                </div>

                {listPosts.map((item, i) => (
                  <Link
                    key={item.id}
                    href={`/berita/${item.slug}`}
                    className="news-list-item-link"
                    style={{
                      borderBottom:
                        i < listPosts.length - 1
                          ? "1px solid var(--color-ink-7)"
                          : "none",
                    }}
                  >
                    {/* Nomor */}
                    <div
                      style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        background: "var(--color-forest-50)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                        fontWeight: 800,
                        color: "var(--color-forest-700)",
                        flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "var(--color-ink)",
                          lineHeight: 1.35,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical" as const,
                          overflow: "hidden",
                          marginBottom: "3px",
                        }}
                      >
                        {item.title}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "11px",
                          color: "var(--color-ink-4)",
                        }}
                      >
                        <Clock size={10} />
                        {timeAgo(item.publishedAt)}
                      </div>
                    </div>

                    <ArrowRight size={13} className="news-list-arrow" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
