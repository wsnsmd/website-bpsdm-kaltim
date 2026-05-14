// src/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bypass
  const bypass = [
    "/api/auth",
    "/login",
    "/forbidden",
    "/_next",
    "/favicon.ico",
  ];

  if (bypass.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Hanya proses route /admin
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Cek session token
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
  matcher: ["/admin/:path*"],
};
