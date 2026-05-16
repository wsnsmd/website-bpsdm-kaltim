// src/app/admin/profil/units/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Edit } from "lucide-react";
import { db, asc } from "@/db";
import { units } from "@/db/schema";
import { DeleteUnitButton } from "@/components/admin/profil/DeleteUnitButton";

export const metadata: Metadata = { title: "Manajemen Unit Kerja" };

const LEVEL_LABELS: Record<
  number,
  { label: string; color: string; bg: string }
> = {
  0: {
    label: "Pimpinan",
    color: "var(--color-forest-800)",
    bg: "var(--color-forest-50)",
  },
  1: {
    label: "Sekretariat",
    color: "var(--color-forest-700)",
    bg: "var(--color-forest-50)",
  },
  2: { label: "Bidang / UPT", color: "#1d4ed8", bg: "#eff6ff" },
  3: { label: "Sub Bagian", color: "#7e22ce", bg: "#fdf4ff" },
};

export default async function AdminUnitsPage() {
  const allUnits = await db
    .select()
    .from(units)
    .orderBy(asc(units.level), asc(units.sortOrder));

  // Build map untuk nama parent
  const unitMap = new Map(allUnits.map((u) => [u.id, u.name]));

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <p style={{ fontSize: "13px", color: "var(--color-ink-4)" }}>
          {allUnits.length} unit terdaftar
        </p>
        <Link href="/admin/profil/units/baru" className="admin-btn-save">
          <Plus size={15} />
          Tambah Unit
        </Link>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Urutan</th>
                <th>Nama Unit</th>
                <th>Level</th>
                <th>Parent</th>
                <th style={{ textAlign: "center" }}>Aktif</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {allUnits.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "var(--color-ink-4)",
                    }}
                  >
                    Belum ada unit kerja.
                  </td>
                </tr>
              )}
              {allUnits.map((unit) => {
                const levelInfo =
                  LEVEL_LABELS[unit.level ?? 0] ?? LEVEL_LABELS[3];
                const parentName = unit.parentId
                  ? unitMap.get(unit.parentId)
                  : null;

                return (
                  <tr key={unit.id}>
                    <td style={{ textAlign: "center" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          background: "var(--color-ink-7)",
                          fontSize: "12px",
                          fontWeight: 700,
                          color: "var(--color-ink-4)",
                        }}
                      >
                        {unit.sortOrder}
                      </span>
                    </td>

                    <td>
                      <div
                        style={{
                          paddingLeft: `${(unit.level ?? 0) * 16}px`,
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: "13.5px",
                            color: "var(--color-ink)",
                            marginBottom: "2px",
                          }}
                        >
                          {unit.name}
                        </div>
                        {unit.shortName && (
                          <div
                            style={{
                              fontSize: "11.5px",
                              color: "var(--color-ink-4)",
                            }}
                          >
                            ({unit.shortName})
                          </div>
                        )}
                      </div>
                    </td>

                    <td>
                      <span
                        style={{
                          display: "inline-flex",
                          padding: "3px 10px",
                          borderRadius: "20px",
                          fontSize: "11.5px",
                          fontWeight: 700,
                          background: levelInfo.bg,
                          color: levelInfo.color,
                        }}
                      >
                        {levelInfo.label}
                      </span>
                    </td>

                    <td
                      style={{
                        fontSize: "12.5px",
                        color: "var(--color-ink-3)",
                      }}
                    >
                      {parentName ?? (
                        <span style={{ color: "var(--color-ink-5)" }}>
                          — (Root)
                        </span>
                      )}
                    </td>

                    <td style={{ textAlign: "center" }}>
                      {unit.isActive ? (
                        <span
                          style={{
                            color: "var(--color-forest-700)",
                            fontSize: "18px",
                          }}
                        >
                          ✓
                        </span>
                      ) : (
                        <span
                          style={{
                            color: "var(--color-ink-5)",
                            fontSize: "18px",
                          }}
                        >
                          —
                        </span>
                      )}
                    </td>

                    <td>
                      <div className="admin-table-actions">
                        <Link
                          href={`/admin/profil/units/${unit.id}`}
                          className="admin-table-btn admin-table-btn-edit"
                        >
                          <Edit size={13} />
                          Edit
                        </Link>
                        <DeleteUnitButton id={unit.id} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
