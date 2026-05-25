// src/app/admin/profil/staff/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Edit } from "lucide-react";
import { db, asc, eq, like, and, or } from "@/db";
import { staff, units } from "@/db/schema";
import { DeleteStaffButton } from "@/components/admin/profil/DeleteStaffButton";
import { SmartImage } from "@/components/ui/SmartImage";

export const metadata: Metadata = { title: "Manajemen Pegawai" };

const TYPE_LABELS: Record<string, string> = {
  kepala_badan: "Kepala Badan",
  sekretaris: "Sekretaris",
  kepala_bidang: "Kepala Bidang",
  widyaiswara: "Widyaiswara",
  pegawai: "Pegawai",
};

const TYPE_BADGE: Record<string, string> = {
  kepala_badan: "badge-forest",
  sekretaris: "badge-forest",
  kepala_bidang: "badge-blue",
  widyaiswara: "badge-gold",
  pegawai: "badge-red",
};

type Props = {
  searchParams: Promise<{ cari?: string; tipe?: string; status?: string }>;
};

export default async function AdminStaffPage({ searchParams }: Props) {
  const params = await searchParams;
  const search = params.cari ?? "";
  const tipe = params.tipe ?? "";
  const status = params.status ?? "";

  const allStaff = await db
    .select({
      id: staff.id,
      name: staff.name,
      nip: staff.nip,
      position: staff.position,
      type: staff.type,
      photo: staff.photo,
      email: staff.email,
      education: staff.education,
      isActive: staff.isActive,
      sortOrder: staff.sortOrder,
      unitName: units.name,
    })
    .from(staff)
    .leftJoin(units, eq(staff.unitId, units.id))
    .orderBy(asc(staff.sortOrder));

  // Filter di JS
  const filtered = allStaff.filter((s) => {
    const matchSearch =
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.nip ?? "").includes(search) ||
      (s.position ?? "").toLowerCase().includes(search.toLowerCase());
    const matchTipe = !tipe || s.type === tipe;
    const matchStatus =
      !status ||
      (status === "aktif"
        ? s.isActive
        : status === "nonaktif"
          ? !s.isActive
          : true);
    return matchSearch && matchTipe && matchStatus;
  });

  return (
    <>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Manajemen Pegawai</h1>
          <p className="admin-page-sub">
            {filtered.length} dari {allStaff.length} pegawai
          </p>
        </div>
        <Link href="/admin/profil/staff/baru" className="admin-btn-save">
          <Plus size={15} />
          Tambah Pegawai
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
          {tipe && <input type="hidden" name="tipe" value={tipe} />}
          {status && <input type="hidden" name="status" value={status} />}
          <input
            name="cari"
            type="text"
            className="admin-input"
            placeholder="Cari nama, NIP, jabatan..."
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
          {(search || tipe || status) && (
            <Link
              href="/admin/profil/staff"
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

        {/* Tipe pills */}
        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
          {[
            { value: "", label: "Semua" },
            { value: "kepala_badan", label: "Kepala Badan" },
            { value: "sekretaris", label: "Sekretaris" },
            { value: "kepala_bidang", label: "Kepala Bidang" },
            { value: "widyaiswara", label: "Widyaiswara" },
            { value: "pegawai", label: "Pegawai" },
          ].map((t) => (
            <Link
              key={t.value}
              href={`/admin/profil/staff?tipe=${t.value}${search ? `&cari=${search}` : ""}${status ? `&status=${status}` : ""}`}
              style={{
                padding: "5px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: 500,
                textDecoration: "none",
                border: "1px solid",
                borderColor:
                  tipe === t.value
                    ? "var(--color-forest-700)"
                    : "var(--color-ink-6)",
                background:
                  tipe === t.value ? "var(--color-forest-700)" : "#fff",
                color: tipe === t.value ? "#fff" : "var(--color-ink-3)",
                whiteSpace: "nowrap",
              }}
            >
              {t.label}
              <span
                style={{
                  marginLeft: "5px",
                  fontSize: "11px",
                  opacity: 0.6,
                }}
              >
                {allStaff.filter((s) => !t.value || s.type === t.value).length}
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
                <th style={{ width: "52px" }}>Foto</th>
                <th>Nama &amp; Jabatan</th>
                <th>Tipe</th>
                <th>Unit Kerja</th>
                <th>Pendidikan</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "var(--color-ink-4)",
                    }}
                  >
                    {search
                      ? `Tidak ada pegawai untuk "${search}"`
                      : "Belum ada data pegawai."}
                  </td>
                </tr>
              )}
              {filtered.map((s) => (
                <tr key={s.id}>
                  {/* Foto */}
                  <td>
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "8px",
                        overflow: "hidden",
                        background: "var(--color-forest-50)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {s.photo ? (
                        <SmartImage
                          src={s.photo}
                          alt={s.name}
                          style={{ objectFit: "cover", objectPosition: "top" }}
                        />
                      ) : (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          style={{ color: "var(--color-forest-300)" }}
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      )}
                    </div>
                  </td>

                  {/* Nama */}
                  <td>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "13.5px",
                        color: "var(--color-ink)",
                        marginBottom: "2px",
                      }}
                    >
                      {s.name}
                    </div>
                    <div
                      style={{ fontSize: "12px", color: "var(--color-ink-4)" }}
                    >
                      {s.position}
                    </div>
                    {s.nip && (
                      <div
                        style={{
                          fontSize: "11px",
                          color: "var(--color-ink-5)",
                        }}
                      >
                        NIP: {s.nip}
                      </div>
                    )}
                  </td>

                  {/* Tipe */}
                  <td>
                    <span
                      className={`badge ${TYPE_BADGE[s.type] ?? "badge-forest"}`}
                    >
                      {TYPE_LABELS[s.type] ?? s.type}
                    </span>
                  </td>

                  {/* Unit */}
                  <td
                    style={{ fontSize: "12.5px", color: "var(--color-ink-3)" }}
                  >
                    {s.unitName ?? "—"}
                  </td>

                  {/* Pendidikan */}
                  <td
                    style={{ fontSize: "12.5px", color: "var(--color-ink-3)" }}
                  >
                    {s.education ?? "—"}
                  </td>

                  {/* Status */}
                  <td>
                    <span
                      className={`status-pill ${s.isActive ? "status-pill-published" : "status-pill-archived"}`}
                    >
                      {s.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>

                  {/* Aksi */}
                  <td>
                    <div className="admin-table-actions">
                      <Link
                        href={`/admin/profil/staff/${s.id}`}
                        className="admin-table-btn admin-table-btn-edit"
                      >
                        <Edit size={13} /> Edit
                      </Link>
                      <DeleteStaffButton id={s.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer summary */}
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
              {filtered.filter((s) => s.isActive).length} aktif ·{" "}
              {filtered.filter((s) => !s.isActive).length} nonaktif
            </span>
            <span>{filtered.length} pegawai ditampilkan</span>
          </div>
        )}
      </div>
    </>
  );
}
