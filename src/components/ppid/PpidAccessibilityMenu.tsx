// src/components/ppid/PpidAccessibilityMenu.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Accessibility,
  Type,
  Contrast,
  Link2,
  PauseCircle,
  MoveHorizontal,
  Volume2,
  Pause,
  Square,
  RotateCcw,
} from "lucide-react";

// ID elemen wrapper (dipasang di ppid/layout.tsx) yang jadi target
// perbesaran teks (zoom), kontras tinggi, garis bawah tautan, dan
// hentikan animasi.
const SCOPE_ID = "ppid-a11y-scope";
const MAIN_CONTENT_ID = "ppid-main-content";

type FontSize = "normal" | "besar" | "lebih-besar" | "terbesar";

const FONT_ZOOM: Record<FontSize, string> = {
  normal: "1",
  besar: "1.15",
  "lebih-besar": "1.3",
  terbesar: "1.5",
};

const FONT_LABEL: Record<FontSize, string> = {
  normal: "Normal",
  besar: "Besar",
  "lebih-besar": "Lebih Besar",
  terbesar: "Terbesar",
};

const STORAGE_KEY = "ppid-a11y-prefs-v2";

type Prefs = {
  fontSize: FontSize;
  contrast: boolean;
  underlineLinks: boolean;
  stopMotion: boolean;
  readingGuide: boolean;
};

const DEFAULT_PREFS: Prefs = {
  fontSize: "normal",
  contrast: false,
  underlineLinks: false,
  stopMotion: false,
  readingGuide: false,
};

function applyPrefs(prefs: Prefs) {
  const scope = document.getElementById(SCOPE_ID);
  if (!scope) return;
  scope.style.zoom = FONT_ZOOM[prefs.fontSize];
  scope.classList.toggle("a11y-contrast", prefs.contrast);
  scope.classList.toggle("a11y-underline-links", prefs.underlineLinks);
  scope.classList.toggle("a11y-stop-motion", prefs.stopMotion);
}

export function PpidAccessibilityMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const guideRef = useRef<HTMLDivElement>(null);
  // Menandai "sedang membaca (bukan sedang dijeda)" tanpa bikin efek di
  // bawah harus depend ke state speaking/paused — dibaca langsung saat
  // pathname berubah.
  const activelyReadingRef = useRef(false);
  const isFirstPathRef = useRef(true);

  // Muat preferensi tersimpan saat pertama kali render di browser.
  useEffect(() => {
    setTtsSupported(
      typeof window !== "undefined" && "speechSynthesis" in window,
    );

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = { ...DEFAULT_PREFS, ...JSON.parse(raw) } as Prefs;
        setPrefs(saved);
        applyPrefs(saved);
      }
    } catch {
      // localStorage tidak tersedia / data korup — abaikan, pakai default.
    }

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Kalau sedang aktif membacakan (bukan dijeda) dan pengguna pindah
  // halaman (klik menu PPID lain), lanjutkan otomatis membacakan
  // halaman yang baru — bukan diam-diam berhenti atau tetap membacakan
  // konten halaman lama yang sudah tidak terlihat.
  useEffect(() => {
    if (isFirstPathRef.current) {
      isFirstPathRef.current = false;
      return;
    }
    if (!activelyReadingRef.current) return;

    window.speechSynthesis.cancel();
    // Beri jeda sedikit supaya konten halaman baru sempat ter-render
    // dulu sebelum diambil teksnya.
    const timer = setTimeout(() => {
      speakMainContent();
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Panduan membaca: garis kuning mengikuti posisi kursor.
  useEffect(() => {
    if (!prefs.readingGuide) return;

    function handleMove(e: MouseEvent) {
      if (guideRef.current) {
        guideRef.current.style.top = `${e.clientY - 18}px`;
      }
    }
    document.addEventListener("mousemove", handleMove);
    return () => document.removeEventListener("mousemove", handleMove);
  }, [prefs.readingGuide]);

  // Tutup panel saat klik di luar area menu.
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function update(partial: Partial<Prefs>) {
    const next = { ...prefs, ...partial };
    setPrefs(next);
    applyPrefs(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Abaikan kalau localStorage penuh/diblokir.
    }
  }

  function handleReset() {
    update(DEFAULT_PREFS);
  }

  // Inti pembacaan teks — dipakai baik oleh tombol "Bacakan Halaman"
  // maupun oleh efek lanjut-otomatis saat pindah halaman.
  function speakText(text: string) {
    if (!ttsSupported || !text) return;
    const synth = window.speechSynthesis;

    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "id-ID";

    const voices = synth.getVoices();
    const idVoice = voices.find((v) => v.lang?.toLowerCase().startsWith("id"));
    if (idVoice) utterance.voice = idVoice;

    utterance.onend = () => {
      activelyReadingRef.current = false;
      setSpeaking(false);
      setPaused(false);
    };
    utterance.onerror = () => {
      activelyReadingRef.current = false;
      setSpeaking(false);
      setPaused(false);
    };

    synth.speak(utterance);
    activelyReadingRef.current = true;
    setSpeaking(true);
    setPaused(false);
  }

  function speakMainContent() {
    const el = document.getElementById(MAIN_CONTENT_ID);
    const text = el?.innerText?.trim() ?? "";
    speakText(text);
  }

  function handleSpeak(selectionOnly: boolean) {
    if (!ttsSupported) return;
    const synth = window.speechSynthesis;

    if (speaking && !paused) {
      synth.pause();
      activelyReadingRef.current = false;
      setPaused(true);
      return;
    }
    if (speaking && paused) {
      synth.resume();
      activelyReadingRef.current = true;
      setPaused(false);
      return;
    }

    if (selectionOnly) {
      const text = window.getSelection()?.toString().trim() ?? "";
      if (!text) {
        alert("Pilih/blok teks di halaman terlebih dahulu, lalu klik tombol ini lagi.");
        return;
      }
      // Bacaan seleksi teks tidak ikut dilanjutkan otomatis saat pindah
      // halaman — teks yang diblok sudah tidak relevan di halaman baru.
      const synthLocal = window.speechSynthesis;
      synthLocal.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "id-ID";
      const voices = synthLocal.getVoices();
      const idVoice = voices.find((v) => v.lang?.toLowerCase().startsWith("id"));
      if (idVoice) utterance.voice = idVoice;
      utterance.onend = () => {
        setSpeaking(false);
        setPaused(false);
      };
      utterance.onerror = () => {
        setSpeaking(false);
        setPaused(false);
      };
      synthLocal.speak(utterance);
      setSpeaking(true);
      setPaused(false);
      return;
    }

    speakMainContent();
  }

  function handleStop() {
    if (!ttsSupported) return;
    window.speechSynthesis.cancel();
    activelyReadingRef.current = false;
    setSpeaking(false);
    setPaused(false);
  }

  const active =
    prefs.fontSize !== "normal" ||
    prefs.contrast ||
    prefs.underlineLinks ||
    prefs.stopMotion ||
    prefs.readingGuide;

  const fontOrder: FontSize[] = ["normal", "besar", "lebih-besar", "terbesar"];

  return (
    <>
      {/* Garis panduan membaca — mengikuti kursor mouse */}
      {prefs.readingGuide && (
        <div
          ref={guideRef}
          aria-hidden="true"
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            height: "36px",
            background: "rgba(250, 204, 21, 0.22)",
            borderTop: "1px solid rgba(250, 204, 21, 0.6)",
            borderBottom: "1px solid rgba(250, 204, 21, 0.6)",
            pointerEvents: "none",
            zIndex: 9998,
          }}
        />
      )}

      <div style={{ position: "relative" }} ref={panelRef}>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Buka menu aksesibilitas"
          aria-expanded={open}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "34px",
            height: "34px",
            borderRadius: "8px",
            background: active ? "rgba(250,204,21,0.18)" : "rgba(255,255,255,0.08)",
            border: `1px solid ${active ? "rgba(250,204,21,0.4)" : "var(--color-forest-800)"}`,
            color: active ? "#facc15" : "rgba(255,255,255,0.82)",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <Accessibility size={16} />
        </button>

        {open && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: 0,
              width: "280px",
              maxHeight: "80vh",
              overflowY: "auto",
              background: "#fff",
              borderRadius: "12px",
              boxShadow: "0 16px 40px rgba(0,0,0,0.18)",
              border: "1px solid rgba(0,0,0,0.07)",
              zIndex: 300,
            }}
          >
            <div
              style={{
                position: "sticky",
                top: 0,
                padding: "12px 16px",
                background:
                  "linear-gradient(90deg, var(--color-forest-900), var(--color-forest-800))",
                color: "#fff",
                fontSize: "12.5px",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: "7px",
              }}
            >
              <Accessibility size={13} />
              Aksesibilitas
            </div>

            <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Ukuran teks */}
              <div>
                <div className="a11y-label">
                  <Type size={12} />
                  Ukuran Teks
                </div>
                <div style={{ display: "flex", gap: "5px" }}>
                  {fontOrder.map((key) => (
                    <button
                      key={key}
                      onClick={() => update({ fontSize: key })}
                      title={FONT_LABEL[key]}
                      style={{
                        flex: 1,
                        padding: "7px 0",
                        borderRadius: "7px",
                        border: `1px solid ${
                          prefs.fontSize === key
                            ? "var(--color-forest-600)"
                            : "var(--color-ink-6)"
                        }`,
                        background:
                          prefs.fontSize === key ? "var(--color-forest-50)" : "#fff",
                        color:
                          prefs.fontSize === key
                            ? "var(--color-forest-700)"
                            : "var(--color-ink-3)",
                        fontWeight: prefs.fontSize === key ? 800 : 600,
                        fontSize:
                          key === "normal"
                            ? "12px"
                            : key === "besar"
                              ? "14px"
                              : key === "lebih-besar"
                                ? "16px"
                                : "18px",
                        cursor: "pointer",
                      }}
                    >
                      A
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggle-toggle tampilan */}
              <ToggleRow
                icon={<Contrast size={12} />}
                label="Kontras Tinggi"
                checked={prefs.contrast}
                onChange={(v) => update({ contrast: v })}
              />
              <ToggleRow
                icon={<Link2 size={12} />}
                label="Garis Bawahi Tautan"
                checked={prefs.underlineLinks}
                onChange={(v) => update({ underlineLinks: v })}
              />
              <ToggleRow
                icon={<PauseCircle size={12} />}
                label="Hentikan Animasi"
                checked={prefs.stopMotion}
                onChange={(v) => update({ stopMotion: v })}
              />
              <ToggleRow
                icon={<MoveHorizontal size={12} />}
                label="Panduan Membaca"
                checked={prefs.readingGuide}
                onChange={(v) => update({ readingGuide: v })}
              />

              {/* Bacakan halaman */}
              {ttsSupported && (
                <div>
                  <div className="a11y-label">
                    <Volume2 size={12} />
                    Bacakan Teks
                  </div>
                  <div style={{ display: "flex", gap: "6px", marginBottom: "6px" }}>
                    <button
                      onClick={() => handleSpeak(false)}
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "5px",
                        padding: "7px 0",
                        borderRadius: "7px",
                        border: "1px solid var(--color-forest-600)",
                        background: "var(--color-forest-600)",
                        color: "#fff",
                        fontSize: "11.5px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {speaking && !paused ? (
                        <>
                          <Pause size={12} /> Jeda
                        </>
                      ) : speaking && paused ? (
                        <>
                          <Volume2 size={12} /> Lanjut
                        </>
                      ) : (
                        <>
                          <Volume2 size={12} /> Bacakan Halaman
                        </>
                      )}
                    </button>
                    {speaking && (
                      <button
                        onClick={handleStop}
                        aria-label="Berhenti membaca"
                        style={{
                          width: "34px",
                          borderRadius: "7px",
                          border: "1px solid var(--color-ink-6)",
                          background: "#fff",
                          color: "var(--color-ink-3)",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Square size={12} />
                      </button>
                    )}
                  </div>
                  {!speaking && (
                    <button
                      onClick={() => handleSpeak(true)}
                      style={{
                        width: "100%",
                        padding: "6px 0",
                        borderRadius: "7px",
                        border: "1px solid var(--color-ink-6)",
                        background: "#fff",
                        color: "var(--color-ink-3)",
                        fontSize: "11px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Bacakan Teks yang Diblok
                    </button>
                  )}
                </div>
              )}

              {active && (
                <button
                  onClick={handleReset}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "5px",
                    padding: "6px 0",
                    borderRadius: "7px",
                    border: "none",
                    background: "transparent",
                    color: "var(--color-ink-4)",
                    fontSize: "11px",
                    fontWeight: 600,
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  <RotateCcw size={11} />
                  Kembalikan ke pengaturan awal
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .a11y-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11.5px;
          font-weight: 700;
          color: var(--color-ink-3);
          margin-bottom: 8px;
        }
      `}</style>
    </>
  );
}

function ToggleRow({
  icon,
  label,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "11.5px",
          fontWeight: 700,
          color: "var(--color-ink-3)",
        }}
      >
        {icon}
        {label}
      </div>
      <button
        onClick={() => onChange(!checked)}
        aria-pressed={checked}
        aria-label={label}
        style={{
          width: "38px",
          height: "21px",
          borderRadius: "20px",
          border: "none",
          padding: "2px",
          background: checked ? "var(--color-forest-600)" : "var(--color-ink-6)",
          cursor: "pointer",
          display: "flex",
          justifyContent: checked ? "flex-end" : "flex-start",
        }}
      >
        <span
          style={{
            width: "17px",
            height: "17px",
            borderRadius: "50%",
            background: "#fff",
            display: "block",
            boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
          }}
        />
      </button>
    </div>
  );
}
