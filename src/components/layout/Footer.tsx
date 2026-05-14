// src/components/layout/Footer.tsx
import Link from "next/link";

const FOOTER_NAV = [
  {
    title: "Navigasi",
    links: [
      { href: "/", label: "Beranda" },
      { href: "/profil", label: "Profil BPSDM" },
      { href: "/program", label: "Program Diklat" },
      { href: "/berita", label: "Berita & Artikel" },
      { href: "/galeri", label: "Galeri & Video" },
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
    ],
  },
];

const SOCIAL_LINKS = [
  {
    href: "https://facebook.com/bpsdmkaltim",
    label: "Facebook",
    path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
  },
  {
    href: "https://instagram.com/bpsdmkaltim",
    label: "Instagram",
    path: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M7.5 2h9a5.5 5.5 0 0 1 5.5 5.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2z",
  },
  {
    href: "https://youtube.com/@bpsdmkaltim",
    label: "YouTube",
    path: "M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z M9.75 15.02l5.75-3.02-5.75-3.02v6.04z",
  },
];

const CONTACT_ITEMS = [
  {
    text: "Jl. H.A.M.M. Rifaddin No. 88, Kota Samarinda, Kalimantan Timur 75243",
    icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  },
  {
    text: "(0541) 7270201",
    icon: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.06 6.06l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z",
  },
  {
    text: "bpsdm@kaltimprov.go.id",
    icon: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer-root">
      <div className="container-content py-14">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
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

            <p className="footer-desc">
              Badan Pengembangan Sumber Daya Manusia Provinsi Kalimantan Timur
              berkomitmen mewujudkan aparatur sipil negara yang kompeten,
              profesional, dan berintegritas demi pelayanan publik terbaik.
            </p>

            <div className="flex gap-2">
              {SOCIAL_LINKS.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn"
                >
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d={s.path} />
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {FOOTER_NAV.map((col) => (
            <div key={col.title}>
              <h4 className="footer-col-title">{col.title}</h4>
              <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="footer-nav-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Kontak */}
          <div>
            <h4 className="footer-col-title">Kontak</h4>
            <div className="flex flex-col gap-3">
              {CONTACT_ITEMS.map((item, i) => (
                <div key={i} className="footer-contact-item">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="footer-contact-icon"
                  >
                    <path d={item.icon} />
                  </svg>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="container-content flex items-center justify-between py-5">
          <span className="footer-copy">
            © {year} BPSDM Provinsi Kalimantan Timur. Hak cipta dilindungi.
          </span>
          <span className="footer-tech">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="footer-tech-icon"
            >
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
            Next.js 16 · TypeScript · Drizzle ORM · MariaDB 10.6
          </span>
        </div>
      </div>
    </footer>
  );
}
