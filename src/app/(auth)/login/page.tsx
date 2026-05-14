"use client";

import { signIn, useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense, useEffect } from "react";

function LoginContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";
  const error = searchParams.get("error");
  const [loading, setLoading] = useState(false);
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="login-root">
        <div
          className="login-card"
          style={{ textAlign: "center", padding: "48px" }}
        >
          <div className="loading-spinner" style={{ margin: "0 auto 16px" }}>
            <div className="loading-spinner-ring" />
          </div>
          <p style={{ color: "var(--color-ink-4)", fontSize: "14px" }}>
            {status === "authenticated"
              ? "Mengalihkan ke dashboard..."
              : "Memeriksa sesi..."}
          </p>
        </div>
      </div>
    );
  }

  async function handleSSO() {
    setLoading(true);
    await signIn("authentik", { callbackUrl });
  }

  return (
    <div className="login-root">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-mark">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div>
            <div className="login-logo-name">BPSDM Kaltim</div>
            <div className="login-logo-sub">Panel Administrasi</div>
          </div>
        </div>

        <h1 className="login-title">Masuk ke Panel Admin</h1>
        <p className="login-desc">
          Gunakan akun SSO BPSDM Kaltim untuk mengakses panel administrasi.
        </p>

        {error && (
          <div className="login-error">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error === "AccessDenied"
              ? "Akun Anda tidak memiliki akses ke panel admin."
              : "Terjadi kesalahan saat login. Coba lagi."}
          </div>
        )}

        <button onClick={handleSSO} disabled={loading} className="sso-btn">
          {loading ? (
            <>
              <div
                className="loading-spinner-ring"
                style={{
                  width: "18px",
                  height: "18px",
                  borderWidth: "2px",
                  borderColor: "rgba(255,255,255,0.3)",
                  borderTopColor: "#fff",
                }}
              />
              Menghubungkan ke SSO...
            </>
          ) : (
            <>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Masuk dengan SSO BPSDM Kaltim
            </>
          )}
        </button>

        <div className="login-sso-info">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          Anda akan diarahkan ke halaman login SSO BPSDM Kaltim
        </div>

        <div className="login-back">
          <a href="/" className="login-back-link">
            ← Kembali ke situs utama
          </a>
        </div>
      </div>
    </div>
  );
}

function LoginFallback() {
  return (
    <div className="login-root">
      <div
        className="login-card"
        style={{ textAlign: "center", padding: "48px" }}
      >
        <div className="loading-spinner" style={{ margin: "0 auto" }}>
          <div className="loading-spinner-ring" />
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginContent />
    </Suspense>
  );
}
