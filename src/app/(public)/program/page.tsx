// src/app/(public)/program/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Pagination } from "@/components/ui/Pagination";
import { ProgramCard } from "@/components/program/ProgramCard";
import { ProgramFilter } from "@/components/program/ProgramFilter";
import { getPrograms, countPrograms } from "@/lib/queries/programs";

export const metadata: Metadata = {
  title: "Katalog Program Diklat",
  description:
    "Temukan program pelatihan yang sesuai dengan kebutuhan pengembangan kompetensi ASN Kalimantan Timur.",
};

const PER_PAGE = 9;

type Props = {
  searchParams: Promise<{ jenis?: string; halaman?: string }>;
};

export default async function ProgramPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.halaman ?? 1));
  const type = params.jenis;

  const [programs, total] = await Promise.all([
    getPrograms({
      type,
      limit: PER_PAGE,
    }),
    countPrograms({ type }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);
  const paginationParams: Record<string, string> = type ? { jenis: type } : {};

  return (
    <>
      <Breadcrumb
        items={[{ label: "Beranda", href: "/" }, { label: "Program Diklat" }]}
      />

      {/* Hero */}
      <div className="page-hero">
        <div className="container-content" style={{ position: "relative" }}>
          <p className="page-hero-eyebrow">Pengembangan Kompetensi ASN</p>
          <h1 className="page-hero-title">Katalog Program Diklat</h1>
          <p className="page-hero-desc">
            Temukan program pelatihan yang sesuai dengan kebutuhan pengembangan
            kompetensi dan karir Anda sebagai aparatur sipil negara.
          </p>

          {/* Stats */}
          <div className="page-hero-stats">
            {[
              { num: String(total), label: "Program tersedia" },
              { num: "603+", label: "Peserta aktif" },
              { num: "48", label: "Jadwal tahun ini" },
            ].map((s) => (
              <div key={s.label} className="page-hero-stat">
                <div className="page-hero-stat-num">{s.num}</div>
                <div className="page-hero-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
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
          {/* Filter — client component */}
          <Suspense>
            <ProgramFilter />
          </Suspense>

          {/* Info */}
          <div className="filter-info">
            Menampilkan <strong>{programs.length}</strong> dari{" "}
            <strong>{total}</strong> program
          </div>

          {/* Grid */}
          {programs.length === 0 ? (
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
                <path d="M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
              <div className="empty-state-title">Belum ada program</div>
              <div className="empty-state-desc">
                Tidak ada program diklat dalam jenis ini.
              </div>
            </div>
          ) : (
            <div className="prog-grid">
              {programs.map((program, i) => (
                <ProgramCard key={program.id} program={program} index={i} />
              ))}
            </div>
          )}

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath="/program"
            searchParams={paginationParams}
          />
        </div>
      </div>
    </>
  );
}
