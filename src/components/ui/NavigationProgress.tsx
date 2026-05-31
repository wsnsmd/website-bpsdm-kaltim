// src/components/ui/NavigationProgress.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// ─── Warna ambil dari CSS variable tema BPSDM ───────────────────────────────
const BAR_COLOR = "var(--color-gold-400, #ffc333)";
const SHADOW_COLOR = "rgba(255, 195, 51, 0.6)";

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const incrementRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevPathRef = useRef<string>("");

  const currentPath = pathname + searchParams.toString();

  // ── Mulai progress bar ──────────────────────────────────────────────────
  const start = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (incrementRef.current) clearInterval(incrementRef.current);

    setVisible(true);
    setProgress(0);

    // Naik cepat ke 20% dulu
    requestAnimationFrame(() => setProgress(20));

    // Increment lambat sampai 85% (simulasi loading)
    let current = 20;
    incrementRef.current = setInterval(() => {
      if (current >= 85) {
        if (incrementRef.current) clearInterval(incrementRef.current);
        return;
      }
      // Semakin lambat seiring progress naik
      const step = current < 50 ? 8 : current < 70 ? 3 : 1;
      current = Math.min(current + step, 85);
      setProgress(current);
    }, 200);
  };

  // ── Selesai & hilang ────────────────────────────────────────────────────
  const finish = () => {
    if (incrementRef.current) clearInterval(incrementRef.current);

    setProgress(100);

    timerRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 400);
  };

  useEffect(() => {
    // Trigger saat path berubah
    if (prevPathRef.current && prevPathRef.current !== currentPath) {
      finish();
    }
    prevPathRef.current = currentPath;
  }, [currentPath]);

  // Intercept link clicks untuk memulai progress
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as Element).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Hanya internal links, bukan anchor/external
      const isInternal =
        href.startsWith("/") &&
        !href.startsWith("//") &&
        !target.getAttribute("target");

      if (isInternal && href !== pathname) {
        start();
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [pathname]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (incrementRef.current) clearInterval(incrementRef.current);
    };
  }, []);

  if (!visible && progress === 0) return null;

  return (
    <>
      {/* Progress Bar */}
      <div
        role="progressbar"
        aria-label="Memuat halaman"
        aria-valuenow={progress}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          height: "3px",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: BAR_COLOR,
            boxShadow: `0 0 10px ${SHADOW_COLOR}, 0 0 5px ${SHADOW_COLOR}`,
            borderRadius: "0 3px 3px 0",
            opacity: visible ? 1 : 0,
            // Longhand semua — jangan campur shorthand "transition" dengan "transitionProperty"
            transitionProperty: progress === 0 ? "none" : "width, opacity",
            transitionDuration: progress === 100 ? "0.2s, 0.3s" : "0.4s, 0.15s",
            transitionTimingFunction:
              progress === 100
                ? "ease-out, ease"
                : "cubic-bezier(0.25, 1, 0.5, 1), ease",
          }}
        />

        {/* Shimmer ujung kanan */}
        {visible && progress > 0 && progress < 100 && (
          <div
            style={{
              position: "absolute",
              top: 0,
              right: `${100 - progress}%`,
              width: "80px",
              height: "100%",
              background: `linear-gradient(to right, transparent, ${SHADOW_COLOR}, transparent)`,
              transform: "translateX(50%)",
              animation: "nprogress-shimmer 1.2s ease infinite",
            }}
          />
        )}
      </div>

      {/* Spinner kecil di pojok kanan atas */}
      {visible && progress < 100 && (
        <div
          aria-hidden
          style={{
            position: "fixed",
            top: "12px",
            right: "16px",
            zIndex: 9999,
            width: "18px",
            height: "18px",
            pointerEvents: "none",
          }}
        >
          <svg
            viewBox="0 0 18 18"
            style={{ animation: "nprogress-spin 0.7s linear infinite" }}
          >
            <circle
              cx="9"
              cy="9"
              r="7"
              fill="none"
              stroke={BAR_COLOR}
              strokeWidth="2.5"
              strokeDasharray="22 22"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}

      <style>{`
        @keyframes nprogress-shimmer {
          0%   { opacity: 0.4; transform: translateX(50%) scaleX(0.5); }
          50%  { opacity: 1;   transform: translateX(50%) scaleX(1); }
          100% { opacity: 0.4; transform: translateX(50%) scaleX(0.5); }
        }
        @keyframes nprogress-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
