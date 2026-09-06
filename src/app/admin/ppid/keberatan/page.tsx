// src/app/admin/ppid/keberatan/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { db, count, desc } from "@/db";
import { ppidKeberatan } from "@/db/schema";
import { Plus, Eye, AlertTriangle, Clock } from "lucide-react";
import { DeleteKeberatanButton } from "@/components/admin/ppid/DeleteKeberatanButton";

export const metadata: Metadata = { title: "Keberatan PPID" };
// PM2 cluster mode (2+ instance) -> Full Route Cache tidak sinkron antar-proses.
// force-dynamic memastikan halaman ini selalu query fresh dari DB.
export const dynamic = "force-dynamic";

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
  diteruskan_ki: {
    label: "Diteruskan ke KI",
    cls: "status-pill-draft",
    color: "#7e22ce",
    bg: "#fdf4ff",
  },
};

export default async function AdminKeberatanPage() {
  const [keberatan, stats] = await Promise.all([
    db
      .select()
      .from(ppidKeberatan)
      .orderBy(desc(ppidKeberatan.createdAt))
      .limit(50),
    db
      .select({ status: ppidKeberatan.status, total: count() })
      .from(ppidKeberatan)
      .groupBy(ppidKeberatan.status),
  ]);

  const statMap = Object.fromEntries(stats.map((s) => [s.status, s.total]));
  const totalKeberatan = keberatan.length;

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
            value: totalKeberatan,
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
            <AlertTriangle size={15} />
            Daftar Keberatan
          </div>
          <span style={{ fontSize: "12px", color: "var(--color-ink-4)" }}>
            {totalKeberatan} keberatan
          </span>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nomor</th>
                <th>Pemohon</th>
                <th>Alasan</th>
                <th style={{ width: "110px" }}>Tanggal</th>
                <th style={{ width: "130px" }}>Status</th>
                <th style={{ width: "150px" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {keberatan.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "var(--color-ink-4)",
                    }}
                  >
                    Belum ada keberatan masuk.
                  </td>
                </tr>
              )}
              {keberatan.map((k) => {
                const cfg = STATUS_CONFIG[k.status] ?? STATUS_CONFIG.diterima;
                return (
                  <tr
                    key={k.id}
                    style={{
                      background: k.status === "diterima" ? "#fffbf0" : "#fff",
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
                        {k.nomorKeberatan}
                      </code>
                      {k.status === "diterima" && (
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
                        {k.namaPemohon}
                      </div>
                      <div
                        style={{
                          fontSize: "11.5px",
                          color: "var(--color-ink-4)",
                        }}
                      >
                        {k.email}
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
                      {k.alasanKeberatan
                        .map((a) => a.replaceAll("_", " "))
                        .join(", ")}
                    </td>
                    <td
                      style={{ fontSize: "12px", color: "var(--color-ink-4)" }}
                    >
                      {new Date(k.createdAt).toLocaleDateString("id-ID", {
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
                      <div style={{ display: "flex", gap: "6px" }}>
                        <Link
                          href={`/admin/ppid/keberatan/${k.id}`}
                          className="admin-table-btn admin-table-btn-view"
                        >
                          <Eye size={13} /> Detail
                        </Link>
                        <DeleteKeberatanButton id={k.id} />
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
