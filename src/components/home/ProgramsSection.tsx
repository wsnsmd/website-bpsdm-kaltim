// src/components/home/ProgramsSection.tsx
import Link from "next/link";

const PROGRAMS = [
  {
    num: "01",
    icon: "M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18",
    name: "Pelatihan Kompetensi Teknis",
    desc: "Pendidikan dan pelatihan untuk mencapai persyaratan kompetensi teknis sesuai jabatan berdasarkan Perka LAN Nomor 25 Tahun 2015.",
    href: "/program/teknis",
  },
  {
    num: "02",
    icon: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
    name: "Pelatihan Kompetensi Fungsional",
    desc: "Pelatihan untuk mencapai persyaratan kompetensi jabatan fungsional sesuai ketentuan peraturan perundang-undangan yang berlaku.",
    href: "/program/fungsional",
  },
  {
    num: "03",
    icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    name: "Pelatihan Kompetensi Manajerial",
    desc: "Membangun wawasan, pengetahuan, dan bekal bagi ASN dalam mengemban tugas kepemimpinan struktural pemerintahan daerah.",
    href: "/program/manajerial",
  },
  {
    num: "04",
    icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
    name: "Kompetensi Pola APBD",
    desc: "Program diklat untuk meningkatkan kompetensi aparatur pemerintah kabupaten/kota di seluruh Kalimantan Timur.",
    href: "/program/pola-apbd",
  },
  {
    num: "05",
    icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    name: "Kompetensi Pola Kontribusi",
    desc: "Pelatihan untuk mencapai persyaratan kompetensi jabatan fungsional melalui mekanisme kontribusi antar instansi pemerintah.",
    href: "/program/pola-kontribusi",
  },
  {
    num: "06",
    icon: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z",
    name: "Kompetensi Pola Kemitraan",
    desc: "Kerjasama strategis antar instansi dalam pengembangan kompetensi ASN secara terintegrasi dan berkelanjutan.",
    href: "/program/pola-kemitraan",
  },
];

export function ProgramsSection() {
  return (
    <section className="section-pad bg-white">
      <div className="container-content">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="sec-label">Program Unggulan</p>
            <h2 className="sec-title">Pelatihan Kompetensi BPSDM</h2>
          </div>
          <Link href="/program" className="qs-all-link">
            Semua program
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
        <div className="prog-grid">
          {PROGRAMS.map((item) => (
            <Link key={item.href} href={item.href} className="prog-card">
              <div className="prog-card-top">
                <div className="prog-card-num">{item.num}</div>
                <div className="prog-card-icon">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={item.icon} />
                  </svg>
                </div>
              </div>
              <div className="prog-card-name">{item.name}</div>
              <div className="prog-card-desc">{item.desc}</div>
              <div className="prog-card-arrow">
                Lihat detail
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
