// src/lib/auth-helpers.ts

export function resolveRoleFromGroups(groups: string[]): string {
  if (groups.includes("superadmin")) return "superadmin";
  if (groups.includes("admin")) return "admin";
  if (groups.includes("editor")) return "editor";
  return "viewer";
}

export const ADMIN_ROLES = ["superadmin", "admin", "editor"];

export function canAccessAdmin(role: string): boolean {
  return ADMIN_ROLES.includes(role);
}

export function can(role: string, action: string): boolean {
  const permissions: Record<string, string[]> = {
    // Berita
    "posts:create": ["superadmin", "admin", "editor"],
    "posts:edit": ["superadmin", "admin", "editor"],
    "posts:delete": ["superadmin", "admin"],

    // Kategori
    "categories:manage": ["superadmin", "admin"],

    // Program
    "programs:manage": ["superadmin", "admin"],

    // Pengumuman
    "announcements:manage": ["superadmin", "admin", "editor"],

    // Dokumen
    "documents:create": ["superadmin", "admin", "editor"],
    "documents:edit": ["superadmin", "admin", "editor"],
    "documents:delete": ["superadmin", "admin"],

    // Galeri
    "gallery:manage": ["superadmin", "admin", "editor"],

    // PPID
    "ppid:manage": ["superadmin", "admin"],

    // Profil
    "profil:manage": ["superadmin", "admin"],

    // Platform
    "platform:manage": ["superadmin", "admin"],

    // Survei
    "survei:view": ["superadmin", "admin"],

    // Menu
    "menu:manage": ["superadmin", "admin"],

    // Pengguna
    "users:manage": ["superadmin"],

    // Pengaturan
    "settings:manage": ["superadmin"],
  };
  return permissions[action]?.includes(role) ?? false;
}

// Helper — redirect ke forbidden jika tidak punya akses
export function requireRole(role: string, requiredRoles: string[]): boolean {
  return requiredRoles.includes(role);
}
