// src/components/ppid/PpidFormClient.tsx
"use client";

import { useState, useTransition, useRef } from "react";
import { submitPermohonan } from "@/lib/actions/ppid";
import { CheckCircle2, Copy, Upload, Loader2 } from "lucide-react";

export function PpidFormClient() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [nomor, setNomor] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [kategoriPemohon, setKategoriPemohon] = useState<
    "perorangan" | "badan_hukum"
  >("perorangan");

  const [ktpUrl, setKtpUrl] = useState<string | null>(null);
  const [ktpNama, setKtpNama] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUploadKtp(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("purpose", "ktp");
      const res = await fetch("/api/ppid/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error ?? "Gagal mengunggah file.");
        return;
      }
      setKtpUrl(data.url);
      setKtpNama(file.name);
    } catch {
      setUploadError("Gagal mengunggah file. Coba lagi.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("kategoriPemohon", kategoriPemohon);
    if (ktpUrl) formData.set("ktpUrl", ktpUrl);

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

      {/* Kategori Permohonan */}
      <div style={{ marginBottom: "20px" }}>
        <label style={labelStyle} htmlFor="kategoriPemohon">
          Kategori Permohonan <span style={{ color: "#dc2626" }}>*</span>
        </label>
        <select
          id="kategoriPemohon"
          value={kategoriPemohon}
          onChange={(e) =>
            setKategoriPemohon(e.target.value as "perorangan" | "badan_hukum")
          }
          style={inputStyle}
        >
          <option value="perorangan">Perorangan</option>
          <option value="badan_hukum">Badan Hukum / Organisasi</option>
        </select>
      </div>

      {kategoriPemohon === "badan_hukum" && (
        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle} htmlFor="namaInstansi">
            Nama Badan Hukum / Organisasi{" "}
            <span style={{ color: "#dc2626" }}>*</span>
          </label>
          <input
            id="namaInstansi"
            name="namaInstansi"
            type="text"
            style={inputStyle}
            placeholder="Nama lembaga/organisasi"
            required
          />
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
              NIK / No. Identitas Pribadi{" "}
              <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <input
              id="nik"
              name="nik"
              type="text"
              style={inputStyle}
              placeholder="16 digit NIK"
              maxLength={16}
              required
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
              No. HP / WhatsApp <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <input
              id="noHp"
              name="noHp"
              type="tel"
              style={inputStyle}
              placeholder="08xx-xxxx-xxxx"
              required
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

      {/* Upload KTP */}
      <div style={{ marginBottom: "20px" }}>
        <label style={labelStyle}>
          Upload KTP / Identitas Pribadi{" "}
          <span style={{ color: "#dc2626" }}>*</span>
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,application/pdf"
          onChange={handleUploadKtp}
          style={{ display: "none" }}
        />
        <div
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: "2px dashed var(--color-ink-5)",
            borderRadius: "12px",
            padding: "22px 20px",
            textAlign: "center",
            cursor: "pointer",
            background: "var(--color-ink-8)",
          }}
        >
          {uploading ? (
            <Loader2
              size={24}
              className="animate-spin"
              style={{ margin: "0 auto 8px", color: "var(--color-ink-4)" }}
            />
          ) : (
            <Upload
              size={24}
              style={{ margin: "0 auto 8px", color: "var(--color-ink-4)" }}
            />
          )}
          <div
            style={{
              fontSize: "13px",
              color: "var(--color-ink-2)",
              fontWeight: 600,
            }}
          >
            {ktpNama ? ktpNama : "Upload File KTP atau Drag File"}
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "var(--color-ink-4)",
              marginTop: "4px",
            }}
          >
            JPG, PNG, atau PDF — Maks 3MB
          </div>
        </div>
        {uploadError && (
          <div style={{ fontSize: "12px", color: "#dc2626", marginTop: "6px" }}>
            {uploadError}
          </div>
        )}
        {ktpUrl && (
          <div style={{ fontSize: "12px", color: "#16a34a", marginTop: "6px" }}>
            ✓ File berhasil diunggah
          </div>
        )}
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

      {/* Cara memperoleh informasi */}
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
          Cara Memperoleh Informasi
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
          }}
        >
          {[
            { value: "melihat", label: "Melihat" },
            { value: "membaca", label: "Membaca" },
            { value: "mendengarkan", label: "Mendengarkan" },
            { value: "mencatat", label: "Mencatat" },
          ].map((opt) => (
            <label
              key={opt.value}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "9px 12px",
                borderRadius: "9px",
                border: "1px solid var(--color-ink-6)",
                fontSize: "13px",
                color: "var(--color-ink-2)",
                cursor: "pointer",
              }}
            >
              <input
                type="radio"
                name="caraMemperolehInfo"
                value={opt.value}
                required
              />
              {opt.label}
            </label>
          ))}
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
              Cara Mendapatkan Salinan
            </label>
            <select id="caraMendapat" name="caraMendapat" style={inputStyle}>
              <option value="ambil_langsung">Mengambil Langsung</option>
              <option value="faksimili">Faksimili</option>
              <option value="email">Melalui Email</option>
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
        {isPending ? "Mengirim..." : "Ajukan Permohonan"}
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
