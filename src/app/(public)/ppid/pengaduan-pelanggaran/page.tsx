// src/app/(public)/ppid/pengaduan-pelanggaran/page.tsx
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PpidPageContent } from "@/components/ppid/PpidPageContent";

export const metadata: Metadata = {
  title: "Pengaduan Penyalahgunaan Wewenang & Pelanggaran",
  alternates: {
    canonical: "/ppid/pengaduan-pelanggaran",
  },
};

export default function PengaduanPelanggaranPage() {
  return (
    <>
      {/* Konten diisi lewat admin: /admin/profil/pages/baru, slug
          "ppid-pengaduan-pelanggaran". Sertakan dua bagian dalam satu
          konten (sesuai 2 butir checklist E-Monev KI Kaltim):
          1) Tata cara pengaduan penyalahgunaan wewenang/pelanggaran oleh
             PEJABAT Badan Publik + pihak yang bisa dihubungi.
          2) Tata cara pengaduan penyalahgunaan wewenang/pelanggaran oleh
             PIHAK KETIGA yang mendapat izin/perjanjian kerja dari Badan
             Publik + pihak yang bisa dihubungi. */}
      <PpidPageContent
        slug="ppid-pengaduan-pelanggaran"
        title="Pengaduan Penyalahgunaan Wewenang & Pelanggaran"
        fallback="Tata cara pengaduan penyalahgunaan wewenang/pelanggaran belum diisi"
      />
    </>
  );
}
