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

type Props = {
  searchParams: Promise<{ cari?: string; level?: string }>;
};

export default async function AdminUnitsPage({ searchParams }: Props) {
  const params = await searchParams;
  const search = params.cari ?? "";
  const level = params.level ?? "";

  const allUnits = await db
    .select()
    .from(units)
    .orderBy(asc(units.level), asc(units.sortOrder));

  const unitMap = new Map(allUnits.map((u) => [u.id, u.name]));

  // Filter di JS
  const filtered = allUnits.filter((u) => {
    const matchSearch =
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      (u.shortName ?? "").toLowerCase().includes(search.toLowerCase());
    const matchLevel = !level || String(u.level ?? 0) === level;
    return matchSearch && matchLevel;
  });

  return (
    <>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Unit Kerja</h1>
          <p className="admin-page-sub">
            {filtered.length} dari {allUnits.length} unit terdaftar
          </p>
        </div>
        <Link href="/admin/profil/units/baru" className="admin-btn-save">
          <Plus size={15} />
          Tambah Unit
        </Link>
      </div>

      {/* Filter bar */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        {/* Search */}
        <form
          method="GET"
          style={{ display: "flex", gap: "8px", flex: 1, minWidth: "200px" }}
        >
          {level && <input type="hidden" name="level" value={level} />}
          <input
            name="cari"
            type="text"
            className="admin-input"
            placeholder="Cari nama unit..."
            defaultValue={search}
            style={{ flex: 1, height: "36px", fontSize: "13px" }}
          />
          <button
            type="submit"
            className="admin-btn-save"
            style={{ height: "36px", padding: "0 16px" }}
          >
            Cari
          </button>
          {(search || level) && (
            <Link
              href="/admin/profil/units"
              style={{
                height: "36px",
                padding: "0 14px",
                borderRadius: "8px",
                border: "1px solid var(--color-ink-6)",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                fontSize: "13px",
                color: "var(--color-ink-3)",
                textDecoration: "none",
              }}
            >
              Reset
            </Link>
          )}
        </form>

        {/* Level pills */}
        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
          {[
            { value: "", label: "Semua" },
            { value: "0", label: "Pimpinan" },
            { value: "1", label: "Sekretariat" },
            { value: "2", label: "Bidang / UPT" },
            { value: "3", label: "Sub Bagian" },
          ].map((l) => (
            <Link
              key={l.value}
              href={`/admin/profil/units?level=${l.value}${search ? `&cari=${search}` : ""}`}
              style={{
                padding: "5px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: 500,
                textDecoration: "none",
                border: "1px solid",
                borderColor:
                  level === l.value
                    ? "var(--color-forest-700)"
                    : "var(--color-ink-6)",
                background:
                  level === l.value ? "var(--color-forest-700)" : "#fff",
                color: level === l.value ? "#fff" : "var(--color-ink-3)",
                whiteSpace: "nowrap",
              }}
            >
              {l.label}
              <span
                style={{ marginLeft: "5px", fontSize: "11px", opacity: 0.6 }}
              >
                {
                  allUnits.filter(
                    (u) => !l.value || String(u.level ?? 0) === l.value,
                  ).length
                }
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "60px" }}>Urutan</th>
                <th>Nama Unit</th>
                <th>Level</th>
                <th>Parent</th>
                <th style={{ textAlign: "center", width: "70px" }}>Aktif</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "var(--color-ink-4)",
                    }}
                  >
                    {search
                      ? `Tidak ada unit untuk "${search}"`
                      : "Belum ada unit kerja."}
                  </td>
                </tr>
              )}
              {filtered.map((unit) => {
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
                        {unit.sortOrder ?? "—"}
                      </span>
                    </td>

                    <td>
                      <div
                        style={{ paddingLeft: `${(unit.level ?? 0) * 16}px` }}
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
                        {unit.description && (
                          <div
                            style={{
                              fontSize: "11.5px",
                              color: "var(--color-ink-5)",
                              marginTop: "2px",
                              maxWidth: "300px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {unit.description}
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
                        <span
                          style={{
                            color: "var(--color-ink-5)",
                            fontSize: "12px",
                          }}
                        >
                          — Root
                        </span>
                      )}
                    </td>

                    <td style={{ textAlign: "center" }}>
                      <span
                        className={`status-pill ${unit.isActive ? "status-pill-published" : "status-pill-archived"}`}
                      >
                        {unit.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>

                    <td>
                      <div className="admin-table-actions">
                        <Link
                          href={`/admin/profil/units/${unit.id}`}
                          className="admin-table-btn admin-table-btn-edit"
                        >
                          <Edit size={13} /> Edit
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

        {/* Footer */}
        {filtered.length > 0 && (
          <div
            style={{
              padding: "12px 20px",
              borderTop: "1px solid var(--color-ink-7)",
              fontSize: "12.5px",
              color: "var(--color-ink-4)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>
              {filtered.filter((u) => u.isActive).length} aktif ·{" "}
              {filtered.filter((u) => !u.isActive).length} nonaktif
            </span>
            <span>{filtered.length} unit ditampilkan</span>
          </div>
        )}
      </div>
    </>
  );
}
