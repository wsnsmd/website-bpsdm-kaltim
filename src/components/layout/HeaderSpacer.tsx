// src/components/layout/HeaderSpacer.tsx
"use client";

import { usePathname } from "next/navigation";

export function HeaderSpacer() {
  const pathname = usePathname();

  // Tidak perlu spacer di halaman home karena header transparan
  const isHome = pathname === "/web" || pathname === "/web/";

  if (isHome) return null;

  return <div style={{ height: "64px" }} />;
}
