// src/components/analytics/VisitorTracker.tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function getOrCreateSessionId(): string {
  const KEY = "bpsdm_sid";
  let sid = sessionStorage.getItem(KEY);
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem(KEY, sid);
  }
  return sid;
}

export function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Delay sedikit agar tidak blok render
    const timer = setTimeout(async () => {
      try {
        const sessionId = getOrCreateSessionId();
        await fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: pathname, sessionId }),
        });
      } catch {
        // Silent fail — tidak blok UI
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
