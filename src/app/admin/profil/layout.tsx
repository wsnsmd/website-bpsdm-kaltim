// src/app/admin/profil/layout.tsx
import { AdminProfilNav } from "@/components/admin/profil/AdminProfilNav";

export default function AdminProfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Manajemen Profil</h1>
          <p className="admin-page-sub">
            Kelola halaman, pegawai, dan struktur organisasi
          </p>
        </div>
      </div>
      <AdminProfilNav />
      <div style={{ marginTop: "20px" }}>{children}</div>
    </div>
  );
}
