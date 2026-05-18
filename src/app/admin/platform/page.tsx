// src/app/admin/platform/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { db, asc } from "@/db";
import { platforms } from "@/db/schema";
import { Plus, Edit, Star } from "lucide-react";
import { DeletePlatformButton } from "@/components/admin/platform/DeletePlatformButton";
import { TogglePlatformButton } from "@/components/admin/platform/TogglePlatformButton";

export const metadata: Metadata = { title: "Platform & Layanan" };

export default async function AdminPlatformPage() {
  const all = await db
    .select()
    .from(platforms)
    .orderBy(asc(platforms.sortOrder));

  const unggulan = all.filter((p) => p.category === "unggulan");
  const ekosistem = all.filter((p) => p.category === "ekosistem");

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Platform & Layanan Digital</h1>
          <p className="admin-page-sub">{all.length} platform terdaftar</p>
        </div>
        <Link href="/admin/platform/baru" className="admin-btn-save">
          <Plus size={15} />
          Tambah Platform
        </Link>
      </div>

      {[
        { label: "Layanan Unggulan (Beranda)", items: unggulan },
        { label: "Ekosistem Digital", items: ekosistem },
      ].map(({ label, items }) => (
        <div
          key={label}
          className="admin-card"
          style={{ marginBottom: "20px" }}
        >
          <div className="admin-card-head">
            <div className="admin-card-title">{label}</div>
            <span style={{ fontSize: "12px", color: "var(--color-ink-4)" }}>
              {items.length} platform
            </span>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: "60px", textAlign: "center" }}>Urutan</th>
                  <th>Nama Platform</th>
                  <th>URL</th>
                  <th style={{ width: "80px" }}>Unggulan</th>
                  <th style={{ width: "70px" }}>Aktif</th>
                  <th style={{ width: "140px" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        textAlign: "center",
                        padding: "28px",
                        color: "var(--color-ink-4)",
                        fontSize: "13px",
                      }}
                    >
                      Belum ada platform.
                    </td>
                  </tr>
                )}
                {items.map((p) => (
                  <tr key={p.id} style={{ opacity: p.isActive ? 1 : 0.55 }}>
                    <td style={{ textAlign: "center" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          background: "var(--color-ink-7)",
                          fontSize: "12px",
                          fontWeight: 700,
                          color: "var(--color-ink-4)",
                        }}
                      >
                        {p.sortOrder}
                      </span>
                    </td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        {p.color && (
                          <div
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              backgroundColor: p.color,
                              flexShrink: 0,
                            }}
                          />
                        )}
                        <div>
                          <div
                            style={{
                              fontWeight: 600,
                              fontSize: "13.5px",
                              color: "var(--color-ink)",
                            }}
                          >
                            {p.name}
                          </div>
                          {p.description && (
                            <div
                              style={{
                                fontSize: "12px",
                                color: "var(--color-ink-4)",
                              }}
                            >
                              {p.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td
                      style={{
                        fontSize: "12.5px",
                        color: "var(--color-ink-3)",
                      }}
                    >
                      {p.url ? (
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "var(--color-forest-700)",
                            textDecoration: "none",
                            fontSize: "12px",
                          }}
                        >
                          {p.url.length > 35 ? p.url.slice(0, 35) + "…" : p.url}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {p.isHighlight ? (
                        <Star
                          size={15}
                          style={{ color: "var(--color-gold-500)" }}
                          fill="currentColor"
                        />
                      ) : (
                        <span style={{ color: "var(--color-ink-5)" }}>—</span>
                      )}
                    </td>
                    <td>
                      <TogglePlatformButton
                        id={p.id}
                        isActive={p.isActive ?? true}
                      />
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <Link
                          href={`/admin/platform/${p.id}`}
                          className="admin-table-btn admin-table-btn-edit"
                        >
                          <Edit size={13} /> Edit
                        </Link>
                        <DeletePlatformButton id={p.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </>
  );
}
