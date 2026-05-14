// src/app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="not-found-root">
      {/* Background pattern */}
      <div className="not-found-pattern" aria-hidden="true" />

      <div className="not-found-inner">
        {/* Kode error */}
        <div className="not-found-code" aria-hidden="true">
          404
        </div>

        {/* Icon */}
        <div className="not-found-icon">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </div>

        <h1 className="not-found-title">Halaman Tidak Ditemukan</h1>
        <p className="not-found-desc">
          Halaman yang Anda cari tidak tersedia atau telah dipindahkan. Silakan
          kembali ke beranda atau gunakan navigasi di atas.
        </p>

        {/* Actions */}
        <div className="not-found-actions">
          <Link href="/" className="btn btn-primary not-found-btn-primary">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Kembali ke Beranda
          </Link>
          <Link
            href="/berita"
            className="btn btn-outline not-found-btn-outline"
          >
            Lihat Berita Terbaru
          </Link>
        </div>

        {/* Quick links */}
        <div className="not-found-links">
          <span className="not-found-links-label">Halaman populer:</span>
          {[
            { href: "/program", label: "Program Diklat" },
            { href: "/program/jadwal", label: "Jadwal Pelatihan" },
            { href: "/ppid", label: "PPID" },
            { href: "/kontak", label: "Kontak" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="not-found-quick-link"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
