// src/app/admin/ppid/informasi/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { db, asc, desc } from "@/db";
import { ppidInformasi } from "@/db/schema";
import { Plus, Edit, BookOpen, Zap, Clock, Lock } from "lucide-react";
import { DeletePpidInformasiButton } from "@/components/admin/ppid/DeletePpidInformasiButton";

export const metadata: Metadata = { title: "Informasi Publik PPID" };

const TIPE_CONFIG = {
  berkala: {
    label: "Berkala",
    color: "#1d4ed8",
    bg: "#eff6ff",
    icon: BookOpen,
  },
  serta_merta: {
    label: "Serta Merta",
    color: "#dc2626",
    bg: "#fef2f2",
    icon: Zap,
  },
  setiap_saat: {
    label: "Setiap Saat",
    color: "#16a34a",
    bg: "#f0fdf4",
    icon: Clock,
  },
  dikecualikan: {
    label: "Dikecualikan",
    color: "#b45309",
    bg: "#fffbeb",
    icon: Lock,
  },
};

export default async function AdminPpidInformasiPage() {
  const list = await db
    .select()
    .from(ppidInformasi)
    .orderBy(asc(ppidInformasi.tipe), asc(ppidInformasi.sortOrder));

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
          {list.length} informasi terdaftar
        </p>
        <Link href="/admin/ppid/informasi/baru" className="admin-btn-save">
          <Plus size={15} /> Tambah Informasi
        </Link>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tipe</th>
                <th>Judul</th>
                <th style={{ width: "70px", textAlign: "center" }}>Tahun</th>
                <th style={{ width: "80px" }}>File</th>
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
                    Belum ada informasi publik.
                  </td>
                </tr>
              )}
              {list.map((item) => {
                const cfg = TIPE_CONFIG[item.tipe as keyof typeof TIPE_CONFIG];
                const Icon = cfg?.icon ?? BookOpen;
                return (
                  <tr key={item.id}>
                    <td>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          padding: "3px 10px",
                          borderRadius: "20px",
                          background: cfg?.bg ?? "#f0fdf4",
                          fontSize: "11.5px",
                          fontWeight: 700,
                          color: cfg?.color ?? "#16a34a",
                        }}
                      >
                        <Icon size={11} />
                        {cfg?.label ?? item.tipe}
                      </span>
                    </td>
                    <td>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: "13px",
                          color: "var(--color-ink)",
                        }}
                      >
                        {item.judul}
                      </div>
                      {item.deskripsi && (
                        <div
                          style={{
                            fontSize: "11.5px",
                            color: "var(--color-ink-4)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: "300px",
                          }}
                        >
                          {item.deskripsi}
                        </div>
                      )}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        fontSize: "13px",
                        color: "var(--color-ink-3)",
                      }}
                    >
                      {item.tahun ?? "—"}
                    </td>
                    <td>
                      {item.fileUrl || item.externalUrl ? (
                        <span
                          style={{
                            fontSize: "11.5px",
                            fontWeight: 700,
                            color: item.fileUrl
                              ? "var(--color-forest-700)"
                              : "#1d4ed8",
                          }}
                        >
                          {item.fileUrl ? "Upload" : "Eksternal"}
                        </span>
                      ) : (
                        <span
                          style={{
                            fontSize: "11.5px",
                            color: "var(--color-ink-5)",
                          }}
                        >
                          —
                        </span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`status-pill ${item.status === "published" ? "status-pill-published" : "status-pill-draft"}`}
                      >
                        {item.status === "published" ? "Terbit" : "Draft"}
                      </span>
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <Link
                          href={`/admin/ppid/informasi/${item.id}`}
                          className="admin-table-btn admin-table-btn-edit"
                        >
                          <Edit size={13} /> Edit
                        </Link>
                        <DeletePpidInformasiButton id={item.id} />
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
