// src/components/profil/OrgChart.tsx
"use client";

import { useMemo } from "react";
import type { UnitWithStaff } from "@/lib/queries/profil";

type Props = { units: UnitWithStaff[] };

const CARD_W = 210;
const CARD_H = 158;
const CARD_H_KJF = 100; // KJF card lebih kecil
const X_GAP = 36;
const Y_GAP = 80;
const PAD = 56;

// ── Cek apakah unit adalah KJF ────────────────
function isKJF(name: string): boolean {
  return name.toUpperCase().includes("KELOMPOK JABATAN FUNGSIONAL");
}

// ── Warna per level ───────────────────────────
const LVL = {
  0: {
    headerGrad: "linear-gradient(135deg, #b91c1c 0%, #dc2626 100%)",
    border: "#ef4444",
    bg: "#fff5f5",
    dot: "#fca5a5",
    glow: "rgba(220,38,38,0.18)",
    label: "Pimpinan",
  },
  1: {
    headerGrad: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
    border: "#3b82f6",
    bg: "#eff6ff",
    dot: "#93c5fd",
    glow: "rgba(59,130,246,0.15)",
    label: "Sekretariat / Bidang",
  },
  2: {
    headerGrad: "linear-gradient(135deg, #15803d 0%, #16a34a 100%)",
    border: "#22c55e",
    bg: "#f0fdf4",
    dot: "#86efac",
    glow: "rgba(34,197,94,0.15)",
    label: "Sub Bagian",
  },
  3: {
    headerGrad: "linear-gradient(135deg, #15803d 0%, #16a34a 100%)",
    border: "#22c55e",
    bg: "#f0fdf4",
    dot: "#86efac",
    glow: "rgba(34,197,94,0.15)",
    label: "Sub Bagian",
  },
} as const;

// ── KJF style — abu-abu ───────────────────────
const KJF_STYLE = {
  headerGrad: "linear-gradient(135deg, #475569 0%, #64748b 100%)",
  border: "#94a3b8",
  bg: "#f8fafc",
  dot: "#cbd5e1",
  glow: "rgba(148,163,184,0.15)",
};

// ── Tinggi card per unit ──────────────────────
function getCardH(unit: UnitWithStaff): number {
  return isKJF(unit.name) ? CARD_H_KJF : CARD_H;
}

// ── Layout engine ─────────────────────────────
type LNode = {
  unit: UnitWithStaff;
  x: number;
  y: number;
  cx: number;
  h: number; // tinggi card aktual
};

function buildLayout(units: UnitWithStaff[]) {
  const byParent = new Map<number | null, UnitWithStaff[]>();
  for (const u of units) {
    const key = u.parentId ?? null;
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key)!.push(u);
  }

  function stw(uid: number): number {
    const ch = byParent.get(uid) ?? [];
    if (!ch.length) return CARD_W;
    return Math.max(
      ch.reduce((s, c, i) => s + stw(c.id) + (i ? X_GAP : 0), 0),
      CARD_W,
    );
  }

  const nodes: LNode[] = [];

  function place(uid: number, cx: number, y: number) {
    const unit = units.find((u) => u.id === uid)!;
    const h = getCardH(unit);
    nodes.push({ unit, x: cx - CARD_W / 2, y, cx, h });

    const ch = byParent.get(uid) ?? [];
    if (!ch.length) return;
    const ws = ch.map((c) => stw(c.id));
    const totW = ws.reduce((s, w) => s + w, 0) + X_GAP * (ch.length - 1);
    let sx = cx - totW / 2;
    ch.forEach((child, i) => {
      place(child.id, sx + ws[i] / 2, y + h + Y_GAP);
      sx += ws[i] + X_GAP;
    });
  }

  const roots = byParent.get(null) ?? [];
  const rws = roots.map((r) => stw(r.id));
  const totW = rws.reduce((s, w) => s + w, 0) + X_GAP * (roots.length - 1);
  let sx = 0;
  roots.forEach((root, i) => {
    place(root.id, sx + rws[i] / 2, 0);
    sx += rws[i] + X_GAP;
  });

  const maxX = Math.max(...nodes.map((n) => n.x + CARD_W));
  const maxY = Math.max(...nodes.map((n) => n.y + n.h));
  return { nodes, canvasW: maxX, canvasH: maxY };
}

// ── Card KJF — versi ringkas abu-abu ─────────
function KJFCard({ node }: { node: LNode }) {
  const { unit } = node;

  return (
    <foreignObject x={node.x} y={node.y} width={CARD_W} height={CARD_H_KJF}>
      <div
        // @ts-ignore
        xmlns="http://www.w3.org/1999/xhtml"
        style={{
          width: `${CARD_W}px`,
          height: `${CARD_H_KJF}px`,
          background: "#f1f5f9",
          borderRadius: "12px",
          border: `1.5px dashed ${KJF_STYLE.border}`,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column" as const,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Header abu-abu */}
        <div
          style={{
            background: KJF_STYLE.headerGrad,
            height: "28px",
            padding: "0 10px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            flexShrink: 0,
          }}
        >
          {/* Icon fungsional */}
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(255,255,255,0.8)"
            strokeWidth="2"
          >
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
          </svg>
          <span
            style={{
              fontSize: "8px",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "0.5px",
              textTransform: "uppercase" as const,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap" as const,
              lineHeight: 1,
              flex: 1,
            }}
          >
            Kelompok Jabatan Fungsional
          </span>
        </div>

        {/* Body */}
        <div
          style={{
            flex: 1,
            padding: "10px 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
          }}
        >
          {/* Keterangan */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: "10px",
                fontWeight: 600,
                color: "#475569",
                lineHeight: 1.3,
                marginBottom: "3px",
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical" as const,
              }}
            >
              {/* Nama unit tanpa "Kelompok Jabatan Fungsional" prefix */}
              {unit.name
                .replace(/KELOMPOK JABATAN FUNGSIONAL\s*/i, "")
                .trim() || "Jabatan Fungsional"}
            </div>
          </div>

          {/* Badge jumlah */}
          <div
            style={{
              display: "flex",
              flexDirection: "column" as const,
              alignItems: "center",
              justifyContent: "center",
              background: "#e2e8f0",
              borderRadius: "10px",
              padding: "5px 10px",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontSize: "16px",
                fontWeight: 800,
                color: "#475569",
                lineHeight: 1,
              }}
            >
              {unit.staffCount}
            </span>
            <span
              style={{
                fontSize: "7.5px",
                color: "#94a3b8",
                fontWeight: 600,
                marginTop: "2px",
                whiteSpace: "nowrap" as const,
              }}
            >
              pegawai
            </span>
          </div>
        </div>
      </div>
    </foreignObject>
  );
}

// ── Card biasa ────────────────────────────────
function OrgCard({ node }: { node: LNode }) {
  const { unit } = node;

  // Gunakan KJFCard jika ini KJF
  if (isKJF(unit.name)) {
    return <KJFCard node={node} />;
  }

  const lvl = Math.min(unit.level ?? 0, 3) as 0 | 1 | 2 | 3;
  const col = LVL[lvl];
  const head = unit.headStaff;
  const isRoot = lvl === 0;

  return (
    <foreignObject x={node.x} y={node.y} width={CARD_W} height={CARD_H}>
      <div
        // @ts-ignore
        xmlns="http://www.w3.org/1999/xhtml"
        style={{
          width: `${CARD_W}px`,
          height: `${CARD_H}px`,
          background: "#ffffff",
          borderRadius: "14px",
          border: `1.5px solid ${col.border}`,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column" as const,
          boxShadow: isRoot
            ? `0 12px 40px ${col.glow}, 0 0 0 4px ${col.bg}, 0 2px 8px rgba(0,0,0,0.08)`
            : `0 4px 16px ${col.glow}, 0 1px 4px rgba(0,0,0,0.06)`,
          fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: col.headerGrad,
            height: "34px",
            padding: "0 12px",
            display: "flex",
            alignItems: "center",
            gap: "7px",
            flexShrink: 0,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: "-12px",
              top: "-12px",
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.12)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: col.dot,
              flexShrink: 0,
              boxShadow: `0 0 6px ${col.dot}, 0 0 12px ${col.dot}`,
            }}
          />
          <span
            style={{
              fontSize: "8.5px",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "0.6px",
              textTransform: "uppercase" as const,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap" as const,
              lineHeight: 1,
              flex: 1,
            }}
          >
            {unit.shortName}
          </span>
          <span
            style={{
              fontSize: "7.5px",
              fontWeight: 700,
              color: "rgba(255,255,255,0.7)",
              background: "rgba(0,0,0,0.2)",
              padding: "2px 6px",
              borderRadius: "20px",
              whiteSpace: "nowrap" as const,
              flexShrink: 0,
            }}
          >
            {col.label}
          </span>
        </div>

        {/* Body */}
        <div
          style={{
            flex: 1,
            padding: "10px 12px 8px",
            display: "flex",
            flexDirection: "column" as const,
            gap: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flex: 1,
            }}
          >
            {/* Foto */}
            <div
              style={{
                width: "50px",
                height: "50px",
                minWidth: "50px",
                borderRadius: "50%",
                overflow: "hidden",
                border: `2.5px solid ${col.border}`,
                background: col.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 0 0 3px ${col.bg}`,
                flexShrink: 0,
              }}
            >
              {head?.photo ? (
                <img
                  src={head.photo}
                  alt={head.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top",
                  }}
                />
              ) : (
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={col.border}
                  strokeWidth="1.5"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              )}
            </div>

            {/* Teks */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: isRoot ? "12.5px" : "11.5px",
                  fontWeight: 700,
                  color: "#0f172a",
                  lineHeight: 1.25,
                  marginBottom: "4px",
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical" as const,
                }}
              >
                {head?.name ?? "Belum diisi"}
              </div>
              {head?.position && (
                <div
                  style={{
                    fontSize: "8.5px",
                    color: "#94a3b8",
                    lineHeight: 1.35,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical" as const,
                  }}
                >
                  {head.position}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "7px",
              borderTop: "1px solid #f1f5f9",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                background: col.bg,
                padding: "3px 8px",
                borderRadius: "20px",
                border: `1px solid ${col.border}20`,
              }}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke={col.border}
                strokeWidth="2"
              >
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
              <span
                style={{
                  fontSize: "9px",
                  fontWeight: 600,
                  color: col.border,
                  lineHeight: 1,
                }}
              >
                {unit.staffCount} pegawai
              </span>
            </div>
          </div>
        </div>
      </div>
    </foreignObject>
  );
}

// ── Garis konektor — semua hitam ──────────────
function Connectors({
  nodes,
  units,
}: {
  nodes: LNode[];
  units: UnitWithStaff[];
}) {
  const nmap = new Map(nodes.map((n) => [n.unit.id, n]));
  return (
    <>
      {units.map((unit) => {
        if (!unit.parentId) return null;
        const p = nmap.get(unit.parentId);
        const c = nmap.get(unit.id);
        if (!p || !c) return null;

        const x1 = p.cx;
        const y1 = p.y + p.h; // pakai tinggi card parent yang sebenarnya
        const x2 = c.cx;
        const y2 = c.y;
        const ym = y1 + (y2 - y1) / 2;

        // Garis putus-putus untuk koneksi ke KJF
        const isKjf = isKJF(unit.name);
        const dashArr = isKjf ? "5 4" : "none";
        const opacity = isKjf ? 0.4 : 0.6;

        return (
          <path
            key={`${p.unit.id}-${unit.id}`}
            d={`M ${x1} ${y1} L ${x1} ${ym} L ${x2} ${ym} L ${x2} ${y2}`}
            fill="none"
            stroke="#1e293b" // ← semua hitam
            strokeWidth={isKjf ? 1.5 : 2}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={dashArr}
            opacity={opacity}
          />
        );
      })}
    </>
  );
}

// ── Legend ────────────────────────────────────
const LEGEND = [
  { color: "#dc2626", label: "Pimpinan" },
  { color: "#3b82f6", label: "Sekretariat / Bidang" },
  { color: "#22c55e", label: "Sub Bagian" },
  { color: "#64748b", label: "Kelompok Jabatan Fungsional", dashed: true },
];

// ── Main ──────────────────────────────────────
export function OrgChart({ units }: Props) {
  const { nodes, canvasW, canvasH } = useMemo(
    () => buildLayout(units),
    [units],
  );

  const svgW = canvasW + PAD * 2;
  const svgH = canvasH + PAD * 2;

  if (!units.length) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "60px",
          color: "var(--color-ink-4)",
        }}
      >
        <div style={{ fontSize: "40px", marginBottom: "12px" }}>🏢</div>
        <p style={{ fontSize: "14px" }}>
          Data struktur organisasi belum tersedia.
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
          flexWrap: "wrap",
          marginBottom: "14px",
          padding: "10px 16px",
          background: "var(--color-ink-8)",
          borderRadius: "10px",
          border: "1px solid var(--color-ink-6)",
          alignItems: "center",
        }}
      >
        {LEGEND.map((l) => (
          <div
            key={l.label}
            style={{ display: "flex", alignItems: "center", gap: "7px" }}
          >
            {l.dashed ? (
              <svg width="20" height="10">
                <line
                  x1="0"
                  y1="5"
                  x2="20"
                  y2="5"
                  stroke={l.color}
                  strokeWidth="2"
                  strokeDasharray="4 3"
                />
              </svg>
            ) : (
              <div
                style={{
                  width: "9px",
                  height: "9px",
                  borderRadius: "50%",
                  background: l.color,
                  boxShadow: `0 0 5px ${l.color}60`,
                }}
              />
            )}
            <span
              style={{
                fontSize: "12px",
                color: "var(--color-ink-3)",
                fontWeight: 500,
              }}
            >
              {l.label}
            </span>
          </div>
        ))}
        <span
          style={{
            marginLeft: "auto",
            fontSize: "11px",
            color: "var(--color-ink-5)",
          }}
        >
          💡 Scroll untuk melihat seluruh struktur
        </span>
      </div>

      {/* Chart */}
      <div
        style={{
          border: "1px solid var(--color-ink-6)",
          borderRadius: "16px",
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
          overflow: "auto",
          maxHeight: "720px",
          position: "relative",
        }}
      >
        {/* Background grid */}
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            opacity: 0.4,
          }}
        >
          <defs>
            <pattern
              id="dots"
              x="0"
              y="0"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1" fill="#cbd5e1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>

        {/* SVG utama */}
        <svg
          width={svgW}
          height={svgH}
          style={{ display: "block", minWidth: "100%", position: "relative" }}
        >
          <g transform={`translate(${PAD}, ${PAD})`}>
            <Connectors nodes={nodes} units={units} />
            {nodes.map((node) => (
              <OrgCard key={node.unit.id} node={node} />
            ))}
          </g>
        </svg>
      </div>

      <p
        style={{
          textAlign: "center",
          marginTop: "10px",
          fontSize: "11.5px",
          color: "var(--color-ink-5)",
        }}
      >
        Data diperbarui sesuai database kepegawaian BPSDM Kaltim
      </p>
    </div>
  );
}
