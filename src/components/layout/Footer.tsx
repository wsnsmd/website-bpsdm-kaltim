// src/components/layout/Footer.tsx
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Code2,
  ChevronRight,
} from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTwitter,
  FaTiktok,
} from "react-icons/fa";
import { getPublicSettings } from "@/lib/queries/settings";

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
  { key: "social_twitter", Icon: FaTwitter, label: "Twitter/X", color: "#fff" },
  {
    key: "social_youtube",
    Icon: FaYoutube,
    label: "YouTube",
    color: "#ff4444",
  },
  { key: "social_tiktok", Icon: FaTiktok, label: "TikTok", color: "#fff" },
];

export async function Footer() {
  const s = await getPublicSettings();
  const year = new Date().getFullYear();

  const activeSocials = SOCIAL_CONFIG.filter((soc) => s[soc.key]);

  const contactItems = [
    {
      Icon: MapPin,
      text: s.contact_address,
      href: null,
    },
    {
      Icon: Phone,
      text: s.contact_phone,
      href: s.contact_phone
        ? `tel:${s.contact_phone.replace(/[^0-9+]/g, "")}`
        : null,
    },
    {
      Icon: Mail,
      text: s.contact_email,
      href: s.contact_email ? `mailto:${s.contact_email}` : null,
    },
  ].filter((c) => c.text);

  return (
    <footer className="footer-root">
      <div className="container-content" style={{ paddingBlock: "3.5rem" }}>
        <div className="footer-grid">
          {/* ── Brand ── */}
          <div>
            {/* Logo */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              <div className="footer-logo-mark">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.5"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <div className="footer-logo-name">
                BPSDM
                <br />
                Kalimantan Timur
              </div>
            </div>

            {/* Deskripsi dari settings */}
            <p className="footer-desc">
              {s.footer_description ||
                "Badan Pengembangan Sumber Daya Manusia Provinsi Kalimantan Timur berkomitmen mewujudkan aparatur sipil negara yang kompeten, profesional, dan berintegritas."}
            </p>

            {/* Sosmed */}
            {activeSocials.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  marginTop: "16px",
                  flexWrap: "wrap",
                }}
              >
                {activeSocials.map((soc) => (
                  <Link
                    key={soc.key}
                    href={s[soc.key]}
                    aria-label={soc.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-btn"
                    title={soc.label}
                    style={{ color: soc.color }}
                  >
                    <soc.Icon size={16} />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* ── Nav columns ── */}
          {FOOTER_NAV.map((col) => (
            <div key={col.title}>
              <h4 className="footer-col-title">{col.title}</h4>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="footer-nav-link"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <ChevronRight
                        size={12}
                        style={{ opacity: 0.4, flexShrink: 0 }}
                      />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* ── Kontak ── */}
          <div>
            <h4 className="footer-col-title">Kontak</h4>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              {contactItems.map((item, i) => (
                <div key={i} className="footer-contact-item">
                  <item.Icon
                    size={15}
                    className="footer-contact-icon"
                    style={{ flexShrink: 0, marginTop: "2px" }}
                  />
                  <div>
                    {item.href ? (
                      <Link
                        href={item.href}
                        style={{
                          color: "rgba(255,255,255,0.65)",
                          textDecoration: "none",
                          fontSize: "13px",
                          lineHeight: 1.5,
                        }}
                      >
                        {item.text}
                      </Link>
                    ) : (
                      <span
                        style={{
                          color: "rgba(255,255,255,0.65)",
                          fontSize: "13px",
                          lineHeight: 1.5,
                        }}
                      >
                        {item.text}
                      </span>
                    )}
                    {(item as any).sub && (
                      <div
                        style={{
                          fontSize: "12px",
                          color: "rgba(255,255,255,0.35)",
                          marginTop: "2px",
                        }}
                      >
                        {(item as any).sub}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="footer-bottom">
        <div
          className="container-content"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBlock: "18px",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <span className="footer-copy">
            {`© ${year} - ` +
              (s.footer_copyright ||
                `© - ${year} BPSDM Provinsi Kalimantan Timur. Hak cipta dilindungi.`)}
          </span>
          <span
            className="footer-tech"
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <Code2 size={13} style={{ opacity: 0.5 }} />
            Dikembangkan oleh Tim IT BPSDM Kaltim
          </span>
        </div>
      </div>
    </footer>
  );
}
