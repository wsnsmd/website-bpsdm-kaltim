// src/components/home/AnnouncementBar.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell, ArrowRight, ChevronUp, ChevronDown } from "lucide-react";
import type { AnnouncementItem } from "@/lib/queries/announcements";

type Props = {
  announcements: AnnouncementItem[];
};

const FALLBACK = [
  {
    id: 1,
    title: "Selamat datang di portal BPSDM Kaltim",
    url: "/",
    type: "info",
  },
];

const INTERVAL = 4000; // ganti setiap 4 detik

export function AnnouncementBar({ announcements }: Props) {
  const items = announcements.length > 0 ? announcements : FALLBACK;
  const [current, setCurrent] = useState(0);
  const [animDir, setAnimDir] = useState<"up" | "down">("up");
  const [visible, setVisible] = useState(true);

  function goTo(next: number, dir: "up" | "down") {
    setVisible(false);
    setAnimDir(dir);
    setTimeout(() => {
      setCurrent(next);
      setVisible(true);
    }, 220);
  }

  function goNext() {
    goTo((current + 1) % items.length, "up");
  }

  function goPrev() {
    goTo((current - 1 + items.length) % items.length, "down");
  }

  // Auto-rotate
  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(goNext, INTERVAL);
    return () => clearInterval(timer);
  }, [current, items.length]);

  const item = items[current];

  return (
    <>
      <style>{`
        @keyframes slideUpIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDownIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ann-item-enter-up {
          animation: slideUpIn 0.22s ease forwards;
        }
        .ann-item-enter-down {
          animation: slideDownIn 0.22s ease forwards;
        }
      `}</style>

      <div className="ann-bar-root">
        <div
          className="container-content"
          style={{
            display: "flex",
            alignItems: "center",
            height: "46px",
            gap: "12px",
          }}
        >
          {/* Label */}
          <span className="ann-bar-label" style={{ flexShrink: 0 }}>
            <Bell size={13} />
            Pengumuman
          </span>

          <div className="ann-bar-sep" />

          {/* Animasi teks pengumuman */}
          <div
            style={{
              flex: 1,
              overflow: "hidden",
              minWidth: 0,
              height: "46px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {visible && (
              <div
                key={current}
                className={
                  animDir === "up" ? "ann-item-enter-up" : "ann-item-enter-down"
                }
                style={{ width: "100%" }}
              >
                <Link
                  href={item.url ?? "/pengumuman"}
                  className="ann-bar-link"
                  style={{
                    display: "block",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontSize: "13px",
                  }}
                >
                  {item.title}
                </Link>
              </div>
            )}
          </div>

          {/* Counter */}
          {items.length > 1 && (
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "var(--color-ink-4)",
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              {current + 1} / {items.length}
            </span>
          )}

          {/* Navigasi atas/bawah */}
          {items.length > 1 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1px",
                flexShrink: 0,
              }}
            >
              <button
                onClick={goPrev}
                style={{
                  width: "18px",
                  height: "18px",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-ink-4)",
                  padding: 0,
                  borderRadius: "3px",
                  transition: "color 0.12s",
                }}
                aria-label="Sebelumnya"
              >
                <ChevronUp size={13} />
              </button>
              <button
                onClick={goNext}
                style={{
                  width: "18px",
                  height: "18px",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-ink-4)",
                  padding: 0,
                  borderRadius: "3px",
                  transition: "color 0.12s",
                }}
                aria-label="Berikutnya"
              >
                <ChevronDown size={13} />
              </button>
            </div>
          )}

          {/* Dots indicator */}
          {items.length > 1 && items.length <= 8 && (
            <div
              style={{
                display: "flex",
                gap: "4px",
                flexShrink: 0,
              }}
            >
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i, i > current ? "up" : "down")}
                  style={{
                    width: i === current ? "16px" : "6px",
                    height: "6px",
                    borderRadius: "3px",
                    border: "none",
                    background:
                      i === current
                        ? "var(--color-forest-700)"
                        : "var(--color-ink-5)",
                    cursor: "pointer",
                    padding: 0,
                    transition: "all 0.2s",
                    flexShrink: 0,
                  }}
                  aria-label={`Pengumuman ${i + 1}`}
                />
              ))}
            </div>
          )}

          <div className="ann-bar-sep" />

          {/* Link semua */}
          <Link
            href="/pengumuman"
            className="ann-bar-all"
            style={{ flexShrink: 0 }}
          >
            Semua
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </>
  );
}
