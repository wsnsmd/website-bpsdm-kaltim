// src/lib/actions/announcements.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db, eq } from "@/db";
import { announcements } from "@/db/schema";
import { z } from "zod";

// ── Schema validasi ───────────────────────────
const AnnouncementSchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter"),
  content: z.string().optional(),
  url: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => {
      // Jika kosong, return null
      if (!val) return null;
      // Jika sudah diawali http:// atau https://, biarkan
      if (val.startsWith("http://") || val.startsWith("https://")) return val;
      // Jika diawali /, anggap sebagai link internal
      if (val.startsWith("/")) return val;
      // Selain itu, tambahkan / di depan untuk link internal
      return `/${val}`;
    }),
  type: z.enum(["info", "warning", "urgent", "event"]),
  showInTicker: z.coerce.boolean(),
  showInBanner: z.coerce.boolean(),
  priority: z.coerce.number().min(0).max(100),
  startDate: z.string().min(1, "Tanggal mulai wajib diisi"),
  endDate: z.string().optional().or(z.literal("")),
  isActive: z.coerce.boolean(),
});

// ── Create ────────────────────────────────────
export async function createAnnouncement(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const raw = {
    title: formData.get("title"),
    content: formData.get("content"),
    url: formData.get("url"),
    type: formData.get("type"),
    showInTicker: formData.get("showInTicker") === "true",
    showInBanner: formData.get("showInBanner") === "true",
    priority: formData.get("priority"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    isActive: formData.get("isActive") === "true",
  };

  const parsed = AnnouncementSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const data = parsed.data;

  try {
    await db.insert(announcements).values({
      title: data.title,
      content: data.content || null,
      url: data.url || null,
      type: data.type,
      showInTicker: data.showInTicker,
      showInBanner: data.showInBanner,
      priority: data.priority,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      isActive: data.isActive,
      createdBy: session.user.id,
    });
  } catch {
    return { error: "Gagal menyimpan pengumuman." };
  }

  revalidatePath("/");
  revalidatePath("/admin/pengumuman");
  redirect("/admin/pengumuman");
}

// ── Update ────────────────────────────────────
export async function updateAnnouncement(id: number, formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const raw = {
    title: formData.get("title"),
    content: formData.get("content"),
    url: formData.get("url"),
    type: formData.get("type"),
    showInTicker: formData.get("showInTicker") === "true",
    showInBanner: formData.get("showInBanner") === "true",
    priority: formData.get("priority"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    isActive: formData.get("isActive") === "true",
  };

  const parsed = AnnouncementSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const data = parsed.data;

  try {
    await db
      .update(announcements)
      .set({
        title: data.title,
        content: data.content || null,
        url: data.url || null,
        type: data.type,
        showInTicker: data.showInTicker,
        showInBanner: data.showInBanner,
        priority: data.priority,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        isActive: data.isActive,
      })
      .where(eq(announcements.id, id));
  } catch {
    return { error: "Gagal menyimpan perubahan." };
  }

  revalidatePath("/");
  revalidatePath("/admin/pengumuman");
  redirect("/admin/pengumuman");
}

// ── Delete ────────────────────────────────────
export async function deleteAnnouncement(id: number) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await db.delete(announcements).where(eq(announcements.id, id));

  revalidatePath("/");
  revalidatePath("/admin/pengumuman");
}

// ── Toggle aktif ──────────────────────────────
export async function toggleAnnouncementActive(id: number, isActive: boolean) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await db
    .update(announcements)
    .set({ isActive })
    .where(eq(announcements.id, id));

  revalidatePath("/web");
  revalidatePath("/admin/pengumuman");
}
