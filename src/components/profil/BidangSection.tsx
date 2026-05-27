// src/components/profil/BidangSection.tsx
"use client";

import { useState } from "react";
import type { UnitItem, StaffItem } from "@/lib/queries/profil";
import { SmartImage } from "@/components/ui/SmartImage";
import { X, Users, ChevronRight, Award, Building2, User } from "lucide-react";

type UnitWithMembers = UnitItem & {
  staffCount: number;
  kepala: StaffItem | null;
  members: StaffItem[];
  col?: (typeof UNIT_COLORS)[number];
};

type Props = { units: UnitWithMembers[] };

const UNIT_COLORS = [
  {
    accent: "#0369a1",
    light: "#e0f2fe",
    border: "#7dd3fc",
    gradient: "linear-gradient(135deg, #0369a1, #0284c7)",
  },
  {
    accent: "#15803d",
    light: "#dcfce7",
    border: "#86efac",
    gradient: "linear-gradient(135deg, #0e3d20, #16a34a)",
  },
  {
    accent: "#7c3aed",
    light: "#ede9fe",
    border: "#c4b5fd",
    gradient: "linear-gradient(135deg, #7c3aed, #8b5cf6)",
  },
  {
    accent: "#b45309",
    light: "#fef3c7",
    border: "#fcd34d",
    gradient: "linear-gradient(135deg, #b45309, #d97706)",
  },
  {
    accent: "#be123c",
    light: "#ffe4e6",
    border: "#fda4af",
    gradient: "linear-gradient(135deg, #be123c, #e11d48)",
  },
];

function StaffBadge({ type }: { type: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    kepala_badan: { label: "Kepala Badan", color: "#dc2626", bg: "#fef2f2" },
    sekretaris: { label: "Sekretaris", color: "#2563eb", bg: "#eff6ff" },
    kepala_bidang: { label: "Kepala Bidang", color: "#15803d", bg: "#f0fdf4" },
    widyaiswara: { label: "Widyaiswara", color: "#7c3aed", bg: "#f5f3ff" },
    pegawai: { label: "Pegawai", color: "#64748b", bg: "#f8fafc" },
  };
  const s = map[type] ?? map.pegawai;
  return (
    <span
      style={{
        fontSize: "9px",
        fontWeight: 700,
        color: s.color,
        background: s.bg,
        padding: "2px 7px",
        borderRadius: "20px",
        border: `1px solid ${s.color}30`,
        whiteSpace: "nowrap",
      }}
    >
      {s.label}
    </span>
  );
}

function StaffModal({
  unit,
  col,
  onClose,
}: {
  unit: UnitWithMembers;
  col: (typeof UNIT_COLORS)[number];
  onClose: () => void;
}) {
  const colorIdx = 0;

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "740px",
          maxHeight: "85vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 32px 80px rgba(0,0,0,0.35)",
          animation: "slideUp 0.3s cubic-bezier(.16,1,.3,1)",
        }}
      >
        {/* Header modal */}
        <div
          style={{
            background: col.gradient,
            padding: "24px 28px",
            position: "relative",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          {/* Dekorasi */}
          <div
            style={{
              position: "absolute",
              top: "-40px",
              right: "-40px",
              width: "160px",
              height: "160px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-20px",
              left: "40%",
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.05)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 800,
                  letterSpacing: "2px",
                  color: "rgba(255,255,255,0.6)",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Unit Kerja
              </div>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: 800,
                  color: "#fff",
                  lineHeight: 1.25,
                  margin: 0,
                }}
              >
                {unit.name}
              </h2>
              {unit.shortName && (
                <div
                  style={{
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.6)",
                    marginTop: "4px",
                  }}
                >
                  {unit.shortName}
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              gap: "20px",
              marginTop: "16px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                background: "rgba(255,255,255,0.12)",
                padding: "6px 14px",
                borderRadius: "20px",
              }}
            >
              <Users size={13} color="rgba(255,255,255,0.8)" />
              <span
                style={{ fontSize: "12px", color: "#fff", fontWeight: 600 }}
              >
                {unit.staffCount} Pegawai
              </span>
            </div>
            {unit.kepala && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  background: "rgba(255,255,255,0.12)",
                  padding: "6px 14px",
                  borderRadius: "20px",
                }}
              >
                <User size={13} color="rgba(255,255,255,0.8)" />
                <span
                  style={{ fontSize: "12px", color: "#fff", fontWeight: 600 }}
                >
                  {unit.kepala.name}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Body — daftar pegawai */}
        <div style={{ overflowY: "auto", flex: 1, padding: "20px 28px" }}>
          {unit.members.length === 0 ? (
            <div
              style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}
            >
              <Users
                size={40}
                strokeWidth={1}
                style={{ margin: "0 auto 12px", opacity: 0.4 }}
              />
              <p style={{ fontSize: "14px" }}>Belum ada data pegawai</p>
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {unit.members.map((s, i) => (
                <div
                  key={s.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "12px 16px",
                    background: "#f8fafc",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    transition: "all 0.15s",
                  }}
                >
                  {/* Nomor */}
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: col.light,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontSize: "11px",
                      fontWeight: 700,
                      color: col.accent,
                    }}
                  >
                    {i + 1}
                  </div>

                  {/* Foto */}
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: `2px solid ${col.border}`,
                      background: col?.light,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {s.photo ? (
                      <img
                        src={s.photo}
                        alt={s.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "top",
                        }}
                      />
                    ) : (
                      <User size={18} color={col.accent} strokeWidth={1.5} />
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "13.5px",
                        fontWeight: 700,
                        color: "#0f172a",
                        lineHeight: 1.25,
                        marginBottom: "3px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {s.name}
                    </div>
                    <div
                      style={{
                        fontSize: "11.5px",
                        color: "#64748b",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {s.position}
                    </div>
                  </div>

                  {/* Badge type */}
                  <StaffBadge type={s.type} />

                  {/* NIP */}
                  {s.nip && (
                    <div
                      style={{
                        fontSize: "10px",
                        color: "#94a3b8",
                        fontFamily: "monospace",
                        display: "none", // hidden di mobile
                      }}
                    >
                      {s.nip}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}

export function BidangSection({ units }: Props) {
  const [selected, setSelected] = useState<{
    unit: UnitWithMembers;
    col: (typeof UNIT_COLORS)[number];
  } | null>(null);

  return (
    <>
      {/* Grid cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {units.map((unit, idx) => {
          // const col = UNIT_COLORS[idx % UNIT_COLORS.length];
          const col = UNIT_COLORS[1];
          const unitData = { ...unit, col };

          return (
            <div
              key={unit.id}
              onClick={() => setSelected({ unit: { ...unit }, col })}
              style={{
                background: "#fff",
                borderRadius: "18px",
                border: `1.5px solid ${col.border}`,
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(.16,1,.3,1)",
                boxShadow: `0 4px 20px rgba(0,0,0,0.06)`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform =
                  "translateY(-4px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  `0 16px 40px rgba(0,0,0,0.12), 0 0 0 3px ${col.light}`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform =
                  "translateY(0)";
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  "0 4px 20px rgba(0,0,0,0.06)";
              }}
            >
              {/* Header card */}
              <div
                style={{
                  background: col.gradient,
                  padding: "20px 20px 16px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Dekorasi */}
                <div
                  style={{
                    position: "absolute",
                    top: "-20px",
                    right: "-20px",
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.1)",
                    pointerEvents: "none",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "-30px",
                    left: "20px",
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.06)",
                    pointerEvents: "none",
                  }}
                />

                {/* Icon building */}
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "12px",
                  }}
                >
                  <Building2 size={20} color="#fff" />
                </div>

                {/* Nama unit */}
                <h3
                  style={{
                    fontSize: "14px",
                    fontWeight: 800,
                    color: "#fff",
                    lineHeight: 1.3,
                    margin: 0,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {unit.name}
                </h3>
                {unit.shortName && (
                  <div
                    style={{
                      fontSize: "11px",
                      color: "rgba(255,255,255,0.65)",
                      marginTop: "4px",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    {unit.shortName}
                  </div>
                )}
              </div>

              {/* Body card */}
              <div style={{ padding: "16px 20px" }}>
                {/* Kepala */}
                {unit.kepala ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "14px",
                    }}
                  >
                    <div
                      style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: `2px solid ${col.border}`,
                        background: col.light,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {unit.kepala.photo ? (
                        <img
                          src={unit.kepala.photo}
                          alt={unit.kepala.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "top",
                          }}
                        />
                      ) : (
                        <User size={16} color={col.accent} />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "10px",
                          color: "#94a3b8",
                          fontWeight: 600,
                          marginBottom: "2px",
                          textTransform: "uppercase" as const,
                          letterSpacing: "0.4px",
                        }}
                      >
                        Kepala
                      </div>
                      <div
                        style={{
                          fontSize: "12.5px",
                          fontWeight: 700,
                          color: "#0f172a",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {unit.kepala.name}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "14px",
                      padding: "8px 12px",
                      background: "#f8fafc",
                      borderRadius: "8px",
                    }}
                  >
                    <User size={14} color="#94a3b8" />
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#94a3b8",
                        fontStyle: "italic",
                      }}
                    >
                      Kepala belum diisi
                    </span>
                  </div>
                )}

                {/* Divider */}
                <div
                  style={{
                    height: "1px",
                    background: "#f1f5f9",
                    marginBottom: "12px",
                  }}
                />

                {/* Footer */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      background: col.light,
                      padding: "5px 12px",
                      borderRadius: "20px",
                    }}
                  >
                    <Users size={12} color={col.accent} />
                    <span
                      style={{
                        fontSize: "11.5px",
                        fontWeight: 700,
                        color: col.accent,
                      }}
                    >
                      {unit.staffCount} pegawai
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "11.5px",
                      fontWeight: 700,
                      color: col.accent,
                    }}
                  >
                    Lihat detail
                    <ChevronRight size={14} color={col.accent} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selected && (
        <StaffModal
          unit={selected.unit}
          col={selected.col}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
