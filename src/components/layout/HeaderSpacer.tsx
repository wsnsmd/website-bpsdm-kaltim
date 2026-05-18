// src/components/layout/HeaderSpacer.tsx
"use client";

import { usePathname } from "next/navigation";

export function HeaderSpacer() {
  const pathname = usePathname();
  // Beranda tidak perlu spacer karena hero sudah handle padding
  if (pathname === "/") return null;
  return <div style={{ height: "64px" }} />;
}
