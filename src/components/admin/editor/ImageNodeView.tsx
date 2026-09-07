// src/components/admin/editor/ImageNodeView.tsx
"use client";

import { NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";

const SIZE_OPTIONS = ["25", "50", "75", "100"] as const;
const ALIGN_OPTIONS = [
  { key: "left", label: "Kiri" },
  { key: "center", label: "Tengah" },
  { key: "right", label: "Kanan" },
  { key: "justify", label: "Justify" },
] as const;

function wrapperAlign(align: string): React.CSSProperties["textAlign"] {
  if (align === "left") return "left";
  if (align === "right") return "right";
  return "center"; // center & justify (justify = lebar penuh, tetap center secara block)
}

// NodeView TipTap: dirender di dalam area editor (interaktif), TERPISAH
// dari renderHTML di CustomImage.ts yang dipakai untuk hasil HTML
// tersimpan/tampil di halaman publik. Kontrol ukuran & perataan ditempel
// langsung pada node ini lewat prop `updateAttributes` bawaan NodeView —
// ini API resmi TipTap untuk update atribut node yang SEDANG di-render,
// jadi tidak bergantung sama sekali pada "seleksi aktif" editor secara
// global seperti pendekatan toolbar terpisah sebelumnya (yang berulang
// kali gagal).
export function ImageNodeView({ node, updateAttributes, selected }: NodeViewProps) {
  const src = node.attrs.src as string;
  const alt = (node.attrs.alt as string) ?? "";
  const width = (node.attrs.width as string) ?? "100";
  const align = (node.attrs.align as string) ?? "center";

  return (
    <NodeViewWrapper
      className="editor-image-node-view"
      style={{ textAlign: wrapperAlign(align) }}
    >
      <div
        style={{
          display: "inline-block",
          position: "relative",
          width: `${width}%`,
          maxWidth: "100%",
          verticalAlign: "top",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- konten
            di dalam NodeView editor, ukuran & src dinamis dari HTML yang
            diupload user; sama seperti pola di ImageUpload.tsx */}
        <img
          src={src}
          alt={alt}
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            borderRadius: "6px",
            outline: selected ? "2px solid var(--color-forest-600)" : "none",
            outlineOffset: "2px",
          }}
        />

        {selected && (
          <div
            contentEditable={false}
            className="editor-image-toolbar"
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
              padding: "6px 8px",
              background: "#fff",
              border: "1px solid var(--color-ink-6)",
              borderRadius: "8px",
              boxShadow: "0 6px 18px rgba(0,0,0,0.14)",
              zIndex: 20,
              whiteSpace: "nowrap",
            }}
          >
            {SIZE_OPTIONS.map((w) => (
              <button
                key={w}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  updateAttributes({ width: w });
                }}
                style={{
                  padding: "3px 8px",
                  fontSize: "11px",
                  fontWeight: 700,
                  borderRadius: "5px",
                  border: "1px solid var(--color-ink-6)",
                  background: width === w ? "var(--color-forest-700)" : "#fff",
                  color: width === w ? "#fff" : "var(--color-ink-3)",
                  cursor: "pointer",
                }}
              >
                {w}%
              </button>
            ))}

            <div
              style={{
                width: "1px",
                background: "var(--color-ink-6)",
                margin: "2px 2px",
              }}
            />

            {ALIGN_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  updateAttributes({ align: opt.key });
                }}
                style={{
                  padding: "3px 8px",
                  fontSize: "11px",
                  fontWeight: 700,
                  borderRadius: "5px",
                  border: "1px solid var(--color-ink-6)",
                  background: align === opt.key ? "var(--color-forest-700)" : "#fff",
                  color: align === opt.key ? "#fff" : "var(--color-ink-3)",
                  cursor: "pointer",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
}
