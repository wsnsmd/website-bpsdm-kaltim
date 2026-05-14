// src/components/layout/Topbar.tsx
import Link from "next/link";

const TOPBAR_LINKS = [
  { href: "https://kaltimprov.go.id", label: "Portal Kaltim", external: true },
  { href: "/ppid", label: "PPID", external: false },
  { href: "https://lapor.go.id", label: "Lapor!", external: true },
  { href: "/maklumat-pelayanan", label: "Maklumat Pelayanan", external: false },
];

function getFormattedDate() {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Makassar",
  }).format(new Date());
}

export function Topbar() {
  const date = getFormattedDate();

  return (
    <div className="topbar-root">
      <div className="container-content flex items-center justify-between h-[34px]">
        {/* Kiri */}
        <div className="flex h-full">
          {TOPBAR_LINKS.map((item, i) => (
            <Link
              key={item.label}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className="topbar-link"
              style={{
                borderRight:
                  i < TOPBAR_LINKS.length - 1
                    ? "1px solid rgba(255,255,255,0.1)"
                    : "none",
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Kanan — tanggal */}
        <div className="topbar-date">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="topbar-date-icon"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {date}
        </div>
      </div>
    </div>
  );
}
