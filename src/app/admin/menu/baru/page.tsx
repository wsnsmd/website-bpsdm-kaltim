// src/app/admin/menu/baru/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { db, asc, isNull } from "@/db";
import { menuGroups, menuItems } from "@/db/schema";
import { MenuItemForm } from "@/components/admin/menu/MenuItemForm";
import { eq } from "@/db";

export const metadata: Metadata = { title: "Tambah Item Menu" };
// PM2 cluster mode (2+ instance) -> Full Route Cache tidak sinkron antar-proses.
// force-dynamic memastikan halaman ini selalu query fresh dari DB.
export const dynamic = "force-dynamic";
export default async function TambahMenuPage() {
  const [groups, parents] = await Promise.all([
    db.select().from(menuGroups).orderBy(asc(menuGroups.id)),
    db
      .select({
        id: menuItems.id,
        label: menuItems.label,
        menuGroupId: menuItems.menuGroupId,
      })
      .from(menuItems)
      .where(isNull(menuItems.parentId))
      .orderBy(asc(menuItems.sortOrder)),
  ]);

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Tambah Item Menu</h1>
        </div>
        <Link href="/admin/menu" className="admin-btn-cancel">
          ← Kembali
        </Link>
      </div>
      <MenuItemForm groups={groups} parents={parents} />
    </>
  );
}
