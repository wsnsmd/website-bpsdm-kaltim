// src/app/admin/profil/staff/[id]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db, eq, asc } from "@/db";
import { staff, units } from "@/db/schema";
import { StaffForm } from "@/components/admin/profil/StaffForm";

export const metadata: Metadata = { title: "Edit Pegawai" };

type Props = { params: Promise<{ id: string }> };

export default async function EditStaffPage({ params }: Props) {
  const { id } = await params;
  const staffId = Number(id);
  if (isNaN(staffId)) notFound();

  const [result, allUnits] = await Promise.all([
    db.select().from(staff).where(eq(staff.id, staffId)).limit(1),
    db
      .select({ id: units.id, name: units.name })
      .from(units)
      .orderBy(asc(units.level), asc(units.sortOrder)),
  ]);

  if (!result[0]) notFound();

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <p
          style={{
            fontSize: "13px",
            color: "var(--color-ink-4)",
            alignSelf: "center",
          }}
        >
          Edit:{" "}
          <strong style={{ color: "var(--color-ink)" }}>
            {result[0].name}
          </strong>
        </p>
        <Link href="/admin/profil/staff" className="admin-btn-cancel">
          ← Kembali
        </Link>
      </div>
      <StaffForm staff={result[0]} units={allUnits} />
    </>
  );
}
