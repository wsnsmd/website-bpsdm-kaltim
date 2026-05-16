// src/app/(public)/login/page.tsx
"use client";

import { signIn, useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense, useEffect } from "react";
import {
  Shield,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Home,
  Building2,
  Users,
  Award,
  CheckCircle,
} from "lucide-react";

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
        <div className="login-card-modern text-center p-8 sm:p-10">
          <div className="flex flex-col items-center justify-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 bg-forest-50 rounded-2xl flex items-center justify-center">
                <Loader2 size={48} className="animate-spin text-forest-700" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center">
                <CheckCircle size={16} className="text-white" />
              </div>
            </div>
            <div>
              <p className="text-ink font-semibold text-lg">
                {status === "authenticated"
                  ? "Mengalihkan..."
                  : "Memeriksa sesi..."}
              </p>
              <p className="text-ink-4 text-sm mt-1">
                {status === "authenticated"
                  ? "Anda akan segera diarahkan ke dashboard."
                  : "Mohon tunggu sebentar."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  async function handleSSO() {
    setLoading(true);
    await signIn("authentik", { callbackUrl });
  }

  return (
    <div className="login-root-modern">
      {/* Background Pattern */}
      <div className="login-bg-pattern" />
      <div className="login-bg-gradient" />

      <div className="login-container">
        {/* Left Side - Branding */}
        <div className="login-brand">
          <div className="login-brand-content">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
                <Building2 size={28} className="text-gold-400" />
              </div>
              <div>
                <div className="text-white font-bold text-lg">BPSDM Kaltim</div>
                <div className="text-white/50 text-xs">
                  Provinsi Kalimantan Timur
                </div>
              </div>
            </div>

            <h1 className="login-brand-title">Panel Administrasi</h1>
            <p className="login-brand-desc">
              Kelola konten website, pelatihan, dan sumber daya manusia dengan
              mudah dan terintegrasi.
            </p>

            <div className="login-features">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <Users size={16} className="text-gold-400" />
                </div>
                <div>
                  <div className="text-white text-sm font-medium">
                    Manajemen Pengguna
                  </div>
                  <div className="text-white/40 text-xs">
                    Kelola akses dan role pengguna
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <Award size={16} className="text-gold-400" />
                </div>
                <div>
                  <div className="text-white text-sm font-medium">
                    Manajemen Pelatihan
                  </div>
                  <div className="text-white/40 text-xs">
                    Kelola program dan sertifikasi
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <Shield size={16} className="text-gold-400" />
                </div>
                <div>
                  <div className="text-white text-sm font-medium">
                    Keamanan Terjamin
                  </div>
                  <div className="text-white/40 text-xs">
                    Login dengan SSO BPSDM Kaltim
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-form-container">
          <div className="login-card-modern">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-forest-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield size={32} className="text-forest-700" />
              </div>
              <h2 className="text-2xl font-bold text-ink">Selamat Datang</h2>
              <p className="text-ink-4 text-sm mt-1">
                Silakan masuk untuk mengakses panel administrasi
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="login-error-modern mb-6">
                <AlertCircle size={18} className="flex-shrink-0" />
                <div>
                  <div className="font-semibold text-sm">Akses Gagal</div>
                  <div className="text-xs opacity-80">
                    {error === "AccessDenied"
                      ? "Akun Anda tidak memiliki akses ke panel admin."
                      : "Terjadi kesalahan saat login. Silakan coba lagi."}
                  </div>
                </div>
              </div>
            )}

            {/* SSO Button */}
            <button
              onClick={handleSSO}
              disabled={loading}
              className="sso-btn-modern w-full"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Menghubungkan ke SSO...
                </>
              ) : (
                <>
                  <Shield size={20} />
                  Masuk dengan SSO BPSDM Kaltim
                </>
              )}
            </button>

            {/* Info Text */}
            <div className="login-info-modern">
              <AlertCircle size={14} />
              <span>Anda akan diarahkan ke halaman login SSO BPSDM Kaltim</span>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-ink-6"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-ink-4">
                  Aman & Terpercaya
                </span>
              </div>
            </div>

            {/* Back Link */}
            <a href="/" className="login-back-modern">
              <ArrowLeft size={16} />
              Kembali ke situs utama
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginFallback() {
  return (
    <div className="login-root-modern">
      <div className="login-bg-pattern" />
      <div className="login-bg-gradient" />
      <div className="flex items-center justify-center min-h-screen">
        <div className="login-card-modern text-center p-10">
          <Loader2 size={48} className="animate-spin text-forest-700 mx-auto" />
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
