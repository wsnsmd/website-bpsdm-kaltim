// src/app/admin/pengguna/page.tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUsers, countUsers } from "@/lib/queries/users";
import { UserStatusButton } from "@/components/admin/UserStatusButton";
import { formatDate, timeAgo } from "@/lib/utils";
import {
  Users,
  ShieldCheck,
  Shield,
  Eye,
  Clock,
  UserCheck,
  UserX,
  Info,
} from "lucide-react";

export const metadata: Metadata = { title: "Manajemen Pengguna" };

const ROLE_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; icon: typeof Shield }
> = {
  superadmin: {
    label: "Super Admin",
    color: "#7e22ce",
    bg: "#fdf4ff",
    icon: ShieldCheck,
  },
  admin: {
    label: "Admin",
    color: "var(--color-forest-700)",
    bg: "var(--color-forest-50)",
    icon: Shield,
  },
  editor: { label: "Editor", color: "#1d4ed8", bg: "#eff6ff", icon: Shield },
  piawan: {
    label: "Piawan",
    color: "var(--color-gold-700)",
    bg: "var(--color-gold-100)",
    icon: Shield,
  },
  viewer: {
    label: "Viewer",
    color: "var(--color-ink-4)",
    bg: "var(--color-ink-7)",
    icon: Eye,
  },
};

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  active: { label: "Aktif", cls: "status-pill-active" },
  inactive: { label: "Nonaktif", cls: "status-pill-inactive" },
  suspended: { label: "Ditangguhkan", cls: "status-pill-full" },
};

export default async function AdminPenggunaPage() {
  const session = await auth();
  const currentUserId = session?.user?.id ?? "";
  const currentRole = (session?.user as any)?.role ?? "viewer";

  // Hanya superadmin yang bisa akses
  if (currentRole !== "superadmin") {
    redirect("/admin");
  }

  const [userList, total] = await Promise.all([
    getUsers({ limit: 100 }),
    countUsers(),
  ]);

  // Statistik
  const stats = {
    total,
    active: userList.filter((u) => u.status === "active").length,
    inactive: userList.filter((u) => u.status === "inactive").length,
    superadmin: userList.filter((u) => u.role === "superadmin").length,
    admin: userList.filter((u) => u.role === "admin").length,
  };

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Manajemen Pengguna</h1>
          <p className="admin-page-sub">
            {total} pengguna terdaftar via SSO Authentik
          </p>
        </div>
      </div>

      {/* Info SSO */}
      <div className="ann-info-box" style={{ marginBottom: "20px" }}>
        <Info size={16} style={{ flexShrink: 0 }} />
        <span>
          Pengguna dikelola melalui <strong>SSO Authentik BPSDM Kaltim</strong>.
          Untuk menambah atau menghapus pengguna, lakukan di panel Authentik. Di
          sini hanya dapat mengatur status akses ke panel admin.
        </span>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "14px",
          marginBottom: "24px",
        }}
      >
        {[
          {
            label: "Total Pengguna",
            value: stats.total,
            icon: Users,
            color: "var(--color-forest-700)",
            bg: "var(--color-forest-50)",
          },
          {
            label: "Aktif",
            value: stats.active,
            icon: UserCheck,
            color: "#16a34a",
            bg: "#f0fdf4",
          },
          {
            label: "Nonaktif",
            value: stats.inactive,
            icon: UserX,
            color: "#dc2626",
            bg: "#fef2f2",
          },
          {
            label: "Super Admin",
            value: stats.superadmin,
            icon: ShieldCheck,
            color: "#7e22ce",
            bg: "#fdf4ff",
          },
          {
            label: "Admin",
            value: stats.admin,
            icon: Shield,
            color: "var(--color-forest-700)",
            bg: "var(--color-forest-50)",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="admin-stat-card"
            style={{ gap: "10px" }}
          >
            <div className="admin-stat-icon" style={{ backgroundColor: s.bg }}>
              <s.icon size={20} style={{ color: s.color }} strokeWidth={1.5} />
            </div>
            <div>
              <div className="admin-stat-value" style={{ fontSize: "26px" }}>
                {s.value}
              </div>
              <div className="admin-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabel */}
      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Akses Admin</th>
                <th>Pengguna</th>
                <th>Role</th>
                <th>Groups Authentik</th>
                <th>Status</th>
                <th>Login Terakhir</th>
                <th>Terdaftar</th>
              </tr>
            </thead>
            <tbody>
              {userList.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "var(--color-ink-4)",
                    }}
                  >
                    Belum ada pengguna yang login via SSO.
                  </td>
                </tr>
              )}
              {userList.map((user) => {
                const isSelf = user.id === currentUserId;
                const roleCfg = ROLE_CONFIG[user.role] ?? ROLE_CONFIG.viewer;
                const statusCfg =
                  STATUS_CONFIG[user.status] ?? STATUS_CONFIG.inactive;
                const RoleIcon = roleCfg.icon;

                // Parse groups dari JSON
                let groups: string[] = [];
                try {
                  groups = user.authentikGroups
                    ? JSON.parse(user.authentikGroups)
                    : [];
                } catch {
                  groups = [];
                }

                return (
                  <tr
                    key={user.id}
                    style={{
                      opacity: user.status === "inactive" ? 0.6 : 1,
                    }}
                  >
                    {/* Toggle akses */}
                    <td>
                      <UserStatusButton
                        userId={user.id}
                        currentStatus={user.status as any}
                        isSelf={isSelf}
                      />
                    </td>

                    {/* Info pengguna */}
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        {/* Avatar */}
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            backgroundColor: roleCfg.bg,
                            border: `2px solid ${roleCfg.color}30`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "14px",
                            fontWeight: 700,
                            color: roleCfg.color,
                            flexShrink: 0,
                          }}
                        >
                          {user.name?.charAt(0).toUpperCase() ?? "?"}
                        </div>
                        <div>
                          <div
                            style={{
                              fontWeight: 600,
                              fontSize: "13.5px",
                              color: "var(--color-ink)",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            {user.name}
                            {isSelf && (
                              <span
                                style={{
                                  fontSize: "10px",
                                  fontWeight: 700,
                                  color: "var(--color-forest-700)",
                                  background: "var(--color-forest-50)",
                                  padding: "1px 7px",
                                  borderRadius: "20px",
                                  border: "1px solid var(--color-forest-200)",
                                }}
                              >
                                Anda
                              </span>
                            )}
                          </div>
                          <div
                            style={{
                              fontSize: "11.5px",
                              color: "var(--color-ink-4)",
                              marginTop: "1px",
                            }}
                          >
                            @{user.username} · {user.email ?? "—"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          padding: "4px 10px",
                          borderRadius: "20px",
                          backgroundColor: roleCfg.bg,
                          color: roleCfg.color,
                          fontSize: "12px",
                          fontWeight: 700,
                        }}
                      >
                        <RoleIcon size={12} />
                        {roleCfg.label}
                      </div>
                    </td>

                    {/* Groups Authentik */}
                    <td>
                      <div
                        style={{
                          display: "flex",
                          gap: "4px",
                          flexWrap: "wrap",
                        }}
                      >
                        {groups.length === 0 ? (
                          <span
                            style={{
                              fontSize: "12px",
                              color: "var(--color-ink-5)",
                            }}
                          >
                            —
                          </span>
                        ) : (
                          groups.map((g) => (
                            <span
                              key={g}
                              style={{
                                fontSize: "10.5px",
                                fontWeight: 600,
                                padding: "2px 8px",
                                borderRadius: "20px",
                                background: "var(--color-ink-7)",
                                color: "var(--color-ink-3)",
                                border: "1px solid var(--color-ink-6)",
                              }}
                            >
                              {g}
                            </span>
                          ))
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td>
                      <span className={`status-pill ${statusCfg.cls}`}>
                        {statusCfg.label}
                      </span>
                    </td>

                    {/* Login terakhir */}
                    <td style={{ whiteSpace: "nowrap" }}>
                      {user.lastLoginAt ? (
                        <div>
                          <div
                            style={{
                              fontSize: "12.5px",
                              color: "var(--color-ink-2)",
                              fontWeight: 500,
                            }}
                          >
                            {timeAgo(user.lastLoginAt)}
                          </div>
                          <div
                            style={{
                              fontSize: "11px",
                              color: "var(--color-ink-5)",
                              display: "flex",
                              alignItems: "center",
                              gap: "3px",
                              marginTop: "2px",
                            }}
                          >
                            <Clock size={10} />
                            {formatDate(user.lastLoginAt, {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      ) : (
                        <span
                          style={{
                            fontSize: "12px",
                            color: "var(--color-ink-5)",
                          }}
                        >
                          Belum pernah
                        </span>
                      )}
                    </td>

                    {/* Terdaftar */}
                    <td
                      style={{
                        fontSize: "12px",
                        color: "var(--color-ink-4)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatDate(user.createdAt, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
