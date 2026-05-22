// src/components/home/SnapController.tsx
"use client";

import { useEffect } from "react";

export function SnapController() {
  useEffect(() => {
    // Tambahkan snap ke section hero & pimpinan
    const hero = document.querySelector(".hero-simple") as HTMLElement;
    const pimpinan = document.querySelector(".pimpinan-section") as HTMLElement;

    if (hero) hero.style.scrollSnapAlign = "start";
    if (pimpinan) pimpinan.style.scrollSnapAlign = "start";

    // Set snap di html element
    document.documentElement.style.scrollSnapType = "y proximity";
    document.documentElement.style.overflowY = "scroll";
    document.documentElement.style.scrollBehavior = "smooth";

    return () => {
      document.documentElement.style.scrollSnapType = "";
      document.documentElement.style.overflowY = "";
    };
  }, []);

  return null;
}
