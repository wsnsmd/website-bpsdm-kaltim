// src/app/admin/menu/[id]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db, eq, asc, isNull } from "@/db";
import { menuGroups, menuItems } from "@/db/schema";
import { MenuItemForm } from "@/components/admin/menu/MenuItemForm";

export const metadata: Metadata = { title: "Edit Item Menu" };

type Props = { params: Promise<{ id: string }> };

export default async function EditMenuPage({ params }: Props) {
  const { id } = await params;
  const itemId = Number(id);
  if (isNaN(itemId)) notFound();

  const [result, groups, parents] = await Promise.all([
    db.select().from(menuItems).where(eq(menuItems.id, itemId)).limit(1),
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

  if (!result[0]) notFound();

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Edit Item Menu</h1>
          <p className="admin-page-sub">{result[0].label}</p>
        </div>
        <Link href="/admin/menu" className="admin-btn-cancel">
          ← Kembali
        </Link>
      </div>
      <MenuItemForm item={result[0]} groups={groups} parents={parents} />
    </>
  );
}
