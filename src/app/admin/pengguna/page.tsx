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
      <div className="ann-info-box mb-5">
        <Info size={16} className="shrink-0" />
        <span>
          Pengguna dikelola melalui <strong>SSO Authentik BPSDM Kaltim</strong>.
          Untuk menambah atau menghapus pengguna, lakukan di panel Authentik. Di
          sini hanya dapat mengatur status akses ke panel admin.
        </span>
      </div>

      {/* ── Stats Grid (2 Kolom HP -> 5 Kolom Desktop) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-6">
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
          <div key={s.label} className="admin-stat-card !gap-2.5">
            <div className="admin-stat-icon" style={{ backgroundColor: s.bg }}>
              <s.icon size={20} style={{ color: s.color }} strokeWidth={1.5} />
            </div>
            <div>
              <div className="admin-stat-value text-[26px]">{s.value}</div>
              <div className="admin-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tabel Pengguna ── */}
      <div className="admin-card">
        {/* Wrapper min-w memberikan fitur geser / horizontal scroll di layar kecil */}
        <div className="admin-table-wrap">
          <table className="admin-table min-w-[900px]">
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
                    className="text-center py-10 text-[var(--color-ink-4)]"
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
                    className={
                      user.status === "inactive" ? "opacity-60" : "opacity-100"
                    }
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
                      <div className="flex items-center gap-2.5">
                        {/* Avatar */}
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 border-2"
                          style={{
                            backgroundColor: roleCfg.bg,
                            borderColor: `${roleCfg.color}30`,
                            color: roleCfg.color,
                          }}
                        >
                          {user.name?.charAt(0).toUpperCase() ?? "?"}
                        </div>
                        <div>
                          <div className="font-semibold text-[13.5px] text-[var(--color-ink)] flex items-center gap-1.5">
                            {user.name}
                            {isSelf && (
                              <span className="text-[10px] font-bold text-[var(--color-forest-700)] bg-[var(--color-forest-50)] px-[7px] py-[1px] rounded-[20px] border border-[var(--color-forest-200)]">
                                Anda
                              </span>
                            )}
                          </div>
                          <div className="text-[11.5px] text-[var(--color-ink-4)] mt-[1px]">
                            @{user.username} · {user.email ?? "—"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td>
                      <div
                        className="inline-flex items-center gap-[5px] px-2.5 py-1 rounded-[20px] text-xs font-bold"
                        style={{
                          backgroundColor: roleCfg.bg,
                          color: roleCfg.color,
                        }}
                      >
                        <RoleIcon size={12} />
                        {roleCfg.label}
                      </div>
                    </td>

                    {/* Groups Authentik */}
                    <td>
                      <div className="flex gap-1 flex-wrap">
                        {groups.length === 0 ? (
                          <span className="text-xs text-[var(--color-ink-5)]">
                            —
                          </span>
                        ) : (
                          groups.map((g) => (
                            <span
                              key={g}
                              className="text-[10.5px] font-semibold px-2 py-0.5 rounded-[20px] bg-[var(--color-ink-7)] text-[var(--color-ink-3)] border border-[var(--color-ink-6)]"
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
                    <td className="whitespace-nowrap">
                      {user.lastLoginAt ? (
                        <div>
                          <div className="text-[12.5px] text-[var(--color-ink-2)] font-medium">
                            {timeAgo(user.lastLoginAt)}
                          </div>
                          <div className="text-[11px] text-[var(--color-ink-5)] flex items-center gap-[3px] mt-0.5">
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
                        <span className="text-xs text-[var(--color-ink-5)]">
                          Belum pernah
                        </span>
                      )}
                    </td>

                    {/* Terdaftar */}
                    <td className="text-xs text-[var(--color-ink-4)] whitespace-nowrap">
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
