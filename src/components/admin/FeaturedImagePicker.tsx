// src/components/admin/FeaturedImagePicker.tsx
"use client";

import { useState } from "react";
import { ImageUpload } from "./ImageUpload";
import { MediaLibrary } from "./MediaLibrary";

type Props = {
  value?: string;
  onImageChange: (url: string) => void; // callback ke parent
  name?: string; // opsional, untuk form integration (PostForm)
};

export function FeaturedImagePicker({
  value = "",
  onImageChange,
  name,
}: Props) {
  const [showLibrary, setShowLibrary] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "library">("upload");

  function handleChange(url: string) {
    onImageChange(url); // update state di parent (PostForm)
  }

  function handleLibrarySelect(url: string) {
    onImageChange(url);
    setShowLibrary(false);
  }

  return (
    <div>
      {/* Tab buttons */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        <button
          type="button"
          onClick={() => setActiveTab("upload")}
          className={`media-tab-btn ${activeTab === "upload" ? "media-tab-btn-active" : ""}`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Upload Baru
        </button>
        <button
          type="button"
          onClick={() => setShowLibrary(true)}
          className="media-tab-btn"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          Pilih dari Library
        </button>
      </div>

      {/* Upload component — onChange langsung update parent */}
      <ImageUpload
        value={value}
        onChange={handleChange}
        aspectRatio="16/9"
        hint="Resolusi rekomendasi: 1200×630px · Otomatis dikonversi ke WebP"
      />

      {/* Media Library Modal */}
      {showLibrary && (
        <MediaLibrary
          onSelect={handleLibrarySelect}
          onClose={() => setShowLibrary(false)}
        />
      )}
    </div>
  );
}
