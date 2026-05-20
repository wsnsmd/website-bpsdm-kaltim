// src/components/layout/ClientComponents.tsx
"use client";

import dynamic from "next/dynamic";

export const SurveyWidget = dynamic(
  () =>
    import("@/components/survei/SurveyWidget").then((m) => ({
      default: m.SurveyWidget,
    })),
  { ssr: false },
);

export const VisitorTracker = dynamic(
  () =>
    import("@/components/analytics/VisitorTracker").then((m) => ({
      default: m.VisitorTracker,
    })),
  { ssr: false },
);
