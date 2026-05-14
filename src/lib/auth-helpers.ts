// src/lib/auth-helpers.ts

/**
 * Mapping groups Authentik → role internal aplikasi.
 *
 * Priority: superadmin > admin > piawan > viewer
 * Jika user punya multiple groups, ambil role tertinggi.
 */
export function resolveRoleFromGroups(groups: string[]): string {
  if (groups.includes("superadmin")) return "superadmin";
  if (groups.includes("admin")) return "admin";
  if (groups.includes("editor")) return "editor";
  return "viewer";
}

/**
 * Role yang diizinkan mengakses admin panel.
 */
export const ADMIN_ROLES = ["superadmin", "admin", "editor"];

/**
 * Cek apakah role boleh akses admin.
 */
export function canAccessAdmin(role: string): boolean {
  return ADMIN_ROLES.includes(role);
}

/**
 * Cek apakah role boleh melakukan aksi tertentu.
 */
export function can(role: string, action: string): boolean {
  const permissions: Record<string, string[]> = {
    "posts:create": ["superadmin", "admin", "editor"],
    "posts:delete": ["superadmin", "admin"],
    "programs:manage": ["superadmin", "admin"],
    "users:manage": ["superadmin"],
    "settings:manage": ["superadmin"],
  };
  return permissions[action]?.includes(role) ?? false;
}
