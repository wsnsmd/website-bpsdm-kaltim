// src/components/landing/LandingPage.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ── SVG Icons modern per app ──────────────────
const AppIcon = ({ id }: { id: string }) => {
  const icons: Record<string, React.ReactNode> = {
    website: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c-2.5 3-4 5.5-4 9s1.5 6 4 9M12 3c2.5 3 4 5.5 4 9s-1.5 6-4 9" />
      </svg>
    ),
    simpel: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <path d="M4 19V5a2 2 0 012-2h12a2 2 0 012 2v14" />
        <path d="M8 7h8M8 11h8M8 15h5" />
      </svg>
    ),
    lc: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <path d="M12 3L2 8l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    dinov: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83" />
        <circle cx="12" cy="12" r="4" />
        <path d="M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
    cbt: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    sieva: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    epustaka: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <path d="M4 19V6a2 2 0 012-2h12a2 2 0 012 2v13" />
        <path d="M4 19a2 2 0 002 2h12a2 2 0 002-2" />
        <path d="M8 10h8M8 14h5" />
      </svg>
    ),
    piawan: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <path d="M18 10a6 6 0 00-12 0c-2.2.3-4 2.2-4 4.5A4.5 4.5 0 006.5 19h11a4.5 4.5 0 004.5-4.5c0-2.3-1.8-4.2-4-4.5z" />
      </svg>
    ),
    akpk: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M6 20v-2a6 6 0 0112 0v2" />
        <path d="M18 12l2 2-2 2" />
      </svg>
    ),
    simonbangkom: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <path d="M3 3v18h18" />
        <path d="M7 16l4-5 4 3 4-6" />
      </svg>
    ),
    nij: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <path d="M14 2v6h6M8 13h8M8 17h5" />
      </svg>
    ),
    kms: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <path d="M12 2a5 5 0 015 5c0 2-1 3.5-2.5 4.5M12 2a5 5 0 00-5 5c0 2 1 3.5 2.5 4.5" />
        <path d="M12 16v6M8 20h8" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
    ppid: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <path d="M12 2L3 7v6c0 5 3.8 9.7 9 11 5.2-1.3 9-6 9-11V7l-9-5z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    statistik: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <rect x="3" y="12" width="4" height="9" rx="1" />
        <rect x="10" y="7" width="4" height="14" rx="1" />
        <rect x="17" y="3" width="4" height="18" rx="1" />
      </svg>
    ),
    bantuan: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M9 9a3 3 0 015.12 2.12C14 13 12 13 12 15" />
        <circle cx="12" cy="19" r=".5" fill="currentColor" />
      </svg>
    ),
    pengaduan: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        <path d="M12 8v4M12 16h.01" />
      </svg>
    ),
  };
  return (
    <span style={{ width: "24px", height: "24px", display: "flex" }}>
      {icons[id] ?? icons.website}
    </span>
  );
};

// ── Data ──────────────────────────────────────
const APPS = [
  {
    id: "website",
    title: "Website",
    desc: "Portal Informasi",
    href: "/web",
    featured: true,
  },
  {
    id: "simpel",
    title: "SIMPel",
    desc: "Manajemen Pelatihan",
    href: "https://simpel.kaltimprov.go.id",
    external: true,
  },
  {
    id: "lc",
    title: "Learning Center",
    desc: "Platform e-Learning",
    href: "https://elearning.kaltimprov.go.id",
    external: true,
  },
  {
    id: "dinov",
    title: "Dinov",
    desc: "Database Inovasi",
    href: "https://bpsdm.kaltimprov.go.id/apps/dinov",
    external: true,
  },
  {
    id: "cbt",
    title: "CBT",
    desc: "Computer Based Test",
    href: "https://cbt.bpsdmkaltim.net",
    external: true,
  },
  {
    id: "sieva",
    title: "SiEva",
    desc: "Survei & Evaluasi",
    href: "https://sieva.bpsdmkaltim.net",
    external: true,
  },
  {
    id: "epustaka",
    title: "e-Pustaka",
    desc: "Perpustakaan Digital",
    href: "https://play.google.com/store/apps/details?id=com.eperpus.saas.bpsdm_kt",
    external: true,
  },
  {
    id: "piawan",
    title: "PiAwan",
    desc: "Penyimpanan Awan",
    href: "https://piawan.bpsdmkaltim.net",
    external: true,
  },
  {
    id: "akpk",
    title: "AKPK",
    desc: "Analisis Kebutuhan Kompetensi",
    href: "https://akpk.kaltimprov.go.id",
    external: true,
  },
  {
    id: "simonbangkom",
    title: "SiMonBangKom",
    desc: "Monitoring Pengembangan Kompetensi",
    href: "https://simonbangkom.kaltimprov.go.id",
    external: true,
  },
  {
    id: "nij",
    title: "NIJ",
    desc: "Nusantara Innovation Journal",
    href: "https://nij.kaltimprov.go.id",
    external: true,
  },
  {
    id: "kms",
    title: "KMS",
    desc: "Knowledge Management System",
    href: "https://kms.kaltimprov.go.id",
    external: true,
  },
  {
    id: "ppid",
    title: "PPID",
    desc: "Keterbukaan Informasi",
    href: "https://ppid.bpsdm.kaltimprov.go.id",
    external: true,
  },
  {
    id: "statistik",
    title: "Statistik",
    desc: "Data & Analitik",
    href: "/web",
  },
  {
    id: "bantuan",
    title: "Bantuan",
    desc: "Dukungan Online",
    href: "https://bpsdm.kaltimprov.go.id/bantuan",
    external: true,
  },
  {
    id: "pengaduan",
    title: "Pengaduan",
    desc: "SP4N LAPOR!",
    href: "https://www.lapor.go.id",
    external: true,
  },
];

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://instagram.com/bpsdmkaltim",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        width="16"
        height="16"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r=".5" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com/bpsdmprovkaltim",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        width="16"
        height="16"
      >
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com/bpsdmkaltim",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        width="16"
        height="16"
      >
        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com/channel/UCLrwXs0jNQ6dMjpDSXlc--w",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        width="16"
        height="16"
      >
        <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.45A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.45a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
        <polygon
          points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"
          fill="currentColor"
          stroke="none"
        />
      </svg>
    ),
  },
];

// ── Particles ─────────────────────────────────
function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    const pts = Array.from({ length: 70 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      o: Math.random() * 0.4 + 0.1,
    }));
    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, W, H);
      for (const p of pts) {
        p.x = (p.x + p.vx + W) % W;
        p.y = (p.y + p.vy + H) % H;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(192,132,252,${p.o})`;
        ctx.fill();
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(167,139,250,${0.08 * (1 - d / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    }
    draw();
    const onResize = () => {
      if (!canvas) return;
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}

// ── Main ──────────────────────────────────────
export function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const appsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080012",
        color: "#fff",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        overflowX: "hidden",
      }}
    >
      {/* ── HERO ── */}
      <section
        style={{
          position: "relative",
          height: "100vh",
          minHeight: "640px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          textAlign: "center",
          padding: "0 24px",
        }}
      >
        {/* Background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `
            radial-gradient(ellipse 70% 70% at 50% 30%, rgba(124,58,237,0.4) 0%, transparent 60%),
            radial-gradient(ellipse 50% 50% at 20% 70%, rgba(139,92,246,0.2) 0%, transparent 55%),
            radial-gradient(ellipse 50% 50% at 80% 70%, rgba(168,85,247,0.15) 0%, transparent 55%),
            #080012
          `,
            zIndex: 0,
          }}
        />

        {/* Grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
            zIndex: 0,
            maskImage:
              "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
          }}
        />

        {/* Orbs */}
        <div
          style={{
            position: "absolute",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",
            top: "-150px",
            left: "-150px",
            animation: "o1 14s ease-in-out infinite",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)",
            bottom: "-100px",
            right: "-100px",
            animation: "o2 18s ease-in-out infinite",
            zIndex: 0,
          }}
        />

        {mounted && <Particles />}

        {/* Content — centered */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0",
          }}
        >
          {/* Logo */}
          <div
            style={{
              marginBottom: "24px",
              opacity: mounted ? 1 : 0,
              transform: mounted
                ? "translateY(0) scale(1)"
                : "translateY(-16px) scale(0.9)",
              transition: "all 0.9s cubic-bezier(.16,1,.3,1)",
            }}
          >
            <div
              style={{
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                background: "rgba(124,58,237,0.1)",
                border: "1px solid rgba(124,58,237,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow:
                  "0 0 40px rgba(124,58,237,0.25), inset 0 0 20px rgba(124,58,237,0.05)",
                margin: "0 auto",
              }}
            >
              <img
                src="/pemprov.png"
                alt="Pemprov Kaltim"
                style={{ width: "70px", height: "70px", objectFit: "contain" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          </div>

          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              padding: "5px 16px",
              borderRadius: "20px",
              background: "rgba(124,58,237,0.12)",
              border: "1px solid rgba(124,58,237,0.25)",
              fontSize: "10.5px",
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase" as const,
              color: "#a78bfa",
              marginBottom: "20px",
              opacity: mounted ? 1 : 0,
              transition: "all 0.8s ease 0.15s",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#8b5cf6",
                boxShadow: "0 0 8px rgba(139,92,246,0.8)",
                animation: "pulse 2s infinite",
              }}
            />
            Pemerintah Provinsi Kalimantan Timur
          </div>

          {/* Name */}
          <div
            style={{
              fontSize: "clamp(12px, 2.5vw, 16px)",
              fontWeight: 500,
              color: "rgba(167,139,250,0.6)",
              letterSpacing: "0.5px",
              marginBottom: "6px",
              opacity: mounted ? 1 : 0,
              transition: "all 0.8s ease 0.25s",
            }}
          >
            Badan Pengembangan Sumber Daya Manusia
          </div>

          <h1
            style={{
              fontSize: "clamp(36px, 7vw, 80px)",
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-2px",
              marginBottom: "10px",
              background:
                "linear-gradient(135deg, #fff 0%, #ddd6fe 40%, #a855f7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(24px)",
              transition: "all 0.9s cubic-bezier(.16,1,.3,1) 0.3s",
            }}
          >
            BPSDM
            <span
              style={{
                paddingLeft: "20px",
                background: "linear-gradient(135deg, #c084fc 0%, #7c3aed 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Kaltim
            </span>
          </h1>

          {/* KISS */}
          <div
            style={{
              fontSize: "clamp(10px, 1.5vw, 13px)",
              fontWeight: 600,
              letterSpacing: "3px",
              textTransform: "uppercase" as const,
              color: "rgba(167,139,250,0.35)",
              marginBottom: "40px",
              opacity: mounted ? 1 : 0,
              transition: "all 0.8s ease 0.4s",
            }}
          >
            Knowledge · Integrated · Solution · System
          </div>

          {/* CTAs */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap" as const,
              justifyContent: "center",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(16px)",
              transition: "all 0.9s cubic-bezier(.16,1,.3,1) 0.5s",
            }}
          >
            <Link
              href="/web"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "13px 30px",
                borderRadius: "40px",
                background: "linear-gradient(135deg, #6d28d9, #9333ea)",
                color: "#fff",
                fontSize: "14px",
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 8px 32px rgba(109,40,217,0.45)",
                transition: "all 0.2s",
              }}
              className="lp-btn-p"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                width="16"
                height="16"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3c-2.5 3-4 5.5-4 9s1.5 6 4 9" />
              </svg>
              Masuk Website
            </Link>
            <button
              onClick={() =>
                appsRef.current?.scrollIntoView({ behavior: "smooth" })
              }
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "13px 28px",
                borderRadius: "40px",
                background: "rgba(109,40,217,0.1)",
                border: "1px solid rgba(109,40,217,0.35)",
                color: "#c4b5fd",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              className="lp-btn-s"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                width="16"
                height="16"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              Portal Layanan
            </button>
          </div>
        </div>

        {/* Scroll hint */}
        <button
          onClick={() =>
            appsRef.current?.scrollIntoView({ behavior: "smooth" })
          }
          style={{
            position: "absolute",
            bottom: "32px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
            background: "none",
            border: "none",
            cursor: "pointer",
            opacity: 0.35,
            animation: "bounce 2.5s ease-in-out infinite",
            zIndex: 2,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(167,139,250,1)"
            strokeWidth="1.5"
            strokeLinecap="round"
            width="20"
            height="20"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </section>

      {/* ── APPS ── */}
      <section
        ref={appsRef}
        style={{
          padding: "80px 24px 60px",
          background:
            "linear-gradient(180deg, #080012 0%, #0d0020 50%, #080012 100%)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: "700px",
            height: "300px",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(109,40,217,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{ maxWidth: "1080px", margin: "0 auto", position: "relative" }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div
              style={{
                display: "inline-block",
                padding: "4px 16px",
                borderRadius: "20px",
                background: "rgba(109,40,217,0.1)",
                border: "1px solid rgba(109,40,217,0.2)",
                fontSize: "10.5px",
                fontWeight: 700,
                letterSpacing: "2px",
                textTransform: "uppercase" as const,
                color: "#9f7aea",
                marginBottom: "14px",
              }}
            >
              Portal Layanan Digital
            </div>
            <h2
              style={{
                fontSize: "clamp(24px, 4vw, 40px)",
                fontWeight: 900,
                letterSpacing: "-1px",
                marginBottom: "10px",
                background: "linear-gradient(135deg, #fff 0%, #c4b5fd 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Ekosistem KISS
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "rgba(167,139,250,0.5)",
                maxWidth: "640px",
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              Platform digital terintegrasi pengembangan kompetensi ASN Kaltim
            </p>
          </div>

          {/* Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(148px, 1fr))",
              gap: "10px",
            }}
          >
            {APPS.map((app) => (
              <Link
                key={app.id}
                href={app.href}
                target={app.external ? "_blank" : undefined}
                rel={app.external ? "noopener noreferrer" : undefined}
                onMouseEnter={() => setHovered(app.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                  padding: "22px 14px",
                  borderRadius: "14px",
                  background:
                    hovered === app.id
                      ? "rgba(109,40,217,0.15)"
                      : app.featured
                        ? "rgba(109,40,217,0.1)"
                        : "rgba(255,255,255,0.025)",
                  border: `1px solid ${
                    hovered === app.id
                      ? "rgba(139,92,246,0.5)"
                      : app.featured
                        ? "rgba(109,40,217,0.3)"
                        : "rgba(255,255,255,0.06)"
                  }`,
                  textDecoration: "none",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  transform:
                    hovered === app.id ? "translateY(-4px)" : "translateY(0)",
                  boxShadow:
                    hovered === app.id
                      ? "0 12px 32px rgba(109,40,217,0.2)"
                      : "none",
                }}
              >
                {/* Icon container */}
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background:
                      hovered === app.id
                        ? "rgba(139,92,246,0.2)"
                        : "rgba(109,40,217,0.12)",
                    border: `1px solid ${hovered === app.id ? "rgba(139,92,246,0.4)" : "rgba(109,40,217,0.2)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: hovered === app.id ? "#c4b5fd" : "#9f7aea",
                    transition: "all 0.2s",
                    flexShrink: 0,
                  }}
                >
                  <AppIcon id={app.id} />
                </div>

                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    textAlign: "center",
                    color:
                      hovered === app.id ? "#fff" : "rgba(255,255,255,0.7)",
                    transition: "color 0.2s",
                    lineHeight: 1.2,
                  }}
                >
                  {app.title}
                </div>

                <div
                  style={{
                    fontSize: "10.5px",
                    color: "rgba(167,139,250,0.35)",
                    textAlign: "center",
                    lineHeight: 1.4,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical" as const,
                    overflow: "hidden",
                  }}
                >
                  {app.desc}
                </div>

                {app.external && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "3px",
                      marginTop: "-4px",
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="rgba(167,139,250,0.25)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      width="10"
                      height="10"
                    >
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                    </svg>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          padding: "32px 24px",
          background: "#050010",
          borderTop: "1px solid rgba(109,40,217,0.1)",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              gap: "8px",
              justifyContent: "center",
              marginBottom: "20px",
              flexWrap: "wrap" as const,
            }}
          >
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "7px 14px",
                  borderRadius: "20px",
                  background: "rgba(109,40,217,0.06)",
                  border: "1px solid rgba(109,40,217,0.12)",
                  color: "rgba(167,139,250,0.5)",
                  fontSize: "12px",
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "all 0.15s",
                }}
                className="lp-social"
              >
                {s.icon} {s.label}
              </a>
            ))}
          </div>
          <div
            style={{
              fontSize: "11.5px",
              color: "rgba(109,40,217,0.3)",
              lineHeight: 1.6,
            }}
          >
            Hak Cipta © {new Date().getFullYear()} — Badan Pengembangan Sumber
            Daya Manusia Provinsi Kalimantan Timur
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes o1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(80px,50px) scale(1.1)} 66%{transform:translate(-50px,80px) scale(0.9)} }
        @keyframes o2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-60px,-40px) scale(1.12)} 66%{transform:translate(40px,-60px) scale(0.88)} }
        @keyframes pulse { 0%,100%{opacity:1;box-shadow:0 0 8px rgba(139,92,246,0.8)} 50%{opacity:.4;box-shadow:0 0 20px rgba(139,92,246,0.3)} }
        @keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(8px)} }
        .lp-btn-p:hover { transform:translateY(-2px)!important; box-shadow:0 14px 40px rgba(109,40,217,0.55)!important; }
        .lp-btn-s:hover { background:rgba(109,40,217,0.18)!important; border-color:rgba(139,92,246,0.5)!important; color:#e9d5ff!important; }
        .lp-social:hover { background:rgba(109,40,217,0.14)!important; border-color:rgba(139,92,246,0.25)!important; color:#c4b5fd!important; }
        @media(max-width:640px){
          div[style*="minmax(148px"]{grid-template-columns:repeat(3,1fr)!important;}
        }
        @media(max-width:380px){
          div[style*="minmax(148px"]{grid-template-columns:repeat(2,1fr)!important;}
        }
      `}</style>
    </div>
  );
}
