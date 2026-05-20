// src/components/ppid/PpidTrackClient.tsx
"use client";

import { useState, useTransition } from "react";
import {
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
} from "lucide-react";

const STATUS_CONFIG = {
  diterima: { label: "Diterima", color: "#1d4ed8", bg: "#eff6ff", icon: Clock },
  diproses: { label: "Diproses", color: "#d97706", bg: "#fffbeb", icon: Clock },
  selesai: {
    label: "Selesai",
    color: "#16a34a",
    bg: "#f0fdf4",
    icon: CheckCircle2,
  },
  ditolak: { label: "Ditolak", color: "#dc2626", bg: "#fef2f2", icon: XCircle },
  banding: {
    label: "Banding",
    color: "#7e22ce",
    bg: "#fdf4ff",
    icon: AlertCircle,
  },
};

type TrackResult = {
  nomorPermohonan: string;
  namaPemohon: string;
  subjekInfo: string;
  status: keyof typeof STATUS_CONFIG;
  catatan: string | null;
  createdAt: string;
  selesaiAt: string | null;
  jawabanUrl: string | null;
};

export function PpidTrackClient() {
  const [nomor, setNomor] = useState("");
  const [result, setResult] = useState<TrackResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    if (!nomor.trim()) return;
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch(
        `/api/ppid/track?nomor=${encodeURIComponent(nomor.trim())}`,
      );
      if (!res.ok) {
        setError("Nomor permohonan tidak ditemukan.");
        return;
      }
      const data = await res.json();
      setResult(data);
    } catch {
      setError("Gagal mengambil data. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form
        onSubmit={handleTrack}
        style={{ display: "flex", gap: "8px", marginBottom: "16px" }}
      >
        <input
          type="text"
          value={nomor}
          onChange={(e) => setNomor(e.target.value)}
          placeholder="Contoh: PPID-202501-1234"
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: "9px",
            border: "1px solid var(--color-ink-5)",
            fontSize: "14px",
            color: "var(--color-ink)",
            outline: "none",
            fontFamily: "monospace",
            letterSpacing: "0.5px",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "10px 18px",
            borderRadius: "9px",
            background: "var(--color-forest-700)",
            color: "#fff",
            fontSize: "13.5px",
            fontWeight: 700,
            border: "none",
            cursor: loading ? "wait" : "pointer",
          }}
        >
          <Search size={15} />
          {loading ? "Mencari..." : "Cek"}
        </button>
      </form>

      {error && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: "8px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#dc2626",
            fontSize: "13px",
          }}
        >
          {error}
        </div>
      )}

      {result &&
        (() => {
          const cfg = STATUS_CONFIG[result.status];
          const Icon = cfg.icon;
          return (
            <div
              style={{
                padding: "16px",
                borderRadius: "12px",
                background: cfg.bg,
                border: `1px solid ${cfg.color}30`,
              }}
            >
              {/* Status badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "12px",
                }}
              >
                <Icon size={18} style={{ color: cfg.color }} />
                <span
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: cfg.color,
                  }}
                >
                  {cfg.label}
                </span>
                <span
                  style={{
                    marginLeft: "auto",
                    fontFamily: "monospace",
                    fontSize: "12px",
                    color: "var(--color-ink-4)",
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                  }}
                >
                  {result.nomorPermohonan}
                </span>
              </div>

              <div
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <div style={{ fontSize: "13px", color: "var(--color-ink-2)" }}>
                  <strong>Pemohon:</strong> {result.namaPemohon}
                </div>
                <div style={{ fontSize: "13px", color: "var(--color-ink-2)" }}>
                  <strong>Subjek:</strong> {result.subjekInfo}
                </div>
                <div style={{ fontSize: "12px", color: "var(--color-ink-4)" }}>
                  Diterima:{" "}
                  {new Date(result.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
                {result.catatan && (
                  <div
                    style={{
                      marginTop: "8px",
                      padding: "10px 12px",
                      borderRadius: "7px",
                      background: "rgba(255,255,255,0.7)",
                      fontSize: "13px",
                      color: "var(--color-ink-2)",
                      lineHeight: 1.55,
                    }}
                  >
                    <strong>Catatan:</strong> {result.catatan}
                  </div>
                )}
                {result.jawabanUrl && (
                  <a
                    href={result.jawabanUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      marginTop: "8px",
                      padding: "8px 14px",
                      borderRadius: "8px",
                      background: cfg.color,
                      color: "#fff",
                      fontSize: "13px",
                      fontWeight: 700,
                      textDecoration: "none",
                      width: "fit-content",
                    }}
                  >
                    Unduh Jawaban
                  </a>
                )}
              </div>
            </div>
          );
        })()}
    </div>
  );
}
