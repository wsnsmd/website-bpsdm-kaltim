// src/app/admin/layout.tsx
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { canAccessAdmin } from "@/lib/auth-helpers";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export const metadata: Metadata = {
  title: {
    default: "Admin — BPSDM Kaltim",
    template: "%s — Admin BPSDM",
  },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const role = (session.user as any).role ?? "viewer";
  if (!canAccessAdmin(role)) {
    redirect("/forbidden");
  }

  return (
    <div className="admin-root">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader user={session.user} />
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
