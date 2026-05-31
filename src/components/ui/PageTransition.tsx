// src/components/ui/PageTransition.tsx
"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface PageTransitionProps {
  children: React.ReactNode;
  /**
   * Jenis animasi:
   * - "fade"       : opacity 0→1 (aman, tidak ada shift)
   * - "fade-up"    : opacity + sedikit naik dari bawah
   * - "fade-slide" : opacity + geser dari kiri
   */
  variant?:
    | "fade"
    | "fade-up"
    | "fade-slide"
    | "fade-scale"
    | "blur-in"
    | "fade-down";
  /** Durasi animasi dalam ms. Default 280 */
  duration?: number;
}

const VARIANTS = {
  fade: {
    hidden: "opacity-0",
    visible: "opacity-100",
    style: {},
  },
  "fade-up": {
    hidden: "opacity-0",
    visible: "opacity-100",
    style: { transform: "translateY(8px)" },
    visibleStyle: { transform: "translateY(0)" },
  },
  "fade-slide": {
    hidden: "opacity-0",
    visible: "opacity-100",
    style: { transform: "translateX(-6px)" },
    visibleStyle: { transform: "translateX(0)" },
  },
  "fade-scale": {
    hidden: "opacity-0",
    visible: "opacity-100",
    style: { transform: "scale(0.97)" },
    visibleStyle: { transform: "scale(1)" },
  },

  "blur-in": {
    hidden: "opacity-0",
    visible: "opacity-100",
    style: { filter: "blur(6px)", transform: "scale(0.99)" },
    visibleStyle: { filter: "blur(0)", transform: "scale(1)" },
  },

  "fade-down": {
    hidden: "opacity-0",
    visible: "opacity-100",
    style: { transform: "translateY(-10px)" },
    visibleStyle: { transform: "translateY(0)" },
  },
};

export function PageTransition({
  children,
  variant = "fade-up",
  duration = 280,
}: PageTransitionProps) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [key, setKey] = useState(pathname);
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      // Path berubah: reset ke hidden, lalu fade-in lagi
      prevPathRef.current = pathname;
      setIsVisible(false);
      setKey(pathname);

      // Delay kecil biar browser sempat apply state hidden
      const t = setTimeout(() => setIsVisible(true), 30);
      return () => clearTimeout(t);
    }
  }, [pathname]);

  // Mount pertama kali
  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 30);
    return () => clearTimeout(t);
  }, []);

  const v = VARIANTS[variant];

  const hiddenStyle: React.CSSProperties = {
    opacity: 0,
    ...(v.style ?? {}),
  };

  const visibleStyle: React.CSSProperties = {
    opacity: 1,
    ...("visibleStyle" in v ? v.visibleStyle : {}),
  };

  return (
    <div
      key={key}
      style={{
        ...(isVisible ? visibleStyle : hiddenStyle),
        transition: `opacity ${duration}ms ease, transform ${duration}ms cubic-bezier(0.25, 1, 0.5, 1)`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
