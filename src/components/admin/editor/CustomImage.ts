// src/components/admin/editor/CustomImage.ts
import Image from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ImageNodeView } from "./ImageNodeView";

export type ImageAlign = "left" | "center" | "right" | "justify";

function marginForAlign(align: string): string {
  switch (align) {
    case "left":
      return "margin:4px auto 4px 0;";
    case "right":
      return "margin:4px 0 4px auto;";
    case "justify":
      // "Justify" untuk gambar tunggal secara praktis berarti melebar
      // penuh — text-align:justify tidak berlaku untuk elemen block
      // tunggal seperti gambar.
      return "margin:4px 0;";
    case "center":
    default:
      return "margin:4px auto;";
  }
}

function parseWidthFromStyle(style: string | null): string {
  const match = style?.match(/width:\s*(\d{1,3})%/);
  return match ? match[1] : "100";
}

function parseAlignFromStyle(style: string | null): ImageAlign {
  if (!style) return "center";
  if (style.includes("margin-right:auto") && style.includes("margin-left:0"))
    return "left";
  if (style.includes("margin-left:auto") && style.includes("margin-right:0"))
    return "right";
  if (/margin:\s*4px\s+0\s*;/.test(style)) return "justify";
  return "center";
}

// Extend Image bawaan TipTap supaya tiap gambar bisa punya ukuran (25/50/
// 75/100%) dan perataan (kiri/tengah/kanan/justify) sendiri-sendiri.
// Disimpan sebagai inline style langsung di tag <img> — jadi begitu HTML
// konten ditampilkan di halaman publik (dangerouslySetInnerHTML), gaya ini
// otomatis ikut tanpa perlu ubah apa pun di sisi tampilan publik.
export const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "100",
        parseHTML: (element) =>
          element.getAttribute("data-width") ||
          parseWidthFromStyle(element.getAttribute("style")),
        renderHTML: () => ({}),
      },
      align: {
        default: "center",
        parseHTML: (element) =>
          (element.getAttribute("data-align") as ImageAlign) ||
          parseAlignFromStyle(element.getAttribute("style")),
        renderHTML: () => ({}),
      },
    };
  },

  renderHTML({ node, HTMLAttributes }) {
    // BUG LAMA: baca dari HTMLAttributes.width/align — tapi attribute-level
    // renderHTML untuk width/align sengaja return {} (lihat addAttributes
    // di atas), jadi HTMLAttributes.width SELALU undefined dan hasil HTML
    // tersimpan selalu default 100%/tengah berapa pun yang diatur di
    // editor. NodeView di editor tampak benar karena baca langsung dari
    // node.attrs (jalur berbeda dari serialisasi HTML ini). Sekarang baca
    // langsung dari node.attrs supaya nilai sebenarnya ikut tersimpan.
    const width = String(node.attrs.width ?? "100");
    const align = String(node.attrs.align ?? "center") as ImageAlign;
    const style = `max-width:100%;width:${width}%;height:auto;display:block;${marginForAlign(
      align,
    )}`;

    const rest: Record<string, unknown> = { ...HTMLAttributes };
    delete rest.width;
    delete rest.align;
    return [
      "img",
      {
        ...rest,
        style,
        "data-width": width,
        "data-align": align,
        class: "editor-image",
      },
    ];
  },

  // NodeView interaktif khusus di dalam editor — kontrol ukuran/perataan
  // ditempel LANGSUNG pada gambar (lihat ImageNodeView.tsx), bukan lewat
  // toolbar terpisah. Ini tidak memengaruhi hasil HTML yang tersimpan
  // (masih pakai renderHTML di atas) — NodeView murni untuk pengalaman
  // mengedit, output tetap <img> polos dengan inline style.
  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },
});
