// src/components/home/ProgramsSection.tsx
import Link from "next/link";
import {
  Wrench,
  Layers,
  Users,
  Globe,
  Landmark,
  BadgeCheck,
  BookOpen,
  Award,
  Target,
  GraduationCap,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { getPrograms } from "@/lib/queries/programs";

const ICON_MAP: Record<string, LucideIcon> = {
  Wrench,
  Layers,
  Users,
  Globe,
  Landmark,
  BadgeCheck,
  BookOpen,
  Award,
  Target,
  GraduationCap,
};

const TYPE_ICON_FALLBACK: Record<string, LucideIcon> = {
  Teknis: Wrench,
  Fungsional: Layers,
  Manajerial: Users,
  Sosiokultural: Globe,
  "Pemerintahan Dalam Negeri": Landmark,
  Sertifikasi: BadgeCheck,
  Orientasi: GraduationCap,
};

const TYPE_COLOR_FALLBACK: Record<string, string> = {
  Teknis: "#1d4ed8",
  Fungsional: "#16a34a",
  Manajerial: "#c2410c",
  Sosiokultural: "#7e22ce",
  "Pemerintahan Dalam Negeri": "#0e7490",
  Sertifikasi: "#b45309",
  Orientasi: "#0e3d20",
};

export async function ProgramsSection() {
  const programs = await getPrograms({ isHighlight: true });

  if (programs.length === 0) return null;

  return (
    <section style={{ paddingBlock: "4rem", background: "#fff" }}>
      <div className="container-content">
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "2rem",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <p className="sec-label">Program</p>
            <h2 className="sec-title">Pengembangan Kompetensi</h2>
          </div>
          <Link href="/program" className="qs-all-link">
            Lihat
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Grid */}
        <div className="prog-grid">
          {programs.map((program, i) => {
            const num = String(i + 1).padStart(2, "0");
            const color =
              program.color ??
              TYPE_COLOR_FALLBACK[program.jenisKey] ??
              "var(--color-forest-700)";
            const Icon =
              (program.icon ? ICON_MAP[program.icon] : null) ??
              TYPE_ICON_FALLBACK[program.jenisKey] ??
              BookOpen;

            return (
              <Link
                key={program.id}
                href={`/program/${program.slug}`}
                className="prog-card"
              >
                <div className="prog-card-top">
                  <div className="prog-card-num">{num}</div>
                  <div
                    className="prog-card-icon"
                    style={{ backgroundColor: `${color}18` }}
                  >
                    <Icon size={22} style={{ color }} />
                  </div>
                </div>

                <div className="prog-card-name">{program.name}</div>

                {program.description && (
                  <div className="prog-card-desc">{program.description}</div>
                )}

                <div className="prog-card-arrow">
                  Lihat detail
                  <ArrowRight size={14} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
