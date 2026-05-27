// src/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { canAccessAdmin, requireRole } from "@/lib/auth-helpers";

// Route yang butuh role tertentu
const ROLE_RESTRICTED: { path: string; roles: string[] }[] = [
  { path: "/admin/pengguna", roles: ["superadmin"] },
  { path: "/admin/pengaturan", roles: ["superadmin"] },
  { path: "/admin/menu", roles: ["superadmin", "admin"] },
  { path: "/admin/platform", roles: ["superadmin", "admin"] },
  { path: "/admin/ppid", roles: ["superadmin", "admin"] },
  { path: "/admin/profil", roles: ["superadmin", "admin"] },
  { path: "/admin/program", roles: ["superadmin", "admin"] },
  { path: "/admin/survei", roles: ["superadmin", "admin"] },
  { path: "/admin/kategori", roles: ["superadmin", "admin"] },
  { path: "/admin/galeri/baru", roles: ["superadmin", "admin", "editor"] },
  { path: "/admin/dokumen/baru", roles: ["superadmin", "admin", "editor"] },
  { path: "/admin/berita/baru", roles: ["superadmin", "admin", "editor"] },
  { path: "/admin/pengumuman/baru", roles: ["superadmin", "admin", "editor"] },
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Bypass paths ──────────────────────────
  const bypass = [
    "/api/auth",
    "/api/maintenance-status",
    "/api/disabled-routes",
    "/login",
    "/forbidden",
    "/maintenance",
    "/_next",
    "/favicon.ico",
    "/uploads",
  ];

  if (bypass.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // ── Cek disabled routes ───────────────────
  if (!pathname.startsWith("/admin")) {
    try {
      const url = new URL("/api/disabled-routes", request.url);
      const res = await fetch(url, {
        headers: { "x-internal": process.env.INTERNAL_SECRET ?? "secret" },
        cache: "no-store",
      });
      if (res.ok) {
        const { routes } = (await res.json()) as { routes: string[] };
        const isDisabled = routes.some(
          (r) => pathname === r || pathname.startsWith(r + "/"),
        );
        if (isDisabled) {
          return NextResponse.rewrite(new URL("/not-found", request.url), {
            status: 404,
          });
        }
      }
    } catch {
      /* fail open */
    }
  }

  // ── Cek maintenance ───────────────────────
  if (!pathname.startsWith("/admin")) {
    try {
      const url = new URL("/api/maintenance-status", request.url);
      const res = await fetch(url, {
        headers: { "x-internal": process.env.INTERNAL_SECRET ?? "secret" },
        cache: "no-store",
      });
      if (res.ok) {
        const { maintenance } = await res.json();
        if (maintenance === "true") {
          const sessionToken =
            request.cookies.get("authjs.session-token")?.value ??
            request.cookies.get("__Secure-authjs.session-token")?.value;
          if (!sessionToken) {
            return NextResponse.redirect(new URL("/maintenance", request.url));
          }
        }
      }
    } catch {
      /* fail open */
    }
  }

  // ── Cek admin auth + role ─────────────────
  if (pathname.startsWith("/admin")) {
    // Ambil token JWT
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });

    // Belum login
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const role = (token.role as string) ?? "viewer";

    // Role tidak boleh akses admin sama sekali
    if (!canAccessAdmin(role)) {
      return NextResponse.redirect(new URL("/forbidden", request.url));
    }

    // Cek role restriction per route
    for (const restriction of ROLE_RESTRICTED) {
      if (pathname.startsWith(restriction.path)) {
        if (!requireRole(role, restriction.roles)) {
          return NextResponse.redirect(new URL("/forbidden", request.url));
        }
        break;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
