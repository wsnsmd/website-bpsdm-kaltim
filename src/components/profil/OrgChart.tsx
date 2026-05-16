// src/components/profil/OrgChart.tsx
"use client";

import { useState } from "react";
import type { UnitItem } from "@/lib/queries/profil";

type Props = { units: UnitItem[] };

const LEVEL_CONFIG = [
  {
    bg: "var(--color-forest-900)",
    color: "#fff",
    border: "var(--color-forest-900)",
    label: "Pimpinan",
  },
  {
    bg: "var(--color-forest-700)",
    color: "#fff",
    border: "var(--color-forest-700)",
    label: "Sekretariat",
  },
  {
    bg: "#fff",
    color: "var(--color-forest-900)",
    border: "var(--color-forest-700)",
    label: "Bidang / UPT",
  },
  {
    bg: "var(--color-ink-8)",
    color: "var(--color-ink-2)",
    border: "var(--color-ink-5)",
    label: "Sub Bagian",
  },
];

function getLevel(unit: UnitItem): number {
  return unit.level ?? 0;
}

function OrgNode({
  unit,
  children,
  isRoot,
}: {
  unit: UnitItem;
  children?: React.ReactNode;
  isRoot: boolean;
}) {
  const [expanded, setExpanded] = useState(true);
  const level = getLevel(unit);
  const cfg = LEVEL_CONFIG[Math.min(level, 3)];
  const hasKids = !!children;

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {/* Garis vertikal turun dari parent — hanya jika BUKAN root */}
      {!isRoot && (
        <div
          style={{
            width: "2px",
            height: "24px",
            background: "var(--color-ink-4)",
            flexShrink: 0,
          }}
        />
      )}

      {/* Node box */}
      <div
        onClick={() => hasKids && setExpanded((v) => !v)}
        style={{
          background: cfg.bg,
          color: cfg.color,
          border: `2px solid ${cfg.border}`,
          borderRadius: "10px",
          padding:
            level === 0 ? "14px 28px" : level === 1 ? "11px 20px" : "9px 16px",
          textAlign: "center",
          cursor: hasKids ? "pointer" : "default",
          transition: "all 0.15s",
          width: level === 0 ? "220px" : level === 1 ? "190px" : "170px",
          position: "relative",
          boxShadow:
            level === 0
              ? "0 6px 20px rgba(14,61,32,0.2)"
              : level === 1
                ? "0 4px 12px rgba(14,61,32,0.12)"
                : "0 2px 6px rgba(0,0,0,0.06)",
          userSelect: "none",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontSize:
              level === 0 ? "13.5px" : level === 1 ? "12.5px" : "11.5px",
            fontWeight: 700,
            lineHeight: 1.35,
            fontFamily: "var(--font-display)",
          }}
        >
          {unit.name}
        </div>

        {unit.shortName && level > 0 && (
          <div
            style={{
              fontSize: "10px",
              opacity: 0.65,
              marginTop: "3px",
              fontWeight: 500,
            }}
          >
            ({unit.shortName})
          </div>
        )}

        {/* Toggle button */}
        {hasKids && (
          <div
            style={{
              position: "absolute",
              bottom: "-11px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "22px",
              height: "22px",
              borderRadius: "50%",
              background: cfg.border,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              fontWeight: 700,
              zIndex: 2,
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            }}
          >
            {expanded ? "−" : "+"}
          </div>
        )}
      </div>

      {/* Children */}
      {hasKids && expanded && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "0",
          }}
        >
          {/* Garis turun dari node ke horizontal */}
          <div
            style={{
              width: "2px",
              height: "24px",
              background: "var(--color-ink-4)",
              marginTop: "10px",
            }}
          />

          {/* Children row */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              position: "relative",
            }}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

// Wrapper node dengan garis horizontal connector
function NodeWithConnector({
  unit,
  children,
  isFirst,
  isLast,
  isOnly,
  isRoot,
}: {
  unit: UnitItem;
  children?: React.ReactNode;
  isFirst: boolean;
  isLast: boolean;
  isOnly: boolean;
  isRoot: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        padding: "0 12px",
        flexShrink: 0,
      }}
    >
      {/* Garis horizontal connector — hanya jika bukan satu-satunya child */}
      {!isOnly && !isRoot && (
        <div
          style={{
            position: "absolute",
            top: "0",
            left: isFirst ? "50%" : "0",
            right: isLast ? "50%" : "0",
            height: "2px",
            background: "var(--color-ink-4)",
            zIndex: 0,
          }}
        />
      )}

      <OrgNode unit={unit} isRoot={isRoot}>
        {children}
      </OrgNode>
    </div>
  );
}

export function OrgChart({ units }: Props) {
  const getChildren = (parentId: number | null) =>
    units.filter((u) =>
      parentId === null ? u.parentId === null : u.parentId === parentId,
    );

  const hasData = units.length > 0;

  function renderTree(
    parentId: number | null,
    isRoot = false,
  ): React.ReactNode {
    const kids = getChildren(parentId);
    if (kids.length === 0) return null;

    return kids.map((unit, i) => {
      const childNodes = renderTree(unit.id, false);
      const isOnly = kids.length === 1;

      return (
        <NodeWithConnector
          key={unit.id}
          unit={unit}
          isFirst={i === 0}
          isLast={i === kids.length - 1}
          isOnly={isOnly}
          isRoot={isRoot}
        >
          {childNodes ?? undefined}
        </NodeWithConnector>
      );
    });
  }

  if (!hasData) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "60px 20px",
          color: "var(--color-ink-4)",
        }}
      >
        <div style={{ fontSize: "40px", marginBottom: "12px" }}>🏢</div>
        <p style={{ fontSize: "14px" }}>
          Data struktur organisasi belum tersedia.
        </p>
        <p
          style={{
            fontSize: "12px",
            marginTop: "6px",
            color: "var(--color-ink-5)",
          }}
        >
          Jalankan <code>bun db:seed-profil</code> untuk mengisi data.
        </p>
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
          marginBottom: "20px",
          flexWrap: "wrap",
          padding: "10px 16px",
          background: "var(--color-ink-8)",
          borderRadius: "10px",
          border: "1px solid var(--color-ink-6)",
          alignItems: "center",
        }}
      >
        {LEVEL_CONFIG.map((cfg) => (
          <div
            key={cfg.label}
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "3px",
                background: cfg.bg,
                border: `2px solid ${cfg.border}`,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: "12px",
                color: "var(--color-ink-3)",
                fontWeight: 500,
              }}
            >
              {cfg.label}
            </span>
          </div>
        ))}
        <div
          style={{
            marginLeft: "auto",
            fontSize: "11px",
            color: "var(--color-ink-5)",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            flexShrink: 0,
          }}
        >
          💡 Klik node ± untuk expand/collapse · Geser horizontal untuk melihat
          seluruh chart
        </div>
      </div>

      {/* Scroll container */}
      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          overflowX: "auto",
          overflowY: "visible",
          borderRadius: "12px",
          border: "1px solid var(--color-ink-6)",
          background: "#fff",
          scrollbarWidth: "thin",
          scrollbarColor: "var(--color-ink-5) transparent",
          WebkitOverflowScrolling: "touch" as any,
        }}
      >
        {/* Inner — lebar mengikuti konten, scroll jika melebihi */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "36px 48px 48px",
            width: "max-content",
            minWidth: "100%",
          }}
        >
          {renderTree(null, true)}
        </div>
      </div>

      {/* Scroll hint */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginTop: "10px",
          fontSize: "11.5px",
          color: "var(--color-ink-5)",
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
        Geser ke kanan untuk melihat seluruh struktur organisasi
      </div>
    </div>
  );
}
