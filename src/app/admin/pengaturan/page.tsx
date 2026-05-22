// src/app/admin/pengaturan/page.tsx
import type { Metadata } from "next";
import { getSettingsByGroup, getSetting } from "@/lib/queries/settings";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { MaintenanceToggle } from "@/components/admin/MaintenanceToggle";
import { MaintenanceMessageForm } from "@/components/admin/MaintenanceMessageForm";
import { DisabledRoutesForm } from "@/components/admin/DisabledRoutesForm";
import { Shield, AlertTriangle } from "lucide-react";

export const metadata: Metadata = { title: "Pengaturan Situs" };

const GROUP_CONFIG: Record<
  string,
  { label: string; icon: string; desc: string }
> = {
  identitas: {
    label: "Identitas Situs",
    icon: "🏛️",
    desc: "Nama, tagline, logo, dan deskripsi situs",
  },
  kontak: {
    label: "Informasi Kontak",
    icon: "📞",
    desc: "Alamat, telepon, email, dan WhatsApp",
  },
  lokasi: {
    label: "Lokasi & Maps",
    icon: "📍",
    desc: "Koordinat dan konfigurasi peta interaktif",
  },
  jam_operasional: {
    label: "Jam Operasional",
    icon: "🕐",
    desc: "Jam layanan dan hari buka",
  },
  sosial_media: {
    label: "Media Sosial",
    icon: "📱",
    desc: "Link akun media sosial",
  },
  footer: {
    label: "Footer",
    icon: "📋",
    desc: "Teks copyright dan deskripsi footer",
  },
  system: {
    label: "Sistem",
    icon: "⚙️",
    desc: "Konfigurasi sistem dan maintenance",
  },
};

export default async function PengaturanPage() {
  const [grouped, maintenanceMode, maintenanceMessage, maintenanceEnd] =
    await Promise.all([
      getSettingsByGroup(),
      getSetting("maintenance_mode"),
      getSetting("maintenance_message"),
      getSetting("maintenance_end"),
    ]);

  const isMaintenanceOn = maintenanceMode === "true";

  // Pisahkan group system dari grouped biasa
  const { system: systemItems, ...otherGroups } = grouped;

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Pengaturan Situs</h1>
          <p className="admin-page-sub">
            Konfigurasi umum portal BPSDM Kalimantan Timur
          </p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* ── Maintenance Card — selalu tampil di atas ── */}
        <div
          className="admin-card"
          style={{
            border: isMaintenanceOn
              ? "1px solid #fecaca"
              : "1px solid var(--color-ink-6)",
          }}
        >
          <div
            className="admin-card-head"
            style={{
              background: isMaintenanceOn ? "#fef2f2" : undefined,
            }}
          >
            <div
              className="admin-card-title"
              style={{
                color: isMaintenanceOn ? "#dc2626" : undefined,
              }}
            >
              <AlertTriangle
                size={15}
                style={{
                  color: isMaintenanceOn ? "#dc2626" : "var(--color-ink-4)",
                }}
              />
              Mode Maintenance
            </div>
            <span style={{ fontSize: "12px", color: "var(--color-ink-4)" }}>
              Tutup situs dari pengunjung publik sementara
            </span>
          </div>

          <div className="admin-card-body">
            {/* Status banner jika aktif */}
            {isMaintenanceOn && (
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: "10px",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "20px",
                }}
              >
                <AlertTriangle
                  size={18}
                  style={{ color: "#dc2626", flexShrink: 0 }}
                />
                <div>
                  <div
                    style={{
                      fontSize: "13.5px",
                      fontWeight: 700,
                      color: "#dc2626",
                    }}
                  >
                    Maintenance sedang AKTIF
                  </div>
                  <div
                    style={{
                      fontSize: "12.5px",
                      color: "#dc2626",
                      opacity: 0.7,
                      marginTop: "2px",
                    }}
                  >
                    Pengunjung publik tidak dapat mengakses situs saat ini.
                  </div>
                </div>
              </div>
            )}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingBottom: "20px",
                borderBottom: "1px solid var(--color-ink-7)",
                marginBottom: "20px",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "var(--color-ink)",
                  }}
                >
                  Aktifkan Mode Maintenance
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "var(--color-ink-4)",
                    marginTop: "3px",
                  }}
                >
                  Admin yang sudah login tetap bisa mengakses semua halaman.
                </div>
              </div>
              <MaintenanceToggle currentValue={maintenanceMode ?? "false"} />
            </div>

            {/* Pesan maintenance */}
            <div className="admin-form" style={{ gap: "14px" }}>
              <div className="admin-form-group">
                <label className="admin-label" htmlFor="maintenance_message">
                  Pesan untuk Pengunjung
                </label>
                <MaintenanceMessageForm
                  messageValue={maintenanceMessage ?? ""}
                  endValue={maintenanceEnd ?? ""}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Disabled Routes Card ── */}
        <DisabledRoutesForm
          currentValue={(await getSetting("disabled_routes")) ?? ""}
        />

        {/* ── Group settings lainnya ── */}
        {Object.entries(otherGroups).map(([group, items]) => {
          const cfg = GROUP_CONFIG[group] ?? {
            label: group,
            icon: "⚙️",
            desc: "",
          };

          return (
            <div key={group} className="admin-card">
              <div className="admin-card-head">
                <div className="admin-card-title">
                  <span style={{ marginRight: "6px" }}>{cfg.icon}</span>
                  {cfg.label}
                </div>
                {cfg.desc && (
                  <span
                    style={{ fontSize: "12px", color: "var(--color-ink-4)" }}
                  >
                    {cfg.desc}
                  </span>
                )}
              </div>
              <div className="admin-card-body">
                <SettingsForm items={items} group={group} />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
