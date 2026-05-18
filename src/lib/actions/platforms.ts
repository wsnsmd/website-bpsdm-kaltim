// src/lib/actions/platforms.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db, eq } from "@/db";
import { platforms } from "@/db/schema";
import { z } from "zod";

const PlatformSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  url: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  category: z.string().default("ekosistem"),
  isHighlight: z.coerce.boolean().default(false),
  isActive: z.coerce.boolean().default(true),
  sortOrder: z.coerce.number().default(0),
});

export async function createPlatform(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const raw = {
    name: formData.get("name"),
    description: formData.get("description"),
    url: formData.get("url"),
    icon: formData.get("icon"),
    color: formData.get("color"),
    category: formData.get("category"),
    isHighlight: formData.get("isHighlight") === "true",
    isActive: formData.get("isActive") === "true",
    sortOrder: formData.get("sortOrder"),
  };

  const parsed = PlatformSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await db.insert(platforms).values(parsed.data);
  revalidatePath("/");
  revalidatePath("/layanan");
  revalidatePath("/admin/platform");
  redirect("/admin/platform");
}

export async function updatePlatform(id: number, formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const raw = {
    name: formData.get("name"),
    description: formData.get("description"),
    url: formData.get("url"),
    icon: formData.get("icon"),
    color: formData.get("color"),
    category: formData.get("category"),
    isHighlight: formData.get("isHighlight") === "true",
    isActive: formData.get("isActive") === "true",
    sortOrder: formData.get("sortOrder"),
  };

  const parsed = PlatformSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await db.update(platforms).set(parsed.data).where(eq(platforms.id, id));
  revalidatePath("/");
  revalidatePath("/layanan");
  revalidatePath("/admin/platform");
  redirect("/admin/platform");
}

export async function deletePlatform(id: number) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
  await db.delete(platforms).where(eq(platforms.id, id));
  revalidatePath("/");
  revalidatePath("/layanan");
  revalidatePath("/admin/platform");
}

export async function togglePlatformActive(id: number, isActive: boolean) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
  await db.update(platforms).set({ isActive }).where(eq(platforms.id, id));
  revalidatePath("/");
  revalidatePath("/layanan");
  revalidatePath("/admin/platform");
}
