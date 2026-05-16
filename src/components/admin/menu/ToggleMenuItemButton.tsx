// src/components/admin/menu/ToggleMenuItemButton.tsx
"use client";

import { useState, useTransition } from "react";
import { toggleMenuItemActive } from "@/lib/actions/menu";

type Props = { id: number; isActive: boolean };

export function ToggleMenuItemButton({ id, isActive: initial }: Props) {
  const [isActive, setIsActive] = useState(initial);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await toggleMenuItemActive(id, !isActive);
      setIsActive((v) => !v);
    });
  }

  return (
    <button
      onClick={handleToggle}
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
        style={{
          transform: isActive ? "translateX(18px)" : "translateX(2px)",
        }}
      />
    </button>
  );
}
