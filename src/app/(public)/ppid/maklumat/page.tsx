// src/app/(public)/ppid/maklumat/page.tsx
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PpidPageContent } from "@/components/ppid/PpidPageContent";

export const metadata: Metadata = { title: "Maklumat Pelayanan PPID" };

export default function MaklumatPage() {
  return (
    <>
      <PpidPageContent
        slug="ppid-maklumat"
        title="Maklumat Pelayanan PPID"
        fallback="Maklumat pelayanan belum diisi"
      />
    </>
  );
}
