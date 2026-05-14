// src/app/(auth)/forbidden/page.tsx
import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <div className="not-found-root">
      <div className="not-found-pattern" aria-hidden="true" />
      <div className="not-found-inner">
        <div className="not-found-code" aria-hidden="true">
          403
        </div>

        <div className="not-found-icon">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <h1 className="not-found-title">Akses Ditolak</h1>
        <p className="not-found-desc">
          Akun Anda tidak memiliki izin untuk mengakses panel administrasi.
          Hubungi administrator untuk mendapatkan akses.
        </p>

        <div className="not-found-actions">
          <Link href="/" className="btn btn-outline not-found-btn-outline">
            Kembali ke Situs
          </Link>
        </div>
      </div>
    </div>
  );
}
