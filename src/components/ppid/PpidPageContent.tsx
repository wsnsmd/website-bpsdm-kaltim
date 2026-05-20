// src/components/ppid/PpidPageContent.tsx
import { getPageBySlug } from "@/lib/queries/profil";
import { FileText } from "lucide-react";

type Props = {
  slug: string;
  title: string;
  fallback: string;
};

export async function PpidPageContent({ slug, title, fallback }: Props) {
  const page = await getPageBySlug(slug).catch(() => null);

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "14px",
        border: "1px solid var(--color-ink-6)",
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          padding: "18px 22px",
          borderBottom: "1px solid var(--color-ink-7)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "9px",
            background: "var(--color-forest-50)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FileText size={18} style={{ color: "var(--color-forest-700)" }} />
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "20px",
            fontWeight: 700,
            color: "var(--color-ink)",
            margin: 0,
          }}
        >
          {page?.title ?? title}
        </h1>
      </div>

      <div style={{ padding: "24px 28px" }}>
        {page?.content ? (
          <div
            className="prose-bpsdm"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        ) : (
          <div
            style={{
              padding: "32px",
              textAlign: "center",
              color: "var(--color-ink-4)",
              fontSize: "13.5px",
              lineHeight: 1.7,
            }}
          >
            <FileText
              size={36}
              style={{ color: "var(--color-ink-5)", margin: "0 auto 12px" }}
            />
            <p
              style={{
                marginBottom: "8px",
                fontWeight: 600,
                color: "var(--color-ink-3)",
              }}
            >
              {fallback}
            </p>
            <p style={{ fontSize: "12.5px" }}>
              Konten halaman ini belum tersedia. Admin dapat mengisi melalui
              panel administrasi.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
