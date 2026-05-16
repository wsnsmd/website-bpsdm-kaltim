// src/lib/actions/units.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db, eq } from "@/db";
import { units } from "@/db/schema";
import { z } from "zod";

const UnitSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  shortName: z.string().optional(),
  description: z.string().optional(),
  parentId: z.coerce.number().optional(),
  level: z.coerce.number().default(0),
  sortOrder: z.coerce.number().default(0),
  isActive: z.coerce.boolean().default(true),
});

export async function createUnit(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const raw = {
    name: formData.get("name"),
    shortName: formData.get("shortName"),
    description: formData.get("description"),
    parentId: formData.get("parentId"),
    level: formData.get("level"),
    sortOrder: formData.get("sortOrder"),
    isActive: formData.get("isActive") === "true",
  };

  const parsed = UnitSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const data = parsed.data;

  try {
    await db.insert(units).values({
      name: data.name,
      shortName: data.shortName || null,
      description: data.description || null,
      parentId: data.parentId || null,
      level: data.level,
      sortOrder: data.sortOrder,
      isActive: data.isActive,
    });
  } catch {
    return { error: "Gagal menyimpan unit." };
  }

  revalidatePath("/profil/struktur-organisasi");
  revalidatePath("/admin/profil/units");
  redirect("/admin/profil/units");
}

export async function updateUnit(id: number, formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const raw = {
    name: formData.get("name"),
    shortName: formData.get("shortName"),
    description: formData.get("description"),
    parentId: formData.get("parentId"),
    level: formData.get("level"),
    sortOrder: formData.get("sortOrder"),
    isActive: formData.get("isActive") === "true",
  };

  const parsed = UnitSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const data = parsed.data;

  try {
    await db
      .update(units)
      .set({
        name: data.name,
        shortName: data.shortName || null,
        description: data.description || null,
        parentId: data.parentId || null,
        level: data.level,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      })
      .where(eq(units.id, id));
  } catch {
    return { error: "Gagal menyimpan perubahan." };
  }

  revalidatePath("/profil/struktur-organisasi");
  revalidatePath("/admin/profil/units");
  redirect("/admin/profil/units");
}

export async function deleteUnit(id: number) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
  await db.delete(units).where(eq(units.id, id));
  revalidatePath("/profil/struktur-organisasi");
  revalidatePath("/admin/profil/units");
}
