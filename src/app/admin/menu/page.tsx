// src/app/admin/menu/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { db, asc } from "@/db";
import { menuGroups, menuItems } from "@/db/schema";
import { Plus } from "lucide-react";
import { SortableMenuTable } from "@/components/admin/menu/SortableMenuTable";
// import { SortableSubMenuTable } from "@/components/admin/menu/SortableSubMenuTable";

export const metadata: Metadata = { title: "Manajemen Menu" };

export default async function AdminMenuPage() {
  // Ambil semua menu groups
  const groups = await db.select().from(menuGroups).orderBy(asc(menuGroups.id));

  // Ambil semua menu items dengan info group
  const allItems = await db
    .select()
    .from(menuItems)
    .orderBy(asc(menuItems.menuGroupId), asc(menuItems.sortOrder));

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Manajemen Menu</h1>
          <p className="admin-page-sub">
            Kelola navigasi header website. Drag and drop untuk mengatur urutan
            menu.
          </p>
        </div>
        <Link href="/admin/menu/baru" className="admin-btn-save">
          <Plus size={15} />
          Tambah Item Menu
        </Link>
      </div>

      {groups.map((group) => {
        const groupItems = allItems.filter((i) => i.menuGroupId === group.id);
        const rootItems = groupItems.filter((i) => !i.parentId);
        const childItems = groupItems.filter((i) => i.parentId);

        // Group child items by parent
        const childrenByParent: Record<number, typeof childItems> = {};
        childItems.forEach((child) => {
          if (child.parentId) {
            if (!childrenByParent[child.parentId]) {
              childrenByParent[child.parentId] = [];
            }
            childrenByParent[child.parentId].push(child);
          }
        });

        return (
          <div
            key={group.id}
            className="admin-card"
            style={{ marginBottom: "20px" }}
          >
            {/* Group header */}
            <div className="admin-card-head">
              <div className="admin-card-title">
                {group.name}
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 500,
                    color: "var(--color-ink-4)",
                    background: "var(--color-ink-7)",
                    padding: "2px 8px",
                    borderRadius: "20px",
                    marginLeft: "8px",
                  }}
                >
                  {group.location || "Tanpa Lokasi"}
                </span>
              </div>
              <span style={{ fontSize: "12px", color: "var(--color-ink-4)" }}>
                {groupItems.length} item
              </span>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: "40px" }}>Urut</th>
                    <th>Label</th>
                    <th>URL / Link</th>
                    <th style={{ width: "100px" }}>Level</th>
                    <th style={{ width: "80px" }}>Aktif</th>
                    <th style={{ width: "120px" }}>Aksi</th>
                  </tr>
                </thead>
                <SortableMenuTable items={rootItems} groupId={group.id} />
              </table>

              {/* Children tables */}
              {rootItems.map((root) => {
                const children = childrenByParent[root.id] || [];
                if (children.length === 0) return null;

                return (
                  <div
                    key={`children-${root.id}`}
                    style={{
                      marginTop: "0",
                      borderTop: "1px solid var(--color-ink-6)",
                    }}
                  >
                    <div
                      style={{
                        padding: "8px 16px",
                        background: "var(--color-ink-7)",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "var(--color-ink-4)",
                      }}
                    >
                      Submenu: {root.label}
                    </div>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th style={{ width: "40px" }}>Urut</th>
                          <th>Label</th>
                          <th>URL / Link</th>
                          <th style={{ width: "100px" }}>Level</th>
                          <th style={{ width: "80px" }}>Aktif</th>
                          <th style={{ width: "120px" }}>Aksi</th>
                        </tr>
                      </thead>
                      <SortableMenuTable
                        items={children}
                        groupId={group.id}
                        isChild
                      />
                    </table>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}
