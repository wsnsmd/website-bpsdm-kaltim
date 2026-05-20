// src/components/ppid/PpidOrgChart.tsx
"use client";

import { useCallback, useEffect } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// ── Custom Node ───────────────────────────────
function OrgNode({ data }: NodeProps) {
  const d = data as {
    jabatan: string;
    nama: string;
    bg: string;
    shadow: string;
    width: number;
  };

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#94a3b8", border: "none", width: 8, height: 8 }}
      />

      <div
        style={{
          width: `${d.width}px`,
          padding: "12px 16px",
          borderRadius: "6px",
          background: d.bg,
          boxShadow: `0 4px 16px ${d.shadow}, 0 2px 4px rgba(0,0,0,0.2)`,
          textAlign: "center",
          border: "1px solid rgba(255,255,255,0.25)",
          cursor: "default",
        }}
      >
        <div
          style={{
            fontSize: "11.5px",
            fontWeight: 800,
            color: "#fff",
            letterSpacing: "0.4px",
            lineHeight: 1.35,
            marginBottom: "7px",
            textTransform: "uppercase",
          }}
        >
          {d.jabatan}
        </div>
        <div
          style={{
            width: "55%",
            height: "1px",
            background: "rgba(255,255,255,0.45)",
            margin: "0 auto 7px",
          }}
        />
        <div
          style={{
            fontSize: "11px",
            color: "rgba(255,255,255,0.9)",
            lineHeight: 1.35,
            fontWeight: 600,
          }}
        >
          {d.nama}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: "#94a3b8", border: "none", width: 8, height: 8 }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        style={{ background: "#94a3b8", border: "none", width: 8, height: 8 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{ background: "#94a3b8", border: "none", width: 8, height: 8 }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left-in"
        style={{ background: "#94a3b8", border: "none", width: 8, height: 8 }}
      />
    </>
  );
}

const nodeTypes = { org: OrgNode };

// ── Nodes ──────────────────────────────────────
// Layout:
//   PJ     = x:300, y:0
//   Ketua  = x:300, y:160
//   Sekr   = x:600, y:320   (offset kanan, rata dengan garis ketua→bidang)
//   Bidang = x:0/300/600, y:500
//
const INIT_NODES: Node[] = [
  {
    id: "pj",
    type: "org",
    position: { x: 225, y: 0 },
    data: {
      jabatan: "Penanggung Jawab",
      nama: "Kepala Badan",
      bg: "linear-gradient(135deg, #f59e0b, #d97706)",
      shadow: "rgba(245,158,11,0.4)",
      width: 200,
    },
    draggable: false,
  },
  {
    id: "ketua",
    type: "org",
    position: { x: 200, y: 160 },
    data: {
      jabatan: "Ketua",
      nama: "Sekretaris",
      bg: "linear-gradient(135deg, #eab308, #ca8a04)",
      shadow: "rgba(234,179,8,0.4)",
      width: 250,
    },
    draggable: false,
  },
  {
    id: "sekr",
    type: "org",
    position: { x: 510, y: 250 },
    data: {
      jabatan: "Sekretaris",
      nama: "Kepala Sub Bagian Umum",
      bg: "linear-gradient(135deg, #60a5fa, #3b82f6)",
      shadow: "rgba(59,130,246,0.4)",
      width: 220,
    },
    draggable: false,
  },
  {
    id: "b1",
    type: "org",
    position: { x: 0, y: 500 },
    data: {
      jabatan: "Bidang Pengolah Data dan Klasifikasi Informasi",
      nama: "Kabid. Sertifikasi Kompetensi dan Pengelolaan Kelembagaan",
      bg: "linear-gradient(135deg, #60a5fa, #3b82f6)",
      shadow: "rgba(59,130,246,0.4)",
      width: 210,
    },
    draggable: false,
  },
  {
    id: "b2",
    type: "org",
    position: { x: 220, y: 500 },
    data: {
      jabatan: "Bidang Pelayanan dan Dokumentasi Informasi",
      nama: "Kabid. Pengembangan Kompetensi Manajerial dan Fungsional",
      bg: "linear-gradient(135deg, #60a5fa, #3b82f6)",
      shadow: "rgba(59,130,246,0.4)",
      width: 210,
    },
    draggable: false,
  },
  {
    id: "b3",
    type: "org",
    position: { x: 440, y: 500 },
    data: {
      jabatan: "Bidang Klarifikasi dan Penyelesaian Sengketa Informasi",
      nama: "Kabid. Pengembangan Kompetensi Teknis",
      bg: "linear-gradient(135deg, #60a5fa, #3b82f6)",
      shadow: "rgba(59,130,246,0.4)",
      width: 210,
    },
    draggable: false,
  },
];

// ── Edges ─────────────────────────────────────
const EDGE_STYLE = {
  stroke: "#94a3b8",
  strokeWidth: 2,
};

const INIT_EDGES: Edge[] = [
  // PJ → Ketua
  {
    id: "pj-ketua",
    source: "pj",
    target: "ketua",
    type: "smoothstep",
    style: EDGE_STYLE,
  },
  // Ketua → Sekretaris (ke kanan)
  {
    id: "ketua-sekr",
    source: "ketua",
    target: "sekr",
    targetHandle: "left-in",
    type: "smoothstep",
    style: EDGE_STYLE,
  },
  // Ketua → B1
  {
    id: "ketua-b1",
    source: "ketua",
    target: "b1",
    type: "smoothstep",
    style: EDGE_STYLE,
  },
  // Ketua → B2
  {
    id: "ketua-b2",
    source: "ketua",
    target: "b2",
    type: "smoothstep",
    style: EDGE_STYLE,
  },
  // Ketua → B3
  {
    id: "ketua-b3",
    source: "ketua",
    target: "b3",
    type: "smoothstep",
    style: EDGE_STYLE,
  },
];

// ── Chart Component ───────────────────────────
export function PpidOrgChart() {
  const [nodes, , onNodesChange] = useNodesState(INIT_NODES);
  const [edges, , onEdgesChange] = useEdgesState(INIT_EDGES);

  return (
    <div
      style={{
        width: "100%",
        height: "620px",
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
        fitViewOptions={{ padding: 0.15 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={true}
        zoomOnScroll={true}
        minZoom={0.5}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#cbd5e1"
        />
      </ReactFlow>
    </div>
  );
}
