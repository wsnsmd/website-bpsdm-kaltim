// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeAgo(date: Date | null | undefined): string {
  if (!date) return "";
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  const intervals = [
    { label: "tahun", secs: 31536000 },
    { label: "bulan", secs: 2592000 },
    { label: "minggu", secs: 604800 },
    { label: "hari", secs: 86400 },
    { label: "jam", secs: 3600 },
    { label: "menit", secs: 60 },
  ];
  for (const i of intervals) {
    const count = Math.floor(seconds / i.secs);
    if (count >= 1) return `${count} ${i.label} lalu`;
  }
  return "Baru saja";
}

export function formatDate(
  date: Date | null | undefined,
  options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  },
): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("id-ID", options).format(new Date(date));
}

export function formatNumber(n: number | null | undefined): string {
  if (n == null) return "0";
  return new Intl.NumberFormat("id-ID").format(n);
}

export function getCategoryBadge(slug: string | undefined): string {
  const map: Record<string, string> = {
    "berita-diklat": "badge-forest",
    "berita-kabkota": "badge-gold",
    "berita-umum": "badge-blue",
    artikel: "badge-red",
    buletin: "badge-gold",
  };
  return map[slug ?? ""] ?? "badge-forest";
}

export function estimateReadingTime(content: string): number {
  const words = content.replace(/<[^>]+>/g, "").split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[àáâãäå]/g, "a")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôõö]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}
