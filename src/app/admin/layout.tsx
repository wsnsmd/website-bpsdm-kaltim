// src/app/admin/layout.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { canAccessAdmin } from "@/lib/auth-helpers";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  if (status === "loading") {
    return (
      <div className="admin-loading">
        <div className="loading-spinner">
          <div className="loading-spinner-ring" />
        </div>
      </div>
    );
  }

  if (!session) {
    redirect("/login");
  }

  const role = (session.user as any).role ?? "viewer";
  if (!canAccessAdmin(role)) {
    redirect("/forbidden");
  }

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar
        role={role}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div
        className={`admin-layout-main ${!isSidebarOpen ? "sidebar-collapsed" : ""}`}
      >
        <AdminHeader
          user={session.user}
          onToggleSidebar={handleToggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
        <main className="admin-layout-content">{children}</main>
      </div>
    </div>
  );
}
