// src/app/admin/pengumuman/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { db, desc } from "@/db";
import { announcements } from "@/db/schema";
import { formatDate } from "@/lib/utils";
import { DeleteAnnouncementButton } from "@/components/admin/DeleteAnnouncementButton";
import { ToggleActiveButton } from "@/components/admin/ToggleActiveButton";
import { Plus } from "lucide-react";

export const metadata: Metadata = { title: "Manajemen Pengumuman" };

const TYPE_STYLE: Record<string, { label: string; cls: string }> = {
  info: { label: "Info", cls: "status-pill-review" },
  warning: { label: "Warning", cls: "status-pill-draft" },
  urgent: { label: "Urgent", cls: "status-pill-full" },
  event: { label: "Event", cls: "status-pill-published" },
};

type Props = {
  searchParams: Promise<{ cari?: string; tipe?: string; aktif?: string }>;
};

export default async function AdminPengumumanPage({ searchParams }: Props) {
  const params = await searchParams;
  const search = params.cari ?? "";
  const tipe = params.tipe ?? "";
  const aktif = params.aktif ?? "";

  const allAnnouncements = await db
    .select()
    .from(announcements)
    .orderBy(announcements.priority, desc(announcements.startDate));

  // Filter di JS
  const filtered = allAnnouncements.filter((a) => {
    const matchSearch =
      !search || a.title.toLowerCase().includes(search.toLowerCase());
    const matchTipe = !tipe || a.type === tipe;
    const matchAktif =
      !aktif ||
      (aktif === "aktif"
        ? a.isActive
        : aktif === "nonaktif"
          ? !a.isActive
          : true);
    return matchSearch && matchTipe && matchAktif;
  });

  const activeCount = allAnnouncements.filter((a) => a.isActive).length;

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Pengumuman</h1>
          <p className="admin-page-sub">
            {filtered.length} dari {allAnnouncements.length} pengumuman ·{" "}
            <span style={{ color: "var(--color-forest-600)", fontWeight: 600 }}>
              {activeCount} aktif
            </span>
          </p>
        </div>
        <Link href="/admin/pengumuman/baru" className="admin-btn-save">
          <Plus size={15} />
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
          Pengumuman aktif tampil di ticker halaman utama sesuai prioritas.
          Prioritas lebih kecil = tampil lebih awal.
        </span>
      </div>

      {/* Filter bar */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        {/* Search */}
        <form
          method="GET"
          style={{ display: "flex", gap: "8px", flex: 1, minWidth: "200px" }}
        >
          {tipe && <input type="hidden" name="tipe" value={tipe} />}
          {aktif && <input type="hidden" name="aktif" value={aktif} />}
          <input
            name="cari"
            type="text"
            className="admin-input"
            placeholder="Cari judul pengumuman..."
            defaultValue={search}
            style={{ flex: 1, height: "36px", fontSize: "13px" }}
          />
          <button
            type="submit"
            className="admin-btn-save"
            style={{ height: "36px", padding: "0 16px" }}
          >
            Cari
          </button>
          {(search || tipe || aktif) && (
            <Link
              href="/admin/pengumuman"
              style={{
                height: "36px",
                padding: "0 14px",
                borderRadius: "8px",
                border: "1px solid var(--color-ink-6)",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                fontSize: "13px",
                color: "var(--color-ink-3)",
                textDecoration: "none",
              }}
            >
              Reset
            </Link>
          )}
        </form>

        {/* Tipe pills */}
        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
          {[
            { value: "", label: "Semua" },
            { value: "info", label: "Info" },
            { value: "warning", label: "Warning" },
            { value: "urgent", label: "Urgent" },
            { value: "event", label: "Event" },
          ].map((t) => (
            <Link
              key={t.value}
              href={`/admin/pengumuman?tipe=${t.value}${search ? `&cari=${search}` : ""}${aktif ? `&aktif=${aktif}` : ""}`}
              style={{
                padding: "5px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: 500,
                textDecoration: "none",
                border: "1px solid",
                borderColor:
                  tipe === t.value
                    ? "var(--color-forest-700)"
                    : "var(--color-ink-6)",
                background:
                  tipe === t.value ? "var(--color-forest-700)" : "#fff",
                color: tipe === t.value ? "#fff" : "var(--color-ink-3)",
                whiteSpace: "nowrap",
              }}
            >
              {t.label}
            </Link>
          ))}

          {/* Divider */}
          <div
            style={{
              width: "1px",
              background: "var(--color-ink-6)",
              margin: "0 4px",
            }}
          />

          {/* Status aktif */}
          {[
            { value: "", label: "Semua Status" },
            { value: "aktif", label: "✓ Aktif" },
            { value: "nonaktif", label: "— Nonaktif" },
          ].map((a) => (
            <Link
              key={a.value}
              href={`/admin/pengumuman?aktif=${a.value}${search ? `&cari=${search}` : ""}${tipe ? `&tipe=${tipe}` : ""}`}
              style={{
                padding: "5px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: 500,
                textDecoration: "none",
                border: "1px solid",
                borderColor:
                  aktif === a.value
                    ? "var(--color-forest-700)"
                    : "var(--color-ink-6)",
                background:
                  aktif === a.value ? "var(--color-forest-700)" : "#fff",
                color: aktif === a.value ? "#fff" : "var(--color-ink-3)",
                whiteSpace: "nowrap",
              }}
            >
              {a.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "60px" }}>Aktif</th>
                <th>Judul</th>
                <th>Tipe</th>
                <th style={{ textAlign: "center" }}>Ticker</th>
                <th style={{ textAlign: "center" }}>Banner</th>
                <th style={{ textAlign: "center" }}>Prioritas</th>
                <th>Mulai Tayang</th>
                <th>Selesai</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "var(--color-ink-4)",
                    }}
                  >
                    {search
                      ? `Tidak ada pengumuman untuk "${search}"`
                      : "Belum ada pengumuman."}
                  </td>
                </tr>
              )}
              {filtered.map((ann) => {
                const typeStyle =
                  TYPE_STYLE[ann.type ?? "info"] ?? TYPE_STYLE.info;
                return (
                  <tr key={ann.id}>
                    <td>
                      <ToggleActiveButton
                        id={ann.id}
                        isActive={ann.isActive ?? false}
                      />
                    </td>

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

                    <td>
                      <span className={`status-pill ${typeStyle.cls}`}>
                        {typeStyle.label}
                      </span>
                    </td>

                    <td style={{ textAlign: "center" }}>
                      {ann.showInTicker ? (
                        <span
                          style={{
                            color: "var(--color-forest-700)",
                            fontSize: "16px",
                          }}
                        >
                          ✓
                        </span>
                      ) : (
                        <span style={{ color: "var(--color-ink-5)" }}>—</span>
                      )}
                    </td>

                    <td style={{ textAlign: "center" }}>
                      {ann.showInBanner ? (
                        <span
                          style={{
                            color: "var(--color-forest-700)",
                            fontSize: "16px",
                          }}
                        >
                          ✓
                        </span>
                      ) : (
                        <span style={{ color: "var(--color-ink-5)" }}>—</span>
                      )}
                    </td>

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

        {/* Footer */}
        {filtered.length > 0 && (
          <div
            style={{
              padding: "12px 20px",
              borderTop: "1px solid var(--color-ink-7)",
              fontSize: "12.5px",
              color: "var(--color-ink-4)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>
              {filtered.filter((a) => a.isActive).length} aktif ·{" "}
              {filtered.filter((a) => a.showInTicker).length} di ticker ·{" "}
              {filtered.filter((a) => a.showInBanner).length} di banner
            </span>
            <span>{filtered.length} pengumuman ditampilkan</span>
          </div>
        )}
      </div>
    </>
  );
}
