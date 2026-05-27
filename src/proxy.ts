// src/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { canAccessAdmin, requireRole } from "@/lib/auth-helpers";

const ROLE_RESTRICTED: { path: string; roles: string[] }[] = [
  { path: "/admin/analytics", roles: ["superadmin"] },
  { path: "/admin/pengguna", roles: ["superadmin"] },
  { path: "/admin/pengaturan", roles: ["superadmin"] },
  { path: "/admin/menu", roles: ["superadmin", "admin"] },
  { path: "/admin/platform", roles: ["superadmin", "admin"] },
  { path: "/admin/ppid", roles: ["superadmin", "admin"] },
  { path: "/admin/profil", roles: ["superadmin", "admin"] },
  { path: "/admin/program", roles: ["superadmin", "admin"] },
  { path: "/admin/survei", roles: ["superadmin", "admin"] },
  { path: "/admin/kategori", roles: ["superadmin", "admin"] },
];

// ── Path yang di-bypass SEPENUHNYA ────────────
const BYPASS_PREFIXES = [
  "/_next/",
  "/api/auth",
  "/api/maintenance-status",
  "/api/disabled-routes",
  "/api/track",
  "/api/ppid",
  "/api/search",
  "/api/unduhan",
  "/api/upload",
  "/login",
  "/forbidden",
  "/maintenance",
  "/favicon.ico",
  "/favicon",
  "/apple",
  "/robots.txt",
  "/sitemap.xml",
  "/uploads/",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. Bypass paths — tidak perlu cek apapun ─
  if (BYPASS_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // ── 2. Non-admin: cek maintenance dari DB langsung ─
  // JANGAN fetch ke API — baca dari cookie atau header yang di-set
  // Maintenance check dilakukan di page level, bukan middleware
  // agar tidak ada recursive fetch

  // ── 3. Admin routes: cek auth ────────────────
  if (pathname.startsWith("/admin")) {
    let token = null;

    try {
      token = await getToken({
        req: request,
        secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? "",
      });
    } catch {
      // Jika gagal ambil token, redirect ke login
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Belum login
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const role = (token.role as string) ?? "viewer";

    // Role tidak diizinkan akses admin
    if (!canAccessAdmin(role)) {
      return NextResponse.redirect(new URL("/forbidden", request.url));
    }

    // Cek restriction per route
    for (const restriction of ROLE_RESTRICTED) {
      if (pathname.startsWith(restriction.path)) {
        if (!requireRole(role, restriction.roles)) {
          return NextResponse.redirect(new URL("/forbidden", request.url));
        }
        break;
      }
    }

    return NextResponse.next();
  }

  // ── 4. Semua request lain — lanjutkan ────────
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Hanya match admin routes + halaman publik tertentu
    // Exclude semua static files
    "/((?!_next/static|_next/image|favicon|apple-touch|robots|sitemap|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?)$).*)",
  ],
};
