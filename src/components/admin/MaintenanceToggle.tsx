// src/components/admin/MaintenanceToggle.tsx
"use client";

import { useState, useTransition } from "react";
import { updateSetting } from "@/lib/actions/settings";

type Props = { currentValue: string };

export function MaintenanceToggle({ currentValue }: Props) {
  const [enabled, setEnabled] = useState(currentValue === "true");
  const [isPending, startT] = useTransition();

  async function toggle() {
    const next = !enabled;
    setEnabled(next);
    startT(async () => {
      await updateSetting("maintenance_mode", next ? "true" : "false");
    });
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      {enabled && (
        <span
          style={{
            padding: "3px 10px",
            borderRadius: "20px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            fontSize: "12px",
            fontWeight: 700,
            color: "#dc2626",
          }}
        >
          AKTIF
        </span>
      )}
      <button
        onClick={toggle}
        disabled={isPending}
        aria-label={
          enabled ? "Nonaktifkan maintenance" : "Aktifkan maintenance"
        }
        style={{
          width: "52px",
          height: "28px",
          borderRadius: "14px",
          background: enabled ? "#dc2626" : "var(--color-ink-5)",
          border: "none",
          cursor: isPending ? "wait" : "pointer",
          position: "relative",
          transition: "background 0.2s",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: "absolute",
            top: "3px",
            left: enabled ? "27px" : "3px",
            width: "22px",
            height: "22px",
            borderRadius: "50%",
            background: "#fff",
            transition: "left 0.2s",
            boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
          }}
        />
      </button>
    </div>
  );
}
