// src/app/admin/ppid/keberatan/[id]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db, eq } from "@/db";
import { ppidKeberatan } from "@/db/schema";
import { ArrowLeft } from "lucide-react";
import { UpdateKeberatanForm } from "@/components/admin/ppid/UpdateKeberatanForm";
import { DeleteKeberatanDetailButton } from "@/components/admin/ppid/DeleteKeberatanDetailButton";

export const metadata: Metadata = { title: "Detail Keberatan PPID" };
// PM2 cluster mode (2+ instance) -> Full Route Cache tidak sinkron antar-proses.
// force-dynamic memastikan halaman ini selalu query fresh dari DB.
export const dynamic = "force-dynamic";
type Props = { params: Promise<{ id: string }> };

const STATUS_COLOR: Record<string, string> = {
  diterima: "#1d4ed8",
  diproses: "#d97706",
  selesai: "#16a34a",
  ditolak: "#dc2626",
  diteruskan_ki: "#7e22ce",
};

const STATUS_LABEL: Record<string, string> = {
  diterima: "Diterima",
  diproses: "Diproses",
  selesai: "Selesai",
  ditolak: "Ditolak",
  diteruskan_ki: "Diteruskan ke Komisi Informasi",
};

const ALASAN_LABEL: Record<string, string> = {
  penolakan_permohonan: "Penolakan atas permohonan informasi publik",
  tidak_disediakan_berkala: "Tidak disediakannya informasi berkala",
  tidak_ditanggapi: "Tidak ditanggapinya permohonan informasi publik",
  ditanggapi_tidak_sebagaimana_mestinya:
    "Permohonan ditanggapi tidak sebagaimana mestinya",
  tidak_dipenuhi: "Tidak dipenuhinya permohonan informasi publik",
  biaya_tidak_wajar: "Pengenaan biaya yang tidak wajar",
  melebihi_jangka_waktu: "Penyampaian informasi melebihi jangka waktu",
};

export default async function DetailKeberatanPage({ params }: Props) {
  const { id } = await params;
  const kid = Number(id);
  if (isNaN(kid)) notFound();

  const result = await db
    .select()
    .from(ppidKeberatan)
    .where(eq(ppidKeberatan.id, kid))
    .limit(1);
  if (!result[0]) notFound();

  const k = result[0];

  const INFO_ROWS = [
    { label: "Nama Pemohon", value: k.namaPemohon },
    { label: "NIK", value: k.nik },
    { label: "Email", value: k.email },
    { label: "No. HP", value: k.noHp ?? "—" },
    { label: "Alamat", value: k.alamat ?? "—" },
    { label: "Kode Permohonan", value: k.kodePermohonan },
    {
      label: "Dikuasakan",
      value: k.dikuasakan ? `Ya — ${k.namaKuasa ?? "—"}` : "Tidak",
    },
    {
      label: "Alasan Keberatan",
      value: k.alasanKeberatan
        .map((a) => ALASAN_LABEL[a] ?? a)
        .join(", "),
    },
    {
      label: "Tanggal Masuk",
      value: new Date(k.createdAt).toLocaleDateString("id-ID", {
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
            {k.nomorKeberatan}
          </code>
          <span
            style={{
              padding: "3px 10px",
              borderRadius: "20px",
              background: `${STATUS_COLOR[k.status]}15`,
              border: `1px solid ${STATUS_COLOR[k.status]}30`,
              fontSize: "12px",
              fontWeight: 700,
              color: STATUS_COLOR[k.status],
            }}
          >
            {STATUS_LABEL[k.status] ?? k.status}
          </span>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <DeleteKeberatanDetailButton id={k.id} />
          <Link href="/admin/ppid/keberatan" className="admin-btn-cancel">
            <ArrowLeft size={14} /> Kembali
          </Link>
        </div>
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
          <div className="admin-card">
            <div className="admin-card-head">
              <div className="admin-card-title">
                Data Pemohon & Keberatan
              </div>
            </div>
            <div>
              {INFO_ROWS.map((row, i) => (
                <div
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "180px 1fr",
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

          <div className="admin-card">
            <div className="admin-card-head">
              <div className="admin-card-title">Uraian Keberatan</div>
            </div>
            <div style={{ padding: "16px 20px" }}>
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
                {k.uraianKeberatan}
              </div>
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-head">
              <div className="admin-card-title">Berkas Pendukung</div>
            </div>
            <div style={{ padding: "16px 20px" }}>
              <a
                href={k.suratKeberatanUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="admin-btn-cancel"
                style={{ display: "inline-flex" }}
              >
                Lihat Surat Keberatan
              </a>
            </div>
          </div>
        </div>

        {/* Kanan — update status */}
        <div style={{ position: "sticky", top: "80px" }}>
          <UpdateKeberatanForm keberatan={k} />
        </div>
      </div>
    </>
  );
}
