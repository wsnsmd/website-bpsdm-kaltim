// src/components/home/QuickServices.tsx
import Link from "next/link";

const SERVICES = [
  {
    href: "/program/daftar",
    label: "Daftar Diklat",
    icon: "M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5",
    color: "var(--color-forest-100)",
    iconColor: "var(--color-forest-700)",
  },
  {
    href: "/program/jadwal",
    label: "Jadwal Pelatihan",
    icon: "M3 4h18v18H3z M16 2v4 M8 2v4 M3 10h18",
    color: "#eff6ff",
    iconColor: "#1d4ed8",
  },
  {
    href: "/ppid",
    label: "PPID",
    icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    color: "var(--color-gold-100)",
    iconColor: "var(--color-gold-700)",
  },
  {
    href: "/survei",
    label: "Survei Layanan",
    icon: "M18 20V10 M12 20V4 M6 20v-6",
    color: "#fdf4ff",
    iconColor: "#7e22ce",
  },
  {
    href: "/unduhan",
    label: "Unduhan",
    icon: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3",
    color: "#fff7ed",
    iconColor: "#c2410c",
  },
  {
    href: "/pengaduan",
    label: "Pengaduan",
    icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
    color: "#fef2f2",
    iconColor: "#b91c1c",
  },
];

export function QuickServices() {
  return (
    <section className="section-pad bg-white">
      <div className="container-content">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="sec-label">Akses Cepat</p>
            <h2 className="sec-title">Layanan Utama</h2>
          </div>
          <Link href="/layanan" className="qs-all-link">
            Semua layanan
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>

        {/* Grid */}
        <div className="qs-grid">
          {SERVICES.map((item) => (
            <Link key={item.href} href={item.href} className="qs-card">
              <div
                className="qs-card-icon"
                style={{ backgroundColor: item.color }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={item.iconColor}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={item.icon} />
                </svg>
              </div>
              <span className="qs-card-label">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
