// src/components/admin/analytics/VisitorChart.tsx
"use client";

import { useMemo } from "react";

type DataPoint = {
  date: string;
  uniqueVisitors: number | null;
  pageViews: number | null;
};

type Props = { data: DataPoint[] };

export function VisitorChart({ data }: Props) {
  const maxViews = Math.max(...data.map((d) => d.pageViews ?? 0), 1);
  const maxUniq = Math.max(...data.map((d) => d.uniqueVisitors ?? 0), 1);
  const H = 200;
  const W = 100; // % per bar

  if (!data.length) {
    return (
      <div
        style={{
          height: "200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--color-ink-4)",
          fontSize: "13px",
        }}
      >
        Belum ada data
      </div>
    );
  }

  return (
    <div>
      {/* Legend */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          marginBottom: "16px",
          fontSize: "12px",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              width: "12px",
              height: "3px",
              borderRadius: "2px",
              background: "#3b82f6",
            }}
          />
          <span style={{ color: "var(--color-ink-3)" }}>Page Views</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              width: "12px",
              height: "3px",
              borderRadius: "2px",
              background: "#22c55e",
            }}
          />
          <span style={{ color: "var(--color-ink-3)" }}>Unique Visitors</span>
        </div>
      </div>

      {/* Bar chart */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "4px",
          height: `${H}px`,
          overflowX: "auto",
          paddingBottom: "24px",
          position: "relative",
        }}
      >
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((p) => (
          <div
            key={p}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: `calc(${p}% + 24px)`,
              borderTop: "1px dashed var(--color-ink-7)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        ))}

        {data.map((d, i) => {
          const viewH = Math.round(((d.pageViews ?? 0) / maxViews) * (H - 30));
          const uniqH = Math.round(
            ((d.uniqueVisitors ?? 0) / maxViews) * (H - 30),
          );
          const dateLabel = d.date.slice(5); // MM-DD

          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "2px",
                flex: "0 0 auto",
                minWidth: "28px",
                position: "relative",
                zIndex: 1,
              }}
              title={`${d.date}\nViews: ${d.pageViews ?? 0}\nUnique: ${d.uniqueVisitors ?? 0}`}
            >
              {/* Bars */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "2px",
                  height: `${H - 30}px`,
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: `${viewH}px`,
                    background: "linear-gradient(to top, #2563eb, #60a5fa)",
                    borderRadius: "3px 3px 0 0",
                    minHeight: "2px",
                    transition: "height 0.3s",
                  }}
                />
                <div
                  style={{
                    width: "10px",
                    height: `${uniqH}px`,
                    background: "linear-gradient(to top, #15803d, #4ade80)",
                    borderRadius: "3px 3px 0 0",
                    minHeight: "2px",
                    transition: "height 0.3s",
                  }}
                />
              </div>

              {/* Label tanggal */}
              {i % 5 === 0 && (
                <span
                  style={{
                    fontSize: "8.5px",
                    color: "var(--color-ink-5)",
                    transform: "rotate(-45deg)",
                    whiteSpace: "nowrap",
                    marginTop: "4px",
                  }}
                >
                  {dateLabel}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
