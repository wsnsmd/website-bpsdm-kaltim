// src/app/(public)/unduhan/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  Filter,
  Download,
  BarChart2,
  FileCheck,
  Scale,
  BookOpen,
  ClipboardList,
  Book,
  Megaphone,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Pagination } from "@/components/ui/Pagination";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { DocumentFilter } from "@/components/documents/DocumentFilter";
import {
  getDocuments,
  countDocuments,
  getDocumentCategories,
  getDocumentYears,
} from "@/lib/queries/documents";

export const metadata: Metadata = {
  title: "Unduhan Dokumen",
  description: "Pusat unduhan dokumen resmi BPSDM Provinsi Kalimantan Timur.",
};

const ICON_MAP: Record<string, LucideIcon> = {
  BarChart2,
  FileCheck,
  Scale,
  BookOpen,
  ClipboardList,
  Book,
  Megaphone,
  Wallet,
  FileText,
};

const PER_PAGE = 12;

type Props = {
  searchParams: Promise<{
    kategori?: string;
    tahun?: string;
    cari?: string;
    halaman?: string;
  }>;
};

export default async function UnduhanPage({ searchParams }: Props) {
  const params = await searchParams;
  const categorySlug = params.kategori;
  const year = params.tahun ? Number(params.tahun) : undefined;
  const search = params.cari;
  const page = Math.max(1, Number(params.halaman ?? 1));
  const offset = (page - 1) * PER_PAGE;

  const [docs, total, categories, years] = await Promise.all([
    getDocuments({ categorySlug, year, search, limit: PER_PAGE, offset }),
    countDocuments({ categorySlug, year, search }),
    getDocumentCategories(),
    getDocumentYears(),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);
  const activeCategory = categories.find((c) => c.slug === categorySlug);

  const searchParamsObj: Record<string, string> = {};
  if (categorySlug) searchParamsObj.kategori = categorySlug;
  if (year) searchParamsObj.tahun = String(year);
  if (search) searchParamsObj.cari = search;

  return (
    <>
      <Breadcrumb
        items={[{ label: "Beranda", href: "/" }, { label: "Unduhan Dokumen" }]}
      />

      {/* Hero */}
      <div className="page-hero" style={{ paddingBlock: "2.5rem 3rem" }}>
        <div className="container-content">
          <p className="page-hero-eyebrow">Pusat Dokumen Resmi</p>
          <h1 className="page-hero-title" style={{ fontSize: "34px" }}>
            Unduhan Dokumen
          </h1>
          <p className="page-hero-desc">
            Akses dokumen resmi, laporan, peraturan, formulir, dan publikasi
            BPSDM Provinsi Kalimantan Timur.
          </p>

          {/* Stats */}
          <div className="page-hero-stats">
            <div className="page-hero-stat">
              <div className="page-hero-stat-num">{total}</div>
              <div className="page-hero-stat-label">Total dokumen</div>
            </div>
            <div className="page-hero-stat">
              <div className="page-hero-stat-num">{categories.length}</div>
              <div className="page-hero-stat-label">Kategori</div>
            </div>
            <div className="page-hero-stat">
              <div className="page-hero-stat-num">{years[0] ?? "—"}</div>
              <div className="page-hero-stat-label">Dokumen terbaru</div>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{ backgroundColor: "var(--color-ink-8)", paddingBlock: "3rem" }}
      >
        <div className="container-content">
          {/* Kategori cards */}
          {!categorySlug && !search && (
            <div style={{ marginBottom: "32px" }}>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "var(--color-ink-3)",
                  marginBottom: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Filter size={15} />
                Pilih Kategori
              </div>
              <div className="unduhan-cat-grid">
                {categories.map((cat) => {
                  const Icon = ICON_MAP[cat.icon ?? ""] ?? FileText;
                  return (
                    <Link
                      key={cat.id}
                      href={`/unduhan?kategori=${cat.slug}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "14px 16px",
                        borderRadius: "12px",
                        background: "#fff",
                        border: "1px solid var(--color-ink-6)",
                        textDecoration: "none",
                        transition: "all 0.15s",
                      }}
                    >
                      <div
                        style={{
                          width: "38px",
                          height: "38px",
                          borderRadius: "10px",
                          background: `${cat.color ?? "#0e3d20"}18`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Icon
                          size={18}
                          style={{
                            color: cat.color ?? "var(--color-forest-700)",
                          }}
                        />
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: 700,
                            color: "var(--color-ink)",
                            lineHeight: 1.2,
                          }}
                        >
                          {cat.name}
                        </div>
                        <div
                          style={{
                            fontSize: "11.5px",
                            color: "var(--color-ink-4)",
                            marginTop: "2px",
                          }}
                        >
                          {cat.count} dokumen
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Filter mobile — pills kategori, hanya tampil jika ada filter aktif atau di mobile */}
          <div className="unduhan-mobile-filter">
            <div className="cat-filter-bar">
              <Link
                href="/unduhan"
                className={`cat-filter-pill ${!categorySlug && !search ? "cat-filter-pill-active" : ""}`}
              >
                Semua
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/unduhan?kategori=${cat.slug}`}
                  className={`cat-filter-pill ${categorySlug === cat.slug ? "cat-filter-pill-active" : ""}`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="unduhan-layout">
            {/* Sidebar filter */}
            <aside className="unduhan-sidebar">
              <Suspense>
                <DocumentFilter
                  categories={categories}
                  years={years}
                  activeCategory={categorySlug}
                  activeYear={year}
                  search={search}
                />
              </Suspense>
            </aside>

            {/* Main list */}
            <div>
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                }}
              >
                <div>
                  {activeCategory && (
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: 700,
                        color: "var(--color-ink)",
                        marginBottom: "2px",
                      }}
                    >
                      {activeCategory.name}
                    </div>
                  )}
                  <div className="filter-info" style={{ margin: 0 }}>
                    Menampilkan <strong>{docs.length}</strong> dari{" "}
                    <strong>{total}</strong> dokumen
                    {search && (
                      <>
                        {" "}
                        · Pencarian: <strong>"{search}"</strong>
                      </>
                    )}
                    {year && (
                      <>
                        {" "}
                        · Tahun: <strong>{year}</strong>
                      </>
                    )}
                  </div>
                </div>

                {/* Reset filter */}
                {(categorySlug || year || search) && (
                  <Link
                    href="/unduhan"
                    style={{
                      fontSize: "12.5px",
                      fontWeight: 600,
                      color: "var(--color-forest-700)",
                      textDecoration: "none",
                      padding: "5px 12px",
                      borderRadius: "8px",
                      border: "1px solid var(--color-forest-200)",
                      background: "var(--color-forest-50)",
                    }}
                  >
                    Reset filter
                  </Link>
                )}
              </div>

              {/* Daftar dokumen */}
              {docs.length === 0 ? (
                <div className="empty-state" style={{ paddingBlock: "48px" }}>
                  <FileText size={40} style={{ color: "var(--color-ink-5)" }} />
                  <div className="empty-state-title">Tidak ada dokumen</div>
                  <div className="empty-state-desc">
                    {search
                      ? `Tidak ada dokumen yang cocok dengan pencarian "${search}".`
                      : "Belum ada dokumen tersedia dalam kategori ini."}
                  </div>
                  <Link
                    href="/unduhan"
                    style={{
                      marginTop: "12px",
                      padding: "8px 18px",
                      borderRadius: "8px",
                      background: "var(--color-forest-700)",
                      color: "#fff",
                      fontSize: "13px",
                      fontWeight: 600,
                      textDecoration: "none",
                      display: "inline-block",
                    }}
                  >
                    Lihat semua dokumen
                  </Link>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {docs.map((doc) => (
                    <DocumentCard key={doc.id} document={doc} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ marginTop: "28px" }}>
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    basePath="/unduhan"
                    searchParams={searchParamsObj}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
