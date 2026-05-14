// src/components/admin/AdminHeader.tsx
"use client";

import { signOut } from "next-auth/react";
import type { Session } from "next-auth";

type Props = {
  user: Session["user"];
};

const ROLE_LABELS: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  superadmin: { label: "Super Admin", color: "#7e22ce", bg: "#fdf4ff" },
  admin: {
    label: "Admin",
    color: "var(--color-forest-700)",
    bg: "var(--color-forest-50)",
  },
  editor: { label: "Editor", color: "#1d4ed8", bg: "#eff6ff" },
  viewer: {
    label: "Viewer",
    color: "var(--color-ink-4)",
    bg: "var(--color-ink-7)",
  },
};

export function AdminHeader({ user }: Props) {
  const role = (user as any).role ?? "viewer";
  const username = (user as any).username ?? "";
  const groups = (user as any).groups ?? [];
  const roleInfo = ROLE_LABELS[role] ?? ROLE_LABELS.viewer;

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <div className="admin-header-greeting">
          Halo, <strong>{user.name ?? username}</strong>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginTop: "2px",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: "20px",
              backgroundColor: roleInfo.bg,
              color: roleInfo.color,
              letterSpacing: "0.3px",
            }}
          >
            {roleInfo.label}
          </span>
          {groups.slice(0, 3).map((g: string) => (
            <span
              key={g}
              style={{
                fontSize: "10px",
                padding: "2px 7px",
                borderRadius: "20px",
                backgroundColor: "var(--color-ink-7)",
                color: "var(--color-ink-4)",
              }}
            >
              {g}
            </span>
          ))}
        </div>
      </div>

      <div className="admin-header-right">
        {/* Username badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 12px",
            background: "var(--color-ink-8)",
            borderRadius: "8px",
            border: "1px solid var(--color-ink-6)",
          }}
        >
          <div
            className="admin-user-avatar"
            style={{ width: "28px", height: "28px", fontSize: "12px" }}
          >
            {user.name?.charAt(0).toUpperCase() ?? "U"}
          </div>
          <div>
            <div className="admin-user-name" style={{ fontSize: "12.5px" }}>
              @{username}
            </div>
            <div className="admin-user-email" style={{ fontSize: "10.5px" }}>
              {user.email}
            </div>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="admin-logout-btn"
          aria-label="Keluar"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Keluar
        </button>
      </div>
    </header>
  );
}
