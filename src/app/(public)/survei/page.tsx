// src/app/(public)/survei/page.tsx
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SurveyForm } from "@/components/survei/SurveyForm";
import { Star, ClipboardList, Clock, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Survei Kepuasan Website",
  description:
    "Bantu kami meningkatkan layanan digital BPSDM Kaltim dengan mengisi survei kepuasan.",
};

const KEUNGGULAN = [
  { icon: Clock, label: "Hanya 2 menit", desc: "Pengisian cepat dan mudah" },
  { icon: Shield, label: "Anonim", desc: "Identitas tidak dipublikasikan" },
  { icon: ClipboardList, label: "5 Aspek", desc: "Penilaian komprehensif" },
];

export default function SurveiPage() {
  return (
    <>
      <Breadcrumb
        items={[{ label: "Beranda", href: "/" }, { label: "Survei Kepuasan" }]}
      />

      {/* Hero */}
      <div className="page-hero">
        <div className="container-content">
          <p className="page-hero-eyebrow">Partisipasi Masyarakat</p>
          <h1 className="page-hero-title">Survei Kepuasan Website</h1>
          <p className="page-hero-desc" style={{ maxWidth: "500px" }}>
            Pendapat Anda sangat berarti bagi kami. Isi survei singkat ini untuk
            membantu BPSDM Kaltim meningkatkan kualitas layanan digital.
          </p>
          <div className="page-hero-stats">
            {KEUNGGULAN.map((k) => (
              <div key={k.label} className="page-hero-stat">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "4px",
                  }}
                >
                  <k.icon
                    size={20}
                    style={{ color: "var(--color-gold-400)" }}
                  />
                </div>
                <div
                  className="page-hero-stat-num"
                  style={{ fontSize: "14px" }}
                >
                  {k.label}
                </div>
                <div className="page-hero-stat-label">{k.desc}</div>
              </div>
            ))}
          </div>
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
          <div
            style={{
              maxWidth: "680px",
              margin: "0 auto",
            }}
          >
            <SurveyForm />
          </div>
        </div>
      </div>
    </>
  );
}
