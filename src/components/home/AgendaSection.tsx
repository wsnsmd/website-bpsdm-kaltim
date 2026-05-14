// src/components/home/AgendaSection.tsx
import Link from "next/link";
import type { ScheduleWithProgram } from "@/lib/queries/programs";

type Props = {
  schedules: ScheduleWithProgram[];
};

const DOCUMENTS = [
  {
    title: "Laporan Kinerja Tahun 2023–2024",
    meta: "PDF · 4.2 MB",
    href: "/unduhan",
  },
  {
    title: "Materi Pelayanan Pengelolaan Keuangan Daerah 2025",
    meta: "PDF · 2.8 MB",
    href: "/unduhan",
  },
  {
    title: "Jam Pelayanan BPSDM Kaltim",
    meta: "PDF · 0.5 MB",
    href: "/unduhan",
  },
  {
    title: "SOP BPSDM Provinsi Kalimantan Timur",
    meta: "PDF · 1.1 MB",
    href: "/unduhan",
  },
];

function formatDateRange(start: Date, end: Date): string {
  const s = start;
  const e = end;

  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  const sStr = s.toLocaleDateString("id-ID", opts);
  const eStr = e.toLocaleDateString("id-ID", { ...opts, year: "numeric" });

  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${s.getDate()}–${eStr}`;
  }
  return `${sStr} – ${eStr}`;
}

export function AgendaSection({ schedules }: Props) {
  return (
    <section
      style={{ backgroundColor: "var(--color-ink-8)", paddingBlock: "4rem" }}
    >
      <div className="container-content">
        <div className="agenda-grid">
          {/* Agenda dari DB */}
          <div className="agenda-card">
            <div className="agenda-head">
              <div className="agenda-head-left">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ color: "var(--color-forest-400)" }}
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>Agenda Kegiatan</span>
              </div>
              <Link href="/program/jadwal" className="agenda-head-link">
                Semua
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
              </Link>
            </div>

            <div className="agenda-body">
              {schedules.length === 0 && (
                <div
                  style={{
                    padding: "20px 22px",
                    color: "var(--color-ink-4)",
                    fontSize: "13px",
                  }}
                >
                  Belum ada jadwal mendatang.
                </div>
              )}
              {schedules.map((item) => {
                const startDate = item.startDate;
                return (
                  <div key={item.id} className="agenda-item">
                    <div className="agenda-cal">
                      <div className="agenda-day">
                        {String(startDate.getDate()).padStart(2, "0")}
                      </div>
                      <div className="agenda-month">
                        {startDate.toLocaleDateString("id-ID", {
                          month: "short",
                        })}
                      </div>
                    </div>
                    <div className="agenda-sep" />
                    <div className="agenda-info">
                      <div className="agenda-title">
                        {item.program.name}
                        {item.batchName && (
                          <span
                            style={{
                              color: "var(--color-ink-4)",
                              fontWeight: 400,
                            }}
                          >
                            {" "}
                            — {item.batchName}
                          </span>
                        )}
                      </div>
                      <div className="agenda-meta">
                        {item.location && (
                          <span>
                            <svg
                              width="11"
                              height="11"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              style={{ display: "inline", marginRight: "3px" }}
                            >
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            {item.location}
                          </span>
                        )}
                        <span>·</span>
                        <span>
                          {formatDateRange(item.startDate, item.endDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Unduhan — statis untuk sekarang */}
          <div className="agenda-card">
            <div className="agenda-head">
              <div className="agenda-head-left">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ color: "var(--color-forest-400)" }}
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Unduhan Dokumen</span>
              </div>
              <Link href="/unduhan" className="agenda-head-link">
                Semua
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
              </Link>
            </div>

            <div className="agenda-body">
              {DOCUMENTS.map((doc, i) => (
                <Link key={i} href={doc.href} className="doc-item">
                  <div className="doc-icon">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      style={{ color: "var(--color-forest-700)" }}
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <div className="doc-body">
                    <div className="doc-name">{doc.title}</div>
                    <div className="doc-meta">{doc.meta}</div>
                  </div>
                  <div className="doc-dl-btn">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
