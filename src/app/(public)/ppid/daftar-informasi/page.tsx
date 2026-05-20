// src/app/(public)/ppid/daftar-informasi/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { DipContent } from "@/components/ppid/DipContent";

export const metadata: Metadata = { title: "Daftar Informasi Publik (DIP)" };

type Props = {
  searchParams: Promise<{
    tipe?: string;
    cari?: string;
    halaman?: string;
    sort?: string;
  }>;
};

export default async function DipPage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <>
      <Suspense
        fallback={
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: "var(--color-ink-4)",
            }}
          >
            Memuat data...
          </div>
        }
      >
        <DipContent
          tipe={params.tipe}
          cari={params.cari}
          halaman={Number(params.halaman ?? 1)}
          sort={params.sort ?? "terbaru"}
        />
      </Suspense>
    </>
  );
}
