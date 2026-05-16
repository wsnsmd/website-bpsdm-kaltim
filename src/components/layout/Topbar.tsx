// src/components/layout/Topbar.tsx
"use client";

import Link from "next/link";
import { Calendar, ExternalLink } from "lucide-react";

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
    <div className="topbar-root hidden lg:block">
      <div className="container-content flex items-center justify-between h-[34px]">
        {/* Kiri */}
        <div className="flex h-full overflow-x-auto no-scrollbar">
          {TOPBAR_LINKS.map((item, i) => (
            <Link
              key={item.label}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className="topbar-link whitespace-nowrap"
              style={{
                borderRight:
                  i < TOPBAR_LINKS.length - 1
                    ? "1px solid rgba(255,255,255,0.1)"
                    : "none",
              }}
            >
              {item.label}
              {item.external && (
                <ExternalLink
                  size={10}
                  strokeWidth={2}
                  className="ml-1 opacity-60 group-hover:opacity-100 transition-opacity"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Kanan — tanggal */}
        <div className="topbar-date shrink-0">
          <Calendar size={13} strokeWidth={2} className="topbar-date-icon" />
          {date}
        </div>
      </div>
    </div>
  );
}
