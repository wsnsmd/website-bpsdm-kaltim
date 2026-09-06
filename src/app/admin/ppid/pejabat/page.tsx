// src/app/admin/ppid/pejabat/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { db, asc } from "@/db";
import { ppidPejabat } from "@/db/schema";
import { Plus, Edit, Users, Mail, Phone } from "lucide-react";
import { DeletePejabatButton } from "@/components/admin/ppid/DeletePejabatButton";

export const metadata: Metadata = { title: "Petugas PPID" };
// PM2 cluster mode (2+ instance) -> Full Route Cache tidak sinkron antar-proses.
// force-dynamic memastikan halaman ini selalu query fresh dari DB.
export const dynamic = "force-dynamic";

const TIPE_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  atasan: { label: "Atasan PPID", color: "#7e22ce", bg: "#fdf4ff" },
  utama: { label: "PPID Utama", color: "#1d4ed8", bg: "#eff6ff" },
  pembantu: { label: "PPID Pelaksana", color: "#16a34a", bg: "#f0fdf4" },
};

export default async function AdminPejabatPage() {
  const list = await db
    .select()
    .from(ppidPejabat)
    .orderBy(asc(ppidPejabat.tipe), asc(ppidPejabat.sortOrder));

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
          {list.length} petugas terdaftar — tampil di halaman publik{" "}
          <code
            style={{
              background: "var(--color-ink-7)",
              padding: "1px 6px",
              borderRadius: "4px",
              fontSize: "12px",
            }}
          >
            /ppid/profil
          </code>
        </p>
        <Link href="/admin/ppid/pejabat/baru" className="admin-btn-save">
          <Plus size={15} /> Tambah Petugas
        </Link>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Jabatan</th>
                <th style={{ width: "130px" }}>Tipe</th>
                <th>Kontak</th>
                <th style={{ width: "80px" }}>Status</th>
                <th style={{ width: "130px" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "var(--color-ink-4)",
                    }}
                  >
                    <Users
                      size={28}
                      style={{ margin: "0 auto 10px", color: "var(--color-ink-5)" }}
                    />
                    <div>Belum ada petugas PPID terdaftar.</div>
                  </td>
                </tr>
              )}
              {list.map((p) => {
                const tipeCfg = TIPE_LABEL[p.tipe] ?? TIPE_LABEL.pembantu;
                return (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600, fontSize: "13px" }}>
                      {p.nama}
                    </td>
                    <td style={{ fontSize: "13px", color: "var(--color-ink-2)" }}>
                      {p.jabatan}
                    </td>
                    <td>
                      <span
                        style={{
                          padding: "3px 10px",
                          borderRadius: "20px",
                          background: tipeCfg.bg,
                          color: tipeCfg.color,
                          fontSize: "11.5px",
                          fontWeight: 700,
                        }}
                      >
                        {tipeCfg.label}
                      </span>
                    </td>
                    <td style={{ fontSize: "12px", color: "var(--color-ink-4)" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        {p.email && (
                          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <Mail size={11} /> {p.email}
                          </span>
                        )}
                        {p.noHp && (
                          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <Phone size={11} /> {p.noHp}
                          </span>
                        )}
                        {!p.email && !p.noHp && "—"}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`status-pill ${p.isActive ? "status-pill-published" : "status-pill-draft"}`}
                      >
                        {p.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <Link
                          href={`/admin/ppid/pejabat/${p.id}`}
                          className="admin-table-btn admin-table-btn-view"
                        >
                          <Edit size={13} /> Edit
                        </Link>
                        <DeletePejabatButton id={p.id} />
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
