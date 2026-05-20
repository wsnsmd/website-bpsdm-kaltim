// src/app/(public)/cari/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { NewsCard } from "@/components/news/NewsCard";
import {
  searchBerita,
  searchProgram,
  searchDokumen,
  countSearch,
} from "@/lib/queries/search";
import {
  FileText,
  Briefcase,
  FolderOpen,
  Download,
  ExternalLink,
  Search,
  ArrowRight,
} from "lucide-react";
import { formatFileSize } from "@/components/ui/FileIcon";
import { timeAgo } from "@/lib/utils";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Hasil pencarian "${q}"` : "Pencarian",
    description: q ? `Hasil pencarian untuk "${q}" di BPSDM Kaltim` : undefined,
    robots: { index: false, follow: false },
  };
}

type Props = {
  searchParams: Promise<{ q?: string; tab?: string }>;
};

const TABS = [
  { key: "semua", label: "Semua" },
  { key: "berita", label: "Berita" },
  { key: "program", label: "Program" },
  { key: "dokumen", label: "Dokumen" },
];

export default async function CariPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const tab = params.tab ?? "semua";

  if (!query) {
    return (
      <>
        <Breadcrumb
          items={[{ label: "Beranda", href: "/" }, { label: "Pencarian" }]}
        />
        <div
          style={{
            backgroundColor: "var(--color-ink-8)",
            paddingBlock: "5rem",
          }}
        >
          <div className="container-content" style={{ textAlign: "center" }}>
            <Search
              size={48}
              style={{ color: "var(--color-ink-5)", margin: "0 auto 16px" }}
            />
            <h1
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "var(--color-ink-3)",
              }}
            >
              Ketik kata kunci untuk mencari
            </h1>
          </div>
        </div>
      </>
    );
  }

  const [counts, beritaRows, programRows, dokumenRows] = await Promise.all([
    countSearch(query),
    tab === "semua" || tab === "berita"
      ? searchBerita(query, 12)
      : Promise.resolve([]),
    tab === "semua" || tab === "program"
      ? searchProgram(query, 12)
      : Promise.resolve([]),
    tab === "semua" || tab === "dokumen"
      ? searchDokumen(query, 12)
      : Promise.resolve([]),
  ]);

  function tabUrl(t: string) {
    return `/cari?q=${encodeURIComponent(query)}&tab=${t}`;
  }

  return (
    <>
      <Breadcrumb
        items={[{ label: "Beranda", href: "/" }, { label: "Pencarian" }]}
      />

      {/* Hero */}
      <div className="page-hero" style={{ paddingBlock: "2rem 2.5rem" }}>
        <div className="container-content">
          <p className="page-hero-eyebrow">Hasil Pencarian</p>
          <h1 className="page-hero-title" style={{ fontSize: "28px" }}>
            "{query}"
          </h1>
          <p className="page-hero-desc">
            Ditemukan <strong style={{ color: "#fff" }}>{counts.total}</strong>{" "}
            hasil dari seluruh konten website.
          </p>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "var(--color-ink-8)",
          paddingBlock: "2.5rem",
        }}
      >
        <div className="container-content">
          {/* Tab filter */}
          <div
            style={{
              display: "flex",
              gap: "6px",
              marginBottom: "24px",
              borderBottom: "2px solid var(--color-ink-6)",
              flexWrap: "wrap",
            }}
          >
            {TABS.map((t) => {
              const cnt =
                t.key === "semua"
                  ? counts.total
                  : (counts[t.key as keyof typeof counts] as number);
              const active = tab === t.key;

              return (
                <Link
                  key={t.key}
                  href={tabUrl(t.key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "9px 16px",
                    fontSize: "13.5px",
                    fontWeight: active ? 700 : 500,
                    color: active
                      ? "var(--color-forest-800)"
                      : "var(--color-ink-3)",
                    borderBottom: active
                      ? "2px solid var(--color-forest-700)"
                      : "2px solid transparent",
                    marginBottom: "-2px",
                    textDecoration: "none",
                    background: active
                      ? "var(--color-forest-50)"
                      : "transparent",
                    borderRadius: "8px 8px 0 0",
                    transition: "all 0.12s",
                  }}
                >
                  {t.label}
                  <span
                    style={{
                      padding: "1px 7px",
                      borderRadius: "20px",
                      background: active
                        ? "var(--color-forest-700)"
                        : "var(--color-ink-7)",
                      color: active ? "#fff" : "var(--color-ink-4)",
                      fontSize: "11.5px",
                      fontWeight: 700,
                    }}
                  >
                    {cnt}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Empty state */}
          {counts.total === 0 && (
            <div
              style={{
                padding: "60px",
                textAlign: "center",
                background: "#fff",
                borderRadius: "14px",
                border: "1px solid var(--color-ink-6)",
              }}
            >
              <Search
                size={40}
                style={{ color: "var(--color-ink-5)", margin: "0 auto 12px" }}
              />
              <div
                style={{
                  fontSize: "17px",
                  fontWeight: 700,
                  color: "var(--color-ink-3)",
                  marginBottom: "6px",
                }}
              >
                Tidak ada hasil
              </div>
              <div style={{ fontSize: "13.5px", color: "var(--color-ink-4)" }}>
                Coba kata kunci lain atau periksa ejaan.
              </div>
            </div>
          )}

          <div
            style={{ display: "flex", flexDirection: "column", gap: "28px" }}
          >
            {/* ── Berita ── */}
            {(tab === "semua" || tab === "berita") && beritaRows.length > 0 && (
              <section>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                  }}
                >
                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "17px",
                      fontWeight: 700,
                      color: "var(--color-ink)",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      margin: 0,
                    }}
                  >
                    <FileText
                      size={16}
                      style={{ color: "var(--color-forest-600)" }}
                    />
                    Berita & Artikel
                    <span
                      style={{
                        fontSize: "12.5px",
                        fontWeight: 400,
                        color: "var(--color-ink-4)",
                      }}
                    >
                      {counts.berita} hasil
                    </span>
                  </h2>
                  {tab === "semua" && counts.berita > beritaRows.length && (
                    <Link
                      href={tabUrl("berita")}
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "var(--color-forest-700)",
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      Lihat semua <ArrowRight size={13} />
                    </Link>
                  )}
                </div>
                <div className="berita-grid">
                  {beritaRows.map((post) => (
                    <NewsCard key={post.id} post={post as any} />
                  ))}
                </div>
              </section>
            )}

            {/* ── Program ── */}
            {(tab === "semua" || tab === "program") &&
              programRows.length > 0 && (
                <section>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "16px",
                    }}
                  >
                    <h2
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "17px",
                        fontWeight: 700,
                        color: "var(--color-ink)",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        margin: 0,
                      }}
                    >
                      <Briefcase size={16} style={{ color: "#1d4ed8" }} />
                      Program Diklat
                      <span
                        style={{
                          fontSize: "12.5px",
                          fontWeight: 400,
                          color: "var(--color-ink-4)",
                        }}
                      >
                        {counts.program} hasil
                      </span>
                    </h2>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "12px",
                    }}
                  >
                    {programRows.map((prog) => (
                      <Link
                        key={prog.id}
                        href={`/program/${prog.slug}`}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                          padding: "16px 18px",
                          borderRadius: "12px",
                          background: "#fff",
                          border: "1px solid #bfdbfe",
                          textDecoration: "none",
                          transition: "all 0.15s",
                          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                        }}
                      >
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "9px",
                            background: "#eff6ff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Briefcase size={18} style={{ color: "#1d4ed8" }} />
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: "13.5px",
                              fontWeight: 700,
                              color: "var(--color-ink)",
                              lineHeight: 1.35,
                            }}
                          >
                            {prog.name}
                          </div>
                          {prog.description && (
                            <div
                              style={{
                                fontSize: "12px",
                                color: "var(--color-ink-4)",
                                marginTop: "4px",
                                lineHeight: 1.5,
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical" as const,
                                overflow: "hidden",
                              }}
                            >
                              {prog.description}
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

            {/* ── Dokumen ── */}
            {(tab === "semua" || tab === "dokumen") &&
              dokumenRows.length > 0 && (
                <section>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "16px",
                    }}
                  >
                    <h2
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "17px",
                        fontWeight: 700,
                        color: "var(--color-ink)",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        margin: 0,
                      }}
                    >
                      <FolderOpen size={16} style={{ color: "#c2410c" }} />
                      Dokumen
                      <span
                        style={{
                          fontSize: "12.5px",
                          fontWeight: 400,
                          color: "var(--color-ink-4)",
                        }}
                      >
                        {counts.dokumen} hasil
                      </span>
                    </h2>
                  </div>
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: "12px",
                      border: "1px solid var(--color-ink-6)",
                      overflow: "hidden",
                    }}
                  >
                    {dokumenRows.map((doc, i) => {
                      const url = doc.externalUrl || doc.fileUrl;
                      const isExt = !!doc.externalUrl;
                      return (
                        <div
                          key={doc.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "14px",
                            padding: "13px 18px",
                            borderBottom:
                              i < dokumenRows.length - 1
                                ? "1px solid var(--color-ink-7)"
                                : "none",
                          }}
                        >
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "9px",
                              background: "#fff7ed",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <FolderOpen
                              size={16}
                              style={{ color: "#c2410c" }}
                            />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                fontSize: "13.5px",
                                fontWeight: 600,
                                color: "var(--color-ink)",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                marginBottom: "3px",
                              }}
                            >
                              {doc.title}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                gap: "8px",
                                alignItems: "center",
                              }}
                            >
                              {doc.category && (
                                <span
                                  style={{
                                    fontSize: "11.5px",
                                    color: "var(--color-ink-4)",
                                  }}
                                >
                                  {doc.category}
                                </span>
                              )}
                              {doc.fileType && (
                                <span
                                  style={{
                                    padding: "1px 6px",
                                    borderRadius: "4px",
                                    background: "var(--color-ink-7)",
                                    fontSize: "10.5px",
                                    fontWeight: 800,
                                    textTransform: "uppercase",
                                    color: "var(--color-ink-4)",
                                  }}
                                >
                                  {doc.fileType}
                                </span>
                              )}
                              {doc.fileSize && (
                                <span
                                  style={{
                                    fontSize: "11px",
                                    color: "var(--color-ink-5)",
                                  }}
                                >
                                  {formatFileSize(doc.fileSize)}
                                </span>
                              )}
                            </div>
                          </div>
                          {url && (
                            <Link
                              href={isExt ? url : `/api/unduhan/${doc.id}`}
                              target={isExt ? "_blank" : undefined}
                              rel={isExt ? "noopener noreferrer" : undefined}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "5px",
                                padding: "6px 12px",
                                borderRadius: "7px",
                                background: "#fff7ed",
                                border: "1px solid #fed7aa",
                                color: "#c2410c",
                                fontSize: "12.5px",
                                fontWeight: 700,
                                textDecoration: "none",
                                flexShrink: 0,
                              }}
                            >
                              {isExt ? (
                                <>
                                  <ExternalLink size={12} /> Buka
                                </>
                              ) : (
                                <>
                                  <Download size={12} /> Unduh
                                </>
                              )}
                            </Link>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
          </div>
        </div>
      </div>
    </>
  );
}
