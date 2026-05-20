// src/components/ppid/PpidFormClient.tsx
"use client";

import { useState, useTransition } from "react";
import { submitPermohonan } from "@/lib/actions/ppid";
import { CheckCircle2, Copy } from "lucide-react";

export function PpidFormClient() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [nomor, setNomor] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await submitPermohonan(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.nomor) {
        setNomor(result.nomor);
      }
    });
  }

  function copyNomor() {
    if (!nomor) return;
    navigator.clipboard.writeText(nomor);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Success state
  if (nomor) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "32px 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <CheckCircle2 size={48} style={{ color: "var(--color-forest-600)" }} />
        <div>
          <div
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "var(--color-ink)",
              marginBottom: "6px",
            }}
          >
            Permohonan Berhasil Dikirim
          </div>
          <div
            style={{
              fontSize: "13.5px",
              color: "var(--color-ink-3)",
              lineHeight: 1.6,
            }}
          >
            Simpan nomor permohonan berikut untuk tracking status:
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 20px",
            borderRadius: "10px",
            background: "var(--color-forest-50)",
            border: "1px solid var(--color-forest-200)",
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "18px",
              fontWeight: 800,
              color: "var(--color-forest-700)",
              letterSpacing: "1px",
            }}
          >
            {nomor}
          </span>
          <button
            onClick={copyNomor}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--color-forest-600)",
              padding: "2px",
            }}
          >
            <Copy size={16} />
          </button>
          {copied && (
            <span
              style={{ fontSize: "12px", color: "var(--color-forest-600)" }}
            >
              Tersalin!
            </span>
          )}
        </div>
        <div
          style={{
            padding: "12px 16px",
            borderRadius: "8px",
            background: "#fffbeb",
            border: "1px solid #fde68a",
            fontSize: "12.5px",
            color: "#92400e",
            lineHeight: 1.6,
            maxWidth: "400px",
            textAlign: "left",
          }}
        >
          ⏱ Permohonan akan diproses dalam <strong>10 hari kerja</strong>. Anda
          dapat mengecek status di bagian <strong>Cek Status Permohonan</strong>
          .
        </div>
        <button
          onClick={() => setNomor(null)}
          style={{
            padding: "8px 18px",
            borderRadius: "8px",
            border: "1px solid var(--color-ink-5)",
            background: "#fff",
            color: "var(--color-ink-2)",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Ajukan Permohonan Lain
        </button>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "9px 12px",
    borderRadius: "8px",
    border: "1px solid var(--color-ink-5)",
    fontSize: "13.5px",
    color: "var(--color-ink)",
    outline: "none",
    background: "#fff",
    transition: "border-color 0.15s",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "12.5px",
    fontWeight: 600,
    color: "var(--color-ink-2)",
    marginBottom: "5px",
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div
          style={{
            padding: "10px 14px",
            borderRadius: "8px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#dc2626",
            fontSize: "13px",
            marginBottom: "16px",
          }}
        >
          {error}
        </div>
      )}

      {/* Grid identitas */}
      <div style={{ marginBottom: "20px" }}>
        <div
          style={{
            fontSize: "11px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: "var(--color-ink-4)",
            marginBottom: "12px",
            paddingBottom: "6px",
            borderBottom: "1px solid var(--color-ink-6)",
          }}
        >
          Identitas Pemohon
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
          }}
        >
          <div>
            <label style={labelStyle} htmlFor="namaPemohon">
              Nama Lengkap <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <input
              id="namaPemohon"
              name="namaPemohon"
              type="text"
              style={inputStyle}
              placeholder="Nama sesuai KTP"
              required
            />
          </div>
          <div>
            <label style={labelStyle} htmlFor="nik">
              NIK
            </label>
            <input
              id="nik"
              name="nik"
              type="text"
              style={inputStyle}
              placeholder="16 digit NIK (opsional)"
            />
          </div>
          <div>
            <label style={labelStyle} htmlFor="email">
              Email <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              style={inputStyle}
              placeholder="email@contoh.com"
              required
            />
          </div>
          <div>
            <label style={labelStyle} htmlFor="noHp">
              No. HP / WhatsApp
            </label>
            <input
              id="noHp"
              name="noHp"
              type="tel"
              style={inputStyle}
              placeholder="08xx-xxxx-xxxx"
            />
          </div>
          <div>
            <label style={labelStyle} htmlFor="pekerjaan">
              Pekerjaan
            </label>
            <input
              id="pekerjaan"
              name="pekerjaan"
              type="text"
              style={inputStyle}
              placeholder="Profesi/pekerjaan"
            />
          </div>
          <div>
            <label style={labelStyle} htmlFor="alamat">
              Alamat
            </label>
            <input
              id="alamat"
              name="alamat"
              type="text"
              style={inputStyle}
              placeholder="Alamat domisili"
            />
          </div>
        </div>
      </div>

      {/* Informasi yang dimohon */}
      <div style={{ marginBottom: "20px" }}>
        <div
          style={{
            fontSize: "11px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: "var(--color-ink-4)",
            marginBottom: "12px",
            paddingBottom: "6px",
            borderBottom: "1px solid var(--color-ink-6)",
          }}
        >
          Informasi yang Dimohon
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <label style={labelStyle} htmlFor="subjekInfo">
              Subjek Informasi <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <input
              id="subjekInfo"
              name="subjekInfo"
              type="text"
              style={inputStyle}
              placeholder="Contoh: Laporan Keuangan BPSDM 2023"
              required
            />
          </div>
          <div>
            <label style={labelStyle} htmlFor="deskripsiInfo">
              Rincian Informasi <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <textarea
              id="deskripsiInfo"
              name="deskripsiInfo"
              rows={4}
              style={{ ...inputStyle, resize: "vertical" }}
              placeholder="Jelaskan secara rinci informasi yang Anda butuhkan..."
              required
            />
          </div>
          <div>
            <label style={labelStyle} htmlFor="tujuanInfo">
              Tujuan Penggunaan
            </label>
            <textarea
              id="tujuanInfo"
              name="tujuanInfo"
              rows={2}
              style={{ ...inputStyle, resize: "vertical" }}
              placeholder="Untuk keperluan apa informasi ini dibutuhkan?"
            />
          </div>
        </div>
      </div>

      {/* Cara penyampaian */}
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            fontSize: "11px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: "var(--color-ink-4)",
            marginBottom: "12px",
            paddingBottom: "6px",
            borderBottom: "1px solid var(--color-ink-6)",
          }}
        >
          Cara Penyampaian
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
          }}
        >
          <div>
            <label style={labelStyle} htmlFor="caraMendapat">
              Cara Mendapatkan
            </label>
            <select id="caraMendapat" name="caraMendapat" style={inputStyle}>
              <option value="email">Melalui Email</option>
              <option value="ambil_langsung">Ambil Langsung</option>
              <option value="pos">Dikirim via Pos</option>
            </select>
          </div>
          <div>
            <label style={labelStyle} htmlFor="caraMedia">
              Format Media
            </label>
            <select id="caraMedia" name="caraMedia" style={inputStyle}>
              <option value="softcopy">Softcopy (Digital)</option>
              <option value="hardcopy">Hardcopy (Cetak)</option>
              <option value="keduanya">Keduanya</option>
            </select>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "10px",
          background: isPending
            ? "var(--color-ink-5)"
            : "var(--color-forest-700)",
          color: "#fff",
          fontSize: "14px",
          fontWeight: 700,
          border: "none",
          cursor: isPending ? "wait" : "pointer",
          transition: "all 0.15s",
        }}
      >
        {isPending ? "Mengirim..." : "Kirim Permohonan Informasi"}
      </button>

      <p
        style={{
          marginTop: "10px",
          fontSize: "11.5px",
          color: "var(--color-ink-4)",
          textAlign: "center",
          lineHeight: 1.5,
        }}
      >
        Dengan mengirim formulir ini, Anda menyetujui ketentuan permohonan
        informasi sesuai UU KIP No. 14/2008.
      </p>
    </form>
  );
}
