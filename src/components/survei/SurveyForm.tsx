// src/components/survei/SurveyForm.tsx
"use client";

import { useState, useTransition } from "react";
import { submitSurvey } from "@/lib/actions/survey";
import { Star, CheckCircle2, Send } from "lucide-react";

const ASPEK = [
  {
    key: "ratingTampilan",
    label: "Tampilan & Desain",
    desc: "Apakah tampilan website menarik dan profesional?",
    color: "#1d4ed8",
  },
  {
    key: "ratingKemudahan",
    label: "Kemudahan Navigasi",
    desc: "Apakah mudah menemukan informasi yang dicari?",
    color: "#7e22ce",
  },
  {
    key: "ratingKonten",
    label: "Kelengkapan Konten",
    desc: "Apakah informasi yang tersedia lengkap dan akurat?",
    color: "#0e7490",
  },
  {
    key: "ratingKecepatan",
    label: "Kecepatan Akses",
    desc: "Apakah website berjalan dengan cepat dan responsif?",
    color: "#d97706",
  },
  {
    key: "ratingLayanan",
    label: "Layanan Online",
    desc: "Apakah fitur layanan online (PPID, unduhan, dll) bermanfaat?",
    color: "#16a34a",
  },
];

const LABELS = [
  "",
  "Sangat Tidak Puas",
  "Tidak Puas",
  "Cukup Puas",
  "Puas",
  "Sangat Puas",
];

function StarRating({
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
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      {/* Bintang */}
      <div style={{ display: "flex", gap: "4px" }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <div
            key={star}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            role="button"
            tabIndex={0}
            aria-label={`${star} bintang — ${LABELS[star]}`}
            onKeyDown={(e) => e.key === "Enter" && onChange(star)}
            style={{
              width: "44px",
              height: "44px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "10px",
              cursor: "pointer",
              background: active >= star ? `${color}12` : "transparent",
              border:
                active >= star
                  ? `1.5px solid ${color}30`
                  : "1.5px solid transparent",
              transition: "all 0.12s",
              userSelect: "none",
            }}
          >
            <Star
              size={28}
              style={{
                color: active >= star ? color : "var(--color-ink-5)",
                fill: active >= star ? color : "transparent",
                transition: "all 0.12s",
                pointerEvents: "none",
              }}
            />
          </div>
        ))}
      </div>

      <input type="hidden" name={name} value={value} />

      {/* Label teks */}
      <div
        style={{
          minWidth: "120px",
          fontSize: "13px",
          fontWeight: active > 0 ? 700 : 400,
          color: active > 0 ? color : "var(--color-ink-5)",
          fontStyle: active > 0 ? "normal" : "italic",
          transition: "all 0.12s",
        }}
      >
        {active > 0 ? LABELS[active] : "Belum dinilai"}
      </div>
    </div>
  );
}

export function SurveyForm() {
  const [isPending, startT] = useTransition();
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<number | null>(null);

  function setRating(key: string, val: number) {
    setRatings((prev) => ({ ...prev, [key]: val }));
  }

  const allFilled = ASPEK.every((a) => (ratings[a.key] ?? 0) > 0);
  const avgRating = allFilled
    ? Object.values(ratings).reduce((s, v) => s + v, 0) / ASPEK.length
    : 0;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!allFilled) {
      setError("Mohon isi semua aspek penilaian.");
      return;
    }
    setError(null);

    const fd = new FormData(e.currentTarget);
    ASPEK.forEach((a) => fd.set(a.key, String(ratings[a.key] ?? 0)));

    startT(async () => {
      const res = await submitSurvey(fd);
      if (res.error) {
        setError(res.error);
        return;
      }
      if (res.success) setSuccess(res.rata ?? avgRating);
    });
  }

  // Sukses
  if (success !== null) {
    const pct = Math.round((success / 5) * 100);
    const label =
      success >= 4.5
        ? "Sangat Puas"
        : success >= 3.5
          ? "Puas"
          : success >= 2.5
            ? "Cukup Puas"
            : "Perlu Peningkatan";

    return (
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          border: "1px solid var(--color-ink-6)",
          padding: "48px 32px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            background: "var(--color-forest-50)",
            border: "2px solid var(--color-forest-200)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CheckCircle2
            size={36}
            style={{ color: "var(--color-forest-600)" }}
          />
        </div>

        <div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "24px",
              fontWeight: 700,
              color: "var(--color-ink)",
              marginBottom: "6px",
            }}
          >
            Terima Kasih!
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "var(--color-ink-3)",
              lineHeight: 1.6,
            }}
          >
            Penilaian Anda telah berhasil dikirim. Masukan Anda sangat berharga
            bagi pengembangan website BPSDM Kaltim.
          </p>
        </div>

        {/* Rating summary */}
        <div
          style={{
            padding: "16px 24px",
            borderRadius: "12px",
            background: "var(--color-forest-50)",
            border: "1px solid var(--color-forest-100)",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "36px",
                fontWeight: 900,
                color: "var(--color-forest-700)",
                lineHeight: 1,
                letterSpacing: "-1px",
              }}
            >
              {success.toFixed(1)}
            </div>
            <div
              style={{
                fontSize: "11.5px",
                color: "var(--color-forest-600)",
                marginTop: "2px",
              }}
            >
              dari 5.0
            </div>
          </div>
          <div>
            <div style={{ display: "flex", gap: "3px", marginBottom: "4px" }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={20}
                  style={{
                    color:
                      s <= Math.round(success)
                        ? "#f59e0b"
                        : "var(--color-ink-6)",
                    fill: s <= Math.round(success) ? "#f59e0b" : "transparent",
                  }}
                />
              ))}
            </div>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "var(--color-forest-700)",
              }}
            >
              {label}
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setSuccess(null);
            setRatings({});
          }}
          style={{
            padding: "9px 20px",
            borderRadius: "8px",
            border: "1px solid var(--color-ink-5)",
            background: "#fff",
            fontSize: "13.5px",
            fontWeight: 600,
            color: "var(--color-ink-2)",
            cursor: "pointer",
          }}
        >
          Isi Survei Lagi
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          border: "1px solid var(--color-ink-6)",
          overflow: "hidden",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--color-ink-7)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "var(--color-forest-50)",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "var(--color-forest-100)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Star size={20} style={{ color: "var(--color-forest-700)" }} />
          </div>
          <div>
            <div
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "var(--color-ink)",
              }}
            >
              Formulir Survei Kepuasan
            </div>
            <div
              style={{
                fontSize: "12.5px",
                color: "var(--color-ink-4)",
                marginTop: "2px",
              }}
            >
              Berikan penilaian Anda untuk setiap aspek berikut
            </div>
          </div>
          {/* Progress */}
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "var(--color-forest-700)",
              }}
            >
              {Object.values(ratings).filter((v) => v > 0).length} /{" "}
              {ASPEK.length}
            </div>
            <div style={{ fontSize: "11px", color: "var(--color-ink-4)" }}>
              aspek diisi
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: "3px", background: "var(--color-ink-7)" }}>
          <div
            style={{
              height: "100%",
              width: `${(Object.values(ratings).filter((v) => v > 0).length / ASPEK.length) * 100}%`,
              background: "var(--color-forest-600)",
              transition: "width 0.3s ease",
            }}
          />
        </div>

        {/* Aspek penilaian */}
        <div style={{ padding: "8px 0" }}>
          {ASPEK.map((aspek, i) => (
            <div
              key={aspek.key}
              style={{
                padding: "18px 24px",
                borderBottom:
                  i < ASPEK.length - 1
                    ? "1px solid var(--color-ink-7)"
                    : "none",
                background: ratings[aspek.key] ? `${aspek.color}05` : "#fff",
                transition: "background 0.15s",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "16px",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "14.5px",
                      fontWeight: 700,
                      color: ratings[aspek.key]
                        ? aspek.color
                        : "var(--color-ink)",
                      marginBottom: "3px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        background: ratings[aspek.key]
                          ? aspek.color
                          : "var(--color-ink-7)",
                        color: ratings[aspek.key]
                          ? "#fff"
                          : "var(--color-ink-4)",
                        fontSize: "11px",
                        fontWeight: 800,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {ratings[aspek.key] ? <CheckCircle2 size={13} /> : i + 1}
                    </span>
                    {aspek.label}
                  </div>
                  <div
                    style={{ fontSize: "13px", color: "var(--color-ink-4)" }}
                  >
                    {aspek.desc}
                  </div>
                </div>
                <StarRating
                  name={aspek.key}
                  value={ratings[aspek.key] ?? 0}
                  onChange={(v) => setRating(aspek.key, v)}
                  color={aspek.color}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Komentar & Saran */}
        <div
          style={{
            padding: "20px 24px",
            borderTop: "1px solid var(--color-ink-7)",
            background: "var(--color-ink-8)",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <div className="admin-form-group" style={{ margin: 0 }}>
            <label
              style={{
                display: "block",
                fontSize: "13.5px",
                fontWeight: 700,
                color: "var(--color-ink-2)",
                marginBottom: "6px",
              }}
            >
              Komentar / Ulasan
              <span
                style={{
                  fontWeight: 400,
                  color: "var(--color-ink-4)",
                  marginLeft: "6px",
                }}
              >
                (opsional)
              </span>
            </label>
            <textarea
              name="komentar"
              rows={3}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid var(--color-ink-5)",
                fontSize: "13.5px",
                color: "var(--color-ink)",
                outline: "none",
                background: "#fff",
                resize: "vertical",
                lineHeight: 1.6,
                boxSizing: "border-box",
              }}
              placeholder="Ceritakan pengalaman Anda menggunakan website ini..."
            />
          </div>

          <div className="admin-form-group" style={{ margin: 0 }}>
            <label
              style={{
                display: "block",
                fontSize: "13.5px",
                fontWeight: 700,
                color: "var(--color-ink-2)",
                marginBottom: "6px",
              }}
            >
              Saran Perbaikan
              <span
                style={{
                  fontWeight: 400,
                  color: "var(--color-ink-4)",
                  marginLeft: "6px",
                }}
              >
                (opsional)
              </span>
            </label>
            <textarea
              name="saran"
              rows={3}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid var(--color-ink-5)",
                fontSize: "13.5px",
                color: "var(--color-ink)",
                outline: "none",
                background: "#fff",
                resize: "vertical",
                lineHeight: 1.6,
                boxSizing: "border-box",
              }}
              placeholder="Apa yang perlu kami perbaiki atau tambahkan?"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              padding: "12px 24px",
              background: "#fef2f2",
              borderTop: "1px solid #fecaca",
              color: "#dc2626",
              fontSize: "13.5px",
            }}
          >
            {error}
          </div>
        )}

        {/* Submit */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid var(--color-ink-7)",
          }}
        >
          <button
            type="submit"
            disabled={isPending || !allFilled}
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: "10px",
              background: allFilled
                ? "var(--color-forest-700)"
                : "var(--color-ink-5)",
              color: "#fff",
              fontSize: "14.5px",
              fontWeight: 700,
              border: "none",
              cursor: allFilled && !isPending ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "all 0.15s",
            }}
          >
            <Send size={17} />
            {isPending ? "Mengirim..." : "Kirim Penilaian"}
          </button>
          {!allFilled && (
            <p
              style={{
                marginTop: "8px",
                textAlign: "center",
                fontSize: "12.5px",
                color: "var(--color-ink-4)",
              }}
            >
              Isi semua {ASPEK.length} aspek penilaian untuk melanjutkan
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
