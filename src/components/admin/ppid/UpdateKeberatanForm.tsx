// src/components/admin/ppid/UpdateKeberatanForm.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateStatusKeberatan } from "@/lib/actions/ppid";
import { CheckCircle2, XCircle, Clock, Scale } from "lucide-react";

type Status = "diterima" | "diproses" | "selesai" | "ditolak" | "diteruskan_ki";

const STATUS_OPTIONS: {
  value: Status;
  label: string;
  color: string;
  bg: string;
  border: string;
  icon: typeof CheckCircle2;
}[] = [
  {
    value: "diterima",
    label: "Diterima",
    color: "#1d4ed8",
    bg: "#eff6ff",
    border: "#bfdbfe",
    icon: Clock,
  },
  {
    value: "diproses",
    label: "Diproses",
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
    icon: Clock,
  },
  {
    value: "selesai",
    label: "Selesai",
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    icon: CheckCircle2,
  },
  {
    value: "ditolak",
    label: "Ditolak",
    color: "#dc2626",
    bg: "#fef2f2",
    border: "#fecaca",
    icon: XCircle,
  },
  {
    value: "diteruskan_ki",
    label: "Diteruskan ke Komisi Informasi",
    color: "#7e22ce",
    bg: "#fdf4ff",
    border: "#e9d5ff",
    icon: Scale,
  },
];

type Props = {
  keberatan: {
    id: number;
    status: string;
    catatan: string | null;
    jawabanUrl: string | null;
    selesaiAt: Date | null;
    createdAt: Date;
  };
};

export function UpdateKeberatanForm({ keberatan }: Props) {
  const router = useRouter();
  const [isPending, startT] = useTransition();
  const [status, setStatus] = useState<Status>(keberatan.status as Status);
  const [catatan, setCatatan] = useState(keberatan.catatan ?? "");
  const [jawaban, setJawaban] = useState(keberatan.jawabanUrl ?? "");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setError(null);
    setSaved(false);
    startT(async () => {
      try {
        await updateStatusKeberatan(
          keberatan.id,
          status,
          catatan || undefined,
          jawaban || undefined,
        );
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        router.refresh();
      } catch {
        setError("Gagal menyimpan perubahan.");
      }
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <div className="admin-card">
        <div className="admin-card-head">
          <div className="admin-card-title">Update Status</div>
        </div>
        <div className="admin-card-body">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginBottom: "14px",
            }}
          >
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStatus(opt.value)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 14px",
                  borderRadius: "9px",
                  border: `1.5px solid ${status === opt.value ? opt.color : "var(--color-ink-6)"}`,
                  background: status === opt.value ? opt.bg : "#fff",
                  cursor: "pointer",
                  transition: "all 0.12s",
                  textAlign: "left",
                  width: "100%",
                }}
              >
                <opt.icon
                  size={15}
                  style={{ color: opt.color, flexShrink: 0 }}
                />
                <span
                  style={{
                    fontSize: "13.5px",
                    fontWeight: status === opt.value ? 700 : 500,
                    color:
                      status === opt.value ? opt.color : "var(--color-ink-2)",
                  }}
                >
                  {opt.label}
                </span>
                {status === opt.value && (
                  <div
                    style={{
                      marginLeft: "auto",
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: opt.color,
                      flexShrink: 0,
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="admin-form-group">
            <label className="admin-label" htmlFor="catatan">
              Catatan / Keterangan
            </label>
            <textarea
              id="catatan"
              className="admin-textarea"
              rows={3}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Tambahkan catatan untuk pemohon..."
            />
          </div>

          <div className="admin-form-group" style={{ marginTop: "10px" }}>
            <label className="admin-label" htmlFor="jawaban">
              URL Dokumen Putusan
            </label>
            <input
              id="jawaban"
              type="url"
              className="admin-input"
              value={jawaban}
              onChange={(e) => setJawaban(e.target.value)}
              placeholder="https://drive.google.com/..."
            />
            <span className="admin-hint">
              Link dokumen putusan keberatan yang bisa diakses pemohon.
            </span>
          </div>

          {error && (
            <div
              style={{
                padding: "8px 12px",
                borderRadius: "7px",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#dc2626",
                fontSize: "13px",
                marginTop: "8px",
              }}
            >
              {error}
            </div>
          )}

          {saved && (
            <div
              style={{
                padding: "8px 12px",
                borderRadius: "7px",
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                color: "#16a34a",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginTop: "8px",
              }}
            >
              <CheckCircle2 size={14} /> Status berhasil disimpan
            </div>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="admin-btn-save"
            style={{
              width: "100%",
              justifyContent: "center",
              marginTop: "12px",
            }}
          >
            {isPending ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-head">
          <div className="admin-card-title">Informasi Waktu</div>
        </div>
        <div
          style={{
            padding: "12px 16px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {[
            {
              label: "Diterima",
              value: new Date(keberatan.createdAt).toLocaleDateString(
                "id-ID",
                { day: "numeric", month: "long", year: "numeric" },
              ),
            },
            {
              label: "Batas Putusan",
              value: (() => {
                const batas = new Date(keberatan.createdAt);
                batas.setDate(batas.getDate() + 30); // maks 30 hari kerja
                return batas.toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                });
              })(),
            },
            {
              label: "Diselesaikan",
              value: keberatan.selesaiAt
                ? new Date(keberatan.selesaiAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "—",
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "12.5px",
              }}
            >
              <span style={{ color: "var(--color-ink-4)" }}>{item.label}</span>
              <span style={{ fontWeight: 600, color: "var(--color-ink-2)" }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
