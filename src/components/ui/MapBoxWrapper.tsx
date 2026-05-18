// src/components/ui/MapBoxWrapper.tsx
"use client";

import dynamic from "next/dynamic";

const MapBox3D = dynamic(
  () => import("@/components/ui/MapBox3D").then((m) => m.MapBox3D),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--color-ink-7)",
          color: "var(--color-ink-4)",
          fontSize: "14px",
          gap: "8px",
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        Memuat peta...
      </div>
    ),
  },
);

type Props = {
  token: string;
  latitude: number;
  longitude: number;
  zoom?: number;
  pitch?: number;
  name?: string;
  address?: string;
};

export function MapBoxWrapper(props: Props) {
  return <MapBox3D {...props} />;
}
