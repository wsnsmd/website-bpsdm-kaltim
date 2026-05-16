// src/app/(public)/profil/page.tsx
import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/queries/profil";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: "Profil BPSDM Kaltim" };

export default async function ProfilPage() {
  const page = await getPageBySlug("profil");
  if (!page) notFound();

  return (
    <>
      <ProfilPageContent page={page} />
    </>
  );
}

function ProfilPageContent({ page }: { page: any }) {
  return (
    <div className="admin-card" style={{ overflow: "visible" }}>
      <div style={{ padding: "28px 32px" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "28px",
            fontWeight: 700,
            color: "var(--color-ink)",
            marginBottom: "6px",
            paddingBottom: "16px",
            borderBottom: "2px solid var(--color-forest-700)",
          }}
        >
          {page.title}
        </h1>
        <div
          className="prose-bpsdm"
          dangerouslySetInnerHTML={{ __html: page.content ?? "" }}
          style={{ marginTop: "24px" }}
        />
      </div>
    </div>
  );
}
