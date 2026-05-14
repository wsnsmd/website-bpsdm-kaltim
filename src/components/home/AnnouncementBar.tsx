// src/components/home/AnnouncementBar.tsx
import Link from "next/link";
import type { AnnouncementItem } from "@/lib/queries/announcements";

type Props = {
  announcements: AnnouncementItem[];
};

// Fallback jika DB kosong
const FALLBACK = [
  {
    id: 1,
    title: "Selamat datang di portal BPSDM Kaltim",
    url: "/",
    type: "info",
  },
];

export function AnnouncementBar({ announcements }: Props) {
  const items = announcements.length > 0 ? announcements : FALLBACK;

  return (
    <div className="ann-bar-root">
      <div className="container-content flex items-center h-[46px] gap-4">
        <span className="ann-bar-label">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          Pengumuman
        </span>

        <div className="ann-bar-sep" />

        <div className="ann-bar-content">
          {items.map((item, i) => (
            <span key={item.id}>
              <Link href={item.url ?? "/pengumuman"} className="ann-bar-link">
                {item.title}
              </Link>
              {i < items.length - 1 && <span className="ann-bar-dot">·</span>}
            </span>
          ))}
        </div>

        <Link href="/pengumuman" className="ann-bar-all">
          Semua
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
