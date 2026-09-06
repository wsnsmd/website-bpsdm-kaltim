// src/components/ppid/PpidPejabatSection.tsx
import { getPpidPejabat } from "@/lib/queries/ppid";
import { Mail, Phone, User } from "lucide-react";

const TIPE_LABEL: Record<string, { label: string; color: string; bg: string }> =
  {
    atasan: { label: "Atasan PPID", color: "#7e22ce", bg: "#fdf4ff" },
    utama: { label: "PPID Utama", color: "#1d4ed8", bg: "#eff6ff" },
    pembantu: { label: "PPID Pelaksana", color: "#16a34a", bg: "#f0fdf4" },
  };

export async function PpidPejabatSection() {
  const pejabat = await getPpidPejabat().catch(() => []);

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "14px",
        border: "1px solid var(--color-ink-6)",
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          padding: "16px 22px",
          borderBottom: "1px solid var(--color-ink-7)",
          fontSize: "16px",
          fontWeight: 700,
          color: "var(--color-ink)",
        }}
      >
        Petugas Layanan Informasi
      </div>

      {/* Saluran & jam pelayanan */}
      <div
        style={{
          padding: "16px 22px",
          background: "var(--color-forest-50)",
          borderBottom: "1px solid var(--color-ink-7)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              color: "var(--color-forest-700)",
              marginBottom: "4px",
            }}
          >
            Hari & Jam Pelayanan
          </div>
          <div style={{ fontSize: "13.5px", color: "var(--color-ink-2)" }}>
            Senin – Kamis: 07.30 – 16.00 WITA
            <br />
            Jumat: 07.30 – 11.00 WITA
          </div>
        </div>
        <div>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              color: "var(--color-forest-700)",
              marginBottom: "4px",
            }}
          >
            Saluran Layanan
          </div>
          <div style={{ fontSize: "13.5px", color: "var(--color-ink-2)" }}>
            Datang langsung, telepon, email, atau formulir online di halaman
            ini.
          </div>
        </div>
      </div>

      {/* Daftar petugas */}
      <div style={{ padding: "20px 22px" }}>
        {pejabat.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "24px",
              color: "var(--color-ink-4)",
              fontSize: "13px",
            }}
          >
            Data petugas layanan belum tersedia.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "14px",
            }}
          >
            {pejabat.map((p) => {
              const cfg = TIPE_LABEL[p.tipe] ?? TIPE_LABEL.pembantu;
              return (
                <div
                  key={p.id}
                  style={{
                    padding: "16px",
                    borderRadius: "12px",
                    border: "1px solid var(--color-ink-6)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "50%",
                        background: cfg.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <User size={18} style={{ color: cfg.color }} />
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "13.5px",
                          fontWeight: 700,
                          color: "var(--color-ink)",
                        }}
                      >
                        {p.nama}
                      </div>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          color: cfg.color,
                        }}
                      >
                        {cfg.label}
                      </span>
                    </div>
                  </div>
                  <div
                    style={{ fontSize: "12.5px", color: "var(--color-ink-3)" }}
                  >
                    {p.jabatan}
                  </div>
                  {(p.email || p.noHp) && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "3px",
                        marginTop: "4px",
                        paddingTop: "8px",
                        borderTop: "1px solid var(--color-ink-7)",
                      }}
                    >
                      {p.email && (
                        <a
                          href={`mailto:${p.email}`}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "12px",
                            color: "var(--color-ink-3)",
                            textDecoration: "none",
                          }}
                        >
                          <Mail size={12} /> {p.email}
                        </a>
                      )}
                      {p.noHp && (
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "12px",
                            color: "var(--color-ink-3)",
                          }}
                        >
                          <Phone size={12} /> {p.noHp}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
