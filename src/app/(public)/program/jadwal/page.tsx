// src/app/(public)/program/jadwal/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import {
  Info,
  Clock,
  CalendarDays,
  Phone,
  ExternalLink,
  CalendarX,
  Activity,
  CalendarCheck,
  LayoutList,
} from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { JadwalCard } from "@/components/program/JadwalCard";
import { JadwalFilter } from "@/components/program/JadwalFilter";
import { fetchJadwal, fetchJenisJadwal } from "@/lib/simpel/jadwal";
import type { StatusJadwal } from "@/lib/simpel/types";

export const metadata: Metadata = {
  title: "Jadwal",
  description:
    "Seluruh jadwal kegiatan pengembangan kompetensi BPSDM Provinsi Kalimantan Timur.",
};

export const revalidate = 3600;

type Props = {
  searchParams: Promise<{
    status?: string;
    jenis?: string;
  }>;
};

export default async function JadwalPage({ searchParams }: Props) {
  const params = await searchParams;
  const status = params.status as StatusJadwal | undefined;
  const jenis = params.jenis;

  const [jadwalList, jenisOptions] = await Promise.all([
    fetchJadwal({ status, jenis }),
    fetchJenisJadwal(),
  ]);

  const stats = {
    berlangsung: jadwalList.filter((j) => j.statusJadwal === "berlangsung")
      .length,
    mendatang: jadwalList.filter((j) => j.statusJadwal === "akan-datang")
      .length,
    selesai: jadwalList.filter((j) => j.statusJadwal === "selesai").length,
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Beranda", href: "/" },
          { label: "Program Diklat", href: "/program" },
          { label: "Jadwal Pelatihan" },
        ]}
      />

      {/* Hero */}
      <div className="page-hero" style={{ paddingBlock: "2.5rem 3rem" }}>
        <div className="container-content">
          <p className="page-hero-eyebrow">Data realtime dari SIMPEL Kaltim</p>
          <h1 className="page-hero-title" style={{ fontSize: "34px" }}>
            Pengembangan Kompetensi
          </h1>
          <p className="page-hero-desc">
            Seluruh jadwal kegiatan BPSDM Kaltim yang dikelola melalui Sistem
            Informasi Manajemen Pelatihan (SIMPel) Kalimantan Timur.
          </p>

          {/* Stats */}
          <div className="page-hero-stats">
            <div className="page-hero-stat">
              <div
                className="page-hero-stat-num"
                style={{ color: "var(--color-gold-400)" }}
              >
                {stats.berlangsung}
              </div>
              <div className="page-hero-stat-label">Sedang berlangsung</div>
            </div>
            <div className="page-hero-stat">
              <div className="page-hero-stat-num">{stats.mendatang}</div>
              <div className="page-hero-stat-label">Akan datang</div>
            </div>
            <div className="page-hero-stat">
              <div
                className="page-hero-stat-num"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                {stats.selesai}
              </div>
              <div className="page-hero-stat-label">Selesai</div>
            </div>
            <div className="page-hero-stat">
              <div className="page-hero-stat-num">{jadwalList.length}</div>
              <div className="page-hero-stat-label">Total kegiatan</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        style={{ backgroundColor: "var(--color-ink-8)", paddingBlock: "3rem" }}
      >
        <div className="container-content">
          <div className="jadwal-layout">
            {/* ── Main ── */}
            <div>
              <Suspense>
                <JadwalFilter jenisOptions={jenisOptions} />
              </Suspense>

              {/* Info */}
              <div className="filter-info">
                Menampilkan <strong>{jadwalList.length}</strong> jadwal
                {jenis && (
                  <>
                    {" "}
                    · Jenis: <strong>{jenis}</strong>
                  </>
                )}
                {status && (
                  <>
                    {" "}
                    · Status: <strong>{status}</strong>
                  </>
                )}
                <span
                  style={{
                    marginLeft: "8px",
                    fontSize: "11px",
                    color: "var(--color-ink-5)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "3px",
                  }}
                >
                  <Clock size={11} />
                  diperbarui setiap 1 jam
                </span>
              </div>
              {/* ── Tanpa filter status — tampilkan per group ── */}
              {!status && (
                <>
                  {/* Berlangsung */}
                  {stats.berlangsung > 0 && (
                    <div style={{ marginBottom: "28px" }}>
                      <div className="jadwal-month-header">
                        <div
                          className="jadwal-month-title"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            color: "var(--color-forest-700)",
                          }}
                        >
                          <Activity
                            size={18}
                            style={{ color: "var(--color-forest-600)" }}
                          />
                          Sedang Berlangsung
                        </div>
                        <div className="jadwal-month-count">
                          {stats.berlangsung} kegiatan
                        </div>
                      </div>
                      <div className="jadwal-list">
                        {jadwalList
                          .filter((j) => j.statusJadwal === "berlangsung")
                          .map((j) => (
                            <JadwalCard key={j.id} jadwal={j} />
                          ))}
                      </div>
                    </div>
                  )}
                  {/* Akan Datang */}
                  {stats.mendatang > 0 && (
                    <div style={{ marginBottom: "28px" }}>
                      <div className="jadwal-month-header">
                        <div
                          className="jadwal-month-title"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <CalendarDays
                            size={18}
                            style={{ color: "var(--color-forest-500)" }}
                          />
                          Akan Datang
                        </div>
                        <div className="jadwal-month-count">
                          {stats.mendatang} kegiatan
                        </div>
                      </div>
                      <div className="jadwal-list">
                        {jadwalList
                          .filter((j) => j.statusJadwal === "akan-datang")
                          .map((j) => (
                            <JadwalCard key={j.id} jadwal={j} />
                          ))}
                      </div>
                    </div>
                  )}
                  {/* Selesai */}
                  {stats.selesai > 0 && (
                    <div>
                      <div className="jadwal-month-header">
                        <div
                          className="jadwal-month-title"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            color: "var(--color-ink-4)",
                          }}
                        >
                          <CalendarCheck
                            size={18}
                            style={{ color: "var(--color-ink-5)" }}
                          />
                          Selesai
                        </div>
                        <div className="jadwal-month-count">
                          {stats.selesai} kegiatan
                        </div>
                      </div>
                      <div className="jadwal-list">
                        {jadwalList
                          .filter((j) => j.statusJadwal === "selesai")
                          .map((j) => (
                            <JadwalCard key={j.id} jadwal={j} />
                          ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ── Dengan filter status aktif ── */}
              {status && (
                <div className="jadwal-list">
                  {jadwalList.length === 0 ? (
                    <div
                      className="empty-state"
                      style={{ paddingBlock: "40px" }}
                    >
                      <CalendarX
                        size={40}
                        style={{ color: "var(--color-ink-5)" }}
                      />
                      <div className="empty-state-title">Tidak ada jadwal</div>
                      <div className="empty-state-desc">
                        Tidak ada jadwal yang sesuai dengan filter yang dipilih.
                      </div>
                    </div>
                  ) : (
                    jadwalList.map((j) => <JadwalCard key={j.id} jadwal={j} />)
                  )}
                </div>
              )}
            </div>

            {/* ── Sidebar ── */}
            <aside className="jadwal-sidebar">
              {/* Sumber data */}
              <div className="sidebar-widget">
                <div className="sidebar-widget-head">
                  <Info size={16} />
                  Sumber Data
                </div>
                <div className="sidebar-widget-body">
                  <p
                    style={{
                      fontSize: "13px",
                      color: "var(--color-ink-3)",
                      lineHeight: 1.6,
                      marginBottom: "12px",
                    }}
                  >
                    Data jadwal diambil langsung dari{" "}
                    <strong>SIMPEL Kalimantan Timur</strong> dan diperbarui
                    otomatis setiap 1 jam.
                  </p>
                  <Link
                    href="https://simpel.kaltimprov.go.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sidebar-more-link"
                    style={{ marginTop: 0, paddingTop: 0, borderTop: "none" }}
                  >
                    Kunjungi SIMPEL Kaltim
                    <ExternalLink size={13} />
                  </Link>
                </div>
              </div>

              {/* Keterangan status */}
              <div className="sidebar-widget">
                <div className="sidebar-widget-head">
                  <LayoutList size={16} />
                  Keterangan Status
                </div>
                <div
                  className="sidebar-widget-body"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {[
                    {
                      dot: "var(--color-forest-700)",
                      label: "Sedang Berlangsung",
                      desc: "Kegiatan aktif saat ini",
                    },
                    {
                      dot: "var(--color-gold-500)",
                      label: "Akan Datang",
                      desc: "Jadwal yang akan datang",
                    },
                    {
                      dot: "var(--color-ink-4)",
                      label: "Selesai",
                      desc: "Kegiatan telah berakhir",
                    },
                  ].map((item) => (
                    <div key={item.label} className="mode-legend-item">
                      <div
                        style={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          backgroundColor: item.dot,
                          flexShrink: 0,
                          marginTop: "3px",
                        }}
                      />
                      <div>
                        <div className="mode-legend-label">{item.label}</div>
                        <div className="mode-legend-desc">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="jadwal-cta">
                <div className="jadwal-cta-title">
                  Butuh informasi lebih lanjut?
                </div>
                <div className="jadwal-cta-desc">
                  Hubungi tim BPSDM untuk konsultasi kebutuhan diklat instansi
                  Anda.
                </div>
                <Link href="/kontak" className="btn-gold btn jadwal-cta-btn">
                  <Phone size={15} />
                  Hubungi Kami
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
