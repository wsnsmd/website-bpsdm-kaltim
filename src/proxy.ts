// src/proxy.ts — final version yang bersih
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
  "/favicon",
  "/apple",
  "/robots.txt",
  "/sitemap.xml",
  "/uploads/",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Bypass ────────────────────────────────────
  if (BYPASS_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // ── Non-admin: maintenance + disabled routes ──
  if (!pathname.startsWith("/admin")) {
    // Disabled routes
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

    // Maintenance
    try {
      const url = new URL("/api/maintenance-status", request.url);
      const res = await fetch(url, {
        headers: { "x-internal": process.env.INTERNAL_SECRET ?? "secret" },
        cache: "no-store",
      });
      if (res.ok) {
        const { maintenance } = await res.json();
        if (maintenance === "true") {
          const hasSession =
            request.cookies.get("authjs.session-token")?.value ??
            request.cookies.get("__Secure-authjs.session-token")?.value;
          if (!hasSession) {
            return NextResponse.redirect(new URL("/maintenance", request.url));
          }
        }
      }
    } catch {
      /* fail open */
    }

    return NextResponse.next();
  }

  // ── Admin: auth + role check ──────────────────
  const isProduction = process.env.NODE_ENV === "production";
  const cookieName = isProduction
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? "",
    salt: cookieName,
    cookieName: cookieName,
  });

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = (token.role as string) ?? "viewer";

  if (!canAccessAdmin(role)) {
    return NextResponse.redirect(new URL("/forbidden", request.url));
  }

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

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon|apple-touch|robots|sitemap|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?)$).*)",
  ],
};
