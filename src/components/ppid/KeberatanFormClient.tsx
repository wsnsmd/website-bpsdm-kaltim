// src/components/ppid/KeberatanFormClient.tsx
"use client";

import { useState, useTransition, useRef } from "react";
import {
  submitKeberatan,
  validasiPermohonanKeberatan,
} from "@/lib/actions/ppid";
import { CheckCircle2, Copy, Search, Upload, Loader2 } from "lucide-react";

const ALASAN_OPTIONS = [
  { value: "penolakan_permohonan", label: "Penolakan atas permohonan informasi publik" },
  { value: "tidak_disediakan_berkala", label: "Tidak disediakannya informasi berkala" },
  { value: "tidak_ditanggapi", label: "Tidak ditanggapinya permohonan informasi publik" },
  {
    value: "ditanggapi_tidak_sebagaimana_mestinya",
    label: "Permohonan ditanggapi tidak sebagaimana mestinya",
  },
  { value: "tidak_dipenuhi", label: "Tidak dipenuhinya permohonan informasi publik" },
  { value: "biaya_tidak_wajar", label: "Pengenaan biaya yang tidak wajar" },
  { value: "melebihi_jangka_waktu", label: "Penyampaian informasi melebihi jangka waktu" },
];

type ValidatedPermohonan = {
  id: number;
  nomorPermohonan: string;
  namaPemohon: string;
  nik: string;
  email: string;
  noHp: string | null;
  alamat: string | null;
  subjekInfo: string;
};

type Step = "validasi" | "alasan" | "berkas";

const STEPS: { key: Step; label: string; sub: string }[] = [
  { key: "validasi", label: "Validasi", sub: "PERMOHONAN" },
  { key: "alasan", label: "Alasan", sub: "KEBERATAN" },
  { key: "berkas", label: "Berkas", sub: "PENDUKUNG" },
];

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: "8px",
  border: "1px solid var(--color-ink-5)",
  fontSize: "13.5px",
  color: "var(--color-ink)",
  outline: "none",
  background: "#fff",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "12.5px",
  fontWeight: 600,
  color: "var(--color-ink-2)",
  marginBottom: "5px",
};

export function KeberatanFormClient() {
  const [step, setStep] = useState<Step>("validasi");
  const [isPending, startTransition] = useTransition();

  // Step 1 — validasi
  const [kodePermohonan, setKodePermohonan] = useState("");
  const [nikInput, setNikInput] = useState("");
  const [validasiError, setValidasiError] = useState<string | null>(null);
  const [permohonan, setPermohonan] = useState<ValidatedPermohonan | null>(null);

  // Step 2 — alasan
  const [alasanTerpilih, setAlasanTerpilih] = useState<string[]>([]);
  const [dikuasakan, setDikuasakan] = useState(false);
  const [namaKuasa, setNamaKuasa] = useState("");
  const [uraian, setUraian] = useState("");

  // Step 3 — berkas
  const [suratUrl, setSuratUrl] = useState<string | null>(null);
  const [suratNama, setSuratNama] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [nomor, setNomor] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function handleValidasi() {
    setValidasiError(null);
    startTransition(async () => {
      const result = await validasiPermohonanKeberatan(kodePermohonan, nikInput);
      if ("error" in result) {
        setValidasiError(result.error as string);
        return;
      }
      setPermohonan(result.permohonan!);
      setStep("alasan");
    });
  }

  function toggleAlasan(value: string) {
    setAlasanTerpilih((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }

  async function handleUploadSurat(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("purpose", "surat_keberatan");
      const res = await fetch("/api/ppid/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error ?? "Gagal mengunggah file.");
        return;
      }
      setSuratUrl(data.url);
      setSuratNama(file.name);
    } catch {
      setUploadError("Gagal mengunggah file. Coba lagi.");
    } finally {
      setUploading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    if (alasanTerpilih.length === 0) {
      setSubmitError("Pilih minimal 1 alasan keberatan");
      setStep("alasan");
      return;
    }
    if (uraian.trim().length < 20) {
      setSubmitError("Kronologi minimal 20 karakter");
      setStep("alasan");
      return;
    }
    if (dikuasakan && !namaKuasa.trim()) {
      setSubmitError("Nama kuasa wajib diisi jika pengajuan dikuasakan");
      setStep("alasan");
      return;
    }
    if (!suratUrl) {
      setSubmitError("Surat keberatan wajib diunggah");
      return;
    }
    if (!permohonan) return;

    const fd = new FormData();
    fd.append("permohonanId", String(permohonan.id));
    fd.append("kodePermohonan", permohonan.nomorPermohonan);
    fd.append("namaPemohon", permohonan.namaPemohon);
    fd.append("nik", permohonan.nik);
    fd.append("email", permohonan.email);
    fd.append("noHp", permohonan.noHp ?? "");
    fd.append("alamat", permohonan.alamat ?? "");
    alasanTerpilih.forEach((a) => fd.append("alasanKeberatan", a));
    fd.append("dikuasakan", dikuasakan ? "true" : "false");
    fd.append("namaKuasa", namaKuasa);
    fd.append("uraianKeberatan", uraian);
    fd.append("suratKeberatanUrl", suratUrl);

    startTransition(async () => {
      const result = await submitKeberatan(fd);
      if (result.error) {
        setSubmitError(result.error);
        return;
      }
      if (result.nomor) setNomor(result.nomor);
    });
  }

  function copyNomor() {
    if (!nomor) return;
    navigator.clipboard.writeText(nomor);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ── Success state ──
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
          <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "6px" }}>
            Keberatan Berhasil Dikirim
          </div>
          <div style={{ fontSize: "13.5px", color: "var(--color-ink-3)" }}>
            Simpan nomor keberatan berikut untuk tracking status:
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 20px",
            borderRadius: "10px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "18px",
              fontWeight: 800,
              color: "#dc2626",
              letterSpacing: "1px",
            }}
          >
            {nomor}
          </span>
          <button
            onClick={copyNomor}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626" }}
          >
            <Copy size={16} />
          </button>
          {copied && <span style={{ fontSize: "12px", color: "#dc2626" }}>Tersalin!</span>}
        </div>
        <div
          style={{
            padding: "12px 16px",
            borderRadius: "8px",
            background: "#fffbeb",
            border: "1px solid #fde68a",
            fontSize: "12.5px",
            color: "#92400e",
            maxWidth: "400px",
          }}
        >
          ⏱ Keberatan akan diputus dalam <strong>30 hari kerja</strong>. Cek
          statusnya di bagian <strong>Cek Status Keberatan</strong>.
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Step tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        {STEPS.map((s, i) => {
          const active = step === s.key;
          const done = STEPS.findIndex((x) => x.key === step) > i;
          return (
            <div
              key={s.key}
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: "10px",
                border: `1.5px solid ${active ? "#dc2626" : done ? "#fecaca" : "var(--color-ink-6)"}`,
                background: active ? "#fef2f2" : "#fff",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "13px", fontWeight: 700, color: active ? "#dc2626" : "var(--color-ink-2)" }}>
                {s.label}
              </div>
              <div style={{ fontSize: "10px", color: "var(--color-ink-4)", letterSpacing: "0.5px" }}>
                {s.sub}
              </div>
            </div>
          );
        })}
      </div>

      {submitError && (
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
          {submitError}
        </div>
      )}

      {/* ── STEP 1: Validasi ── */}
      {step === "validasi" && (
        <div>
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
            Validasi Permohonan
          </div>
          <p style={{ fontSize: "12.5px", color: "var(--color-ink-4)", marginBottom: "14px" }}>
            Keberatan hanya bisa diajukan atas permohonan informasi yang sudah
            pernah Anda ajukan. Masukkan kode permohonan dan NIK yang
            digunakan saat mengajukan permohonan tersebut.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
            <div>
              <label style={labelStyle} htmlFor="kodePermohonan">
                Kode Permohonan <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <input
                id="kodePermohonan"
                type="text"
                style={{ ...inputStyle, fontFamily: "monospace" }}
                placeholder="Contoh: PPID-202501-1234"
                value={kodePermohonan}
                onChange={(e) => setKodePermohonan(e.target.value)}
              />
            </div>
            <div>
              <label style={labelStyle} htmlFor="nikValidasi">
                NIK <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <input
                id="nikValidasi"
                type="text"
                style={inputStyle}
                placeholder="16 digit NIK"
                value={nikInput}
                onChange={(e) => setNikInput(e.target.value)}
              />
            </div>
          </div>

          {validasiError && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "8px",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#dc2626",
                fontSize: "13px",
                marginBottom: "12px",
              }}
            >
              {validasiError}
            </div>
          )}

          <button
            type="button"
            onClick={handleValidasi}
            disabled={isPending || !kodePermohonan || !nikInput}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              background: isPending ? "var(--color-ink-5)" : "#dc2626",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 700,
              border: "none",
              cursor: isPending ? "wait" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Search size={16} />
            )}
            {isPending ? "Memeriksa..." : "Cek Data Permohonan"}
          </button>
        </div>
      )}

      {/* ── STEP 2: Alasan ── */}
      {step === "alasan" && permohonan && (
        <div>
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "8px",
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              fontSize: "13px",
              color: "var(--color-ink-2)",
              marginBottom: "18px",
            }}
          >
            ✓ Permohonan tervalidasi atas nama <strong>{permohonan.namaPemohon}</strong>{" "}
            — {permohonan.subjekInfo}
          </div>

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
            Alasan Pengajuan Keberatan (bisa pilih lebih dari satu)
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "18px" }}>
            {ALASAN_OPTIONS.map((opt) => {
              const checked = alasanTerpilih.includes(opt.value);
              return (
                <label
                  key={opt.value}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    padding: "10px 14px",
                    borderRadius: "9px",
                    border: `1.5px solid ${checked ? "#dc2626" : "var(--color-ink-6)"}`,
                    background: checked ? "#fef2f2" : "#fff",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleAlasan(opt.value)}
                    style={{ marginTop: "2px" }}
                  />
                  <span style={{ fontSize: "13px", color: "var(--color-ink-2)" }}>
                    {opt.label}
                  </span>
                </label>
              );
            })}
          </div>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 14px",
              borderRadius: "9px",
              border: "1.5px solid var(--color-ink-6)",
              marginBottom: "18px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={dikuasakan}
              onChange={(e) => setDikuasakan(e.target.checked)}
            />
            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-ink-2)" }}>
              Pengajuan Keberatan Dikuasakan (jika ada)
            </span>
          </label>

          {dikuasakan && (
            <div style={{ marginBottom: "18px" }}>
              <label style={labelStyle} htmlFor="namaKuasa">
                Nama Penerima Kuasa <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <input
                id="namaKuasa"
                type="text"
                style={inputStyle}
                placeholder="Nama lengkap penerima kuasa"
                value={namaKuasa}
                onChange={(e) => setNamaKuasa(e.target.value)}
              />
            </div>
          )}

          <div style={{ marginBottom: "18px" }}>
            <label style={labelStyle} htmlFor="uraian">
              Kronologi (Penjelasan Keberatan) <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <textarea
              id="uraian"
              rows={4}
              style={{ ...inputStyle, resize: "vertical" }}
              placeholder="Jelaskan kronologi dan alasan keberatan Anda..."
              value={uraian}
              onChange={(e) => setUraian(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              onClick={() => setStep("validasi")}
              style={{
                padding: "12px 20px",
                borderRadius: "10px",
                border: "1px solid var(--color-ink-5)",
                background: "#fff",
                color: "var(--color-ink-2)",
                fontSize: "13.5px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Kembali
            </button>
            <button
              type="button"
              onClick={() => {
                if (alasanTerpilih.length === 0) {
                  setSubmitError("Pilih minimal 1 alasan keberatan");
                  return;
                }
                if (uraian.trim().length < 20) {
                  setSubmitError("Kronologi minimal 20 karakter");
                  return;
                }
                if (dikuasakan && !namaKuasa.trim()) {
                  setSubmitError("Nama kuasa wajib diisi");
                  return;
                }
                setSubmitError(null);
                setStep("berkas");
              }}
              style={{
                flex: 1,
                padding: "12px 20px",
                borderRadius: "10px",
                background: "#dc2626",
                color: "#fff",
                fontSize: "14px",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
              }}
            >
              Lanjut ke Berkas
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Berkas ── */}
      {step === "berkas" && (
        <form onSubmit={handleSubmit}>
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
            Upload Surat Keberatan
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,application/pdf"
            onChange={handleUploadSurat}
            style={{ display: "none" }}
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: "2px dashed var(--color-ink-5)",
              borderRadius: "12px",
              padding: "28px 20px",
              textAlign: "center",
              cursor: "pointer",
              background: "var(--color-ink-8)",
              marginBottom: "12px",
            }}
          >
            {uploading ? (
              <Loader2 size={28} className="animate-spin" style={{ margin: "0 auto 10px", color: "var(--color-ink-4)" }} />
            ) : (
              <Upload size={28} style={{ margin: "0 auto 10px", color: "var(--color-ink-4)" }} />
            )}
            <div style={{ fontSize: "13px", color: "var(--color-ink-2)", fontWeight: 600 }}>
              {suratNama ? suratNama : "Upload Surat Keberatan atau Drag File"}
            </div>
            <div style={{ fontSize: "11.5px", color: "var(--color-ink-4)", marginTop: "4px" }}>
              JPG, PNG, atau PDF — Maks 6MB
            </div>
          </div>

          {uploadError && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "8px",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#dc2626",
                fontSize: "13px",
                marginBottom: "12px",
              }}
            >
              {uploadError}
            </div>
          )}

          {suratUrl && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "8px",
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                color: "#16a34a",
                fontSize: "13px",
                marginBottom: "18px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <CheckCircle2 size={14} /> File berhasil diunggah
            </div>
          )}

          <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
            <button
              type="button"
              onClick={() => setStep("alasan")}
              style={{
                padding: "12px 20px",
                borderRadius: "10px",
                border: "1px solid var(--color-ink-5)",
                background: "#fff",
                color: "var(--color-ink-2)",
                fontSize: "13.5px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Kembali
            </button>
            <button
              type="submit"
              disabled={isPending || !suratUrl}
              style={{
                flex: 1,
                padding: "12px 20px",
                borderRadius: "10px",
                background: isPending || !suratUrl ? "var(--color-ink-5)" : "#dc2626",
                color: "#fff",
                fontSize: "14px",
                fontWeight: 700,
                border: "none",
                cursor: isPending || !suratUrl ? "not-allowed" : "pointer",
              }}
            >
              {isPending ? "Mengirim..." : "Ajukan Keberatan"}
            </button>
          </div>

          <p style={{ marginTop: "10px", fontSize: "11.5px", color: "var(--color-ink-4)", textAlign: "center" }}>
            Keberatan diajukan sesuai Pasal 35 UU KIP No. 14/2008 kepada atasan PPID BPSDM Kaltim.
          </p>
        </form>
      )}
    </div>
  );
}
