// src/components/home/PimpinanSection.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Pause,
  Play,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type Pimpinan = {
  id: number;
  name: string;
  position: string;
  photo: string | null;
  bio?: string | null;
  href: string;
  accent: string; // warna aksen tiap slide
  accentAlt: string;
};

type Props = {
  pimpinan: Pimpinan[];
};

const INTERVAL = 6000;

export function PimpinanSection({ pimpinan }: Props) {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [animDir, setAnimDir] = useState<"next" | "prev">("next");
  const [isAnim, setIsAnim] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = pimpinan.length;

  const goTo = useCallback(
    (idx: number, dir: "next" | "prev" = "next") => {
      if (isAnim || idx === active) return;
      setAnimDir(dir);
      setIsAnim(true);
      setPrev(active);
      setActive(idx);
      setTimeout(() => {
        setPrev(null);
        setIsAnim(false);
      }, 700);
    },
    [active, isAnim],
  );

  const goNext = useCallback(() => {
    goTo((active + 1) % total, "next");
  }, [active, total, goTo]);

  const goPrev = useCallback(() => {
    goTo((active - 1 + total) % total, "prev");
  }, [active, total, goTo]);

  // Auto-slide
  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(goNext, INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, goNext]);

  // Keyboard
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  if (total === 0) return null;

  const current = pimpinan[active];
  const nextIdx = (active + 1) % total;
  const nextItem = pimpinan[nextIdx];

  return (
    <section
      className="pimpinan-section"
      style={{
        position: "relative",
        height: "100vh",
        minHeight: "600px",
        overflow: "hidden",
        background: "#f0f2f0",
      }}
    >
      {/* ── Slides ── */}
      {pimpinan.map((p, i) => {
        const isActive = i === active;
        const isPrev = i === prev;
        if (!isActive && !isPrev) return null;

        return (
          <div
            key={p.id}
            style={{
              position: "absolute",
              inset: 0,
              transition: "opacity 0.7s ease, transform 0.7s ease",
              opacity: isActive ? 1 : 0,
              transform: isActive
                ? "translateX(0)"
                : animDir === "next"
                  ? "translateX(-40px)"
                  : "translateX(40px)",
              zIndex: isActive ? 2 : 1,
            }}
          >
            {/* Background gradient */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(135deg, #e8ede8 0%, #f4f6f0 40%, ${p.accent}18 100%)`,
              }}
            />

            {/* Dot pattern */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
                maskImage:
                  "radial-gradient(ellipse 60% 60% at 80% 50%, black 30%, transparent 80%)",
              }}
            />

            {/* Dekorasi lingkaran belakang foto */}
            <div
              style={{
                position: "absolute",
                right: "calc(50% - 320px)",
                top: "50%",
                transform: "translate(60px, -50%)",
                width: "520px",
                height: "520px",
                borderRadius: "50%",
                background: p.accentAlt,
                opacity: 0.35,
                transition: "background 0.7s ease",
              }}
            />
            <div
              style={{
                position: "absolute",
                right: "calc(50% - 260px)",
                top: "50%",
                transform: "translate(20px, -55%)",
                width: "420px",
                height: "420px",
                borderRadius: "50%",
                background: p.accent,
                opacity: 0.25,
                transition: "background 0.7s ease",
              }}
            />

            {/* Layout grid */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                alignItems: "center",
                maxWidth: "1280px",
                margin: "0 auto",
                padding: "0 80px",
                gap: "40px",
              }}
              className="pimpinan-grid"
            >
              {/* Kiri — teks */}
              <div
                style={{
                  position: "relative",
                  zIndex: 3,
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? "translateY(0)" : "translateY(20px)",
                  transition:
                    "opacity 0.6s ease 0.15s, transform 0.6s ease 0.15s",
                }}
              >
                {/* Eyebrow */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "7px",
                    padding: "5px 14px",
                    borderRadius: "20px",
                    background: "rgba(0,0,0,0.06)",
                    fontSize: "10.5px",
                    fontWeight: 700,
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    color: "rgba(0,0,0,0.45)",
                    marginBottom: "28px",
                  }}
                >
                  <span
                    style={{
                      width: "5px",
                      height: "5px",
                      borderRadius: "50%",
                      background: p.accent,
                    }}
                  />
                  Pimpinan BPSDM Kaltim
                </div>

                {/* Jabatan */}
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(14px, 2vw, 20px)",
                    fontWeight: 700,
                    color: p.accent,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                  }}
                >
                  {p.position}
                </div>

                {/* Nama besar */}
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(40px, 6vw, 80px)",
                    fontWeight: 900,
                    lineHeight: 0.95,
                    letterSpacing: "-2px",
                    marginBottom: "24px",
                    color: "#1a2a1a",
                  }}
                >
                  {p.name.split(" ").map((word, wi) => (
                    <div
                      key={wi}
                      style={{
                        color: wi % 2 === 1 ? p.accent : "#1a2a1a",
                      }}
                    >
                      {word}
                    </div>
                  ))}
                </div>

                {/* Bio */}
                {p.bio && (
                  <p
                    style={{
                      fontSize: "14.5px",
                      color: "rgba(0,0,0,0.5)",
                      lineHeight: 1.7,
                      maxWidth: "380px",
                      marginBottom: "32px",
                    }}
                  >
                    {p.bio}
                  </p>
                )}

                {/* CTA */}
                <Link
                  href={p.href}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "13px 28px",
                    borderRadius: "30px",
                    background: p.accent,
                    color: "#fff",
                    fontSize: "13px",
                    fontWeight: 700,
                    textDecoration: "none",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    transition: "all 0.2s",
                    boxShadow: `0 8px 24px ${p.accent}40`,
                  }}
                >
                  Lihat Profil Lengkap
                  <ArrowRight size={14} />
                </Link>
              </div>

              {/* Kanan — foto */}
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  height: "100vh",
                  zIndex: 3,
                }}
              >
                {p.photo ? (
                  <img
                    src={p.photo}
                    alt={p.name}
                    style={{
                      height: "90%",
                      maxHeight: "700px",
                      width: "auto",
                      objectFit: "contain",
                      objectPosition: "bottom",
                      filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.15))",
                      opacity: isActive ? 1 : 0,
                      transform: isActive
                        ? "scale(1) translateY(0)"
                        : "scale(0.95) translateY(20px)",
                      transition:
                        "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "340px",
                      height: "460px",
                      borderRadius: "24px",
                      background: "rgba(0,0,0,0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "80px",
                    }}
                  >
                    👤
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* ── Progress bar ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "rgba(0,0,0,0.08)",
          zIndex: 10,
        }}
      >
        <div
          key={`${active}-${paused}`}
          style={{
            height: "100%",
            background: current.accent,
            animation: paused ? "none" : `progressBar ${INTERVAL}ms linear`,
            width: paused ? "0%" : undefined,
          }}
        />
      </div>

      {/* ── Dots navigasi kiri ── */}
      <div
        style={{
          position: "absolute",
          left: "80px",
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          zIndex: 10,
        }}
        className="pimpinan-dots"
      >
        {pimpinan.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > active ? "next" : "prev")}
            style={{
              width: i === active ? "4px" : "4px",
              height: i === active ? "24px" : "8px",
              borderRadius: "4px",
              background: i === active ? current.accent : "rgba(0,0,0,0.2)",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "all 0.3s ease",
            }}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* ── Tombol prev/next ── */}
      <button
        onClick={goPrev}
        style={{
          position: "absolute",
          left: "120px",
          bottom: "48px",
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.8)",
          border: "1px solid rgba(0,0,0,0.08)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#333",
          zIndex: 10,
          backdropFilter: "blur(8px)",
          transition: "all 0.15s",
          boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
        }}
        className="pimpinan-nav-btn"
      >
        <ChevronLeft size={18} />
      </button>

      <button
        onClick={goNext}
        style={{
          position: "absolute",
          left: "172px",
          bottom: "48px",
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.8)",
          border: "1px solid rgba(0,0,0,0.08)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#333",
          zIndex: 10,
          backdropFilter: "blur(8px)",
          transition: "all 0.15s",
          boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
        }}
        className="pimpinan-nav-btn"
      >
        <ChevronRight size={18} />
      </button>

      {/* ── Tombol pause/play ── */}
      <button
        onClick={() => setPaused((v) => !v)}
        style={{
          position: "absolute",
          right: "40px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          background: current.accent,
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          zIndex: 10,
          boxShadow: `0 4px 16px ${current.accent}50`,
          transition: "all 0.2s",
        }}
      >
        {paused ? (
          <Play size={16} fill="#fff" />
        ) : (
          <Pause size={16} fill="#fff" />
        )}
      </button>

      {/* ── Preview "Selanjutnya" ── */}
      <button
        onClick={goNext}
        style={{
          position: "absolute",
          right: "40px",
          bottom: "48px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "12px 16px",
          borderRadius: "14px",
          background: "rgba(255,255,255,0.85)",
          border: "1px solid rgba(0,0,0,0.06)",
          cursor: "pointer",
          zIndex: 10,
          backdropFilter: "blur(12px)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          transition: "all 0.2s",
          textAlign: "left",
        }}
        className="pimpinan-next-preview"
      >
        {/* Foto kecil */}
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            overflow: "hidden",
            background: nextItem.accentAlt,
            flexShrink: 0,
          }}
        >
          {nextItem.photo && (
            <img
              src={nextItem.photo}
              alt={nextItem.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top",
              }}
            />
          )}
        </div>
        <div>
          <div
            style={{
              fontSize: "9.5px",
              fontWeight: 700,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: "rgba(0,0,0,0.35)",
              marginBottom: "2px",
            }}
          >
            Selanjutnya
          </div>
          <div
            style={{ fontSize: "13.5px", fontWeight: 700, color: "#1a2a1a" }}
          >
            {nextItem.name}
          </div>
          <div style={{ fontSize: "11px", color: "rgba(0,0,0,0.4)" }}>
            {nextItem.position}
          </div>
        </div>
        <ArrowRight
          size={14}
          style={{ color: "rgba(0,0,0,0.3)", marginLeft: "4px" }}
        />
      </button>
    </section>
  );
}
