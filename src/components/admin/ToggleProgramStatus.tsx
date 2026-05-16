// src/components/admin/ToggleProgramStatus.tsx
"use client";

import { useState, useTransition } from "react";
import { toggleProgramStatus } from "@/lib/actions/programs";

type Props = {
  id: number;
  status: "active" | "inactive";
};

export function ToggleProgramStatus({ id, status: initialStatus }: Props) {
  const [status, setStatus] = useState(initialStatus);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    const next = status === "active" ? "inactive" : "active";
    startTransition(async () => {
      await toggleProgramStatus(id, next);
      setStatus(next);
    });
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className="toggle-btn"
      style={{
        backgroundColor:
          status === "active"
            ? "var(--color-forest-700)"
            : "var(--color-ink-6)",
      }}
      aria-label={status === "active" ? "Nonaktifkan" : "Aktifkan"}
    >
      <div
        className="toggle-thumb"
        style={{
          transform:
            status === "active" ? "translateX(18px)" : "translateX(2px)",
        }}
      />
    </button>
  );
}
