// src/components/profil/OrgChart.tsx
"use client";

import { useMemo } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  BackgroundVariant,
  Controls,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { UnitItem } from "@/lib/queries/profil";

type Props = { units: UnitItem[] };

// ── Level config ──────────────────────────────
const LEVEL_CONFIG = [
  {
    bg: "linear-gradient(135deg, #0e3d20, #1e7a40)",
    shadow: "rgba(14,61,32,0.4)",
    width: 220,
  },
  {
    bg: "linear-gradient(135deg, #1e7a40, #339770)",
    shadow: "rgba(30,122,64,0.35)",
    width: 200,
  },
  {
    bg: "linear-gradient(135deg, #60a5fa, #3b82f6)",
    shadow: "rgba(59,130,246,0.35)",
    width: 190,
  },
  {
    bg: "linear-gradient(135deg, #94a3b8, #64748b)",
    shadow: "rgba(100,116,139,0.3)",
    width: 180,
  },
];

// ── Custom Node ───────────────────────────────
function OrgNode({ data }: NodeProps) {
  const d = data as {
    name: string;
    shortName: string | null;
    level: number;
    bg: string;
    shadow: string;
    width: number;
  };

  const cfg = LEVEL_CONFIG[Math.min(d.level, 3)];
  const isRoot = d.level === 0;

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#94a3b8", border: "none", width: 8, height: 8 }}
      />

      <div
        style={{
          width: `${cfg.width}px`,
          padding: isRoot ? "14px 20px" : "10px 14px",
          borderRadius: "10px",
          background: cfg.bg,
          boxShadow: `0 4px 16px ${cfg.shadow}, 0 2px 4px rgba(0,0,0,0.15)`,
          textAlign: "center",
          border: "1px solid rgba(255,255,255,0.2)",
          cursor: "default",
        }}
      >
        <div
          style={{
            fontSize: isRoot ? "13px" : d.level === 1 ? "12px" : "11px",
            fontWeight: 700,
            color: "#fff",
            lineHeight: 1.35,
            fontFamily: "Poppins, system-ui, sans-serif",
          }}
        >
          {d.name}
        </div>
        {d.shortName && d.level > 0 && (
          <div
            style={{
              fontSize: "10px",
              color: "rgba(255,255,255,0.65)",
              marginTop: "3px",
            }}
          >
            ({d.shortName})
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: "#94a3b8", border: "none", width: 8, height: 8 }}
      />
    </>
  );
}

const nodeTypes = { org: OrgNode };

const EDGE_STYLE = { stroke: "#94a3b8", strokeWidth: 1.5 };

// ── Layout engine ─────────────────────────────
function buildGraph(units: UnitItem[]): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Group by parentId
  const byParent = new Map<number | null, UnitItem[]>();
  for (const u of units) {
    const key = u.parentId ?? null;
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key)!.push(u);
  }

  const X_GAP = 220;
  const Y_GAP = 130;
  const posMap = new Map<number, { x: number; y: number }>();

  // BFS layout
  function layout(parentId: number | null, startX: number, y: number): number {
    const children = byParent.get(parentId) ?? [];
    if (children.length === 0) return startX;

    let currentX = startX;
    const childPositions: number[] = [];

    for (const child of children) {
      const childWidth = X_GAP;
      const subtreeEnd = layout(child.id, currentX, y + Y_GAP);
      const centerX = (currentX + subtreeEnd) / 2;
      childPositions.push(centerX);
      posMap.set(child.id, {
        x: centerX - LEVEL_CONFIG[Math.min(child.level ?? 0, 3)].width / 2,
        y,
      });
      currentX = subtreeEnd + X_GAP;
    }

    return currentX;
  }

  // Root nodes
  const roots = byParent.get(null) ?? [];
  let rx = 0;
  for (const root of roots) {
    const end = layout(root.id, rx, Y_GAP);
    const cx = (rx + end) / 2;
    posMap.set(root.id, { x: cx - LEVEL_CONFIG[0].width / 2, y: 0 });
    rx = end + X_GAP;
  }

  // Build nodes
  for (const unit of units) {
    const pos = posMap.get(unit.id) ?? { x: 0, y: 0 };
    const lvl = unit.level ?? 0;
    const cfg = LEVEL_CONFIG[Math.min(lvl, 3)];

    nodes.push({
      id: String(unit.id),
      type: "org",
      position: pos,
      data: {
        name: unit.name,
        shortName: unit.shortName ?? null,
        level: lvl,
        bg: cfg.bg,
        shadow: cfg.shadow,
        width: cfg.width,
      },
      draggable: false,
    });
  }

  // Build edges
  for (const unit of units) {
    if (unit.parentId != null) {
      edges.push({
        id: `e-${unit.parentId}-${unit.id}`,
        source: String(unit.parentId),
        target: String(unit.id),
        type: "smoothstep",
        style: EDGE_STYLE,
      });
    }
  }

  return { nodes, edges };
}

// ── Legend ────────────────────────────────────
const LEGEND = [
  { bg: "linear-gradient(135deg, #0e3d20, #1e7a40)", label: "Pimpinan" },
  { bg: "linear-gradient(135deg, #1e7a40, #339770)", label: "Sekretariat" },
  { bg: "linear-gradient(135deg, #60a5fa, #3b82f6)", label: "Bidang / UPT" },
  { bg: "linear-gradient(135deg, #94a3b8, #64748b)", label: "Sub Bagian" },
];

// ── Main Component ────────────────────────────
export function OrgChart({ units }: Props) {
  const { nodes: initNodes, edges: initEdges } = useMemo(
    () => buildGraph(units),
    [units],
  );

  const [nodes, , onNodesChange] = useNodesState(initNodes);
  const [edges, , onEdgesChange] = useEdgesState(initEdges);

  if (units.length === 0) {
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
          marginBottom: "16px",
          flexWrap: "wrap",
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
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
            }}
          >
            <div
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "4px",
                background: l.bg,
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
              {l.label}
            </span>
          </div>
        ))}
        <div
          style={{
            marginLeft: "auto",
            fontSize: "11px",
            color: "var(--color-ink-5)",
          }}
        >
          💡 Scroll & pinch untuk zoom · Drag untuk geser
        </div>
      </div>

      {/* Chart */}
      <div
        style={{
          width: "100%",
          height: "600px",
          borderRadius: "12px",
          border: "1px solid var(--color-ink-6)",
          background: "#f8fafc",
          overflow: "hidden",
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag={true}
          zoomOnScroll={true}
          zoomOnPinch={true}
          minZoom={0.3}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="#cbd5e1"
          />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>

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
        Geser dan zoom untuk melihat seluruh struktur organisasi
      </div>
    </div>
  );
}
