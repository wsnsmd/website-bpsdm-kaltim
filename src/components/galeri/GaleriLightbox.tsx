// src/components/galeri/GaleriLightbox.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import type { GalleryPhoto } from "@/lib/queries/gallery";

type Props = { photos: GalleryPhoto[] };

export function GaleriLightbox({ photos }: Props) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const open = (i: number) => setActiveIdx(i);
  const close = () => setActiveIdx(null);

  const prev = useCallback(() => {
    setActiveIdx((i) =>
      i !== null ? (i - 1 + photos.length) % photos.length : null,
    );
  }, [photos.length]);

  const next = useCallback(() => {
    setActiveIdx((i) => (i !== null ? (i + 1) % photos.length : null));
  }, [photos.length]);

  useEffect(() => {
    if (activeIdx === null) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIdx, prev, next]);

  useEffect(() => {
    document.body.style.overflow = activeIdx !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeIdx]);

  // Bagi ke 4 kolom
  const cols: GalleryPhoto[][] = [[], [], [], []];
  photos.forEach((p, i) => cols[i % 4].push(p));

  return (
    <>
      {/* ── Masonry Grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "8px",
          alignItems: "start",
        }}
      >
        {cols.map((col, ci) => (
          <div
            key={ci}
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
          >
            {col.map((photo, pi) => {
              const globalIdx = pi * 4 + ci;
              // Hitung tinggi berdasarkan width/height asli atau fallback
              const ratio =
                photo.width && photo.height
                  ? photo.height / photo.width
                  : [0.75, 1.2, 0.85, 1.4, 0.67][pi % 5];

              return (
                <div
                  key={photo.id}
                  onClick={() => open(globalIdx)}
                  style={{
                    position: "relative",
                    width: "100%",
                    height: 0,
                    paddingBottom: `${ratio * 100}%`,
                    borderRadius: "8px",
                    overflow: "hidden",
                    cursor: "pointer",
                    background: "var(--color-forest-900)",
                    display: "block",
                  }}
                  className="gallery-photo-item"
                  role="button"
                  tabIndex={0}
                  aria-label={photo.caption ?? `Foto ${globalIdx + 1}`}
                  onKeyDown={(e) => e.key === "Enter" && open(globalIdx)}
                >
                  <img
                    src={photo.thumbUrl ?? photo.imageUrl}
                    alt={photo.caption ?? ""}
                    loading="lazy"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.3s ease",
                      display: "block",
                    }}
                  />
                  {/* Hover overlay */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(0,0,0,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 0,
                      transition: "opacity 0.2s",
                    }}
                    className="gallery-photo-overlay"
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.15)",
                        border: "2px solid rgba(255,255,255,0.6)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ZoomIn size={18} color="#fff" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* ── Lightbox Modal ── */}
      {activeIdx !== null && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.95)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={close}
        >
          {/* Tombol tutup */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
            }}
          >
            <X size={18} />
          </button>

          {/* Counter */}
          <div
            style={{
              position: "absolute",
              top: "24px",
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: "13px",
              color: "rgba(255,255,255,0.6)",
              fontWeight: 600,
              zIndex: 1,
            }}
          >
            {activeIdx + 1} / {photos.length}
          </div>

          {/* Prev */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
            }}
          >
            <ChevronLeft size={22} />
          </button>

          {/* Gambar */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              maxWidth: "90vw",
              maxHeight: "82vh",
            }}
          >
            <img
              src={photos[activeIdx].imageUrl}
              alt={photos[activeIdx].caption ?? ""}
              style={{
                maxWidth: "90vw",
                maxHeight: "82vh",
                objectFit: "contain",
                borderRadius: "8px",
                display: "block",
              }}
            />
            {photos[activeIdx].caption && (
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "20px 16px 12px",
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                  color: "rgba(255,255,255,0.9)",
                  fontSize: "13.5px",
                  borderRadius: "0 0 8px 8px",
                  textAlign: "center",
                }}
              >
                {photos[activeIdx].caption}
              </div>
            )}
          </div>

          {/* Next */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            style={{
              position: "absolute",
              right: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
            }}
          >
            <ChevronRight size={22} />
          </button>

          {/* Thumbnail strip */}
          <div
            style={{
              position: "absolute",
              bottom: "12px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "5px",
              maxWidth: "80vw",
              overflowX: "auto",
              padding: "6px 10px",
              background: "rgba(0,0,0,0.5)",
              borderRadius: "30px",
              zIndex: 1,
            }}
          >
            {photos.map((p, i) => (
              <button
                key={p.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx(i);
                }}
                style={{
                  width: "44px",
                  height: "32px",
                  borderRadius: "5px",
                  overflow: "hidden",
                  flexShrink: 0,
                  border:
                    i === activeIdx
                      ? "2px solid #fff"
                      : "2px solid transparent",
                  cursor: "pointer",
                  padding: 0,
                  background: "none",
                  opacity: i === activeIdx ? 1 : 0.5,
                  transition: "opacity 0.15s, border-color 0.15s",
                }}
              >
                <img
                  src={p.thumbUrl ?? p.imageUrl}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
