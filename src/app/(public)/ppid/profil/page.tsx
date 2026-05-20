// src/app/(public)/ppid/profil/page.tsx
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PpidPageContent } from "@/components/ppid/PpidPageContent";

export const metadata: Metadata = { title: "Profil PPID" };

export default function PpidProfilPage() {
  return (
    <>
      <PpidPageContent
        slug="ppid-profil"
        title="Profil PPID BPSDM Kaltim"
        fallback="Profil PPID belum diisi"
      />
    </>
  );
}
