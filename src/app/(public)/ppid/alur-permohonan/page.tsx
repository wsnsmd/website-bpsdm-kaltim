// src/app/(public)/ppid/alur-permohonan/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ArrowDown, ArrowRight, FileText } from "lucide-react";

export const metadata: Metadata = { title: "Alur Permohonan Informasi" };

const ALUR_STEPS = [
  {
    no: "01",
    label: "Pengajuan Permohonan",
    desc: "Pemohon mengisi formulir permohonan informasi secara online atau langsung ke loket PPID.",
    color: "var(--color-forest-700)",
    bg: "var(--color-forest-50)",
    border: "var(--color-forest-200)",
  },
  {
    no: "02",
    label: "Registrasi & Verifikasi",
    desc: "PPID mencatat dan memverifikasi kelengkapan permohonan. Pemohon mendapat nomor registrasi.",
    color: "#1d4ed8",
    bg: "#eff6ff",
    border: "#bfdbfe",
  },
  {
    no: "03",
    label: "Konfirmasi Tertulis",
    desc: "PPID mengirimkan konfirmasi tertulis bahwa permohonan telah diterima dalam 1 hari kerja.",
    color: "#7e22ce",
    bg: "#fdf4ff",
    border: "#e9d5ff",
  },
  {
    no: "04",
    label: "Proses Penelaahan",
    desc: "PPID menelaah apakah informasi yang diminta termasuk informasi yang dapat diberikan atau dikecualikan.",
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
  },
  {
    no: "05",
    label: "Penyampaian Informasi",
    desc: "PPID menyampaikan informasi kepada pemohon sesuai cara yang diminta dalam 10 hari kerja (dapat diperpanjang 7 hari).",
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#bbf7d0",
  },
];

const KEBERATAN_STEPS = [
  {
    label: "Pemohon Mengajukan Keberatan",
    desc: "Jika tidak puas, pemohon dapat mengajukan keberatan kepada atasan PPID dalam 30 hari kerja.",
  },
  {
    label: "Tanggapan Atasan PPID",
    desc: "Atasan PPID memberikan tanggapan dalam 30 hari kerja sejak keberatan diterima.",
  },
  {
    label: "Sengketa ke Komisi Informasi",
    desc: "Jika masih tidak puas, pemohon dapat mengajukan sengketa ke Komisi Informasi dalam 14 hari kerja.",
  },
];

export default function AlurPermohonanPage() {
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Alur utama */}
        <div
          style={{
            background: "#fff",
            borderRadius: "14px",
            border: "1px solid var(--color-ink-6)",
            padding: "24px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "18px",
              fontWeight: 700,
              color: "var(--color-ink)",
              marginBottom: "24px",
            }}
          >
            Alur Permohonan Informasi Publik
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0",
            }}
          >
            {ALUR_STEPS.map((step, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "16px",
                    width: "100%",
                    maxWidth: "620px",
                    padding: "16px 20px",
                    borderRadius: "12px",
                    background: step.bg,
                    border: `1px solid ${step.border}`,
                  }}
                >
                  {/* Nomor */}
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: step.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      fontWeight: 800,
                      color: "#fff",
                      flexShrink: 0,
                    }}
                  >
                    {step.no}
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: "14.5px",
                        fontWeight: 700,
                        color: step.color,
                        marginBottom: "4px",
                      }}
                    >
                      {step.label}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "var(--color-ink-3)",
                        lineHeight: 1.6,
                      }}
                    >
                      {step.desc}
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                {i < ALUR_STEPS.length - 1 && (
                  <ArrowDown
                    size={20}
                    style={{
                      color: "var(--color-ink-4)",
                      margin: "8px 0",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Alur keberatan */}
        <div
          style={{
            background: "#fff",
            borderRadius: "14px",
            border: "1px solid var(--color-ink-6)",
            padding: "24px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "16px",
              fontWeight: 700,
              color: "var(--color-ink)",
              marginBottom: "20px",
            }}
          >
            Alur Keberatan & Sengketa
          </h3>
          <div style={{ display: "flex", alignItems: "stretch", gap: "0" }}>
            {KEBERATAN_STEPS.map((step, i) => (
              <div
                key={i}
                style={{ display: "flex", alignItems: "center", flex: 1 }}
              >
                <div
                  style={{
                    flex: 1,
                    padding: "16px",
                    borderRadius: "10px",
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: "#dc2626",
                      color: "#fff",
                      fontSize: "12px",
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 10px",
                    }}
                  >
                    {i + 1}
                  </div>
                  <div
                    style={{
                      fontSize: "12.5px",
                      fontWeight: 700,
                      color: "#dc2626",
                      marginBottom: "6px",
                      lineHeight: 1.3,
                    }}
                  >
                    {step.label}
                  </div>
                  <div
                    style={{
                      fontSize: "11.5px",
                      color: "var(--color-ink-3)",
                      lineHeight: 1.5,
                    }}
                  >
                    {step.desc}
                  </div>
                </div>
                {i < KEBERATAN_STEPS.length - 1 && (
                  <ArrowRight
                    size={18}
                    style={{
                      color: "var(--color-ink-4)",
                      flexShrink: 0,
                      margin: "0 8px",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
          }}
        >
          <Link
            href="/ppid/permohonan"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "16px 20px",
              borderRadius: "12px",
              background: "var(--color-forest-700)",
              textDecoration: "none",
            }}
          >
            <FileText size={20} color="#fff" />
            <div>
              <div
                style={{ fontSize: "13.5px", fontWeight: 700, color: "#fff" }}
              >
                Ajukan Permohonan Sekarang
              </div>
              <div
                style={{
                  fontSize: "11.5px",
                  color: "rgba(255,255,255,0.65)",
                  marginTop: "2px",
                }}
              >
                Isi formulir permohonan informasi publik
              </div>
            </div>
          </Link>

          <Link
            href="/ppid/keberatan"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "16px 20px",
              borderRadius: "12px",
              background: "#fff",
              border: "1px solid var(--color-ink-6)",
              textDecoration: "none",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            <FileText size={20} style={{ color: "#dc2626" }} />
            <div>
              <div
                style={{
                  fontSize: "13.5px",
                  fontWeight: 700,
                  color: "var(--color-ink)",
                }}
              >
                Ajukan Keberatan
              </div>
              <div
                style={{
                  fontSize: "11.5px",
                  color: "var(--color-ink-4)",
                  marginTop: "2px",
                }}
              >
                Prosedur keberatan & sengketa informasi
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
