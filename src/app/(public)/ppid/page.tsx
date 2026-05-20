// src/app/(public)/ppid/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  Users,
  Clock,
  ArrowRight,
  Scale,
  BookOpen,
  Zap,
  Lock,
  User,
  Shield,
  ChevronRight,
  ExternalLink,
  GitBranch,
  AlertTriangle,
  BarChart2,
  Star,
  ClipboardList,
  CheckCircle2,
} from "lucide-react";
import { getPpidCount } from "@/lib/queries/ppid";

export const metadata: Metadata = {
  title: "PPID — Keterbukaan Informasi Publik",
  description:
    "Pejabat Pengelola Informasi dan Dokumentasi BPSDM Provinsi Kalimantan Timur.",
};

export const revalidate = 3600;

const TIPE_CONFIG = {
  berkala: {
    label: "Informasi Berkala",
    icon: BookOpen,
    color: "#1d4ed8",
    bg: "#eff6ff",
    border: "#bfdbfe",
    desc: "Wajib diumumkan secara berkala (Pasal 9 UU KIP)",
  },
  serta_merta: {
    label: "Informasi Serta Merta",
    icon: Zap,
    color: "#dc2626",
    bg: "#fef2f2",
    border: "#fecaca",
    desc: "Diumumkan segera tanpa penundaan (Pasal 10 UU KIP)",
  },
  setiap_saat: {
    label: "Informasi Setiap Saat",
    icon: Clock,
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    desc: "Tersedia kapan saja diminta (Pasal 11 UU KIP)",
  },
  dikecualikan: {
    label: "Informasi Dikecualikan",
    icon: Lock,
    color: "#b45309",
    bg: "#fffbeb",
    border: "#fde68a",
    desc: "Dikecualikan sesuai ketentuan (Pasal 17 UU KIP)",
  },
} as const;

const MENU_CARDS = [
  {
    label: "Profil PPID",
    href: "/ppid/profil",
    icon: User,
    color: "#1d4ed8",
    bg: "#eff6ff",
    border: "#bfdbfe",
  },
  {
    label: "Struktur Organisasi",
    href: "/ppid/struktur",
    icon: Users,
    color: "#7e22ce",
    bg: "#fdf4ff",
    border: "#e9d5ff",
  },
  {
    label: "Tugas & Fungsi",
    href: "/ppid/tugas-fungsi",
    icon: ClipboardList,
    color: "#0e7490",
    bg: "#ecfeff",
    border: "#a5f3fc",
  },
  {
    label: "Maklumat Pelayanan",
    href: "/ppid/maklumat",
    icon: Star,
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#bbf7d0",
  },
  {
    label: "Standar Layanan",
    href: "/ppid/standar-layanan",
    icon: BookOpen,
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
  },
  {
    label: "Daftar Informasi",
    href: "/ppid/daftar-informasi",
    icon: Scale,
    color: "#dc2626",
    bg: "#fef2f2",
    border: "#fecaca",
  },
  {
    label: "Laporan Tahunan",
    href: "/ppid/laporan-tahunan",
    icon: BarChart2,
    color: "#c2410c",
    bg: "#fff7ed",
    border: "#fed7aa",
  },
  {
    label: "Alur Permohonan",
    href: "/ppid/alur-permohonan",
    icon: GitBranch,
    color: "#0e3d20",
    bg: "var(--color-forest-50)",
    border: "var(--color-forest-200)",
  },
  {
    label: "Ajukan Permohonan",
    href: "/ppid/permohonan",
    icon: FileText,
    color: "#1d4ed8",
    bg: "#eff6ff",
    border: "#bfdbfe",
  },
  {
    label: "Keberatan & Sengketa",
    href: "/ppid/keberatan",
    icon: AlertTriangle,
    color: "#dc2626",
    bg: "#fef2f2",
    border: "#fecaca",
  },
  {
    label: "Regulasi PPID",
    href: "/ppid/regulasi",
    icon: Scale,
    color: "#7e22ce",
    bg: "#fdf4ff",
    border: "#e9d5ff",
  },
];

const LAYANAN_UNGGULAN = [
  {
    no: "10",
    label: "Hari Kerja",
    desc: "Waktu respons permohonan informasi",
    color: "var(--color-forest-700)",
    bg: "var(--color-forest-50)",
  },
  {
    no: "24/7",
    label: "Online",
    desc: "Ajukan permohonan kapan saja secara daring",
    color: "#1d4ed8",
    bg: "#eff6ff",
  },
  {
    no: "Gratis",
    label: "Tanpa Biaya",
    desc: "Layanan informasi publik tanpa pungutan",
    color: "#16a34a",
    bg: "#f0fdf4",
  },
];

export default async function PpidPage() {
  const counts = await getPpidCount();
  const totalInfo = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* ── Banner statistik informasi ── */}
      <div
        style={{
          background: "var(--color-forest-900)",
          borderRadius: "16px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Dot grid texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            padding: "24px 28px",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "9px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Shield size={18} color="rgba(255,255,255,0.8)" />
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>
                Statistik Keterbukaan Informasi
              </div>
              <div
                style={{
                  fontSize: "11.5px",
                  color: "rgba(255,255,255,0.4)",
                  marginTop: "1px",
                }}
              >
                Data informasi publik BPSDM Kaltim
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "0",
            }}
          >
            {[
              { label: "Total Informasi", value: totalInfo, color: "#fff" },
              {
                label: "Berkala",
                value: counts.berkala ?? 0,
                color: "#60a5fa",
              },
              {
                label: "Serta Merta",
                value: counts.serta_merta ?? 0,
                color: "#f87171",
              },
              {
                label: "Setiap Saat",
                value: counts.setiap_saat ?? 0,
                color: "#4ade80",
              },
              {
                label: "Dikecualikan",
                value: counts.dikecualikan ?? 0,
                color: "#fbbf24",
              },
            ].map((s, i) => (
              <div
                key={s.label}
                style={{
                  padding: "0 20px",
                  borderRight:
                    i < 4 ? "1px solid rgba(255,255,255,0.07)" : "none",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "30px",
                    fontWeight: 900,
                    color: s.color,
                    lineHeight: 1,
                    letterSpacing: "-0.5px",
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: "11.5px",
                    color: "rgba(255,255,255,0.4)",
                    marginTop: "6px",
                    fontWeight: 500,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Layanan unggulan ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px",
        }}
      >
        {LAYANAN_UNGGULAN.map((item) => (
          <div
            key={item.label}
            style={{
              padding: "16px 20px",
              borderRadius: "12px",
              background: "#fff",
              border: "1px solid var(--color-ink-6)",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "12px",
                background: item.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontSize: item.no.length > 4 ? "12px" : "18px",
                  fontWeight: 900,
                  color: item.color,
                  lineHeight: 1,
                  letterSpacing: "-0.5px",
                }}
              >
                {item.no}
              </span>
            </div>
            <div>
              <div
                style={{
                  fontSize: "13.5px",
                  fontWeight: 700,
                  color: item.color,
                  marginBottom: "2px",
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--color-ink-4)",
                  lineHeight: 1.4,
                }}
              >
                {item.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Navigasi cepat ── */}
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
            padding: "14px 18px",
            borderBottom: "1px solid var(--color-ink-7)",
            fontSize: "13.5px",
            fontWeight: 700,
            color: "var(--color-ink)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Shield size={15} style={{ color: "var(--color-forest-600)" }} />
          Navigasi PPID
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "0",
          }}
        >
          {MENU_CARDS.map((item, i) => {
            const isLastRow =
              i >= MENU_CARDS.length - (MENU_CARDS.length % 3 || 3);
            const isRightCol = (i + 1) % 3 === 0;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "14px 16px",
                  textDecoration: "none",
                  borderRight: !isRightCol
                    ? "1px solid var(--color-ink-7)"
                    : "none",
                  borderBottom: !isLastRow
                    ? "1px solid var(--color-ink-7)"
                    : "none",
                  background: "#fff",
                  transition: "background 0.12s",
                }}
                className="ppid-nav-item"
              >
                <div
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "9px",
                    background: item.bg,
                    border: `1px solid ${item.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <item.icon size={15} style={{ color: item.color }} />
                </div>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--color-ink-2)",
                    flex: 1,
                    lineHeight: 1.3,
                  }}
                >
                  {item.label}
                </span>
                <ChevronRight
                  size={13}
                  style={{ color: "var(--color-ink-5)", flexShrink: 0 }}
                />
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── 4 jenis informasi ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "12px",
        }}
      >
        {(Object.keys(TIPE_CONFIG) as (keyof typeof TIPE_CONFIG)[]).map(
          (tipe) => {
            const cfg = TIPE_CONFIG[tipe];
            const Icon = cfg.icon;
            const cnt = counts[tipe] ?? 0;

            return (
              <Link
                key={tipe}
                href={`/ppid/daftar-informasi?tipe=${tipe}`}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "14px",
                  padding: "18px 20px",
                  borderRadius: "12px",
                  background: "#fff",
                  border: `1px solid ${cfg.border}`,
                  textDecoration: "none",
                  transition: "all 0.18s",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}
                className="ppid-tipe-card"
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "11px",
                    background: cfg.bg,
                    border: `1px solid ${cfg.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={20} style={{ color: cfg.color }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: cfg.color,
                      marginBottom: "3px",
                    }}
                  >
                    {cfg.label}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--color-ink-4)",
                      lineHeight: 1.5,
                    }}
                  >
                    {cfg.desc}
                  </div>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      marginTop: "8px",
                      padding: "3px 10px",
                      borderRadius: "20px",
                      background: cfg.bg,
                      border: `1px solid ${cfg.border}`,
                      fontSize: "12px",
                      fontWeight: 700,
                      color: cfg.color,
                    }}
                  >
                    {cnt} dokumen
                  </div>
                </div>
                <ArrowRight
                  size={15}
                  style={{ color: cfg.color, flexShrink: 0, marginTop: "2px" }}
                />
              </Link>
            );
          },
        )}
      </div>

      {/* ── Dasar hukum singkat ── */}
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          border: "1px solid var(--color-ink-6)",
          padding: "16px 20px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            fontSize: "12.5px",
            fontWeight: 700,
            color: "var(--color-ink-3)",
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <Scale size={13} style={{ color: "var(--color-forest-600)" }} />
          Landasan Hukum
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
          }}
        >
          {[
            "UU No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik",
            "PP No. 61 Tahun 2010 tentang Pelaksanaan UU KIP",
            "PerKI No. 1 Tahun 2010 tentang Standar Layanan Informasi",
            "Pergub Kaltim tentang PPID di Lingkungan Pemprov Kaltim",
          ].map((h, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "flex-start",
                fontSize: "12.5px",
                color: "var(--color-ink-3)",
                lineHeight: 1.5,
              }}
            >
              <CheckCircle2
                size={14}
                style={{
                  color: "var(--color-forest-500)",
                  flexShrink: 0,
                  marginTop: "2px",
                }}
              />
              {h}
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA Permohonan ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
        }}
      >
        <Link
          href="/ppid/permohonan"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            padding: "20px",
            borderRadius: "14px",
            background: "var(--color-forest-900)",
            textDecoration: "none",
            transition: "all 0.15s",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Texture */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "11px",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              position: "relative",
            }}
          >
            <FileText size={20} color="#fff" />
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ fontSize: "14.5px", fontWeight: 700, color: "#fff" }}>
              Ajukan Permohonan
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "rgba(255,255,255,0.55)",
                marginTop: "3px",
              }}
            >
              Formulir permohonan informasi publik online
            </div>
          </div>
          <ChevronRight
            size={18}
            color="rgba(255,255,255,0.5)"
            style={{ marginLeft: "auto", position: "relative" }}
          />
        </Link>

        <Link
          href="/ppid/permohonan#tracking"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            padding: "20px",
            borderRadius: "14px",
            background: "#fff",
            border: "1px solid var(--color-ink-6)",
            textDecoration: "none",
            transition: "all 0.15s",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "11px",
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Clock size={20} style={{ color: "#1d4ed8" }} />
          </div>
          <div>
            <div
              style={{
                fontSize: "14.5px",
                fontWeight: 700,
                color: "var(--color-ink)",
              }}
            >
              Cek Status Permohonan
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "var(--color-ink-4)",
                marginTop: "3px",
              }}
            >
              Lacak nomor permohonan informasi Anda
            </div>
          </div>
          <ChevronRight
            size={18}
            style={{ color: "var(--color-ink-5)", marginLeft: "auto" }}
          />
        </Link>
      </div>
    </div>
  );
}
