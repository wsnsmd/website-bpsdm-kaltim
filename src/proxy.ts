// src/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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

  // ── Cek disabled routes (hanya publik) ────
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

  // ── Cek maintenance ────────────────────────
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

  // ── Cek admin auth ─────────────────────────
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const sessionToken =
    request.cookies.get("authjs.session-token")?.value ??
    request.cookies.get("__Secure-authjs.session-token")?.value;

  if (!sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
