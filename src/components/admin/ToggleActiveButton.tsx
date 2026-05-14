// src/components/admin/ToggleActiveButton.tsx
"use client";

import { useState, useTransition } from "react";
import { toggleAnnouncementActive } from "@/lib/actions/announcements";

type Props = {
  id: number;
  isActive: boolean;
};

export function ToggleActiveButton({ id, isActive: initialActive }: Props) {
  const [active, setActive] = useState(initialActive);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await toggleAnnouncementActive(id, !active);
      setActive((prev) => !prev);
    });
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className="toggle-btn"
      style={{
        backgroundColor: active
          ? "var(--color-forest-700)"
          : "var(--color-ink-6)",
      }}
      aria-label={active ? "Nonaktifkan" : "Aktifkan"}
      title={active ? "Klik untuk nonaktifkan" : "Klik untuk aktifkan"}
    >
      <div
        className="toggle-thumb"
        style={{
          transform: active ? "translateX(18px)" : "translateX(2px)",
        }}
      />
    </button>
  );
}
