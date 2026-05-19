// src/app/(public)/berita/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, ImageIcon, Clock, Eye } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Pagination } from "@/components/ui/Pagination";
import { NewsCard } from "@/components/news/NewsCard";
import { NewsSearchBar } from "@/components/news/NewsSearchBar";
import {
  getLatestPosts,
  countPosts,
  getFeaturedPost,
} from "@/lib/queries/posts";
import { getPostCategories } from "@/lib/queries/categories";
import { timeAgo, formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Berita & Artikel",
  description:
    "Informasi terkini seputar kegiatan, program, dan pengumuman BPSDM Provinsi Kalimantan Timur.",
};

const PER_PAGE = 9;

const CATEGORY_BADGE: Record<string, string> = {
  "berita-diklat": "badge-forest",
  "berita-kabkota": "badge-gold",
  "berita-umum": "badge-blue",
  artikel: "badge-red",
};

function getCategoryBadge(slug?: string): string {
  return CATEGORY_BADGE[slug ?? ""] ?? "badge-forest";
}

type Props = {
  searchParams: Promise<{
    kategori?: string;
    halaman?: string;
    cari?: string;
  }>;
};

export default async function BeritaPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.halaman ?? 1));
  const categorySlug = params.kategori;
  const search = params.cari;

  const isFiltered = !!(categorySlug || search);

  const [categories, posts, total, featuredPost] = await Promise.all([
    getPostCategories(),
    getLatestPosts({
      limit: PER_PAGE,
      offset: (page - 1) * PER_PAGE,
      categorySlug,
      search,
    }),
    countPosts({ categorySlug, search }),
    // Hanya ambil featured jika tidak ada filter
    isFiltered ? Promise.resolve(null) : getFeaturedPost(),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);
  const paginationParams: Record<string, string> = {};
  if (categorySlug) paginationParams.kategori = categorySlug;
  if (search) paginationParams.cari = search;

  // Featured post tidak ditampilkan di grid
  const gridPosts = featuredPost
    ? posts.filter((p) => p.id !== featuredPost.id)
    : posts;

  return (
    <>
      <Breadcrumb
        items={[{ label: "Beranda", href: "/" }, { label: "Berita & Artikel" }]}
      />

      {/* Hero */}
      <div className="page-hero">
        <div className="container-content" style={{ position: "relative" }}>
          <p
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.55)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "10px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "20px",
                height: "2px",
                backgroundColor: "var(--color-gold-500)",
              }}
            />
            Informasi Publik
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "38px",
              fontWeight: 700,
              color: "#fff",
              marginBottom: "10px",
              lineHeight: 1.15,
            }}
          >
            Berita &amp; Artikel
          </h1>
          <p
            style={{
              fontSize: "15px",
              color: "rgba(255,255,255,0.6)",
              maxWidth: "480px",
            }}
          >
            Informasi terkini seputar kegiatan, program pelatihan, dan
            pengumuman resmi BPSDM Provinsi Kalimantan Timur.
          </p>
        </div>
      </div>

      {/* Content */}
      <div
        style={{ backgroundColor: "var(--color-ink-8)", paddingBlock: "3rem" }}
      >
        <div className="container-content">
          {/* ── Featured Post — hanya jika tidak ada filter ── */}
          {featuredPost && !isFiltered && (
            <Link
              href={`/berita/${featuredPost.slug}`}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                borderRadius: "16px",
                overflow: "hidden",
                background: "#fff",
                border: "1px solid var(--color-ink-6)",
                textDecoration: "none",
                marginBottom: "28px",
                transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
              className="featured-post-card"
            >
              {/* Gambar */}
              <div
                style={{
                  position: "relative",
                  height: "320px",
                  overflow: "hidden",
                }}
              >
                {featuredPost.featuredImage ? (
                  <img
                    src={featuredPost.featuredImage}
                    alt={featuredPost.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.3s",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: "var(--color-forest-50)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--color-forest-200)",
                    }}
                  >
                    <ImageIcon size={48} strokeWidth={1} />
                  </div>
                )}
                {/* Overlay gradient */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to right, transparent 60%, rgba(255,255,255,0.1) 100%)",
                  }}
                />
                {/* Badge featured */}
                <div
                  style={{
                    position: "absolute",
                    top: "14px",
                    left: "14px",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    background: "var(--color-gold-600)",
                    color: "#fff",
                    fontSize: "11px",
                    fontWeight: 800,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  ★ Pilihan Redaksi
                </div>
              </div>

              {/* Konten */}
              <div
                style={{
                  padding: "32px 36px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span
                    className={`badge ${getCategoryBadge(featuredPost.category?.slug)}`}
                  >
                    {featuredPost.category?.name ?? "Berita"}
                  </span>
                </div>

                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "24px",
                    fontWeight: 700,
                    color: "var(--color-ink)",
                    lineHeight: 1.3,
                    margin: 0,
                  }}
                >
                  {featuredPost.title}
                </h2>

                {featuredPost.excerpt && (
                  <p
                    style={{
                      fontSize: "14px",
                      color: "var(--color-ink-3)",
                      lineHeight: 1.65,
                      margin: 0,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical" as const,
                      overflow: "hidden",
                    }}
                  >
                    {featuredPost.excerpt}
                  </p>
                )}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    fontSize: "12.5px",
                    color: "var(--color-ink-4)",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Clock size={12} />
                    {timeAgo(featuredPost.publishedAt)}
                  </span>
                  <span style={{ color: "var(--color-ink-6)" }}>·</span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Eye size={12} />
                    {featuredPost.viewCount?.toLocaleString("id-ID") ??
                      "0"}{" "}
                    dibaca
                  </span>
                </div>

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13.5px",
                    fontWeight: 700,
                    color: "var(--color-forest-700)",
                    marginTop: "4px",
                  }}
                >
                  Baca Selengkapnya
                  <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          )}

          {/* ── Filter bar + Search ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              flexWrap: "wrap",
              marginBottom: "16px",
            }}
          >
            {/* Kategori pills */}
            <div className="cat-filter-bar" style={{ margin: 0 }}>
              <Link
                href="/berita"
                className={`cat-filter-pill ${!categorySlug && !search ? "cat-filter-pill-active" : ""}`}
              >
                Semua
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/berita?kategori=${cat.slug}`}
                  className={`cat-filter-pill ${categorySlug === cat.slug ? "cat-filter-pill-active" : ""}`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            {/* Search */}
            <Suspense>
              <NewsSearchBar initialValue={search ?? ""} />
            </Suspense>
          </div>

          {/* Info jumlah */}
          <div
            style={{
              fontSize: "13px",
              color: "var(--color-ink-4)",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            Menampilkan{" "}
            <strong style={{ color: "var(--color-ink)" }}>
              {gridPosts.length}
            </strong>{" "}
            dari <strong style={{ color: "var(--color-ink)" }}>{total}</strong>{" "}
            artikel
            {categorySlug && (
              <span>
                · Kategori:{" "}
                <span
                  style={{ color: "var(--color-forest-700)", fontWeight: 600 }}
                >
                  {categories.find((c) => c.slug === categorySlug)?.name}
                </span>
              </span>
            )}
            {search && (
              <span>
                · Pencarian:{" "}
                <span
                  style={{ color: "var(--color-forest-700)", fontWeight: 600 }}
                >
                  "{search}"
                </span>
              </span>
            )}
            {(categorySlug || search) && (
              <Link
                href="/berita"
                style={{
                  fontSize: "12px",
                  color: "var(--color-ink-4)",
                  textDecoration: "none",
                  padding: "2px 8px",
                  borderRadius: "6px",
                  border: "1px solid var(--color-ink-6)",
                  transition: "all 0.12s",
                }}
              >
                × Reset
              </Link>
            )}
          </div>

          {/* Grid */}
          {gridPosts.length === 0 ? (
            <div className="empty-state" style={{ paddingBlock: "48px" }}>
              <ImageIcon size={40} style={{ color: "var(--color-ink-5)" }} />
              <div className="empty-state-title">
                {search
                  ? `Tidak ada hasil untuk "${search}"`
                  : "Belum ada artikel"}
              </div>
              <div className="empty-state-desc">
                {search
                  ? "Coba kata kunci lain atau hapus filter yang aktif."
                  : "Tidak ada artikel dalam kategori ini saat ini."}
              </div>
              <Link
                href="/berita"
                className="btn btn-primary"
                style={{ marginTop: "12px" }}
              >
                Lihat semua artikel
              </Link>
            </div>
          ) : (
            <div className="berita-grid">
              {gridPosts.map((post) => (
                <NewsCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ marginTop: "32px" }}>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                basePath="/berita"
                searchParams={paginationParams}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
