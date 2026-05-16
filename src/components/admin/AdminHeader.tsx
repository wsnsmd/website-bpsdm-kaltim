// src/components/admin/AdminHeader.tsx
"use client";

import { signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import {
  LogOut,
  User,
  Shield,
  ChevronDown,
  Mail,
  Menu,
  X,
  Settings,
  Home,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import type { Session } from "next-auth";

type Props = {
  user: Session["user"];
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
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

export function AdminHeader({
  user,
  onToggleSidebar,
  isSidebarOpen = true,
}: Props) {
  const role = (user as any).role ?? "viewer";
  const username = (user as any).username ?? "";
  const groups = (user as any).groups ?? [];
  const roleInfo = ROLE_LABELS[role] ?? ROLE_LABELS.viewer;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="admin-header-responsive">
      {/* Left Section */}
      <div className="admin-header-left">
        {/* Toggle Sidebar Button */}
        <button
          onClick={onToggleSidebar}
          className="admin-toggle-sidebar-btn"
          aria-label={
            isSidebarOpen ? "Sembunyikan sidebar" : "Tampilkan sidebar"
          }
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Right Section */}
      <div className="admin-header-right">
        {/* User Dropdown - Desktop */}
        <div className="admin-user-dropdown" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="admin-user-trigger"
          >
            <div className="admin-user-avatar">
              {user.name?.charAt(0).toUpperCase() ?? "U"}
            </div>
            <div className="admin-user-info">
              <div className="admin-user-name">@{username}</div>
              <div className="admin-user-email">{user.email}</div>
            </div>
            <ChevronDown
              size={14}
              className={`admin-dropdown-icon ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="admin-dropdown-menu">
              {/* User Info Section */}
              <div className="admin-dropdown-user-info">
                <div className="admin-dropdown-avatar">
                  {user.name?.charAt(0).toUpperCase() ?? "U"}
                </div>
                <div className="admin-dropdown-user-details">
                  <div className="admin-dropdown-user-name">
                    {user.name ?? username}
                  </div>
                  <div className="admin-dropdown-user-email">{user.email}</div>
                </div>
              </div>

              {/* Role Badge */}
              <div className="admin-dropdown-role">
                <Shield size={12} />
                <span>{roleInfo.label}</span>
              </div>

              {/* Menu Items */}
              <Link
                href="/admin"
                className="admin-dropdown-item"
                onClick={() => setIsDropdownOpen(false)}
              >
                <LayoutDashboard size={14} />
                <span>Dashboard</span>
              </Link>

              <Link
                href="/"
                className="admin-dropdown-item"
                onClick={() => setIsDropdownOpen(false)}
                target="_blank"
              >
                <Home size={14} />
                <span>Lihat Situs</span>
              </Link>

              <Link
                href="/admin/pengaturan"
                className="admin-dropdown-item"
                onClick={() => setIsDropdownOpen(false)}
              >
                <Settings size={14} />
                <span>Pengaturan</span>
              </Link>

              <div className="admin-dropdown-divider" />

              {/* Logout Button */}
              <button
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
                className="admin-dropdown-item admin-dropdown-logout"
              >
                <LogOut size={14} />
                <span>Keluar</span>
              </button>
            </div>
          )}
        </div>

        {/* Logout Button - Mobile Icon Only */}
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="admin-logout-btn-mobile"
          aria-label="Keluar"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
