// src/components/ppid/PpidPejabatSection.tsx
// Data petugas ditulis langsung di file ini (tanpa database).
// Sumber: Keputusan Kepala BPSDM Kaltim Nomor 400.14.3/003/SK/BPSDM-I/2026 (2 Januari 2026).
import { Mail, MapPin, MessageCircle, Phone, User } from "lucide-react";

/* ------------------------------------------------------------------ */
/* 1. KONTAK LAYANAN                                                  */
/*    Ganti sesuai data resmi. Kosongkan ("") untuk menyembunyikan.   */
/* ------------------------------------------------------------------ */
const KONTAK_LAYANAN = {
  email: "bpsdm@kaltimprov.go.id", // ganti ke email khusus PPID jika sudah ada
  telepon: "0541-7270201", // sesuai kop SK
  whatsapp: "085190987271",
  alamat: "Jl. H.A.M.M. Rifaddin No. 88, Samarinda, Kalimantan Timur 75132",
  loket: "", // contoh: "Ruang Pelayanan Informasi, Lantai 1"
};

/* ------------------------------------------------------------------ */
/* 2. DATA PETUGAS                                                    */
/*    nama   : isi nama pejabat. Jika "", kartu hanya menampilkan     */
/*             jabatan. WAJIB diisi sebelum diajukan ke verifikator.  */
/*    jabatan: jabatan di instansi (opsional, isi dari data           */
/*             kepegawaian; SK tidak memuat jabatan anggota).         */
/* ------------------------------------------------------------------ */
type Peran =
  | "penanggungjawab"
  | "ketua"
  | "sekretaris"
  | "koordinator"
  | "anggota";

type Petugas = {
  nama: string;
  peran: Peran;
  jabatan?: string;
};

type Kelompok = {
  judul: string;
  petugas: Petugas[];
};

const PERAN_LABEL: Record<Peran, { label: string; color: string; bg: string }> =
  {
    penanggungjawab: {
      label: "Penanggung Jawab",
      color: "#7e22ce",
      bg: "#fdf4ff",
    },
    ketua: { label: "Ketua", color: "#1d4ed8", bg: "#eff6ff" },
    sekretaris: { label: "Sekretaris", color: "#1d4ed8", bg: "#eff6ff" },
    koordinator: { label: "Koordinator", color: "#b45309", bg: "#fffbeb" },
    anggota: { label: "Anggota", color: "#16a34a", bg: "#f0fdf4" },
  };

const KELOMPOK: Kelompok[] = [
  {
    judul: "Pimpinan Tim PPID Pelaksana",
    petugas: [
      {
        nama: "",
        peran: "penanggungjawab",
        jabatan: "Kepala BPSDM Provinsi Kalimantan Timur",
      },
      {
        nama: "", // TODO: nama Sekretaris BPSDM
        peran: "ketua",
        jabatan: "Sekretaris",
      },
      {
        nama: "", // TODO: nama Kepala Sub Bagian Umum
        peran: "sekretaris",
        jabatan: "Kepala Sub Bagian Umum",
      },
    ],
  },
  {
    judul: "Bidang Pengolah Data dan Klasifikasi Informasi",
    petugas: [
      {
        nama: "", // TODO: nama Kabid
        peran: "koordinator",
        jabatan: "Kepala Bidang Sertifikasi Kompetensi dan Pengelolaan Kelembagaan",
      },
      { nama: "Dimas Radhitya Anggara, S.E", peran: "anggota" },
      { nama: "Titik Dwi Lestari, S.Pd", peran: "anggota" },
      { nama: "Desy Arum Sekarini, S.STP", peran: "anggota" },
      { nama: "Fandik Wijaya, S.STP.", peran: "anggota" },
      { nama: "Eva Indah Purnama", peran: "anggota" },
      { nama: "Fadil Hidayatulfajri, S.P.", peran: "anggota" },
    ],
  },
  {
    judul: "Bidang Pelayanan dan Dokumentasi Informasi",
    petugas: [
      {
        nama: "", // TODO: nama Kabid
        peran: "koordinator",
        jabatan: "Kepala Bidang Pengembangan Kompetensi Manajerial dan Fungsional",
      },
      { nama: "Endang Reny Wahyuti, S.Sos.", peran: "anggota" },
      { nama: "Tajuddin Noor, S.E.", peran: "anggota" },
      { nama: "Wawan Setiawan, S.Kom.", peran: "anggota" },
      { nama: "Urai Gani Sutriyadi, A.Md.", peran: "anggota" },
      { nama: "Miftahularif Hidayah, S.Kom", peran: "anggota" },
      { nama: "Muhammad Hidayat, ST", peran: "anggota" },
    ],
  },
  {
    judul: "Bidang Klarifikasi dan Penyelesaian Sengketa Informasi",
    petugas: [
      {
        nama: "", // TODO: nama Kabid
        peran: "koordinator",
        jabatan: "Kepala Bidang Pengembangan Kompetensi Teknis",
      },
      { nama: "Dr. Moh. Jauhar Efendi, M.Si", peran: "anggota" },
      { nama: "Indri Widayanti, SE", peran: "anggota" },
      { nama: "Rufansyah, S.Pd", peran: "anggota" },
      { nama: "Wahyudi Bayu S", peran: "anggota" },
      { nama: "Lisa Paramita, S.Sos", peran: "anggota" },
      { nama: "Siti Zulaeha, S.Sos", peran: "anggota" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* 3. KOMPONEN                                                        */
/* ------------------------------------------------------------------ */
const labelStyle: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  color: "var(--color-forest-700)",
  marginBottom: "4px",
};

const bodyStyle: React.CSSProperties = {
  fontSize: "13.5px",
  color: "var(--color-ink-2)",
  lineHeight: 1.6,
};

const contactRow: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: "8px",
  fontSize: "13.5px",
  color: "var(--color-ink-2)",
  textDecoration: "none",
};

function PetugasCard({ p }: { p: Petugas }) {
  const cfg = PERAN_LABEL[p.peran];
  // Jika nama belum diisi, tampilkan jabatan sebagai judul kartu.
  const judul = p.nama || p.jabatan || cfg.label;
  const subjudul = p.nama ? p.jabatan : undefined;

  return (
    <div
      style={{
        padding: "16px",
        borderRadius: "12px",
        border: "1px solid var(--color-ink-6)",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
            {judul}
          </div>
          <span style={{ fontSize: "11px", fontWeight: 700, color: cfg.color }}>
            {cfg.label}
          </span>
        </div>
      </div>
      {subjudul && (
        <div style={{ fontSize: "12.5px", color: "var(--color-ink-3)" }}>
          {subjudul}
        </div>
      )}
    </div>
  );
}

export function PpidPejabatSection() {
  const k = KONTAK_LAYANAN;

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

      {/* Jam pelayanan & kontak layanan */}
      <div
        style={{
          padding: "16px 22px",
          background: "var(--color-forest-50)",
          borderBottom: "1px solid var(--color-ink-7)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "20px",
        }}
      >
        <div>
          <div style={labelStyle}>Hari & Jam Pelayanan</div>
          <div style={bodyStyle}>
            Senin – Kamis: 07.30 – 16.00 WITA
            <br />
            Jumat: 07.30 – 11.00 WITA
          </div>
        </div>

        <div>
          <div style={labelStyle}>Kontak Layanan Informasi</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {k.email && (
              <a href={`mailto:${k.email}`} style={contactRow}>
                <Mail size={14} style={{ marginTop: "3px", flexShrink: 0 }} />
                {k.email}
              </a>
            )}
            {k.telepon && (
              <a
                href={`tel:${k.telepon.replace(/[^\d+]/g, "")}`}
                style={contactRow}
              >
                <Phone size={14} style={{ marginTop: "3px", flexShrink: 0 }} />
                {k.telepon}
              </a>
            )}
            {k.whatsapp && (
              <a
                href={`https://wa.me/62${k.whatsapp.replace(/^0/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                style={contactRow}
              >
                <MessageCircle
                  size={14}
                  style={{ marginTop: "3px", flexShrink: 0 }}
                />
                WhatsApp {k.whatsapp}
              </a>
            )}
          </div>
        </div>

        <div>
          <div style={labelStyle}>Lokasi Layanan</div>
          <div style={{ ...contactRow, color: "var(--color-ink-2)" }}>
            <MapPin size={14} style={{ marginTop: "3px", flexShrink: 0 }} />
            <span>
              {k.loket && (
                <>
                  {k.loket}
                  <br />
                </>
              )}
              {k.alamat}
            </span>
          </div>
        </div>
      </div>

      {/* Daftar petugas per kelompok */}
      <div
        style={{
          padding: "20px 22px",
          display: "flex",
          flexDirection: "column",
          gap: "28px",
        }}
      >
        <p style={{ ...bodyStyle, margin: 0, color: "var(--color-ink-3)" }}>
          Susunan Tim PPID Pelaksana BPSDM Provinsi Kalimantan Timur berdasarkan
          Keputusan Kepala BPSDM Nomor 400.14.3/003/SK/BPSDM-I/2026 tanggal 2
          Januari 2026. Permohonan informasi dilayani melalui kontak layanan di
          atas.
        </p>

        {KELOMPOK.map((g) => (
          <section key={g.judul}>
            <h3
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "var(--color-forest-700)",
                margin: "0 0 12px",
                paddingBottom: "8px",
                borderBottom: "1px solid var(--color-ink-7)",
              }}
            >
              {g.judul}
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: "14px",
              }}
            >
              {g.petugas.map((p, i) => (
                <PetugasCard key={`${g.judul}-${i}`} p={p} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
