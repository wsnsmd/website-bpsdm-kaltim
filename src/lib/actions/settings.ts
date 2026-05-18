// src/lib/actions/settings.ts
"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db, eq } from "@/db";
import { settings } from "@/db/schema";

export async function updateSettings(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const entries = Array.from(formData.entries());

  for (const [key, value] of entries) {
    if (typeof value !== "string") continue;
    await db
      .update(settings)
      .set({ value, updatedAt: new Date() })
      .where(eq(settings.key, key));
  }

  revalidatePath("/");
  revalidatePath("/kontak");
  revalidatePath("/admin/pengaturan");

  return { success: true };
}

export async function updateSingleSetting(key: string, value: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await db
    .update(settings)
    .set({ value, updatedAt: new Date() })
    .where(eq(settings.key, key));

  revalidatePath("/");
  revalidatePath("/kontak");
  revalidatePath("/admin/pengaturan");

  return { success: true };
}
