// src/app/(public)/ppid/tugas-fungsi/page.tsx
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PpidPageContent } from "@/components/ppid/PpidPageContent";

export const metadata: Metadata = { title: "Tugas & Fungsi PPID" };

export default function TugasFungsiPage() {
  return (
    <>
      <PpidPageContent
        slug="ppid-tugas-fungsi"
        title="Tugas & Fungsi PPID"
        fallback="Tugas dan fungsi PPID belum diisi"
      />
    </>
  );
}
