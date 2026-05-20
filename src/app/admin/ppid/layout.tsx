// src/app/admin/ppid/layout.tsx
import { AdminPpidNav } from "@/components/admin/ppid/AdminPpidNav";

export default function AdminPpidLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Manajemen PPID</h1>
          <p className="admin-page-sub">
            Kelola informasi publik, permohonan, dan pejabat PPID.
          </p>
        </div>
      </div>
      <AdminPpidNav />
      {children}
    </div>
  );
}
