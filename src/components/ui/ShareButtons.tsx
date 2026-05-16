// src/components/ui/ShareButtons.tsx
"use client";

import { Share2, Link2, MessageCircle } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  excerpt?: string | null;
  url: string;
}

export function ShareButtons({ title, excerpt, url }: ShareButtonsProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: excerpt || "",
          url: url,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert("Link berhasil disalin!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      title + " - " + url,
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="article-share">
      <span className="article-share-label">Bagikan:</span>
      <button
        className="share-btn"
        aria-label="Bagikan artikel"
        onClick={handleShare}
      >
        <Share2 size={16} strokeWidth={2} />
      </button>
      <button
        className="share-btn"
        aria-label="Salin link"
        onClick={handleCopyLink}
      >
        <Link2 size={16} strokeWidth={2} />
      </button>
      <button
        className="share-btn"
        aria-label="Bagikan ke WhatsApp"
        onClick={handleWhatsApp}
      >
        <MessageCircle size={16} strokeWidth={2} />
      </button>
    </div>
  );
}
