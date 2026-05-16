// src/app/admin/program/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Info, Eye, Edit } from "lucide-react";
import { db, asc } from "@/db";
import { programs } from "@/db/schema";
import { DeleteProgramButton } from "@/components/admin/DeleteProgramButton";
import { ToggleProgramStatus } from "@/components/admin/ToggleProgramStatus";

export const metadata: Metadata = { title: "Manajemen Program" };

const JENIS_BADGE: Record<string, string> = {
  Teknis: "badge-blue",
  Fungsional: "badge-forest",
  Manajerial: "badge-gold",
  Sosiokultural: "badge-red",
  "Pemerintahan Dalam Negeri": "badge-red",
  Sertifikasi: "badge-gold",
};

export default async function AdminProgramPage() {
  const allPrograms = await db
    .select()
    .from(programs)
    .orderBy(asc(programs.sortOrder), asc(programs.name));

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Program Diklat</h1>
          <p className="admin-page-sub">
            {allPrograms.length} program terdaftar
          </p>
        </div>
        <Link href="/admin/program/baru" className="admin-btn-save">
          <Plus size={15} />
          Tambah Program
        </Link>
      </div>

      {/* Info */}
      <div className="ann-info-box" style={{ marginBottom: "20px" }}>
        <Info size={16} style={{ flexShrink: 0 }} />
        <span>
          Program yang diaktifkan akan tampil di halaman publik. Jadwal kegiatan
          diambil otomatis dari <strong>SIMPEL Kaltim</strong> berdasarkan kolom{" "}
          <strong>Jenis Kompetensi</strong>.
        </span>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "60px", textAlign: "center" }}>Urutan</th>
                <th style={{ width: "60px" }}>Aktif</th>
                <th>Nama Program</th>
                <th>Jenis Kompetensi (SIMPEL)</th>
                <th style={{ width: "80px", textAlign: "center" }}>Beranda</th>
                <th style={{ width: "160px" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {allPrograms.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "var(--color-ink-4)",
                    }}
                  >
                    Belum ada program. Tambahkan yang pertama!
                  </td>
                </tr>
              )}
              {allPrograms.map((prog) => (
                <tr key={prog.id}>
                  {/* Urutan */}
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
                        color: "var(--color-ink-3)",
                      }}
                    >
                      {prog.sortOrder ?? 0}
                    </span>
                  </td>

                  {/* Toggle aktif */}
                  <td>
                    <ToggleProgramStatus
                      id={prog.id}
                      status={prog.status as "active" | "inactive"}
                    />
                  </td>

                  {/* Nama */}
                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      {/* Dot warna */}
                      {prog.color && (
                        <span
                          style={{
                            display: "inline-block",
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            backgroundColor: prog.color,
                            flexShrink: 0,
                          }}
                        />
                      )}
                      <div>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: "13.5px",
                            color: "var(--color-ink)",
                            marginBottom: "2px",
                          }}
                        >
                          {prog.name}
                        </div>
                        <div
                          style={{
                            fontSize: "11.5px",
                            color: "var(--color-ink-4)",
                          }}
                        >
                          /program/{prog.slug}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Jenis Kompetensi */}
                  <td>
                    <span
                      className={`badge ${JENIS_BADGE[prog.jenisKey] ?? "badge-forest"}`}
                    >
                      {prog.jenisKey}
                    </span>
                  </td>

                  {/* Highlight beranda */}
                  <td style={{ textAlign: "center" }}>
                    {prog.isHighlight ? (
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

                  {/* Aksi */}
                  <td>
                    <div className="admin-table-actions">
                      <Link
                        href={`/program/${prog.slug}`}
                        target="_blank"
                        className="admin-table-btn admin-table-btn-view"
                      >
                        <Eye size={13} />
                        Lihat
                      </Link>
                      <Link
                        href={`/admin/program/${prog.id}`}
                        className="admin-table-btn admin-table-btn-edit"
                      >
                        <Edit size={13} />
                        Edit
                      </Link>
                      <DeleteProgramButton id={prog.id} />
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
