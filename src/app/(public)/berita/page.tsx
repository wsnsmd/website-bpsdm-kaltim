// src/app/(public)/berita/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Pagination } from "@/components/ui/Pagination";
import { NewsCard } from "@/components/news/NewsCard";
import { getLatestPosts, countPosts } from "@/lib/queries/posts";
import { getPostCategories } from "@/lib/queries/categories";
import { getCategoryBadge } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Berita & Artikel",
  description:
    "Informasi terkini seputar kegiatan, program, dan pengumuman BPSDM Provinsi Kalimantan Timur.",
};

const PER_PAGE = 9;

type Props = {
  searchParams: Promise<{ kategori?: string; halaman?: string }>;
};

export default async function BeritaPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.halaman ?? 1));
  const categorySlug = params.kategori;

  const [categories, posts, total] = await Promise.all([
    getPostCategories(),
    getLatestPosts({
      limit: PER_PAGE,
      offset: (page - 1) * PER_PAGE,
      categorySlug,
    }),
    countPosts({ categorySlug }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

  // Build searchParams untuk pagination (tanpa halaman)
  const paginationParams: Record<string, string> = categorySlug
    ? { kategori: categorySlug }
    : {};

  return (
    <>
      <Breadcrumb
        items={[{ label: "Beranda", href: "/" }, { label: "Berita & Artikel" }]}
      />

      {/* Page hero */}
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
        style={{
          backgroundColor: "var(--color-ink-8)",
          paddingBlock: "3.5rem",
        }}
      >
        <div className="container-content">
          {/* Filter kategori */}
          <div className="cat-filter-bar">
            <Link
              href="/berita"
              className={`cat-filter-pill ${!categorySlug ? "cat-filter-pill-active" : ""}`}
            >
              Semua
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/berita?kategori=${cat.slug}`}
                className={`cat-filter-pill ${
                  categorySlug === cat.slug ? "cat-filter-pill-active" : ""
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Info jumlah */}
          <div
            style={{
              fontSize: "13px",
              color: "var(--color-ink-4)",
              marginBottom: "24px",
            }}
          >
            Menampilkan{" "}
            <strong style={{ color: "var(--color-ink)" }}>
              {posts.length}
            </strong>{" "}
            dari <strong style={{ color: "var(--color-ink)" }}>{total}</strong>{" "}
            artikel
            {categorySlug && (
              <>
                {" "}
                dalam kategori{" "}
                <span
                  style={{
                    color: "var(--color-forest-700)",
                    fontWeight: 600,
                  }}
                >
                  {categories.find((c) => c.slug === categorySlug)?.name}
                </span>
              </>
            )}
          </div>

          {/* Grid */}
          {posts.length === 0 ? (
            <div className="empty-state">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                style={{ color: "var(--color-ink-5)" }}
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <div className="empty-state-title">Belum ada artikel</div>
              <div className="empty-state-desc">
                Tidak ada artikel dalam kategori ini saat ini.
              </div>
              <Link href="/berita" className="btn-primary btn">
                Lihat semua artikel
              </Link>
            </div>
          ) : (
            <div className="berita-grid">
              {posts.map((post) => (
                <NewsCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath="/berita"
            searchParams={paginationParams}
          />
        </div>
      </div>
    </>
  );
}
