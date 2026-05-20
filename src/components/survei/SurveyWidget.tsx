// src/components/survei/SurveyWidget.tsx
"use client";

import { useState, useTransition, useEffect } from "react";
import { submitSurvey } from "@/lib/actions/survey";
import {
  Star,
  X,
  Send,
  CheckCircle2,
  ChevronUp,
  MessageSquarePlus,
} from "lucide-react";

const STORAGE_KEY = "bpsdm_survey_done";

const ASPEK = [
  { key: "ratingTampilan", label: "Tampilan", color: "#1d4ed8" },
  { key: "ratingKemudahan", label: "Navigasi", color: "#7e22ce" },
  { key: "ratingKonten", label: "Konten", color: "#0e7490" },
  { key: "ratingKecepatan", label: "Kecepatan", color: "#d97706" },
  { key: "ratingLayanan", label: "Layanan", color: "#16a34a" },
];

const LABELS = [
  "",
  "Sangat Tidak Puas",
  "Tidak Puas",
  "Cukup",
  "Puas",
  "Sangat Puas",
];

function MiniStars({
  name,
  value,
  onChange,
  color,
}: {
  name: string;
  value: number;
  onChange: (v: number) => void;
  color: string;
}) {
  const [hover, setHover] = useState(0);
  const active = hover || value;

  return (
    <div style={{ display: "flex", gap: "3px" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <div
          key={star}
          role="button"
          tabIndex={0}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onKeyDown={(e) => e.key === "Enter" && onChange(star)}
          style={{
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "8px",
            cursor: "pointer",
            background: active >= star ? `${color}15` : "var(--color-ink-8)",
            border: `1.5px solid ${active >= star ? color + "40" : "var(--color-ink-6)"}`,
            transition: "all 0.1s",
            userSelect: "none",
          }}
        >
          <Star
            size={18}
            style={{
              color: active >= star ? color : "var(--color-ink-5)",
              fill: active >= star ? color : "transparent",
              pointerEvents: "none",
              transition: "all 0.1s",
            }}
          />
        </div>
      ))}
      <input type="hidden" name={name} value={value} />
    </div>
  );
}

type Step = "closed" | "trigger" | "form" | "done";

export function SurveyWidget() {
  const [step, setStep] = useState<Step>("trigger");
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [komentar, setKomentar] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startT] = useTransition();
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Cek localStorage setelah mount (hindari SSR mismatch)
  useEffect(() => {
    setMounted(true);
    const done = localStorage.getItem(STORAGE_KEY);
    if (done) setDismissed(true);
  }, []);

  // Jangan render sebelum mount (SSR safe)
  if (!mounted) return null;
  if (dismissed) return null;

  const allFilled = ASPEK.every((a) => (ratings[a.key] ?? 0) > 0);
  const filledCount = ASPEK.filter((a) => (ratings[a.key] ?? 0) > 0).length;

  function setRating(key: string, val: number) {
    setRatings((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!allFilled) {
      setError("Mohon isi semua aspek.");
      return;
    }
    setError(null);
    const fd = new FormData(e.currentTarget);
    ASPEK.forEach((a) => fd.set(a.key, String(ratings[a.key] ?? 0)));
    fd.set("komentar", komentar);
    startT(async () => {
      const res = await submitSurvey(fd);
      if (res.error) {
        setError(res.error);
        return;
      }
      // ← Simpan ke localStorage agar tidak muncul lagi
      localStorage.setItem(STORAGE_KEY, new Date().toISOString());
      setStep("done");
    });
  }

  function handleDismiss() {
    if (step === "done") {
      localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    }
    setDismissed(true);
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "32px",
        right: "82px",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "8px",
      }}
    >
      {/* ── Panel widget ── */}
      {step === "form" && (
        <div
          style={{
            width: "340px",
            background: "#fff",
            borderRadius: "16px",
            border: "1px solid var(--color-ink-5)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.1)",
            overflow: "hidden",
            animation: "slideUpFade 0.25s ease",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "var(--color-forest-900)",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              position: "relative",
            }}
          >
            {/* Dot texture */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
                backgroundSize: "16px 16px",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                position: "relative",
              }}
            >
              <Star size={16} color="#fbbf24" fill="#fbbf24" />
            </div>
            <div style={{ flex: 1, position: "relative" }}>
              <div
                style={{ fontSize: "13.5px", fontWeight: 700, color: "#fff" }}
              >
                Survei Kepuasan Website
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.5)",
                  marginTop: "1px",
                }}
              >
                {filledCount}/{ASPEK.length} aspek diisi
              </div>
            </div>
            {/* Progress pill */}
            <div
              style={{
                position: "relative",
                padding: "2px 8px",
                borderRadius: "20px",
                background: "rgba(255,255,255,0.1)",
                fontSize: "10.5px",
                fontWeight: 700,
                color:
                  filledCount === ASPEK.length
                    ? "#4ade80"
                    : "rgba(255,255,255,0.5)",
                marginRight: "4px",
              }}
            >
              {Math.round((filledCount / ASPEK.length) * 100)}%
            </div>
            <button
              onClick={() => setStep("trigger")}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                color: "rgba(255,255,255,0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "26px",
                height: "26px",
                position: "relative",
                flexShrink: 0,
              }}
            >
              <ChevronUp size={14} />
            </button>
          </div>

          {/* Progress bar */}
          <div style={{ height: "2px", background: "var(--color-ink-7)" }}>
            <div
              style={{
                height: "100%",
                width: `${(filledCount / ASPEK.length) * 100}%`,
                background: "var(--color-forest-500)",
                transition: "width 0.3s ease",
              }}
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div
              style={{
                padding: "12px 14px",
                maxHeight: "380px",
                overflowY: "auto",
              }}
            >
              {/* Aspek bintang */}
              {ASPEK.map((aspek, i) => (
                <div
                  key={aspek.key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "8px",
                    padding: "8px 0",
                    borderBottom:
                      i < ASPEK.length - 1
                        ? "1px solid var(--color-ink-7)"
                        : "none",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "12.5px",
                        fontWeight: 700,
                        color: ratings[aspek.key]
                          ? aspek.color
                          : "var(--color-ink-2)",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      {ratings[aspek.key] ? (
                        <CheckCircle2
                          size={12}
                          style={{ color: aspek.color, flexShrink: 0 }}
                        />
                      ) : (
                        <span
                          style={{
                            width: "14px",
                            height: "14px",
                            borderRadius: "50%",
                            background: "var(--color-ink-7)",
                            fontSize: "8px",
                            fontWeight: 800,
                            color: "var(--color-ink-4)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {i + 1}
                        </span>
                      )}
                      {aspek.label}
                    </div>
                    {ratings[aspek.key] > 0 && (
                      <div
                        style={{
                          fontSize: "10.5px",
                          color: aspek.color,
                          marginTop: "1px",
                          paddingLeft: "19px",
                        }}
                      >
                        {LABELS[ratings[aspek.key]]}
                      </div>
                    )}
                  </div>
                  <MiniStars
                    name={aspek.key}
                    value={ratings[aspek.key] ?? 0}
                    onChange={(v) => setRating(aspek.key, v)}
                    color={aspek.color}
                  />
                </div>
              ))}

              {/* Komentar singkat */}
              <div style={{ marginTop: "10px" }}>
                <textarea
                  value={komentar}
                  onChange={(e) => setKomentar(e.target.value)}
                  name="komentar"
                  rows={2}
                  placeholder="Komentar singkat... (opsional)"
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: "8px",
                    border: "1px solid var(--color-ink-5)",
                    fontSize: "12.5px",
                    color: "var(--color-ink)",
                    outline: "none",
                    resize: "none",
                    background: "var(--color-ink-8)",
                    lineHeight: 1.5,
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  padding: "8px 14px",
                  background: "#fef2f2",
                  borderTop: "1px solid #fecaca",
                  color: "#dc2626",
                  fontSize: "12px",
                }}
              >
                {error}
              </div>
            )}

            {/* Footer */}
            <div
              style={{
                padding: "10px 14px",
                borderTop: "1px solid var(--color-ink-7)",
                display: "flex",
                gap: "8px",
                alignItems: "center",
              }}
            >
              <button
                type="button"
                onClick={handleDismiss}
                style={{
                  padding: "7px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--color-ink-5)",
                  background: "#fff",
                  fontSize: "12px",
                  color: "var(--color-ink-4)",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Tutup
              </button>
              <button
                type="submit"
                disabled={isPending || !allFilled}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "8px",
                  background: allFilled
                    ? "var(--color-forest-700)"
                    : "var(--color-ink-5)",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 700,
                  border: "none",
                  cursor: allFilled && !isPending ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  transition: "all 0.15s",
                }}
              >
                <Send size={13} />
                {isPending ? "Mengirim..." : "Kirim"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Done state ── */}
      {step === "done" && (
        <div
          style={{
            width: "300px",
            background: "#fff",
            borderRadius: "16px",
            border: "1px solid var(--color-forest-200)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            padding: "24px 20px",
            textAlign: "center",
            animation: "slideUpFade 0.25s ease",
          }}
        >
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              background: "var(--color-forest-50)",
              border: "2px solid var(--color-forest-200)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
            }}
          >
            <CheckCircle2
              size={28}
              style={{ color: "var(--color-forest-600)" }}
            />
          </div>
          <div
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "var(--color-ink)",
              marginBottom: "6px",
            }}
          >
            Terima Kasih! 🎉
          </div>
          <div
            style={{
              fontSize: "12.5px",
              color: "var(--color-ink-4)",
              lineHeight: 1.6,
              marginBottom: "16px",
            }}
          >
            Penilaian Anda telah kami terima dan akan digunakan untuk
            meningkatkan layanan website.
          </div>
          <button
            onClick={handleDismiss}
            style={{
              padding: "7px 20px",
              borderRadius: "8px",
              border: "1px solid var(--color-ink-5)",
              background: "#fff",
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--color-ink-2)",
              cursor: "pointer",
            }}
          >
            Tutup
          </button>
        </div>
      )}

      {/* ── Trigger button ── */}
      {(step === "trigger" || step === "form") && (
        <button
          onClick={() => setStep(step === "form" ? "trigger" : "form")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "11px 18px",
            borderRadius: "30px",
            background: "var(--color-forest-900)",
            border: "1px solid var(--color-forest-700)",
            color: "#fff",
            fontSize: "13.5px",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(7,26,13,0.35)",
            transition: "all 0.15s",
            whiteSpace: "nowrap",
          }}
          className="survey-trigger-btn"
        >
          {step === "form" ? (
            <>
              <ChevronUp size={16} />
              Sembunyikan
            </>
          ) : (
            <>
              <MessageSquarePlus size={16} style={{ color: "#fbbf24" }} />
              Beri Penilaian
              <span
                style={{
                  padding: "1px 7px",
                  borderRadius: "20px",
                  background: "rgba(251,191,36,0.15)",
                  border: "1px solid rgba(251,191,36,0.3)",
                  fontSize: "10.5px",
                  fontWeight: 700,
                  color: "#fbbf24",
                }}
              >
                2 menit
              </span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
