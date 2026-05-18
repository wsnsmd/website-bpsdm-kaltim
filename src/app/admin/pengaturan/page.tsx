// src/app/admin/pengaturan/page.tsx
import type { Metadata } from "next";
import { getSettingsByGroup } from "@/lib/queries/settings";
import { SettingsForm } from "@/components/admin/SettingsForm";

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
};

export default async function PengaturanPage() {
  const grouped = await getSettingsByGroup();

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
        {Object.entries(grouped).map(([group, items]) => {
          const cfg = GROUP_CONFIG[group] ?? {
            label: group,
            icon: "⚙️",
            desc: "",
          };

          return (
            <div key={group} className="admin-card">
              {/* Group header */}
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
