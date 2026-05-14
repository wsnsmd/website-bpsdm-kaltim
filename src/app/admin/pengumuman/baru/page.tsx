// src/app/admin/pengumuman/baru/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { AnnouncementForm } from "@/components/admin/AnnouncementForm";

export const metadata: Metadata = { title: "Tambah Pengumuman" };

export default function TambahPengumumanPage() {
  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Tambah Pengumuman</h1>
          <p className="admin-page-sub">
            Buat pengumuman baru untuk ditampilkan di situs
          </p>
        </div>
        <Link href="/admin/pengumuman" className="admin-btn-cancel">
          ← Kembali
        </Link>
      </div>

      <AnnouncementForm />
    </>
  );
}
