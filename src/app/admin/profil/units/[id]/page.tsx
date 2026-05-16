// src/app/admin/profil/units/[id]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db, eq, asc } from "@/db";
import { units } from "@/db/schema";
import { UnitForm } from "@/components/admin/profil/UnitForm";

export const metadata: Metadata = { title: "Edit Unit Kerja" };

type Props = { params: Promise<{ id: string }> };

export default async function EditUnitPage({ params }: Props) {
  const { id } = await params;
  const unitId = Number(id);
  if (isNaN(unitId)) notFound();

  const [result, allUnits] = await Promise.all([
    db.select().from(units).where(eq(units.id, unitId)).limit(1),
    db
      .select({ id: units.id, name: units.name, level: units.level })
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
        <Link href="/admin/profil/units" className="admin-btn-cancel">
          ← Kembali
        </Link>
      </div>
      <UnitForm unit={result[0]} units={allUnits} />
    </>
  );
}
