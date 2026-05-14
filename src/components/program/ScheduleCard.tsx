// src/components/program/ScheduleCard.tsx
import Link from "next/link";
import type { ScheduleWithProgram } from "@/lib/queries/programs";

const MODE_LABELS = {
  online: "Daring",
  offline: "Luring",
  blended: "Mandiri",
};

const MODE_BADGE = {
  online: "badge-blue",
  offline: "badge-forest",
  blended: "badge-gold",
};

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  open: { label: "Dibuka", cls: "badge-open" },
  ongoing: { label: "Berlangsung", cls: "badge-forest" },
  full: { label: "Penuh", cls: "badge-full" },
  closed: { label: "Ditutup", cls: "badge-red" },
  draft: { label: "Draft", cls: "badge-gold" },
  completed: { label: "Selesai", cls: "badge-forest" },
  cancelled: { label: "Dibatalkan", cls: "badge-red" },
};

function formatDateRange(start: Date, end: Date): string {
  const s = start;
  const e = end;
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${s.getDate()}–${e.toLocaleDateString("id-ID", { ...opts, year: "numeric" })}`;
  }
  return `${s.toLocaleDateString("id-ID", opts)} – ${e.toLocaleDateString("id-ID", { ...opts, year: "numeric" })}`;
}

function quotaPercent(registered: number | null, quota: number): number {
  return Math.min(100, Math.round(((registered ?? 0) / quota) * 100));
}

type Props = {
  schedule: ScheduleWithProgram;
};

export function ScheduleCard({ schedule }: Props) {
  const startDate = schedule.startDate;
  const status = STATUS_BADGE[schedule.status] ?? STATUS_BADGE.draft;
  const pct = quotaPercent(schedule.registeredCount, schedule.quota);
  const sisa = schedule.quota - (schedule.registeredCount ?? 0);
  const canRegister = schedule.status === "open" && sisa > 0;

  return (
    <div className="schedule-card">
      <div className="schedule-card-inner">
        {/* Tanggal */}
        <div
          className="schedule-date-col"
          style={{
            backgroundColor:
              schedule.status === "full"
                ? "var(--color-ink-3)"
                : "var(--color-forest-900)",
          }}
        >
          <div className="schedule-date-day">
            {String(startDate.getDate()).padStart(2, "0")}
          </div>
          <div className="schedule-date-mon">
            {startDate.toLocaleDateString("id-ID", { month: "short" })}
          </div>
          {schedule.startDate !== schedule.endDate && (
            <div className="schedule-date-end">
              s/d{" "}
              {new Date(schedule.endDate).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
              })}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="schedule-body">
          <div className="schedule-title">
            {schedule.program.name}
            {schedule.batchName && (
              <span className="schedule-batch"> — {schedule.batchName}</span>
            )}
          </div>

          <div className="schedule-meta-row">
            {schedule.location && (
              <span className="schedule-meta-item">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {schedule.location}
              </span>
            )}
            <span className="schedule-meta-item">
              <svg
                width="12"
                height="12"
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
              {formatDateRange(schedule.startDate, schedule.endDate)}
            </span>
            {schedule.program.durationDays && (
              <span className="schedule-meta-item">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {schedule.program.durationDays} hari
              </span>
            )}
          </div>

          {/* Badges */}
          <div className="schedule-badges">
            <span className={`badge ${status.cls}`}>{status.label}</span>
            <span className={`badge ${MODE_BADGE[schedule.mode]}`}>
              {MODE_LABELS[schedule.mode]}
            </span>
          </div>
        </div>

        {/* Action */}
        <div className="schedule-action-col">
          {/* Quota */}
          <div className="schedule-quota">
            <div className="schedule-quota-nums">
              <span
                className="schedule-quota-sisa"
                style={{
                  color:
                    sisa === 0
                      ? "var(--color-red, #dc2626)"
                      : sisa <= 10
                        ? "var(--color-gold-600)"
                        : "var(--color-forest-700)",
                }}
              >
                {sisa}
              </span>
              <span className="schedule-quota-total">/{schedule.quota}</span>
            </div>
            <div className="schedule-quota-label">sisa kuota</div>
            <div className="schedule-quota-bar">
              <div
                className="schedule-quota-fill"
                style={{
                  width: `${pct}%`,
                  backgroundColor:
                    pct >= 100
                      ? "#dc2626"
                      : pct >= 80
                        ? "var(--color-gold-500)"
                        : "var(--color-forest-700)",
                }}
              />
            </div>
          </div>

          {/* Tombol */}
          {canRegister ? (
            <Link
              href={`/program/${schedule.program.slug}?jadwal=${schedule.id}`}
              className="btn-primary btn schedule-btn"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
              Daftar
            </Link>
          ) : (
            <button className="schedule-btn-disabled" disabled>
              {schedule.status === "full" ? "Penuh" : "Belum Dibuka"}
            </button>
          )}
          <Link
            href={`/program/${schedule.program.slug}`}
            className="schedule-btn-info"
          >
            Detail
          </Link>
        </div>
      </div>
    </div>
  );
}
