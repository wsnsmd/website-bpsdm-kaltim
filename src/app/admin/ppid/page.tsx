// src/app/admin/ppid/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { db, eq, count, desc } from "@/db";
import { ppidPermohonan } from "@/db/schema";
import { Plus, Eye, FileText, Clock } from "lucide-react";

export const metadata: Metadata = { title: "Permohonan PPID" };

const STATUS_CONFIG: Record<
  string,
  { label: string; cls: string; color: string; bg: string }
> = {
  diterima: {
    label: "Diterima",
    cls: "status-pill-draft",
    color: "#1d4ed8",
    bg: "#eff6ff",
  },
  diproses: {
    label: "Diproses",
    cls: "status-pill-published",
    color: "#d97706",
    bg: "#fffbeb",
  },
  selesai: {
    label: "Selesai",
    cls: "status-pill-published",
    color: "#16a34a",
    bg: "#f0fdf4",
  },
  ditolak: {
    label: "Ditolak",
    cls: "status-pill-archived",
    color: "#dc2626",
    bg: "#fef2f2",
  },
  banding: {
    label: "Banding",
    cls: "status-pill-draft",
    color: "#7e22ce",
    bg: "#fdf4ff",
  },
};

export default async function AdminPpidPage() {
  const [permohonan, stats] = await Promise.all([
    db
      .select()
      .from(ppidPermohonan)
      .orderBy(desc(ppidPermohonan.createdAt))
      .limit(50),
    db
      .select({ status: ppidPermohonan.status, total: count() })
      .from(ppidPermohonan)
      .groupBy(ppidPermohonan.status),
  ]);

  const statMap = Object.fromEntries(stats.map((s) => [s.status, s.total]));
  const totalPermohonan = permohonan.length;

  return (
    <>
      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        {[
          {
            label: "Total",
            value: totalPermohonan,
            color: "var(--color-forest-700)",
            bg: "var(--color-forest-50)",
          },
          {
            label: "Diterima",
            value: statMap.diterima ?? 0,
            color: "#1d4ed8",
            bg: "#eff6ff",
          },
          {
            label: "Diproses",
            value: statMap.diproses ?? 0,
            color: "#d97706",
            bg: "#fffbeb",
          },
          {
            label: "Selesai",
            value: statMap.selesai ?? 0,
            color: "#16a34a",
            bg: "#f0fdf4",
          },
          {
            label: "Ditolak",
            value: statMap.ditolak ?? 0,
            color: "#dc2626",
            bg: "#fef2f2",
          },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              padding: "16px",
              borderRadius: "10px",
              background: "#fff",
              border: "1px solid var(--color-ink-6)",
              textAlign: "center",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            <div style={{ fontSize: "26px", fontWeight: 900, color: s.color }}>
              {s.value}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "var(--color-ink-4)",
                marginTop: "3px",
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Tabel */}
      <div className="admin-card">
        <div className="admin-card-head">
          <div className="admin-card-title">
            <FileText size={15} />
            Daftar Permohonan Informasi
          </div>
          <span style={{ fontSize: "12px", color: "var(--color-ink-4)" }}>
            {totalPermohonan} permohonan
          </span>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nomor</th>
                <th>Pemohon</th>
                <th>Subjek Informasi</th>
                <th style={{ width: "110px" }}>Tanggal</th>
                <th style={{ width: "100px" }}>Status</th>
                <th style={{ width: "80px" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {permohonan.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "var(--color-ink-4)",
                    }}
                  >
                    Belum ada permohonan masuk.
                  </td>
                </tr>
              )}
              {permohonan.map((p) => {
                const cfg = STATUS_CONFIG[p.status] ?? STATUS_CONFIG.diterima;
                return (
                  <tr
                    key={p.id}
                    style={{
                      background: p.status === "diterima" ? "#fffbf0" : "#fff",
                    }}
                  >
                    <td>
                      <code
                        style={{
                          fontSize: "11.5px",
                          background: "var(--color-ink-7)",
                          padding: "2px 7px",
                          borderRadius: "5px",
                          color: "var(--color-ink-3)",
                          fontFamily: "monospace",
                        }}
                      >
                        {p.nomorPermohonan}
                      </code>
                      {p.status === "diterima" && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "3px",
                            marginLeft: "6px",
                            fontSize: "10px",
                            fontWeight: 700,
                            color: "#d97706",
                            background: "#fffbeb",
                            padding: "1px 6px",
                            borderRadius: "20px",
                            border: "1px solid #fde68a",
                          }}
                        >
                          <Clock size={9} /> Baru
                        </span>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: "13px" }}>
                        {p.namaPemohon}
                      </div>
                      <div
                        style={{
                          fontSize: "11.5px",
                          color: "var(--color-ink-4)",
                        }}
                      >
                        {p.email}
                      </div>
                    </td>
                    <td
                      style={{
                        maxWidth: "220px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontSize: "13px",
                      }}
                    >
                      {p.subjekInfo}
                    </td>
                    <td
                      style={{ fontSize: "12px", color: "var(--color-ink-4)" }}
                    >
                      {new Date(p.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      <span className={`status-pill ${cfg.cls}`}>
                        {cfg.label}
                      </span>
                    </td>
                    <td>
                      <Link
                        href={`/admin/ppid/${p.id}`}
                        className="admin-table-btn admin-table-btn-view"
                      >
                        <Eye size={13} /> Detail
                      </Link>
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
