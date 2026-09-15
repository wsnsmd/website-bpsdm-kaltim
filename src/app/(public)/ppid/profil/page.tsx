// src/app/(public)/ppid/profil/page.tsx
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PpidPageContent } from "@/components/ppid/PpidPageContent";
import { PpidPejabatSection } from "@/components/ppid/PpidPejabatSection";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Profil PPID",
  alternates: {
    canonical: "/ppid/profil",
  },
};

export default function PpidProfilPage() {
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <PpidPageContent
          slug="ppid-profil"
          title="Profil PPID BPSDM Kaltim"
          fallback="Profil PPID belum diisi"
        />
        <PpidPejabatSection />
      </div>
    </>
  );
}
