// src/app/(public)/program/jadwal/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ScheduleCard } from "@/components/program/ScheduleCard";
import { ScheduleFilter } from "@/components/program/ScheduleFilter";
import { Pagination } from "@/components/ui/Pagination";
import {
  getUpcomingSchedules,
  getSchedulesByMonth,
  countSchedules,
} from "@/lib/queries/programs";

export const metadata: Metadata = {
  title: "Jadwal Pelatihan",
  description:
    "Seluruh jadwal kegiatan pelatihan dan diklat BPSDM Provinsi Kalimantan Timur.",
};

const PER_PAGE = 10;

type Props = {
  searchParams: Promise<{
    mode?: string;
    status?: string;
    halaman?: string;
  }>;
};

export default async function JadwalPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.halaman ?? 1));
  const mode = params.mode as "online" | "offline" | "blended" | undefined;
  const filterStatus = params.status;

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const statusFilter =
    filterStatus === "open"
      ? ["open"]
      : filterStatus === "full"
        ? ["full"]
        : ["open", "ongoing", "full", "closed"];

  const [schedules, thisMonthSchedules, total] = await Promise.all([
    getUpcomingSchedules({
      mode,
      limit: PER_PAGE,
    }),
    getSchedulesByMonth(year, month),
    countSchedules({ mode, status: statusFilter }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

  // Hari-hari yang punya jadwal bulan ini
  const scheduledDays = new Set(
    thisMonthSchedules.map((s) => s.startDate.getDate()),
  );

  // Build calendar
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  const monthName = now.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  const paginationParams: Record<string, string> = {};
  if (mode) paginationParams.mode = mode;
  if (filterStatus) paginationParams.status = filterStatus;

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
      <div className="page-hero" style={{ paddingBlock: "2.5rem" }}>
        <div className="container-content" style={{ position: "relative" }}>
          <p className="page-hero-eyebrow">
            {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
          </p>
          <h1 className="page-hero-title" style={{ fontSize: "34px" }}>
            Jadwal Pelatihan &amp; Diklat
          </h1>
          <p className="page-hero-desc">
            Seluruh jadwal kegiatan pelatihan BPSDM Kaltim — filter berdasarkan
            mode, jenis, dan status pendaftaran.
          </p>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          backgroundColor: "var(--color-ink-8)",
          paddingBlock: "3.5rem",
        }}
      >
        <div className="container-content">
          <div className="jadwal-layout">
            {/* Main */}
            <div>
              {/* Filter */}
              <Suspense>
                <ScheduleFilter />
              </Suspense>

              {/* Info */}
              <div className="filter-info">{total} jadwal ditemukan</div>

              {/* Group by month */}
              <div className="jadwal-month-group">
                <div className="jadwal-month-header">
                  <div className="jadwal-month-title">
                    {now.toLocaleDateString("id-ID", { month: "long" })}
                  </div>
                  <div className="jadwal-month-year">{year}</div>
                  <div className="jadwal-month-count">
                    {thisMonthSchedules.length} kegiatan
                  </div>
                </div>

                {schedules.length === 0 ? (
                  <div className="empty-state" style={{ paddingBlock: "40px" }}>
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      style={{ color: "var(--color-ink-5)" }}
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <div className="empty-state-title">Belum ada jadwal</div>
                    <div className="empty-state-desc">
                      Tidak ada jadwal yang sesuai dengan filter yang dipilih.
                    </div>
                  </div>
                ) : (
                  <div className="jadwal-list">
                    {schedules.map((s) => (
                      <ScheduleCard key={s.id} schedule={s} />
                    ))}
                  </div>
                )}
              </div>

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                basePath="/program/jadwal"
                searchParams={paginationParams}
              />
            </div>

            {/* Sidebar */}
            <aside className="jadwal-sidebar">
              {/* Mini Calendar */}
              <div className="sidebar-widget">
                <div className="sidebar-widget-head">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Kalender {now.toLocaleDateString("id-ID", { month: "long" })}
                </div>
                <div
                  className="sidebar-widget-body"
                  style={{ padding: "16px" }}
                >
                  <div className="mini-cal">
                    <div className="mini-cal-dow-row">
                      {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map(
                        (d) => (
                          <div key={d} className="mini-cal-dow">
                            {d}
                          </div>
                        ),
                      )}
                    </div>
                    <div className="mini-cal-grid">
                      {/* Padding awal */}
                      {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`empty-${i}`} />
                      ))}
                      {/* Hari-hari */}
                      {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                        (day) => {
                          const isToday = day === now.getDate();
                          const hasEvent = scheduledDays.has(day);
                          return (
                            <div
                              key={day}
                              className={`mini-cal-day${isToday ? " mini-cal-day-today" : ""}${hasEvent ? " mini-cal-day-event" : ""}`}
                            >
                              {day}
                            </div>
                          );
                        },
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Keterangan mode */}
              <div className="sidebar-widget">
                <div className="sidebar-widget-head">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  Keterangan Mode
                </div>
                <div
                  className="sidebar-widget-body"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {[
                    {
                      color: "#1d4ed8",
                      label: "Daring (Online)",
                      desc: "Via platform virtual",
                    },
                    {
                      color: "var(--color-forest-700)",
                      label: "Luring (Offline)",
                      desc: "Di lokasi fisik",
                    },
                    {
                      color: "var(--color-gold-600)",
                      label: "Mandiri (Blended)",
                      desc: "Kombinasi online & offline",
                    },
                  ].map((m) => (
                    <div key={m.label} className="mode-legend-item">
                      <div
                        className="mode-legend-dot"
                        style={{ backgroundColor: m.color }}
                      />
                      <div>
                        <div className="mode-legend-label">{m.label}</div>
                        <div className="mode-legend-desc">{m.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA konsultasi */}
              <div className="jadwal-cta">
                <div className="jadwal-cta-title">
                  Belum menemukan jadwal yang sesuai?
                </div>
                <div className="jadwal-cta-desc">
                  Hubungi tim BPSDM untuk konsultasi kebutuhan diklat instansi
                  Anda.
                </div>
                <a href="/kontak" className="btn-gold btn jadwal-cta-btn">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.06 6.06l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  Hubungi Kami
                </a>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
