// src/components/profil/StaffCard.tsx
"use client";

import { useState } from "react";
import type { StaffItem } from "@/lib/queries/profil";
import { SmartImage } from "@/components/ui/SmartImage";
import {
  X,
  User,
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  IdCard,
  Building2,
} from "lucide-react";

const TYPE_LABELS: Record<string, string> = {
  kepala_badan: "Kepala Badan",
  sekretaris: "Sekretaris",
  kepala_bidang: "Kepala Bidang",
  widyaiswara: "Widyaiswara",
  pegawai: "Pegawai",
};

const TYPE_COLOR: Record<
  string,
  { bg: string; color: string; border: string }
> = {
  kepala_badan: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
  sekretaris: { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
  kepala_bidang: { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
  widyaiswara: { bg: "#f8fafc", color: "#475569", border: "#e2e8f0" },
  pegawai: { bg: "#f8fafc", color: "#475569", border: "#e2e8f0" },
};

type Props = { staff: StaffItem };

// ── Modal Detail Pegawai ──────────────────────
function StaffModal({
  staff,
  onClose,
}: {
  staff: StaffItem;
  onClose: () => void;
}) {
  const tc = TYPE_COLOR[staff.type] ?? TYPE_COLOR.pegawai;

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        animation: "scFadeIn 0.2s ease",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "22px",
          width: "100%",
          maxWidth: "460px",
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.06)",
          animation: "scSlideUp 0.3s cubic-bezier(.16,1,.3,1)",
        }}
      >
        {/* ── Header dengan foto ── */}
        <div
          style={{
            background: "linear-gradient(160deg, #0f172a 0%, #1e293b 100%)",
            padding: "32px 28px 28px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Dekorasi background */}
          <div
            style={{
              position: "absolute",
              top: "-40px",
              right: "-40px",
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.04)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-20px",
              left: "30%",
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.03)",
              pointerEvents: "none",
            }}
          />

          {/* Tombol tutup */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s",
            }}
          >
            <X size={15} />
          </button>

          <div style={{ display: "flex", alignItems: "flex-end", gap: "20px" }}>
            {/* Foto besar */}
            <div
              style={{
                width: "88px",
                height: "88px",
                borderRadius: "18px",
                overflow: "hidden",
                border: "3px solid rgba(255,255,255,0.2)",
                background: "#1e293b",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              }}
            >
              {staff.photo ? (
                <img
                  src={staff.photo}
                  alt={staff.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top",
                  }}
                />
              ) : (
                <User
                  size={36}
                  color="rgba(255,255,255,0.3)"
                  strokeWidth={1.5}
                />
              )}
            </div>

            {/* Nama + jabatan */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Badge tipe */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "3px 10px",
                  borderRadius: "20px",
                  background: tc.bg,
                  border: `1px solid ${tc.border}`,
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: tc.color,
                  }}
                />
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: tc.color,
                    letterSpacing: "0.3px",
                  }}
                >
                  {TYPE_LABELS[staff.type] ?? staff.type}
                </span>
              </div>

              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: 800,
                  color: "#fff",
                  lineHeight: 1.25,
                  margin: 0,
                }}
              >
                {staff.name}
              </h2>
              <p
                style={{
                  fontSize: "12.5px",
                  color: "rgba(255,255,255,0.5)",
                  marginTop: "4px",
                  lineHeight: 1.35,
                }}
              >
                {staff.position}
              </p>
            </div>
          </div>
        </div>

        {/* ── Body detail ── */}
        <div style={{ padding: "20px 28px 28px" }}>
          {/* Pendidikan */}
          {staff.education && (
            <DetailRow
              icon={<GraduationCap size={15} />}
              label="Pendidikan"
              value={staff.education}
            />
          )}

          {/* Bio */}
          {staff.bio && (
            <div style={{ marginTop: "16px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.6px",
                  marginBottom: "8px",
                }}
              >
                <BookOpen size={13} />
                Profil
              </div>
              <div
                className="prose-bpsdm"
                dangerouslySetInnerHTML={{ __html: staff.bio }}
                style={{
                  fontSize: "13.5px",
                  lineHeight: 1.65,
                  color: "#475569",
                }}
              />
            </div>
          )}

          {/* Kosong */}
          {!staff.nip &&
            !staff.email &&
            !staff.phone &&
            !staff.education &&
            !staff.bio && (
              <div
                style={{
                  textAlign: "center",
                  padding: "24px",
                  color: "#94a3b8",
                  fontSize: "13px",
                }}
              >
                Tidak ada informasi detail tersedia.
              </div>
            )}
        </div>
      </div>

      <style>{`
        @keyframes scFadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes scSlideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}

// ── Row item detail ───────────────────────────
function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        padding: "10px 0",
        borderBottom: "1px solid #f1f5f9",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "8px",
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#64748b",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      {/* Konten */}
      <div style={{ flex: 1, paddingTop: "5px" }}>
        <div
          style={{
            fontSize: "10px",
            fontWeight: 700,
            color: "#94a3b8",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            marginBottom: "2px",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: "13.5px",
            color: "#1e293b",
            lineHeight: 1.4,
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

// ── StaffCard ─────────────────────────────────
export function StaffCard({ staff }: Props) {
  const [open, setOpen] = useState(false);
  const tc = TYPE_COLOR[staff.type] ?? TYPE_COLOR.pegawai;

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        style={{
          background: "#fff",
          border: `1.5px solid ${tc.border}`,
          borderRadius: "14px",
          overflow: "hidden",
          cursor: "pointer",
          transition: "all 0.2s cubic-bezier(.16,1,.3,1)",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform =
            "translateY(-3px)";
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            `0 12px 30px rgba(0,0,0,0.1), 0 0 0 2px ${tc.border}`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            "0 2px 10px rgba(0,0,0,0.05)";
        }}
      >
        {/* Foto */}
        <div
          style={{
            height: "180px",
            background: tc.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {staff.photo ? (
            <SmartImage
              src={staff.photo}
              alt={staff.name}
              style={{ objectFit: "cover", objectPosition: "top" }}
            />
          ) : (
            <div
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `2px solid ${tc.border}`,
              }}
            >
              <User size={32} color={tc.color} strokeWidth={1.5} />
            </div>
          )}

          {/* Overlay hover */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              padding: "12px",
              opacity: 0,
              transition: "opacity 0.2s",
            }}
            className="staff-card-overlay"
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#fff",
                background: "rgba(255,255,255,0.2)",
                padding: "5px 14px",
                borderRadius: "20px",
                backdropFilter: "blur(4px)",
              }}
            >
              Lihat Detail
            </span>
          </div>

          {/* Badge tipe */}
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              background: tc.bg,
              color: tc.color,
              fontSize: "9.5px",
              fontWeight: 700,
              padding: "3px 9px",
              borderRadius: "20px",
              border: `1px solid ${tc.border}`,
              letterSpacing: "0.3px",
              textTransform: "uppercase" as const,
            }}
          >
            {TYPE_LABELS[staff.type] ?? staff.type}
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: "14px 16px" }}>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "14px",
              fontWeight: 700,
              color: "var(--color-ink)",
              lineHeight: 1.3,
              marginBottom: "4px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {staff.name}
          </h3>
          <p
            style={{
              fontSize: "12px",
              color: "var(--color-ink-3)",
              lineHeight: 1.4,
              marginBottom: "6px",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical" as const,
            }}
          >
            {staff.position}
          </p>
          {staff.education && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "11px",
                color: "var(--color-ink-4)",
              }}
            >
              <GraduationCap size={11} />
              {staff.education}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {open && <StaffModal staff={staff} onClose={() => setOpen(false)} />}

      <style>{`
        .staff-card-overlay { opacity: 0 !important; }
        div:hover > .staff-card-overlay { opacity: 1 !important; }
      `}</style>
    </>
  );
}
