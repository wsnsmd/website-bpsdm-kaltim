// src/app/admin/profil/staff/baru/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { db, asc } from "@/db";
import { units } from "@/db/schema";
import { StaffForm } from "@/components/admin/profil/StaffForm";

export const metadata: Metadata = { title: "Tambah Pegawai" };

export default async function TambahStaffPage() {
  const allUnits = await db
    .select({ id: units.id, name: units.name })
    .from(units)
    .orderBy(asc(units.level), asc(units.sortOrder));

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "16px",
        }}
      >
        <Link href="/admin/profil/staff" className="admin-btn-cancel">
          ← Kembali
        </Link>
      </div>
      <StaffForm units={allUnits} />
    </>
  );
}
