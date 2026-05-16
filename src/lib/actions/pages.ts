// src/lib/actions/pages.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db, eq } from "@/db";
import { pages } from "@/db/schema";
import { z } from "zod";

const PageSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  slug: z.string().min(1, "Slug wajib diisi"),
  content: z.string().optional(),
  excerpt: z.string().optional(),
  template: z.string().default("default"),
  status: z.enum(["published", "draft", "archived"]),
  sortOrder: z.coerce.number().default(0),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  showInNav: z.coerce.boolean().optional(),
});

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\/\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function createPage(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const raw = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    content: formData.get("content"),
    excerpt: formData.get("excerpt"),
    template: formData.get("template"),
    status: formData.get("status"),
    sortOrder: formData.get("sortOrder"),
    metaTitle: formData.get("metaTitle"),
    metaDescription: formData.get("metaDescription"),
    showInNav: formData.get("showInNav") === "true",
  };

  const parsed = PageSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const data = parsed.data;

  try {
    await db.insert(pages).values({
      title: data.title,
      slug: toSlug(data.slug),
      content: data.content || null,
      excerpt: data.excerpt || null,
      template: data.template,
      status: data.status,
      sortOrder: data.sortOrder,
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      showInNav: data.showInNav ?? false,
      // Hapus createdBy karena tidak ada di tabel
    });
  } catch (err: any) {
    console.error("Error creating page:", err);
    if (err?.code === "ER_DUP_ENTRY" || err?.code === "23505") {
      return { error: "Slug sudah digunakan. Silakan gunakan slug lain." };
    }
    return { error: "Gagal menyimpan halaman. Silakan coba lagi." };
  }

  revalidatePath("/profil");
  revalidatePath("/admin/profil/pages");

  return { success: true };
}

export async function updatePage(id: number, formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const raw = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    content: formData.get("content"),
    excerpt: formData.get("excerpt"),
    template: formData.get("template"),
    status: formData.get("status"),
    sortOrder: formData.get("sortOrder"),
    metaTitle: formData.get("metaTitle"),
    metaDescription: formData.get("metaDescription"),
    showInNav: formData.get("showInNav") === "true",
  };

  const parsed = PageSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const data = parsed.data;

  try {
    await db
      .update(pages)
      .set({
        title: data.title,
        slug: toSlug(data.slug),
        content: data.content || null,
        excerpt: data.excerpt || null,
        template: data.template,
        status: data.status,
        sortOrder: data.sortOrder,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        showInNav: data.showInNav ?? false,
        updatedAt: new Date(),
      })
      .where(eq(pages.id, id));
  } catch (err: any) {
    console.error("Error updating page:", err);
    if (err?.code === "ER_DUP_ENTRY" || err?.code === "23505") {
      return { error: "Slug sudah digunakan oleh halaman lain." };
    }
    return { error: "Gagal menyimpan perubahan. Silakan coba lagi." };
  }

  revalidatePath("/profil");
  revalidatePath("/admin/profil/pages");

  return { success: true };
}

export async function deletePage(id: number) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  try {
    await db.delete(pages).where(eq(pages.id, id));
    revalidatePath("/profil");
    revalidatePath("/admin/profil/pages");
    return { success: true };
  } catch (error) {
    console.error("Error deleting page:", error);
    return { error: "Gagal menghapus halaman" };
  }
}
