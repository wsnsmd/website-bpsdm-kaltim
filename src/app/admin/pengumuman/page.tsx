// src/app/admin/pengumuman/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { db, desc } from "@/db";
import { announcements } from "@/db/schema";
import { formatDate } from "@/lib/utils";
import { DeleteAnnouncementButton } from "@/components/admin/DeleteAnnouncementButton";
import { ToggleActiveButton } from "@/components/admin/ToggleActiveButton";

export const metadata: Metadata = { title: "Manajemen Pengumuman" };

const TYPE_STYLE: Record<string, { label: string; cls: string }> = {
  info: { label: "Info", cls: "status-pill-review" },
  warning: { label: "Warning", cls: "status-pill-draft" },
  urgent: { label: "Urgent", cls: "status-pill-full" },
  event: { label: "Event", cls: "status-pill-published" },
};

export default async function AdminPengumumanPage() {
  const allAnnouncements = await db
    .select()
    .from(announcements)
    .orderBy(announcements.priority, desc(announcements.startDate));

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Pengumuman</h1>
          <p className="admin-page-sub">
            {allAnnouncements.length} pengumuman terdaftar
          </p>
        </div>
        <Link href="/admin/pengumuman/baru" className="admin-btn-save">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Tambah Pengumuman
        </Link>
      </div>

      {/* Info box */}
      <div className="ann-info-box">
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
        <span>
          Pengumuman aktif akan tampil di ticker halaman utama sesuai urutan
          prioritas. Prioritas lebih kecil = tampil lebih awal.
        </span>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Aktif</th>
                <th>Judul</th>
                <th>Tipe</th>
                <th>Ticker</th>
                <th>Banner</th>
                <th>Prioritas</th>
                <th>Mulai Tayang</th>
                <th>Selesai</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {allAnnouncements.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "var(--color-ink-4)",
                    }}
                  >
                    Belum ada pengumuman. Tambahkan yang pertama!
                  </td>
                </tr>
              )}
              {allAnnouncements.map((ann) => {
                const typeStyle =
                  TYPE_STYLE[ann.type ?? "info"] ?? TYPE_STYLE.info;
                return (
                  <tr key={ann.id}>
                    {/* Toggle aktif */}
                    <td>
                      <ToggleActiveButton
                        id={ann.id}
                        isActive={ann.isActive ?? false}
                      />
                    </td>

                    {/* Judul */}
                    <td style={{ maxWidth: "260px" }}>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: "13.5px",
                          color: "var(--color-ink)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          marginBottom: "3px",
                        }}
                      >
                        {ann.title}
                      </div>
                      {ann.url && (
                        <div
                          style={{
                            fontSize: "11px",
                            color: "var(--color-forest-700)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {ann.url}
                        </div>
                      )}
                    </td>

                    {/* Tipe */}
                    <td>
                      <span className={`status-pill ${typeStyle.cls}`}>
                        {typeStyle.label}
                      </span>
                    </td>

                    {/* Ticker */}
                    <td style={{ textAlign: "center" }}>
                      {ann.showInTicker ? (
                        <span
                          style={{
                            color: "var(--color-forest-700)",
                            fontSize: "18px",
                          }}
                        >
                          ✓
                        </span>
                      ) : (
                        <span
                          style={{
                            color: "var(--color-ink-5)",
                            fontSize: "18px",
                          }}
                        >
                          —
                        </span>
                      )}
                    </td>

                    {/* Banner */}
                    <td style={{ textAlign: "center" }}>
                      {ann.showInBanner ? (
                        <span
                          style={{
                            color: "var(--color-forest-700)",
                            fontSize: "18px",
                          }}
                        >
                          ✓
                        </span>
                      ) : (
                        <span
                          style={{
                            color: "var(--color-ink-5)",
                            fontSize: "18px",
                          }}
                        >
                          —
                        </span>
                      )}
                    </td>

                    {/* Prioritas */}
                    <td style={{ textAlign: "center" }}>
                      <span
                        style={{
                          display: "inline-block",
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          backgroundColor: "var(--color-ink-8)",
                          border: "1px solid var(--color-ink-6)",
                          lineHeight: "32px",
                          textAlign: "center",
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "var(--color-ink-2)",
                        }}
                      >
                        {ann.priority}
                      </span>
                    </td>

                    {/* Mulai */}
                    <td
                      style={{
                        fontSize: "12px",
                        color: "var(--color-ink-4)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatDate(ann.startDate, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    {/* Selesai */}
                    <td
                      style={{
                        fontSize: "12px",
                        color: "var(--color-ink-4)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {ann.endDate ? (
                        formatDate(ann.endDate, {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      ) : (
                        <span style={{ color: "var(--color-ink-5)" }}>
                          Tidak terbatas
                        </span>
                      )}
                    </td>

                    {/* Aksi */}
                    <td>
                      <div className="admin-table-actions">
                        <Link
                          href={`/admin/pengumuman/${ann.id}`}
                          className="admin-table-btn admin-table-btn-edit"
                        >
                          Edit
                        </Link>
                        <DeleteAnnouncementButton id={ann.id} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
