// src/app/admin/profil/staff/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Edit } from "lucide-react";
import { db, asc } from "@/db";
import { staff, units } from "@/db/schema";
import { eq } from "@/db";
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

export default async function AdminStaffPage() {
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
          {allStaff.length} pegawai terdaftar
        </p>
        <Link href="/admin/profil/staff/baru" className="admin-btn-save">
          <Plus size={15} />
          Tambah Pegawai
        </Link>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Foto</th>
                <th>Nama & Jabatan</th>
                <th>Tipe</th>
                <th>Unit Kerja</th>
                <th>Pendidikan</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {allStaff.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "var(--color-ink-4)",
                    }}
                  >
                    Belum ada data pegawai.
                  </td>
                </tr>
              )}
              {allStaff.map((s) => (
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
                      className={`status-pill ${s.isActive ? "status-pill-active" : "status-pill-inactive"}`}
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
                        <Edit size={13} />
                        Edit
                      </Link>
                      <DeleteStaffButton id={s.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
