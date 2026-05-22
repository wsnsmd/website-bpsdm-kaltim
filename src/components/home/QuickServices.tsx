// src/components/home/QuickServices.tsx
import Link from "next/link";
import {
  ClipboardList,
  GraduationCap,
  MonitorCheck,
  BookOpen,
  Database,
  BarChart2,
  Cloud,
  TrendingUp,
  Activity,
  Newspaper,
  Brain,
  Globe,
  PieChart,
  Headphones,
  MessageSquareWarning,
  CalendarDays,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { getPlatforms } from "@/lib/queries/platforms";

const ICON_MAP: Record<string, LucideIcon> = {
  ClipboardList,
  GraduationCap,
  MonitorCheck,
  BookOpen,
  Database,
  BarChart2,
  Cloud,
  TrendingUp,
  Activity,
  Newspaper,
  Brain,
  Globe,
  PieChart,
  Headphones,
  MessageSquareWarning,
  CalendarDays,
};

export async function QuickServices() {
  const highlights = await getPlatforms({ isHighlight: true });

  if (highlights.length === 0) return null;

  return (
    <section className="quick-services" style={{ backgroundColor: "#fff" }}>
      <div className="container-content">
        {/* Header */}
        <div className="quick-services-header">
          <p className="quick-services-badge">Akses Cepat</p>
          <h2 className="quick-services-title">Layanan Unggulan BPSDM</h2>
          <p className="quick-services-subtitle">
            Platform digital utama yang paling sering diakses oleh pengguna.
          </p>
        </div>

        {/* Grid unggulan */}
        <div className="quick-services-grid">
          {highlights.map((platform) => {
            const Icon = ICON_MAP[platform.icon ?? ""] ?? GraduationCap;
            const isExternal = platform.url?.startsWith("http");

            return (
              <Link
                key={platform.id}
                href={platform.url ?? "#"}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="quick-service-card"
              >
                <div className="quick-service-icon">
                  <Icon size={26} />
                </div>
                <div className="quick-service-info">
                  <h3 className="quick-service-name">{platform.name}</h3>
                  <p className="quick-service-desc">{platform.description}</p>
                </div>
                <div className="quick-service-cta">
                  <span>Akses Layanan</span>
                  <ArrowRight size={14} />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Link ke semua platform */}
        <div className="quick-services-footer">
          <Link href="/layanan" className="quick-services-link-all">
            <span>Lihat Semua Platform & Layanan</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
