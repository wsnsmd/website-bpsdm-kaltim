// src/components/admin/UserStatusButton.tsx
"use client";

import { useState, useTransition } from "react";
import { updateUserStatus } from "@/lib/actions/users";

type Status = "active" | "inactive" | "suspended";

type Props = {
  userId: string;
  currentStatus: Status;
  isSelf: boolean;
};

const STATUS_NEXT: Record<Status, Status> = {
  active: "inactive",
  inactive: "active",
  suspended: "active",
};

export function UserStatusButton({ userId, currentStatus, isSelf }: Props) {
  const [status, setStatus] = useState<Status>(currentStatus);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    if (isSelf) return;
    const next = STATUS_NEXT[status];
    startTransition(async () => {
      const result = await updateUserStatus(userId, next);
      if (!result.error) setStatus(next);
    });
  }

  if (isSelf) {
    return (
      <span
        style={{
          fontSize: "11px",
          color: "var(--color-ink-5)",
          fontStyle: "italic",
        }}
      >
        (akun Anda)
      </span>
    );
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
      title={
        status === "active" ? "Klik untuk nonaktifkan" : "Klik untuk aktifkan"
      }
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
