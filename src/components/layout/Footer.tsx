// src/components/layout/Footer.tsx
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, ChevronRight, Code2, Users } from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTwitter,
  FaTiktok,
} from "react-icons/fa";
import { getPublicSettings } from "@/lib/queries/settings";
import { getVisitorSummary } from "@/lib/queries/visitors";

const FOOTER_NAV = [
  {
    title: "Navigasi",
    links: [
      { href: "/", label: "Beranda" },
      { href: "/profil", label: "Profil BPSDM" },
      { href: "/program", label: "Program Diklat" },
      { href: "/berita", label: "Berita & Artikel" },
      { href: "/kontak", label: "Kontak" },
    ],
  },
  {
    title: "Layanan",
    links: [
      { href: "/ppid", label: "PPID" },
      { href: "/pengaduan", label: "Pengaduan Publik" },
      { href: "/unduhan", label: "Unduhan Dokumen" },
      { href: "/survei", label: "Survei Kepuasan" },
      { href: "/maklumat-pelayanan", label: "Maklumat Pelayanan" },
      { href: "/program/jadwal", label: "Jadwal Pelatihan" },
    ],
  },
];

const SOCIAL_CONFIG = [
  {
    key: "social_facebook",
    Icon: FaFacebook,
    label: "Facebook",
    color: "#1877f2",
  },
  {
    key: "social_instagram",
    Icon: FaInstagram,
    label: "Instagram",
    color: "#e1306c",
  },
  {
    key: "social_twitter",
    Icon: FaTwitter,
    label: "Twitter/X",
    color: "#1da1f2",
  },
  {
    key: "social_youtube",
    Icon: FaYoutube,
    label: "YouTube",
    color: "#ff0000",
  },
  { key: "social_tiktok", Icon: FaTiktok, label: "TikTok", color: "#010101" },
];

export async function Footer() {
  const [s, stats] = await Promise.all([
    getPublicSettings(),
    getVisitorSummary().catch(() => ({
      today: 0,
      yesterday: 0,
      thisMonth: 0,
      total: 0,
      onlineNow: 0,
    })),
  ]);

  const year = new Date().getFullYear();
  const activeSocials = SOCIAL_CONFIG.filter((soc) => s[soc.key]);

  const contactItems = [
    { Icon: MapPin, text: s.contact_address, href: null },
    {
      Icon: Phone,
      text: s.contact_phone,
      href: s.contact_phone
        ? `tel:${s.contact_phone.replace(/[^0-9+]/g, "")}`
        : null,
      sub: s.contact_fax ? `Fax: ${s.contact_fax}` : null,
    },
    {
      Icon: Mail,
      text: s.contact_email,
      href: s.contact_email ? `mailto:${s.contact_email}` : null,
    },
  ].filter((c) => c.text);

  const statItems = [
    { label: "Hari Ini", value: stats.today.toLocaleString("id-ID") },
    { label: "Kemarin", value: stats.yesterday.toLocaleString("id-ID") },
    { label: "Bulan Ini", value: stats.thisMonth.toLocaleString("id-ID") },
    { label: "Total Kunjungan", value: stats.total.toLocaleString("id-ID") },
  ];

  return (
    <footer className="footer-root">
      {/* Glow Ambient Layer & Pola Dot Matrix senada dengan Page Hero */}
      <div className="footer-glow-overlay" />
      <div className="footer-dot-texture" />

      {/* ── BAGIAN ATAS: 4 Kolom Utama (Kini Seimbang Tingginya) ── */}
      <div className="container-content footer-container-top">
        <div className="footer-grid-layout">
          {/* Kolom 1: Identitas */}
          <div className="footer-brand-col">
            {/* ── LOGO PEMPROV DI SINI ── */}
            <div className="footer-logo-wrapper flex items-center gap-1.5 mb-4">
              <div className="relative w-10 h-11 shrink-0 flex items-center justify-center">
                <Image
                  src="/pemprov.png"
                  alt="Logo Pemprov Kaltim"
                  width={40}
                  height={44}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="footer-brand-title">
                  BPSDM Kalimantan Timur
                </span>
                <span className="footer-brand-subtitle">
                  Badan Pengembangan Sumber Daya Manusia
                </span>
              </div>
            </div>

            <p className="footer-text-desc">
              {s.footer_description ||
                "Badan Pengembangan Sumber Daya Manusia Provinsi Kalimantan Timur berkomitmen mewujudkan aparatur sipil negara yang kompeten, profesional, dan berintegritas."}
            </p>
            {activeSocials.length > 0 && (
              <div className="footer-social-wrapper">
                {activeSocials.map((soc) => (
                  <Link
                    key={soc.key}
                    href={s[soc.key]}
                    aria-label={soc.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-icon-btn"
                    title={soc.label}
                    style={
                      { "--hover-color": soc.color } as React.CSSProperties
                    }
                  >
                    <soc.Icon size={16} />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Kolom 2 & 3: Navigasi Links */}
          {FOOTER_NAV.map((col) => (
            <div key={col.title} className="footer-links-col">
              <h4 className="footer-section-title">{col.title}</h4>
              <ul className="footer-links-list">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="footer-anchor-link">
                      <ChevronRight size={14} className="footer-chevron-icon" />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Kolom 4: Hubungi Kami Bersih Tanpa Box Stat */}
          <div className="footer-contact-col">
            <h4 className="footer-section-title">Hubungi Kami</h4>
            <div className="footer-contact-list">
              {contactItems.map((item, i) => (
                <div key={i} className="footer-info-card">
                  <item.Icon size={15} className="footer-info-icon" />
                  <div className="footer-info-text-box">
                    {item.href ? (
                      <Link href={item.href} className="footer-info-link">
                        {item.text}
                      </Link>
                    ) : (
                      <span>{item.text}</span>
                    )}
                    {item.sub && (
                      <span className="footer-info-subtext">{item.sub}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── BAGIAN TENGAH: Baris Statistik Horizontal Penuh (Menjamin Simetris) ── */}
      <div className="footer-stats-horizontal-row">
        <div className="container-content footer-stats-horizontal-container">
          <div className="footer-stats-row-label-box">
            <Users size={16} className="text-green-400" />
            <span className="footer-stats-row-title">
              Statistik Kunjungan Situs
            </span>
            <div className="footer-stats-live-badge-box">
              <div className="footer-pulse-dot" />
              <div className="footer-pulse-glow" />
              <span className="footer-live-count-text">
                {stats.onlineNow} Aktif
              </span>
            </div>
          </div>

          <div className="footer-stats-horizontal-grid">
            {statItems.map((item) => (
              <div key={item.label} className="footer-stat-horizontal-pill">
                <span className="footer-horizontal-pill-label">
                  {item.label}
                </span>
                <span className="footer-horizontal-pill-val">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BAGIAN BAWAH: Bottom Copyright Bar ── */}
      <div className="footer-bottom-bar">
        <div className="container-content footer-bottom-container">
          <p className="footer-copyright-text">
            © {year} ·{" "}
            {s.footer_copyright ||
              "BPSDM Provinsi Kalimantan Timur. Hak cipta dilindungi."}
          </p>
        </div>
      </div>
    </footer>
  );
}
