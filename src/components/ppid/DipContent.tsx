// src/components/ppid/DipContent.tsx
import Link from "next/link";
import {
  BookOpen,
  Zap,
  Clock,
  Lock,
  Download,
  ExternalLink,
  FileText,
  Search,
  SortAsc,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import {
  getPpidInformasi,
  getPpidCount,
  countPpidInformasi,
} from "@/lib/queries/ppid";
import { formatFileSize } from "@/components/ui/FileIcon";
import { DipSearchBar } from "@/components/ppid/DipSearchBar";

const PER_PAGE = 12;

const TIPE_CONFIG = {
  berkala: {
    label: "Informasi Berkala",
    icon: BookOpen,
    color: "#1d4ed8",
    bg: "#eff6ff",
    border: "#bfdbfe",
  },
  serta_merta: {
    label: "Serta Merta",
    icon: Zap,
    color: "#dc2626",
    bg: "#fef2f2",
    border: "#fecaca",
  },
  setiap_saat: {
    label: "Setiap Saat",
    icon: Clock,
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#bbf7d0",
  },
  dikecualikan: {
    label: "Dikecualikan",
    icon: Lock,
    color: "#b45309",
    bg: "#fffbeb",
    border: "#fde68a",
  },
} as const;

const SORT_OPTIONS = [
  { value: "terbaru", label: "Terbaru" },
  { value: "terlama", label: "Terlama" },
  { value: "az", label: "A–Z" },
  { value: "za", label: "Z–A" },
];

function getDownloadUrl(item: {
  fileUrl: string | null;
  externalUrl: string | null;
}): { url: string; isExternal: boolean } | null {
  if (item.externalUrl) return { url: item.externalUrl, isExternal: true };
  if (item.fileUrl) return { url: item.fileUrl, isExternal: false };
  return null;
}

function buildUrl(base: string, params: Record<string, string | undefined>) {
  const p = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v) p.set(k, v);
  });
  const str = p.toString();
  return str ? `${base}?${str}` : base;
}

type Props = {
  tipe?: string;
  cari?: string;
  halaman?: number;
  sort?: string;
};

export async function DipContent({
  tipe,
  cari,
  halaman = 1,
  sort = "terbaru",
}: Props) {
  const page = Math.max(1, halaman);
  const offset = (page - 1) * PER_PAGE;

  const [allInfo, counts, total] = await Promise.all([
    getPpidInformasi({ tipe, search: cari, limit: PER_PAGE, offset, sort }),
    getPpidCount(),
    countPpidInformasi({ tipe, search: cari }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);
  const totalAll = Object.values(counts).reduce((a, b) => a + b, 0);
  const hasFilter = !!(tipe || cari);

  // Build pagination URL helper
  function pageUrl(p: number) {
    return buildUrl("/ppid/daftar-informasi", {
      tipe,
      cari,
      sort: sort !== "terbaru" ? sort : undefined,
      halaman: p > 1 ? String(p) : undefined,
    });
  }

  function filterUrl(params: { tipe?: string; cari?: string; sort?: string }) {
    return buildUrl("/ppid/daftar-informasi", {
      tipe: params.tipe,
      cari: params.cari ?? cari,
      sort:
        (params.sort ?? sort) !== "terbaru" ? (params.sort ?? sort) : undefined,
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      {/* ── Search + Sort bar ── */}
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          border: "1px solid var(--color-ink-6)",
          padding: "14px 16px",
          display: "flex",
          gap: "10px",
          alignItems: "center",
          flexWrap: "wrap",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}
      >
        {/* Search — client component */}
        <div style={{ flex: 1, minWidth: "200px" }}>
          <DipSearchBar initialValue={cari ?? ""} tipe={tipe} sort={sort} />
        </div>

        {/* Sort */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <SortAsc size={14} style={{ color: "var(--color-ink-4)" }} />
          <div style={{ display: "flex", gap: "4px" }}>
            {SORT_OPTIONS.map((opt) => (
              <Link
                key={opt.value}
                href={filterUrl({ sort: opt.value })}
                style={{
                  padding: "5px 12px",
                  borderRadius: "7px",
                  fontSize: "12.5px",
                  fontWeight: sort === opt.value ? 700 : 500,
                  background:
                    sort === opt.value
                      ? "var(--color-forest-700)"
                      : "var(--color-ink-7)",
                  color: sort === opt.value ? "#fff" : "var(--color-ink-3)",
                  textDecoration: "none",
                  transition: "all 0.12s",
                  whiteSpace: "nowrap",
                }}
              >
                {opt.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filter tipe ── */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
        }}
      >
        <Link
          href={filterUrl({ tipe: undefined })}
          style={{
            padding: "6px 14px",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: !tipe ? 700 : 500,
            background: !tipe ? "var(--color-forest-700)" : "#fff",
            color: !tipe ? "#fff" : "var(--color-ink-3)",
            border: !tipe
              ? "1px solid var(--color-forest-700)"
              : "1px solid var(--color-ink-6)",
            textDecoration: "none",
            transition: "all 0.12s",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <Filter
            size={11}
            style={{
              display: "inline",
              marginRight: "4px",
              verticalAlign: "middle",
            }}
          />
          Semua ({totalAll})
        </Link>
        {(Object.keys(TIPE_CONFIG) as (keyof typeof TIPE_CONFIG)[]).map((t) => {
          const cfg = TIPE_CONFIG[t];
          const active = tipe === t;
          return (
            <Link
              key={t}
              href={filterUrl({ tipe: t })}
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "13px",
                fontWeight: active ? 700 : 500,
                background: active ? cfg.color : "#fff",
                color: active ? "#fff" : cfg.color,
                border: `1px solid ${active ? cfg.color : cfg.border}`,
                textDecoration: "none",
                transition: "all 0.12s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              {cfg.label} ({counts[t] ?? 0})
            </Link>
          );
        })}
      </div>

      {/* ── Info hasil ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "13px",
          color: "var(--color-ink-4)",
          flexWrap: "wrap",
        }}
      >
        <span>
          Menampilkan{" "}
          <strong style={{ color: "var(--color-ink)" }}>
            {offset + 1}–{Math.min(offset + PER_PAGE, total)}
          </strong>{" "}
          dari <strong style={{ color: "var(--color-ink)" }}>{total}</strong>{" "}
          dokumen
        </span>
        {cari && (
          <span
            style={{
              padding: "2px 10px",
              borderRadius: "20px",
              background: "var(--color-forest-50)",
              border: "1px solid var(--color-forest-200)",
              color: "var(--color-forest-700)",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            Pencarian: "{cari}"
          </span>
        )}
        {tipe && TIPE_CONFIG[tipe as keyof typeof TIPE_CONFIG] && (
          <span
            style={{
              padding: "2px 10px",
              borderRadius: "20px",
              background: TIPE_CONFIG[tipe as keyof typeof TIPE_CONFIG].bg,
              border: `1px solid ${TIPE_CONFIG[tipe as keyof typeof TIPE_CONFIG].border}`,
              color: TIPE_CONFIG[tipe as keyof typeof TIPE_CONFIG].color,
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            {TIPE_CONFIG[tipe as keyof typeof TIPE_CONFIG].label}
          </span>
        )}
        {hasFilter && (
          <Link
            href="/ppid/daftar-informasi"
            style={{
              padding: "2px 10px",
              borderRadius: "20px",
              background: "var(--color-ink-7)",
              border: "1px solid var(--color-ink-6)",
              color: "var(--color-ink-4)",
              fontSize: "12px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            × Reset
          </Link>
        )}
      </div>

      {/* ── Daftar dokumen ── */}
      <div
        style={{
          background: "#fff",
          borderRadius: "14px",
          border: "1px solid var(--color-ink-6)",
          overflow: "hidden",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}
      >
        {allInfo.length === 0 ? (
          <div
            style={{
              padding: "60px 40px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                background: "var(--color-ink-7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FileText size={24} style={{ color: "var(--color-ink-4)" }} />
            </div>
            <div>
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "var(--color-ink-2)",
                  marginBottom: "4px",
                }}
              >
                {cari
                  ? `Tidak ada hasil untuk "${cari}"`
                  : "Belum ada informasi"}
              </div>
              <div style={{ fontSize: "13px", color: "var(--color-ink-4)" }}>
                {cari
                  ? "Coba kata kunci lain atau hapus filter."
                  : "Belum ada dokumen tersedia."}
              </div>
            </div>
            {hasFilter && (
              <Link
                href="/ppid/daftar-informasi"
                style={{
                  padding: "8px 18px",
                  borderRadius: "8px",
                  background: "var(--color-forest-700)",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Lihat semua dokumen
              </Link>
            )}
          </div>
        ) : (
          allInfo.map((item, i) => {
            const tipeCfg = TIPE_CONFIG[item.tipe as keyof typeof TIPE_CONFIG];
            const dlInfo = getDownloadUrl(item);

            return (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "14px 18px",
                  borderBottom:
                    i < allInfo.length - 1
                      ? "1px solid var(--color-ink-7)"
                      : "none",
                  transition: "background 0.1s",
                }}
                className="dip-item"
              >
                {/* Nomor */}
                <div
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    background: tipeCfg?.bg ?? "var(--color-ink-7)",
                    border: `1px solid ${tipeCfg?.border ?? "var(--color-ink-6)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11.5px",
                    fontWeight: 700,
                    color: tipeCfg?.color ?? "var(--color-ink-4)",
                    flexShrink: 0,
                  }}
                >
                  {offset + i + 1}
                </div>

                {/* Icon file */}
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "9px",
                    background: tipeCfg?.bg ?? "var(--color-ink-7)",
                    border: `1px solid ${tipeCfg?.border ?? "var(--color-ink-6)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <FileText
                    size={16}
                    style={{ color: tipeCfg?.color ?? "var(--color-ink-4)" }}
                  />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "13.5px",
                      fontWeight: 600,
                      color: "var(--color-ink)",
                      marginBottom: "4px",
                      lineHeight: 1.4,
                    }}
                  >
                    {item.judul}
                  </div>
                  {item.deskripsi && (
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--color-ink-4)",
                        marginBottom: "5px",
                        lineHeight: 1.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical" as const,
                        overflow: "hidden",
                      }}
                    >
                      {item.deskripsi}
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    {tipeCfg && (
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: "20px",
                          background: tipeCfg.bg,
                          border: `1px solid ${tipeCfg.border}`,
                          fontSize: "11px",
                          fontWeight: 700,
                          color: tipeCfg.color,
                        }}
                      >
                        {tipeCfg.label}
                      </span>
                    )}
                    {item.tahun && (
                      <span
                        style={{
                          fontSize: "11.5px",
                          color: "var(--color-ink-4)",
                        }}
                      >
                        {item.tahun}
                      </span>
                    )}
                    {item.fileType && (
                      <span
                        style={{
                          padding: "1px 6px",
                          borderRadius: "4px",
                          background: "var(--color-ink-7)",
                          fontSize: "10.5px",
                          fontWeight: 800,
                          textTransform: "uppercase",
                          color: "var(--color-ink-4)",
                          letterSpacing: "0.3px",
                        }}
                      >
                        {item.fileType}
                      </span>
                    )}
                    {item.fileSize ? (
                      <span
                        style={{
                          fontSize: "11px",
                          color: "var(--color-ink-5)",
                        }}
                      >
                        {formatFileSize(item.fileSize)}
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Tombol */}
                {dlInfo ? (
                  <Link
                    href={dlInfo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      background: tipeCfg?.bg ?? "var(--color-forest-50)",
                      border: `1px solid ${tipeCfg?.border ?? "var(--color-forest-200)"}`,
                      color: tipeCfg?.color ?? "var(--color-forest-700)",
                      fontSize: "12.5px",
                      fontWeight: 700,
                      textDecoration: "none",
                      flexShrink: 0,
                      whiteSpace: "nowrap",
                      transition: "all 0.12s",
                    }}
                  >
                    {dlInfo.isExternal ? (
                      <>
                        <ExternalLink size={13} /> Buka
                      </>
                    ) : (
                      <>
                        <Download size={13} /> Unduh
                      </>
                    )}
                  </Link>
                ) : (
                  <span
                    style={{
                      fontSize: "12px",
                      color: "var(--color-ink-5)",
                      fontStyle: "italic",
                      flexShrink: 0,
                    }}
                  >
                    Tidak tersedia
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            background: "#fff",
            borderRadius: "10px",
            border: "1px solid var(--color-ink-6)",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          {/* Info halaman */}
          <span style={{ fontSize: "12.5px", color: "var(--color-ink-4)" }}>
            Halaman{" "}
            <strong style={{ color: "var(--color-ink)" }}>{page}</strong> dari{" "}
            <strong style={{ color: "var(--color-ink)" }}>{totalPages}</strong>
          </span>

          {/* Tombol navigasi */}
          <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
            {/* Prev */}
            {page > 1 ? (
              <Link
                href={pageUrl(page - 1)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "6px 12px",
                  borderRadius: "7px",
                  background: "#fff",
                  border: "1px solid var(--color-ink-5)",
                  color: "var(--color-ink-2)",
                  fontSize: "13px",
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "all 0.12s",
                }}
              >
                <ChevronLeft size={14} /> Sebelumnya
              </Link>
            ) : (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "6px 12px",
                  borderRadius: "7px",
                  background: "var(--color-ink-7)",
                  border: "1px solid var(--color-ink-6)",
                  color: "var(--color-ink-5)",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                <ChevronLeft size={14} /> Sebelumnya
              </span>
            )}

            {/* Nomor halaman */}
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              // Logika sliding window
              let pageNum: number;
              if (totalPages <= 7) {
                pageNum = i + 1;
              } else if (page <= 4) {
                if (i < 5) pageNum = i + 1;
                else if (i === 5)
                  return (
                    <span
                      key="dots1"
                      style={{
                        padding: "6px 4px",
                        color: "var(--color-ink-4)",
                        fontSize: "13px",
                      }}
                    >
                      ···
                    </span>
                  );
                else pageNum = totalPages;
              } else if (page >= totalPages - 3) {
                if (i === 0) pageNum = 1;
                else if (i === 1)
                  return (
                    <span
                      key="dots2"
                      style={{
                        padding: "6px 4px",
                        color: "var(--color-ink-4)",
                        fontSize: "13px",
                      }}
                    >
                      ···
                    </span>
                  );
                else pageNum = totalPages - (6 - i);
              } else {
                if (i === 0) pageNum = 1;
                else if (i === 1)
                  return (
                    <span
                      key="dots3"
                      style={{
                        padding: "6px 4px",
                        color: "var(--color-ink-4)",
                        fontSize: "13px",
                      }}
                    >
                      ···
                    </span>
                  );
                else if (i === 5)
                  return (
                    <span
                      key="dots4"
                      style={{
                        padding: "6px 4px",
                        color: "var(--color-ink-4)",
                        fontSize: "13px",
                      }}
                    >
                      ···
                    </span>
                  );
                else if (i === 6) pageNum = totalPages;
                else pageNum = page + (i - 3);
              }

              const isActive = pageNum === page;
              return (
                <Link
                  key={pageNum}
                  href={pageUrl(pageNum)}
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "7px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "13px",
                    fontWeight: isActive ? 700 : 500,
                    background: isActive ? "var(--color-forest-700)" : "#fff",
                    color: isActive ? "#fff" : "var(--color-ink-2)",
                    border: isActive
                      ? "1px solid var(--color-forest-700)"
                      : "1px solid var(--color-ink-6)",
                    textDecoration: "none",
                    transition: "all 0.12s",
                  }}
                >
                  {pageNum}
                </Link>
              );
            })}

            {/* Next */}
            {page < totalPages ? (
              <Link
                href={pageUrl(page + 1)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "6px 12px",
                  borderRadius: "7px",
                  background: "var(--color-forest-700)",
                  border: "1px solid var(--color-forest-700)",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "all 0.12s",
                }}
              >
                Berikutnya <ChevronRight size={14} />
              </Link>
            ) : (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "6px 12px",
                  borderRadius: "7px",
                  background: "var(--color-ink-7)",
                  border: "1px solid var(--color-ink-6)",
                  color: "var(--color-ink-5)",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                Berikutnya <ChevronRight size={14} />
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
