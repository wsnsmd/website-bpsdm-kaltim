// src/lib/actions/menu.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db, eq } from "@/db";
import { menuItems } from "@/db/schema";
import { z } from "zod";

const MenuItemSchema = z.object({
  label: z.string().min(1, "Label wajib diisi"),
  url: z.string().optional(),
  menuGroupId: z.coerce.number(),
  parentId: z.coerce.number().optional(),
  sortOrder: z.coerce.number().default(0),
  target: z.enum(["_self", "_blank"]).default("_self"),
  isActive: z.coerce.boolean().default(true),
});

export async function createMenuItem(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const raw = {
    label: formData.get("label"),
    url: formData.get("url"),
    menuGroupId: formData.get("menuGroupId"),
    parentId: formData.get("parentId") || undefined,
    sortOrder: formData.get("sortOrder"),
    target: formData.get("target"),
    isActive: formData.get("isActive") === "true",
  };

  const parsed = MenuItemSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const data = parsed.data;

  await db.insert(menuItems).values({
    label: data.label,
    url: data.url || null,
    menuGroupId: data.menuGroupId,
    parentId: data.parentId || null,
    sortOrder: data.sortOrder,
    target: data.target,
    isActive: data.isActive,
  });

  revalidatePath("/");
  revalidatePath("/admin/menu");
  redirect("/admin/menu");
}

export async function updateMenuItem(id: number, formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const raw = {
    label: formData.get("label"),
    url: formData.get("url"),
    menuGroupId: formData.get("menuGroupId"),
    parentId: formData.get("parentId") || undefined,
    sortOrder: formData.get("sortOrder"),
    target: formData.get("target"),
    isActive: formData.get("isActive") === "true",
  };

  const parsed = MenuItemSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const data = parsed.data;

  await db
    .update(menuItems)
    .set({
      label: data.label,
      url: data.url || null,
      parentId: data.parentId || null,
      sortOrder: data.sortOrder,
      target: data.target,
      isActive: data.isActive,
    })
    .where(eq(menuItems.id, id));

  revalidatePath("/");
  revalidatePath("/admin/menu");
  redirect("/admin/menu");
}

export async function deleteMenuItem(id: number) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  // Hapus children dulu
  await db.delete(menuItems).where(eq(menuItems.parentId, id));
  await db.delete(menuItems).where(eq(menuItems.id, id));

  revalidatePath("/");
  revalidatePath("/admin/menu");
}

export async function toggleMenuItemActive(id: number, isActive: boolean) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await db.update(menuItems).set({ isActive }).where(eq(menuItems.id, id));

  revalidatePath("/");
  revalidatePath("/admin/menu");
}

export async function updateMenuItemOrder(
  updates: { id: number; sortOrder: number }[],
) {
  try {
    // Update each item in a transaction
    await db.transaction(async (tx) => {
      for (const update of updates) {
        await tx
          .update(menuItems)
          .set({ sortOrder: update.sortOrder })
          .where(eq(menuItems.id, update.id));
      }
    });

    revalidatePath("/admin/menu");
    return { success: true };
  } catch (error) {
    console.error("Error updating menu order:", error);
    return { error: "Gagal mengupdate urutan menu" };
  }
}
