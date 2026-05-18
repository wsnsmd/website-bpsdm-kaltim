// src/app/admin/dokumen/layout.tsx
import { AdminDokumenNav } from "@/components/admin/dokumen/AdminDokumenNav";

export default function AdminDokumenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Manajemen Dokumen</h1>
          <p className="admin-page-sub">
            Kelola dokumen unduhan publik BPSDM Kaltim
          </p>
        </div>
      </div>
      <AdminDokumenNav />
      {children}
    </div>
  );
}
