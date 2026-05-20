// src/components/galeri/GaleriTabs.tsx
"use client";

import Link from "next/link";
import { Image as ImageIcon, Play } from "lucide-react";

type Props = {
  activeTab: "foto" | "video";
  photoCount: number;
  videoCount: number;
};

export function GaleriTabs({ activeTab, photoCount, videoCount }: Props) {
  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        marginBottom: "24px",
        borderBottom: "2px solid var(--color-ink-6)",
      }}
    >
      <Link
        href="/galeri"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "7px",
          padding: "10px 20px",
          fontSize: "14px",
          fontWeight: activeTab === "foto" ? 700 : 500,
          color:
            activeTab === "foto"
              ? "var(--color-forest-800)"
              : "var(--color-ink-3)",
          borderBottom:
            activeTab === "foto"
              ? "2px solid var(--color-forest-700)"
              : "2px solid transparent",
          marginBottom: "-2px",
          textDecoration: "none",
          background:
            activeTab === "foto" ? "var(--color-forest-50)" : "transparent",
          borderRadius: "8px 8px 0 0",
          transition: "all 0.12s",
        }}
      >
        <ImageIcon size={16} />
        Foto
        <span
          style={{
            padding: "1px 8px",
            borderRadius: "20px",
            background:
              activeTab === "foto"
                ? "var(--color-forest-700)"
                : "var(--color-ink-7)",
            color: activeTab === "foto" ? "#fff" : "var(--color-ink-4)",
            fontSize: "11.5px",
            fontWeight: 700,
          }}
        >
          {photoCount}
        </span>
      </Link>

      <Link
        href="/galeri?tab=video"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "7px",
          padding: "10px 20px",
          fontSize: "14px",
          fontWeight: activeTab === "video" ? 700 : 500,
          color:
            activeTab === "video"
              ? "var(--color-forest-800)"
              : "var(--color-ink-3)",
          borderBottom:
            activeTab === "video"
              ? "2px solid var(--color-forest-700)"
              : "2px solid transparent",
          marginBottom: "-2px",
          textDecoration: "none",
          background:
            activeTab === "video" ? "var(--color-forest-50)" : "transparent",
          borderRadius: "8px 8px 0 0",
          transition: "all 0.12s",
        }}
      >
        <Play size={15} />
        Video
        <span
          style={{
            padding: "1px 8px",
            borderRadius: "20px",
            background:
              activeTab === "video"
                ? "var(--color-forest-700)"
                : "var(--color-ink-7)",
            color: activeTab === "video" ? "#fff" : "var(--color-ink-4)",
            fontSize: "11.5px",
            fontWeight: 700,
          }}
        >
          {videoCount}
        </span>
      </Link>
    </div>
  );
}
