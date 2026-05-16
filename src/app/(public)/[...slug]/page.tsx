// src/app/[...slug]/page.tsx
import { notFound } from "next/navigation";
import { db, eq } from "@/db";
import { pages } from "@/db/schema";
import { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { BackToTop } from "@/components/ui/BackToTop";
import { SidebarNav } from "@/components/ui/SidebarNav";
import { SidebarAbout } from "@/components/ui/SidebarAbout";
import { FileText, Clock } from "lucide-react";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

// Fungsi untuk mendapatkan halaman dari database berdasarkan slug
async function getPageBySlug(slugPath: string) {
  try {
    const page = await db
      .select()
      .from(pages)
      .where(eq(pages.slug, slugPath))
      .limit(1);

    return page[0] || null;
  } catch (error) {
    console.error("Error fetching page:", error);
    return null;
  }
}

// Generate metadata untuk SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const slugPath = slug.join("/");
  const page = await getPageBySlug(slugPath);

  if (!page) {
    return {
      title: "Halaman Tidak Ditemukan",
    };
  }

  return {
    title: page.metaTitle || page.title,
    description:
      page.metaDescription ||
      page.excerpt ||
      `${page.title} - BPSDM Kalimantan Timur`,
    openGraph: {
      title: page.metaTitle || page.title,
      description: page.metaDescription || page.excerpt || "",
      type: "website",
    },
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const slugPath = slug.join("/");
  const page = await getPageBySlug(slugPath);

  // Jika halaman tidak ditemukan, tampilkan 404
  if (!page) {
    notFound();
  }

  // Jika status draft dan bukan mode preview, tetap 404
  if (page.status !== "published") {
    notFound();
  }

  // Generate breadcrumb items berdasarkan slug
  const breadcrumbItems = [
    { label: "Beranda", href: "/" },
    ...slug.map((segment, index) => {
      const path = slug.slice(0, index + 1).join("/");
      const isLast = index === slug.length - 1;
      return {
        label:
          segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
        href: isLast ? undefined : `/${path}`,
      };
    }),
  ];

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />

      {/* Page hero */}
      <div className="page-hero">
        <div className="container-content" style={{ position: "relative" }}>
          <p
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.55)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "10px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "20px",
                height: "2px",
                backgroundColor: "var(--color-gold-500)",
              }}
            />
            Halaman Informasi
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "38px",
              fontWeight: 700,
              color: "#fff",
              marginBottom: "10px",
              lineHeight: 1.15,
            }}
          >
            {page.title}
          </h1>
          {page.excerpt && (
            <p
              style={{
                fontSize: "15px",
                color: "rgba(255,255,255,0.6)",
                maxWidth: "480px",
              }}
            >
              {page.excerpt}
            </p>
          )}
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl border border-ink-6 overflow-hidden">
                <div className="p-6 md:p-8">
                  <article className="prose-bpsdm max-w-none">
                    {page.content ? (
                      <div dangerouslySetInnerHTML={{ __html: page.content }} />
                    ) : (
                      <div className="empty-state-small flex flex-col items-center justify-center py-12">
                        <FileText
                          size={48}
                          strokeWidth={1.5}
                          className="text-ink-5"
                        />
                        <p className="text-ink-4 text-center mt-4">
                          Konten sedang dalam penyusunan.
                        </p>
                      </div>
                    )}
                  </article>

                  {/* Last updated */}
                  {page.updatedAt && (
                    <div className="mt-8 pt-6 border-t border-ink-6">
                      <p className="text-xs text-ink-4 flex items-center gap-2">
                        <Clock size={12} />
                        Terakhir diperbarui:{" "}
                        {new Date(page.updatedAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ISR: Revalidate setiap 60 detik jika ada perubahan
export const revalidate = 60;
