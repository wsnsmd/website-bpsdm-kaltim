// src/components/home/VideoSection.tsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";

type Video = {
  id: number;
  title: string;
  videoId: string | null;
  description: string | null;
  thumbUrl: string | null;
  sourceType: string;
  sourceUrl: string;
};

type Props = { videos: Video[] };

function getYtThumb(id: string) {
  return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
}

// ── Modal ─────────────────────────────────────
function VideoModal({ video, onClose }: { video: Video; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background: "rgba(0,0,0,0.95)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        backdropFilter: "blur(12px)",
        animation: "vFadeIn 0.25s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "860px",
          position: "relative",
          animation: "vScaleIn 0.3s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "-52px",
            right: 0,
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.15s",
          }}
        >
          <X size={17} />
        </button>

        <div
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "rgba(255,255,255,0.5)",
            marginBottom: "10px",
          }}
        >
          {video.title}
        </div>

        <div
          style={{
            position: "relative",
            paddingBottom: "56.25%",
            borderRadius: "18px",
            overflow: "hidden",
            background: "#000",
            boxShadow:
              "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)",
          }}
        >
          <iframe
            src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={video.title}
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              border: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ── 3D Card ───────────────────────────────────
function VideoCard3D({
  video,
  index,
  isCenter,
  onPlay,
}: {
  video: Video;
  index: number;
  isCenter: boolean;
  onPlay: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);
  const [imgErr, setImgErr] = useState(false);

  const thumb =
    !imgErr && video.thumbUrl
      ? video.thumbUrl
      : video.videoId
        ? getYtThumb(video.videoId)
        : "";

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current || !isCenter) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * 12, y: x * -12 });
  }

  function onMouseLeave() {
    setHover(false);
    setTilt({ x: 0, y: 0 });
  }

  // Posisi 3D berdasarkan jarak dari center
  const offset = index;
  const absOffset = Math.abs(offset);
  const scale = isCenter ? 1 : Math.max(0.75, 1 - absOffset * 0.1);
  const translateX = offset * (isCenter ? 0 : 280);
  const rotateY = isCenter ? tilt.y : offset * -12;
  const rotateX = isCenter ? tilt.x : 0;
  const zIndex = isCenter ? 10 : Math.max(1, 10 - absOffset * 2);
  const opacity = absOffset > 2 ? 0 : Math.max(0.3, 1 - absOffset * 0.25);
  const blur = isCenter ? 0 : absOffset * 1.5;

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={onMouseLeave}
      onClick={onPlay}
      style={{
        position: "absolute",
        width: "340px",
        cursor: "pointer",
        zIndex,
        opacity,
        filter: blur > 0 ? `blur(${blur}px)` : "none",
        transform: `
          translateX(${translateX}px)
          perspective(1000px)
          rotateY(${rotateY}deg)
          rotateX(${rotateX}deg)
          scale(${scale})
        `,
        transformOrigin: "center center",
        transition:
          hover && isCenter
            ? "transform 0.08s ease, opacity 0.4s ease, filter 0.4s ease"
            : "transform 0.5s cubic-bezier(.16,1,.3,1), opacity 0.4s ease, filter 0.4s ease",
        willChange: "transform",
      }}
    >
      {/* Card */}
      <div
        style={{
          borderRadius: "20px",
          overflow: "hidden",
          background: isCenter
            ? "linear-gradient(145deg, #1a3a2a, #0e2a1a)"
            : "linear-gradient(145deg, #111, #0a0a0a)",
          border: isCenter
            ? "1px solid rgba(74,222,128,0.2)"
            : "1px solid rgba(255,255,255,0.05)",
          boxShadow: isCenter
            ? `
              0 30px 60px rgba(0,0,0,0.5),
              0 0 0 1px rgba(74,222,128,0.1),
              inset 0 1px 0 rgba(255,255,255,0.08)
            `
            : "0 10px 30px rgba(0,0,0,0.3)",
          transition: "all 0.4s ease",
        }}
      >
        {/* Thumbnail */}
        <div
          style={{
            position: "relative",
            aspectRatio: "16/9",
            overflow: "hidden",
          }}
        >
          {thumb && (
            <img
              src={thumb}
              alt={video.title}
              onError={() => setImgErr(true)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: hover && isCenter ? "scale(1.08)" : "scale(1)",
                transition: "transform 0.6s ease",
              }}
            />
          )}

          {/* Gradient overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: isCenter
                ? "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)"
                : "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)",
              transition: "background 0.3s",
            }}
          />

          {/* Shimmer effect saat hover */}
          {hover && isCenter && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)",
                animation: "vShimmer 1.5s ease infinite",
              }}
            />
          )}

          {/* Play button */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%,-50%) scale(${hover && isCenter ? 1.15 : 1})`,
              width: isCenter ? "64px" : "48px",
              height: isCenter ? "64px" : "48px",
              borderRadius: "50%",
              background: isCenter
                ? hover
                  ? "var(--color-forest-600)"
                  : "rgba(255,255,255,0.95)"
                : "rgba(255,255,255,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: isCenter
                ? "0 8px 32px rgba(0,0,0,0.4), 0 0 0 4px rgba(255,255,255,0.1)"
                : "0 4px 16px rgba(0,0,0,0.3)",
              transition: "all 0.3s cubic-bezier(.16,1,.3,1)",
            }}
          >
            <Play
              size={isCenter ? 24 : 18}
              fill={
                isCenter ? (hover ? "#fff" : "var(--color-forest-700)") : "#fff"
              }
              color={
                isCenter ? (hover ? "#fff" : "var(--color-forest-700)") : "#fff"
              }
              style={{ marginLeft: isCenter ? "4px" : "3px" }}
            />
          </div>

          {/* Duration badge jika ada */}
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              right: "10px",
              padding: "3px 8px",
              borderRadius: "6px",
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <svg viewBox="0 0 24 24" width="10" height="10" fill="#ff0000">
              <path d="M23 7s-.3-2-1.2-2.7c-1.1-1.2-2.4-1.2-3-1.3C16.2 3 12 3 12 3s-4.2 0-6.8.2c-.6 0-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.1.7 11.3v2c0 2.1.3 4.2.3 4.2s.3 2 1.2 2.7c1.1 1.2 2.6 1.1 3.3 1.2C7.2 21.5 12 21.5 12 21.5s4.2 0 6.8-.3c.6 0 1.9-.1 3-1.3.9-.7 1.2-2.7 1.2-2.7s.3-2.1.3-4.2v-2C23.3 9.1 23 7 23 7zM9.7 15.5V8l6.5 3.8-6.5 3.7z" />
            </svg>
            <span style={{ fontSize: "10px", color: "#fff", fontWeight: 600 }}>
              YouTube
            </span>
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: isCenter ? "18px 20px" : "12px 14px" }}>
          <div
            style={{
              fontSize: isCenter ? "14.5px" : "12.5px",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.3,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical" as const,
              overflow: "hidden",
              marginBottom: "6px",
              transition: "font-size 0.3s",
            }}
          >
            {video.title}
          </div>
          {isCenter && video.description && (
            <div
              style={{
                fontSize: "12px",
                color: "rgba(255,255,255,0.4)",
                lineHeight: 1.5,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical" as const,
                overflow: "hidden",
              }}
            >
              {video.description}
            </div>
          )}
        </div>
      </div>

      {/* Reflection effect */}
      {isCenter && (
        <div
          style={{
            position: "absolute",
            bottom: "-40px",
            left: 0,
            right: 0,
            height: "40px",
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.04), transparent)",
            transform: "scaleY(-1) translateY(-2px)",
            borderRadius: "0 0 20px 20px",
            opacity: 0.3,
            filter: "blur(2px)",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────
export function VideoSection({ videos }: Props) {
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = videos.length;

  const goTo = useCallback(
    (idx: number) => {
      setCurrent(((idx % total) + total) % total);
    },
    [total],
  );

  const goNext = useCallback(() => goTo(current + 1), [current, goTo]);
  const goPrev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Auto-slide
  useEffect(() => {
    timerRef.current = setInterval(goNext, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [goNext]);

  // Pause on hover
  function pauseAuto() {
    if (timerRef.current) clearInterval(timerRef.current);
  }
  function resumeAuto() {
    timerRef.current = setInterval(goNext, 5000);
  }

  if (total === 0) return null;

  return (
    <>
      {activeVideo && (
        <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
      )}

      <section
        style={{
          background:
            "linear-gradient(180deg, #061610 0%, #030e08 60%, #000 100%)",
          paddingBlock: "80px 100px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
            linear-gradient(rgba(74,222,128,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74,222,128,0.03) 1px, transparent 1px)
          `,
            backgroundSize: "60px 60px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 50%, black 20%, transparent 80%)",
            pointerEvents: "none",
          }}
        />

        {/* Glow center */}
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "800px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(14,61,32,0.5) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="container-content" style={{ position: "relative" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "5px 16px",
                borderRadius: "20px",
                background: "rgba(74,222,128,0.08)",
                border: "1px solid rgba(74,222,128,0.15)",
                marginBottom: "16px",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#4ade80",
                  boxShadow: "0 0 8px rgba(74,222,128,0.8)",
                  animation: "vPulse 2s ease-in-out infinite",
                }}
              />
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "2px",
                  textTransform: "uppercase" as const,
                  color: "#4ade80",
                }}
              >
                Galeri Video
              </span>
            </div>

            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 4vw, 42px)",
                fontWeight: 900,
                color: "#fff",
                letterSpacing: "-1px",
                lineHeight: 1.1,
                marginBottom: "12px",
              }}
            >
              Video BPSDM Kaltim
            </h2>
            <p
              style={{
                fontSize: "14.5px",
                color: "rgba(255,255,255,0.35)",
                maxWidth: "400px",
                margin: "0 auto",
              }}
            >
              Dokumentasi kegiatan dan program pengembangan kompetensi ASN
            </p>
          </div>

          {/* 3D Carousel */}
          <div
            onMouseEnter={pauseAuto}
            onMouseLeave={resumeAuto}
            style={{
              position: "relative",
              height: "340px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              perspective: "1200px",
            }}
          >
            {videos.map((video, i) => {
              const offset = (i - current + total) % total;
              const centered =
                offset === 0
                  ? 0
                  : offset <= total / 2
                    ? offset
                    : offset - total;
              const isCenter = centered === 0;
              if (Math.abs(centered) > 2) return null;
              return (
                <VideoCard3D
                  key={video.id}
                  video={video}
                  index={centered}
                  isCenter={isCenter}
                  onPlay={() => isCenter && setActiveVideo(video)}
                />
              );
            })}
          </div>

          {/* Controls */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px",
              marginTop: "40px",
            }}
          >
            {/* Prev */}
            <button
              onClick={goPrev}
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.15s",
              }}
              className="v-nav-btn"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Dots */}
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              {videos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  style={{
                    width: i === current ? "28px" : "6px",
                    height: "6px",
                    borderRadius: "3px",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    background:
                      i === current ? "#4ade80" : "rgba(255,255,255,0.15)",
                    boxShadow:
                      i === current ? "0 0 10px rgba(74,222,128,0.5)" : "none",
                    transition: "all 0.35s cubic-bezier(.16,1,.3,1)",
                  }}
                />
              ))}
            </div>

            {/* Next */}
            <button
              onClick={goNext}
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: "rgba(74,222,128,0.1)",
                border: "1px solid rgba(74,222,128,0.2)",
                color: "#4ade80",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.15s",
              }}
              className="v-nav-btn"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Counter */}
          <div
            style={{
              textAlign: "center",
              marginTop: "16px",
              fontSize: "12px",
              color: "rgba(255,255,255,0.2)",
              fontWeight: 600,
              letterSpacing: "1px",
            }}
          >
            {String(current + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes vFadeIn  { from{opacity:0}                       to{opacity:1} }
        @keyframes vScaleIn { from{opacity:0;transform:scale(.94)}  to{opacity:1;transform:scale(1)} }
        @keyframes vShimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes vPulse   {
          0%,100%{opacity:1;box-shadow:0 0 8px rgba(74,222,128,0.8)}
          50%    {opacity:.4;box-shadow:0 0 20px rgba(74,222,128,0.2)}
        }
        .v-nav-btn:hover {
          background: rgba(74,222,128,0.15) !important;
          border-color: rgba(74,222,128,0.3) !important;
          color: #4ade80 !important;
          transform: scale(1.05);
        }
        @media (max-width: 768px) {
          .v-3d-carousel { height: 260px !important; }
        }
      `}</style>
    </>
  );
}
