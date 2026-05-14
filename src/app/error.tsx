// src/app/error.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: Props) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="not-found-root">
      <div className="not-found-pattern" aria-hidden="true" />

      <div className="not-found-inner">
        <div className="not-found-code" aria-hidden="true">
          500
        </div>

        <div className="not-found-icon">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <h1 className="not-found-title">Terjadi Kesalahan</h1>
        <p className="not-found-desc">
          Sistem mengalami gangguan sementara. Tim teknis kami sedang menangani
          masalah ini. Silakan coba beberapa saat lagi.
        </p>

        {/* Error digest untuk debugging */}
        {error.digest && (
          <div
            style={{
              marginBottom: "24px",
              padding: "8px 16px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "8px",
              fontSize: "11px",
              color: "rgba(255,255,255,0.35)",
              fontFamily: "monospace",
            }}
          >
            Error ID: {error.digest}
          </div>
        )}

        <div className="not-found-actions">
          <button
            onClick={reset}
            className="btn btn-gold not-found-btn-primary"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            Coba Lagi
          </button>
          <Link href="/" className="btn btn-outline not-found-btn-outline">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
