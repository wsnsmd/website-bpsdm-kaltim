// src/components/ui/Pagination.tsx
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string>;
};

function buildUrl(
  basePath: string,
  page: number,
  params: Record<string, string> = {},
): string {
  const query = new URLSearchParams({ ...params, halaman: String(page) });
  // Hapus halaman=1 dari URL supaya lebih bersih
  if (page === 1) query.delete("halaman");
  const qs = query.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

function getPageRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const result: (number | "...")[] = [1];
  if (current > 3) result.push("...");
  for (
    let i = Math.max(2, current - 1);
    i <= Math.min(total - 1, current + 1);
    i++
  ) {
    result.push(i);
  }
  if (current < total - 2) result.push("...");
  result.push(total);
  return result;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  searchParams = {},
}: Props) {
  if (totalPages <= 1) return null;

  const pages = getPageRange(currentPage, totalPages);
  // Hapus halaman dari params supaya tidak duplikat
  const { halaman: _, ...restParams } = searchParams;

  return (
    <nav
      className="flex items-center justify-center gap-1 mt-10"
      aria-label="Navigasi halaman"
    >
      {/* Prev */}
      {currentPage > 1 ? (
        <Link
          href={buildUrl(basePath, currentPage - 1, restParams)}
          className="pg-btn"
          aria-label="Halaman sebelumnya"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
      ) : (
        <span className="pg-btn pg-btn-disabled" aria-disabled="true">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </span>
      )}

      {/* Pages */}
      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`dots-${i}`} className="pg-dots">
            ···
          </span>
        ) : (
          <Link
            key={page}
            href={buildUrl(basePath, page, restParams)}
            className={cn("pg-btn", currentPage === page && "pg-btn-active")}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </Link>
        ),
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={buildUrl(basePath, currentPage + 1, restParams)}
          className="pg-btn"
          aria-label="Halaman berikutnya"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>
      ) : (
        <span className="pg-btn pg-btn-disabled" aria-disabled="true">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </span>
      )}
    </nav>
  );
}
