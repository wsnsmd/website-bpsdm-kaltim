// src/components/admin/platform/TogglePlatformButton.tsx
"use client";
import { useState, useTransition } from "react";
import { togglePlatformActive } from "@/lib/actions/platforms";

export function TogglePlatformButton({
  id,
  isActive: init,
}: {
  id: number;
  isActive: boolean;
}) {
  const [isActive, setIsActive] = useState(init);
  const [isPending, start] = useTransition();

  return (
    <button
      onClick={() =>
        start(async () => {
          await togglePlatformActive(id, !isActive);
          setIsActive((v) => !v);
        })
      }
      disabled={isPending}
      className="toggle-btn"
      style={{
        backgroundColor: isActive
          ? "var(--color-forest-700)"
          : "var(--color-ink-6)",
      }}
    >
      <div
        className="toggle-thumb"
        style={{ transform: isActive ? "translateX(18px)" : "translateX(2px)" }}
      />
    </button>
  );
}
