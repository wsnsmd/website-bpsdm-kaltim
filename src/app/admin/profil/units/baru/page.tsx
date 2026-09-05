// src/app/admin/profil/units/baru/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { db, asc } from "@/db";
import { units } from "@/db/schema";
import { UnitForm } from "@/components/admin/profil/UnitForm";

export const metadata: Metadata = { title: "Tambah Unit Kerja" };
// PM2 cluster mode (2+ instance) -> Full Route Cache tidak sinkron antar-proses.
// force-dynamic memastikan halaman ini selalu query fresh dari DB.
export const dynamic = "force-dynamic";
export default async function TambahUnitPage() {
  const allUnits = await db
    .select({ id: units.id, name: units.name, level: units.level })
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
        <Link href="/admin/profil/units" className="admin-btn-cancel">
          ← Kembali
        </Link>
      </div>
      <UnitForm units={allUnits} />
    </>
  );
}
