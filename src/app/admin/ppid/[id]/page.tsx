// src/app/admin/ppid/[id]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db, eq } from "@/db";
import { ppidPermohonan } from "@/db/schema";
import { ArrowLeft } from "lucide-react";
import { UpdatePermohonanForm } from "@/components/admin/ppid/UpdatePermohonanForm";

export const metadata: Metadata = { title: "Detail Permohonan PPID" };

type Props = { params: Promise<{ id: string }> };

const STATUS_COLOR: Record<string, string> = {
  diterima: "#1d4ed8",
  diproses: "#d97706",
  selesai: "#16a34a",
  ditolak: "#dc2626",
  banding: "#7e22ce",
};

export default async function DetailPermohonanPage({ params }: Props) {
  const { id } = await params;
  const pid = Number(id);
  if (isNaN(pid)) notFound();

  const result = await db
    .select()
    .from(ppidPermohonan)
    .where(eq(ppidPermohonan.id, pid))
    .limit(1);
  if (!result[0]) notFound();

  const p = result[0];

  const INFO_ROWS = [
    { label: "Nama Pemohon", value: p.namaPemohon },
    { label: "NIK", value: p.nik ?? "—" },
    { label: "Email", value: p.email },
    { label: "No. HP", value: p.noHp ?? "—" },
    { label: "Pekerjaan", value: p.pekerjaan ?? "—" },
    { label: "Alamat", value: p.alamat ?? "—" },
    { label: "Subjek Informasi", value: p.subjekInfo },
    { label: "Cara Mendapat", value: p.caraMendapat },
    { label: "Format Media", value: p.caraMedia },
    {
      label: "Tanggal Masuk",
      value: new Date(p.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    },
  ];

  return (
    <>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <code
            style={{
              fontSize: "13px",
              background: "var(--color-ink-7)",
              padding: "4px 10px",
              borderRadius: "6px",
              color: "var(--color-ink-2)",
              fontFamily: "monospace",
              fontWeight: 700,
            }}
          >
            {p.nomorPermohonan}
          </code>
          <span
            style={{
              padding: "3px 10px",
              borderRadius: "20px",
              background: `${STATUS_COLOR[p.status]}15`,
              border: `1px solid ${STATUS_COLOR[p.status]}30`,
              fontSize: "12px",
              fontWeight: 700,
              color: STATUS_COLOR[p.status],
            }}
          >
            {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
          </span>
        </div>
        <Link href="/admin/ppid" className="admin-btn-cancel">
          <ArrowLeft size={14} /> Kembali
        </Link>
      </div>

      {/* Content */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 360px",
          gap: "20px",
          alignItems: "start",
        }}
      >
        {/* Kiri — detail */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Data pemohon */}
          <div className="admin-card">
            <div className="admin-card-head">
              <div className="admin-card-title">Data Pemohon & Permohonan</div>
            </div>
            <div>
              {INFO_ROWS.map((row, i) => (
                <div
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "160px 1fr",
                    gap: "12px",
                    padding: "12px 20px",
                    borderBottom:
                      i < INFO_ROWS.length - 1
                        ? "1px solid var(--color-ink-7)"
                        : "none",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "var(--color-ink-4)",
                      textTransform: "uppercase",
                      letterSpacing: "0.3px",
                    }}
                  >
                    {row.label}
                  </div>
                  <div
                    style={{
                      fontSize: "13.5px",
                      color: "var(--color-ink)",
                      lineHeight: 1.55,
                    }}
                  >
                    {row.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rincian informasi */}
          <div className="admin-card">
            <div className="admin-card-head">
              <div className="admin-card-title">
                Rincian Informasi yang Dimohon
              </div>
            </div>
            <div
              style={{
                padding: "16px 20px",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    color: "var(--color-ink-4)",
                    marginBottom: "6px",
                  }}
                >
                  Deskripsi Informasi
                </div>
                <div
                  style={{
                    fontSize: "13.5px",
                    color: "var(--color-ink-2)",
                    lineHeight: 1.65,
                    padding: "12px 14px",
                    background: "var(--color-ink-8)",
                    borderRadius: "8px",
                    border: "1px solid var(--color-ink-6)",
                  }}
                >
                  {p.deskripsiInfo}
                </div>
              </div>

              {p.tujuanInfo && (
                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      color: "var(--color-ink-4)",
                      marginBottom: "6px",
                    }}
                  >
                    Tujuan Penggunaan
                  </div>
                  <div
                    style={{
                      fontSize: "13.5px",
                      color: "var(--color-ink-2)",
                      lineHeight: 1.65,
                      padding: "12px 14px",
                      background: "var(--color-ink-8)",
                      borderRadius: "8px",
                      border: "1px solid var(--color-ink-6)",
                    }}
                  >
                    {p.tujuanInfo}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Kanan — update status */}
        <div style={{ position: "sticky", top: "80px" }}>
          <UpdatePermohonanForm permohonan={p} />
        </div>
      </div>
    </>
  );
}
