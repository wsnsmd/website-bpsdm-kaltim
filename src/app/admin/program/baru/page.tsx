// src/app/admin/program/baru/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ProgramForm } from "@/components/admin/ProgramForm";

export const metadata: Metadata = { title: "Tambah Program" };

export default function TambahProgramPage() {
  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Tambah Program</h1>
          <p className="admin-page-sub">
            Buat program pengembangan kompetensi baru
          </p>
        </div>
        <Link href="/admin/program" className="admin-btn-cancel">
          ← Kembali
        </Link>
      </div>
      <ProgramForm />
    </>
  );
}
